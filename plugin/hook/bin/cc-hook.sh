#!/bin/sh
# The fail-closed wrapper. This file is the E11 guarantee.
#
# CC-2 tested Claude Code against a hook broken four different ways — hung past
# its timeout, exited non-zero, printed non-JSON, and missing entirely — and the
# write went through every time. Claude Code is fail-OPEN. So denying on failure
# is not something we can configure; it has to be a process that always answers.
#
# That is this script. Whatever happens to the core, something valid reaches
# stdout. It costs about 20 ms (CC-1) because it means three processes per call
# instead of one, and that is the price of the guarantee.
#
# The one failure it cannot cover: if THIS file is missing, nothing runs and
# nothing complains. There is no in-band fix — that gap belongs to Layer 3, which
# is why the CI check is not optional.

TIMEOUT_S="${CC_HOOK_TIMEOUT:-3}"
# Locate ourselves with shell builtins only. `dirname` is an external binary,
# and this script runs under the same stripped PATH it exists to survive — the
# first draft used dirname, and a hostile-enough PATH made it deny with the
# WRONG cause ("core is missing") before the node search even ran.
case "$0" in
  */*) DIR="${0%/*}" ;;
  *)   DIR="." ;;
esac
DIR="$(cd "$DIR" && pwd)"
CORE="$DIR/../dist/core.js"

# The denial, with the cause and an exit that works (CC-233).
#
# The first live install produced the deadlock this now avoids naming: the
# harness runs hooks with a stripped PATH, node lived in ~/.local/node/bin, the
# wrapper could not find it — and the denial's only remedy was `cc doctor`,
# which the denial itself had just made unrunnable, because a downed hook
# denies EVERY tool in the session, reads included. A remedy has to work from
# outside the thing that is broken.
#
# $1 is always one of the fixed strings below — never input — so it is safe to
# interpolate into JSON.
deny() {
  printf '{"hookSpecificOutput":{"hookEventName":"PreToolUse","permissionDecision":"deny","permissionDecisionReason":"CC hook unavailable — denying by default (%s). Fix it from OUTSIDE this session: run `cycle doctor` in a terminal, or disable the commitcycle plugin and open a new session to work unenforced while you do."}}' "$1"
}

allow_degraded() {
  printf '{"hookSpecificOutput":{"hookEventName":"PreToolUse","permissionDecision":"allow","permissionDecisionReason":"%s"}}' "$1"
}

# Read stdin once; it is not replayable. `cat` is external too: if the PATH is
# so broken it is gone, carry on with empty input — the node search below will
# name the real cause instead of this line crashing the wrapper.
INPUT=$(cat 2>/dev/null || :)

# The failure policy (CC-239, D-58): what this wrapper does when the core
# cannot answer is the REPOSITORY'S decision, made by a person on the board,
# synced down by `cycle sync` as one line in .zones/state/failure-policy.
# Absent file — or any parse failure below — means closed, today's behavior:
# a guard's only shippable default. The file is part of the trust root the
# hook seals against agent writes (CC-237/D-57), and everything here uses
# shell builtins only, because the premise of this code path is that nothing
# else can be assumed to work.
#
# no_answer replaces every direct deny for the cannot-answer causes:
#   closed  → deny, exactly as before.
#   reads   → a fixed name-list of read-only tools passes, announced as
#             degraded; everything else denies. The wrapper cannot see zones,
#             so a repository declaring secrets accepted that risk when a
#             person chose this mode — the board says so before saving.
#   journal → the raw payload is appended to .zones/state/guard/journal.jsonl
#             and the call passes, announced as unwitnessed; if the journal
#             cannot be written the mode falls back to closed, because
#             allow-without-record is the one combination nobody chose.
no_answer() {
  _cwd="${INPUT#*\"cwd\":\"}"
  if [ "$_cwd" = "$INPUT" ]; then _cwd=""; else _cwd="${_cwd%%\"*}"; fi
  _root=""; _policy="closed"
  d="$_cwd"
  while [ -n "$d" ] && [ "$d" != "/" ]; do
    if [ -f "$d/.zones/state/failure-policy" ]; then
      _root="$d"
      IFS= read -r _p < "$d/.zones/state/failure-policy" 2>/dev/null || _p="closed"
      case "$_p" in reads|journal) _policy="$_p" ;; esac
      break
    fi
    d="${d%/*}"
  done

  if [ "$_policy" = "reads" ]; then
    _tool="${INPUT#*\"tool_name\":\"}"
    if [ "$_tool" = "$INPUT" ]; then _tool="${INPUT#*\"tool_name\": \"}"; fi
    if [ "$_tool" = "$INPUT" ]; then _tool=""; else _tool="${_tool%%\"*}"; fi
    case "$_tool" in
      Read|Glob|Grep)
        allow_degraded "CC hook down ($1) — allowed by this repository's failure policy: reads stay open while the core is out. Writes are still denied. Run \`cycle doctor\` in a terminal when you can."
        exit 0 ;;
    esac
    deny "$1 — the failure policy keeps reads open, and this tool is not on the read list"
    exit 0
  fi

  if [ "$_policy" = "journal" ] && [ -n "$_root" ]; then
    if printf '%s\n' "$INPUT" >> "$_root/.zones/state/guard/journal.jsonl" 2>/dev/null; then
      allow_degraded "CC hook down ($1) — allowed and journaled by this repository's failure policy. Nothing is enforcing zones until the core returns, and this call is on the unwitnessed record."
      exit 0
    fi
  fi

  deny "$1"
  exit 0
}

if [ ! -f "$CORE" ]; then
  no_answer "the hook core is missing at hook/dist/core.js"
fi

# Where node actually is (CC-233). The harness strips the PATH, and node is
# almost never in the strip: any nvm, Homebrew or ~/.local install vanishes,
# which turned the guarantee into a machine-wide denial on the first machine
# that installed the plugin. CC_HOOK_NODE pins it outright; then the PATH;
# then the places node really lives on developer machines.
NODE_BIN=""
if [ -n "${CC_HOOK_NODE:-}" ] && [ -x "${CC_HOOK_NODE}" ]; then
  NODE_BIN="$CC_HOOK_NODE"
elif command -v node >/dev/null 2>&1; then
  NODE_BIN="node"
else
  for candidate in "$HOME/.local/node/bin/node" /opt/homebrew/bin/node /usr/local/bin/node /usr/bin/node; do
    if [ -x "$candidate" ]; then
      NODE_BIN="$candidate"
      break
    fi
  done
  if [ -z "$NODE_BIN" ]; then
    # The lexically last nvm install. Imperfect ordering across major versions,
    # deliberately tolerated: any working node beats a denial that blocks the
    # whole session, and CC_HOOK_NODE exists for whoever needs it exact.
    for candidate in "$HOME/.nvm/versions/node"/*/bin/node; do
      [ -x "$candidate" ] && NODE_BIN="$candidate"
    done
  fi
fi

if [ -z "$NODE_BIN" ]; then
  no_answer "node was not found on the PATH or in the usual install locations — set CC_HOOK_NODE to your node binary"
  exit 0
fi

# GNU coreutils ships `timeout`; macOS has it as `gtimeout` when installed.
if command -v timeout >/dev/null 2>&1; then
  OUT=$(printf '%s' "$INPUT" | timeout "${TIMEOUT_S}s" "$NODE_BIN" "$CORE" 2>/dev/null)
elif command -v gtimeout >/dev/null 2>&1; then
  OUT=$(printf '%s' "$INPUT" | gtimeout "${TIMEOUT_S}s" "$NODE_BIN" "$CORE" 2>/dev/null)
else
  # No timeout binary. The core has its own guard, but a hard hang would hang the
  # session, so this is worth reporting from `cc doctor`.
  OUT=$(printf '%s' "$INPUT" | "$NODE_BIN" "$CORE" 2>/dev/null)
fi
STATUS=$?

# Non-zero exit, empty output, or output that is not a JSON object → deny.
case "$OUT" in
  '{'*'}') ;;
  *) STATUS=1 ;;
esac

if [ "$STATUS" -ne 0 ]; then
  no_answer "the hook core did not answer"
  exit 0
fi

printf '%s' "$OUT"
