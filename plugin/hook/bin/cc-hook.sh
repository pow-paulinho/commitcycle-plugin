#!/bin/sh
# The fail-closed wrapper. This file is the E11 guarantee.
#
# CC-2 tested Claude Code against a hook broken four different ways — hung past
# its timeout, exited non-zero, printed non-JSON, and missing entirely — and the
# write went through every time. Claude Code is fail-OPEN. So denying on failure
# is not something we can configure; it has to be a process that always answers.
#
# That is this script. Whatever happens to the core, a valid refusal reaches the
# harness. It costs about 20 ms (CC-1) because it means three processes per call
# instead of one, and that is the price of the guarantee.
#
# "Reaches the harness" was written as "reaches stdout" until CC-728, and the
# wording was the bug. Three of the four harnesses read a decision off stdout at
# exit 0; Windsurf reads ONLY the exit code, and this file ended every path at
# `exit 0` — so on that harness the guarantee inverted into its opposite, and a
# denial, a dead core and a clean allow were indistinguishable allows. A guard
# that answers on a channel its reader does not consult has not answered. The
# dialect is resolved below, and every exit from here on is taken in it.
#
# The one failure it cannot cover: if THIS file is missing, nothing runs and
# nothing complains. There is no in-band fix — that gap belongs to Layer 3, which
# is why the CI check is not optional.
#
# Windows, and why nothing sits beside this file for it (CC-682, D-25).
#
# A platform that cannot run this file is that same uncoverable mode, arriving
# as the normal case rather than the exception: both registrations name this
# path, the harness runs it as a file, nothing executes, and no denial appears.
# `cycle doctor` now demonstrates that by EXECUTING the registered wrapper
# rather than checking that a bundle exists (CC-685). This comment is the other
# half, and it is a refusal to guess:
#   - A `.cmd`/`.ps1` sibling cannot be reached by a registration. It is one
#     command string with no platform conditional, `cmd.exe` dispatches by
#     extension so it can never launch a `.sh`, and a second registration would
#     run on every platform. Node also refuses to spawn a `.cmd` without a shell
#     (the CVE-2024-27980 fix — documented, not measured here), so doctor's
#     probe could not demonstrate a working one either: Windows would move from
#     silently unenforced to silently unreported.
#   - `node <core>` as the registered command fails OPEN the moment node is not
#     on the harness's stripped PATH — the machine CC-233 bricked, with the
#     failure inverted. A fail-open entry point is worse than none, because
#     doctor would then report a wall that exists and does not hold.
#   - Whether this harness launches hooks through a POSIX shell on Windows was
#     not established from a primary source (docs/13-harness-hooks.md is the
#     pass that would have said so). If it does, this file is already the entry
#     point there — and what kills it first is its line endings, which is the
#     one cause CC-682 could measure and fix: see bin/.gitattributes.
# So nothing unexercised ships. The next person's first job is the measurement
# nobody here could make: on real Windows, how does the harness launch a
# `type: "command"` hook? `packages/hook/test/wrapper-portable.test.ts` is the
# acceptance table for whatever the answer turns out to require.

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

# Which harness we are answering (CC-728).
#
# Until now this file had no idea, and it did not need one: every dialect but
# Windsurf answers in JSON at exit 0, which is what this wrapper has always
# emitted. Windsurf's ENTIRE contract is the exit code — 0 allows, 2 blocks,
# anything else is "Error — Action proceeds normally", i.e. fail-open — and
# this script ended every path at `exit 0`. So a Windsurf denial, a dead core
# and a clean allow were the same three bytes to that harness: allow. Not a
# denial with the wrong wording; the wall silently absent.
#
# The rule is src/wire.ts's, held here for the same reason: **the dialect comes
# from how we were invoked, or it is claude-code.** argv and the environment are
# written by the hook entry the repository installs; a payload never votes,
# because a payload is authored by the thing being judged, and a wrong dialect
# is a reply the harness cannot parse — which all four treat as hook failure,
# and all four fail OPEN on hook failure. Structure never votes; this mirrors
# `harnessFromInvocation`, including its aliases.
DIALECT=""
_next_is_harness=""
for _a in "$@"; do
  if [ -n "$_next_is_harness" ]; then DIALECT="$_a"; _next_is_harness=""; continue; fi
  case "$_a" in
    --harness=*) DIALECT="${_a#--harness=}" ;;
    --harness)   _next_is_harness=1 ;;
  esac
done
[ -z "$DIALECT" ] && DIALECT="${CC_HOOK_HARNESS:-}"
# Spelled out rather than case-folded: `tr` is external and this file runs under
# the PATH it exists to survive. An unrecognised name falls to claude-code,
# which is the safe end — it is the one dialect whose reply every harness here
# either understands or ignores at exit 0, and it is what this file emitted
# before it could tell the difference.
case "$DIALECT" in
  windsurf|Windsurf|WINDSURF|cascade|Cascade|devin-desktop|devin_desktop) DIALECT="windsurf" ;;
  cursor|Cursor|CURSOR) DIALECT="cursor" ;;
  codex|Codex|CODEX) DIALECT="codex" ;;
  *) DIALECT="claude-code" ;;
esac

# The denial, with the cause, the repair FIRST, and an exit that works (CC-233).
#
# The first live install produced the deadlock this now avoids naming: the
# harness runs hooks with a stripped PATH, node lived in ~/.local/node/bin, the
# wrapper could not find it — and the denial's only remedy was `cc doctor`,
# which the denial itself had just made unrunnable, because a downed hook
# denies EVERY tool in the session, reads included. A remedy has to work from
# outside the thing that is broken.
#
# Three rules about this text, all measured (CC-561):
#   - The repair leads. The old message led with diagnosis (`cycle doctor`)
#     and offered disabling the plugin as the working alternative — so the
#     one remedy that always "worked" was turning the enforcement off, which
#     is the worst advice a guard can print about itself.
#   - Local and cloud are different repairs, and the message says so: `cycle
#     doctor` on your machine does not fix a cloud container. A remote
#     session is repaired by provisioning in the container itself, which is
#     what the SessionStart hook (cc-provision.sh) is wired to do.
#   - Disabling the plugin is not offered. It is not a repair; it is the
#     failure-policy decision made unilaterally, and that decision belongs to
#     a person on the board (D-58), not to a denial message.
#
# $1 is always one of the fixed strings below — never input — so it is safe to
# interpolate into JSON.
#
# The text is one string for all four dialects. Only the CHANNEL changes, and
# Windsurf is the reason this function grew a branch at all: on that harness a
# refusal is `exit 2` and nothing else, so emitting this JSON at exit 0 — which
# is what every path here used to do — told Windsurf to allow. The sentence was
# written, correctly, to a stream that harness does not read for a decision.
deny_text() {
  printf 'CC hook unavailable — denying by default (%s). Repair it, from OUTSIDE this session: in a checkout, run `sh packages/hook/bin/cc-provision.sh` from the repository root — it seeds the core from the committed plugin bundle, no install and no network — or `pnpm --filter @commitcycle/hook build`; for a marketplace plugin install, reinstall or update the plugin. Local and cloud are different repairs: `cycle doctor` on your machine does not fix a cloud container — the container itself must provision, which is what the SessionStart hook in .claude/settings.json does at boot. If sessions should stay usable through an outage like this, that is the failure policy: a person sets it on the board Settings and `cycle sync` carries it down.' "$1"
}

deny() {
  case "$DIALECT" in
    windsurf)
      # stderr is where this harness reads a blocked hook's reason, and exit 2
      # is the block itself. stdout stays empty: the Cascade UI is already
      # showing stderr when the entry sets `show_output: true`, and a second
      # copy there would be the same sentence twice.
      deny_text "$1" >&2
      printf '\n' >&2
      exit 2
      ;;
    cursor)
      # `{"permission":"deny"}` at exit 0 is Cursor's primary deny mechanism,
      # and exit 0 is what keeps the message: the vendor reads stdout JSON only
      # on a zero exit, so blocking by code would discard the reason. Both
      # message fields carry it — one is read by the person, one by the model,
      # and the model is the one that must not go looking for another route.
      printf '{"permission":"deny","user_message":"'
      deny_text "$1"
      printf '","agent_message":"'
      deny_text "$1"
      printf '"}'
      ;;
    *)
      # claude-code and codex share the envelope byte for byte. Codex also
      # takes a stderr copy, which costs a denial at exit 0 nothing and puts
      # the sentence in the log a person greps.
      printf '{"hookSpecificOutput":{"hookEventName":"PreToolUse","permissionDecision":"deny","permissionDecisionReason":"'
      deny_text "$1"
      printf '"}}'
      [ "$DIALECT" = "codex" ] && { deny_text "$1" >&2; printf '\n' >&2; }
      ;;
  esac
}

allow_degraded() {
  case "$DIALECT" in
    # An allow on this harness is exit 0 and silence. The sentence still goes
    # to stderr, because a session running unenforced is exactly the thing
    # nobody should have to infer from the absence of a refusal.
    windsurf) printf '%s\n' "$1" >&2 ;;
    cursor)   printf '{"permission":"allow"}' ;;
    *)        printf '{"hookSpecificOutput":{"hookEventName":"PreToolUse","permissionDecision":"allow","permissionDecisionReason":"%s"}}' "$1" ;;
  esac
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
# `"$@"` is forwarded, and that is load-bearing (CC-728). The core picks its
# reply dialect from its own argv, and this wrapper is the only thing that ever
# launches it — so an argument swallowed here is a dialect the core can never
# select. Every harness got a claude-code answer no matter what its hook entry
# asked for, which is the half of the bug that survives even once `cycle init`
# starts writing `--harness`.
#
# stderr is no longer sent to /dev/null. It was discarded because nothing read
# it; wire.ts now puts the refusal's reason there for three of the four
# dialects, and for Windsurf it is the ONLY place the sentence exists. The cost
# is that node's own noise reaches the harness's log on a crash, which is a
# diagnosis a person can use and was being thrown away with everything else.
if command -v timeout >/dev/null 2>&1; then
  OUT=$(printf '%s' "$INPUT" | timeout "${TIMEOUT_S}s" "$NODE_BIN" "$CORE" "$@")
elif command -v gtimeout >/dev/null 2>&1; then
  OUT=$(printf '%s' "$INPUT" | gtimeout "${TIMEOUT_S}s" "$NODE_BIN" "$CORE" "$@")
else
  # No timeout binary. The core has its own guard, but a hard hang would hang the
  # session, so this is worth reporting from `cc doctor`.
  OUT=$(printf '%s' "$INPUT" | "$NODE_BIN" "$CORE" "$@")
fi
STATUS=$?

# Did the core answer? The question has a different shape per dialect, because
# what a valid answer LOOKS like is per dialect — and getting that wrong in
# either direction is a wall that does not hold.
if [ "$DIALECT" = "windsurf" ]; then
  # Here the decision IS the exit code: 0 allows, 2 blocks, and wire.ts may
  # emit nothing else, because anything else is read as "Error — Action
  # proceeds normally", i.e. fail-open. stdout is empty by that dialect's
  # design, so bytes there did not come from the renderer this expects.
  #
  # The residual, named rather than papered over: a core that died while still
  # exiting 0 is indistinguishable here from a deliberate allow. Every
  # realistic death — an uncaught throw, a kill, a missing core, a stripped
  # PATH — lands on a non-zero code or is caught further up, so what remains is
  # a core that explicitly exits 0 having emitted nothing, which is a defect in
  # core.ts rather than a state this file can observe. It is also exactly the
  # trust the JSON branch below has always placed in "exit 0 and a well-formed
  # object", so this dialect is not the weaker one — it just has less to check.
  if [ -n "$OUT" ]; then
    no_answer "the hook core wrote to stdout on a dialect whose entire reply is the exit code"
  fi
  case "$STATUS" in
    0|2) exit "$STATUS" ;;
    *)   no_answer "the hook core did not answer" ;;
  esac
fi

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
