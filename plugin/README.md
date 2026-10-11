# CommitCycle — Claude Code plugin

Least privilege for AI coding agents. Areas of a codebase that are dangerous to
change get an owner; work declares which of them it needs; access is granted for
one task on one branch and taken back when the work is handed in.

## What this plugin installs

| Component | What it does |
|---|---|
| `set-up-commitcycle` skill | Sets a repository up by asking about it — which areas are dangerous, who approves each, which board it reports to |
| `start-work-inside-cc` skill | Files and scopes the task before the work, so the rule arrives as an arrangement rather than as a refusal |
| `commitcycle` MCP server | Six tools: the zone map, one-line intake, the interview, scoping, board status, and which tasks changed a file (`cc_why`). Intake and scoping write to the board; none moves a task |
| The hooks | `PreToolUse`/`PostToolUse`: the part that actually blocks a write. `Stop`: on a task branch in a repository with a board, sends the agent's last message to the board as the task's latest reply and keeps a copy in `.zones/state/replies/` |

It brings its own binaries: the hook and the MCP server need no `npm install`,
and nothing is put on `PATH`. The `cycle` command the skills ask you to run
(`cycle login`, `cycle start`, `cycle submit`) is separate — `npm i -g commitcycle`.
Outside the project you are working in, the only thing written is
`~/.commitcycle/`, where sign-in, pairing and the update check keep their files.

## Why installing this cannot break your other projects

Plugin hooks load user-wide — they run in every repository you open, not only
the one you set up. That is exactly why the hook was held back until it could
tell **"this repository never installed CommitCycle"** from **"this task has not
been started yet"**. It could not, and answered `deny` to both, so a single
install would have blocked every write in every unrelated project on the
machine.

It can now (CC-175). A repository with no `.zones/zones.yml` is left alone
silently: allowed, nothing recorded, no advice — you should not be able to tell
the hook ran. A repository that has a zone map keeps every rule it has, and an
**empty** map is not the same thing as an absent one: that is a project that ran
the setup and protected nothing, and a task is still required there.

## Using it without an account

Without a board there is no gate: no task can be filed or started, and in a
repository with a zone map the hook then denies every write. So without an
account the setup skill writes nothing and says why. A board is what issues
grants, holds approvals and keeps the trail past one machine.

## The tools, and the line they do not cross

`cc_zones`, `cc_intake`, `cc_interview`, `cc_scope`, `cc_status`, `cc_why`.

None of them starts work, issues a grant, or approves access to anything. That
is not an oversight to be fixed later: an approval arriving through a tool the
agent calls is authenticated by a token the agent holds, so a board could not
tell your yes from the agent's own. The tools describe work; starting it is
`cycle start`, which the skill runs only on your say-so.

The hosted connector (the board's MCP URL, added to a client instead of this
plugin) is a different surface: its `cc_start`, `cc_submit` and `cc_close` move
a task through the board's gate. It still has no tool that approves access.
