# CommitCycle — Claude Code plugin

Least privilege for AI coding agents. Areas of a codebase that are dangerous to
change get an owner; work declares which of them it needs; access is granted for
one task on one branch and taken back when the work is handed in.

## What this plugin installs

| Component | What it does |
|---|---|
| `set-up-commitcycle` skill | Sets a repository up by asking about it — which areas are dangerous, who approves each, which board it reports to |
| `start-work-inside-cc` skill | Files and scopes the task before the work, so the rule arrives as an arrangement rather than as a refusal |
| `commitcycle` MCP server | Five read-and-describe tools: the zone map, one-line intake, the interview, scoping, and board status |
| The hook | The part that actually blocks a write, on `PreToolUse` and `PostToolUse` |

It brings its own binaries. There is no `npm install`, nothing is put on
`PATH`, and nothing outside the project you are working in is touched.

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

Everything local works with no board: the zone map, the audit of what is
dangerous, and the record of what a task declared. A board is what issues
grants, holds approvals and keeps the trail past one machine — the skill offers
it and does not push it.

## The tools, and the line they do not cross

`cc_zones`, `cc_intake`, `cc_interview`, `cc_scope`, `cc_status`.

None of them starts work, issues a grant, or approves access to anything. That
is not an oversight to be fixed later: an approval arriving through a tool the
agent calls is authenticated by a token the agent holds, so a board could not
tell your yes from the agent's own. The tools describe work. A person starts it.
