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
DIR="$(cd "$(dirname "$0")" && pwd)"
CORE="$DIR/../dist/core.js"

DENY='{"hookSpecificOutput":{"hookEventName":"PreToolUse","permissionDecision":"deny","permissionDecisionReason":"CC hook unavailable — denying by default. Run `cc doctor`."}}'

# Read stdin once; it is not replayable.
INPUT=$(cat)

if [ ! -f "$CORE" ]; then
  printf '%s' "$DENY"
  exit 0
fi

# GNU coreutils ships `timeout`; macOS has it as `gtimeout` when installed.
if command -v timeout >/dev/null 2>&1; then
  OUT=$(printf '%s' "$INPUT" | timeout "${TIMEOUT_S}s" node "$CORE" 2>/dev/null)
elif command -v gtimeout >/dev/null 2>&1; then
  OUT=$(printf '%s' "$INPUT" | gtimeout "${TIMEOUT_S}s" node "$CORE" 2>/dev/null)
else
  # No timeout binary. The core has its own guard, but a hard hang would hang the
  # session, so this is worth reporting from `cc doctor`.
  OUT=$(printf '%s' "$INPUT" | node "$CORE" 2>/dev/null)
fi
STATUS=$?

# Non-zero exit, empty output, or output that is not a JSON object → deny.
case "$OUT" in
  '{'*'}') ;;
  *) STATUS=1 ;;
esac

if [ "$STATUS" -ne 0 ]; then
  printf '%s' "$DENY"
  exit 0
fi

printf '%s' "$OUT"
