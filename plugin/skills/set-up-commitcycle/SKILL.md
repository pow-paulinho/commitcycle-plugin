---
name: set-up-commitcycle
description: Sets a repository up with CommitCycle by asking about it rather than by making the person type commands — proposing which areas are dangerous to change, who approves each, and which board it reports to. Use when someone says "set up CommitCycle", "set up CC here", "protect this repo", "add guardrails to this project", "install the gate", or asks what CommitCycle would protect in a codebase it has not seen yet. Also use when a CommitCycle tool refuses because the repository has no zone map.
---

# Setting a repository up with CommitCycle

Drive this as a conversation. The person answers questions about their own
codebase; you write the files. Nothing here is a form to fill in, and nothing is
written that they did not say yes to.

## What you are setting up, in one paragraph

CommitCycle stops an agent writing where it was not sent. A **zone** is an area
that is dangerous to change, with an **owner** who approves access to it. A
**task** declares which zones it needs, and the **gate** issues a grant bound to
one task and one branch. Everything not in a zone is unprotected and needs no
approval — that is the point, and say so, because a person who thinks this
gates everything will decline all of it.

## Before anything

Check for `.zones/zones.yml` in the repository root.

- **It exists** — CommitCycle is already set up. Do not rewrite it. Say what is
  protected, and offer `cycle doctor` if something seems wrong.
- **It does not** — continue.

Check the repository is a git repository. CommitCycle binds tasks to branches,
so it cannot work without one. If there is no `.git`, say that and stop.

## Step one: find what is dangerous

Read the repository yourself before asking anything. Look for the areas whose
breakage is expensive and hard to notice:

- database migrations and schema definitions
- authentication, sessions, and anything holding secrets — `.env` and friends
- payment and billing code, and anything importing a payments SDK
- shared contracts other packages compile against
- deploy configuration and CI workflows

Aim for **three to five zones**. More than five and the person will decline the
whole thing; fewer than three and it protects nothing. A zone that matches no
file is worse than no zone, so check each path actually matches something.

## Step two: ask, one question each

For every candidate, ask the one question anybody can answer about their own
codebase: **is this dangerous to change?** Give the paths and the reason you
picked it. Never ask them to write a glob.

Take no for an answer. A declined zone is simply not written, and say that
plainly rather than arguing.

For each zone they accept, ask **who approves access to it** and default to
their own address. An owner that is not a real address makes the first
escalation dead-end: the gate asks the owner, and it cannot ask nobody.

Ask which of the accepted zones hold secrets. Those are read-closed as well as
write-closed; everything else stays readable.

## Step three: write the zone map

Write `.zones/zones.yml` with only the accepted zones. Use `read-only` as the
policy for risky areas and reserve `deny` for zones holding secrets — a
repository where everything is denied is a repository nobody can work in, and it
gets uninstalled in a week.

```yaml
version: 1

config:
  spike_env: local
  spike_cleanup: null
  spike_verify: null
  extra_commands: []

generated:
  - pnpm-lock.yaml
  - package-lock.json
  - "**/dist/**"

zones:
  - id: schema
    name: "Database schema"
    risk: high
    owner: someone@example.com
    description: "Migrations run once and are hard to take back."
    paths:
      - "migrations/**"
    default_policy: read-only
```

## Step four: the board

**Offer it here, and say what it adds.** This is the one moment a board means
something concrete: they have just finished naming the areas they do not want
touched, and the board is what makes that hold. Do not skip past it to avoid
sounding like a sales pitch — a setup that never mentions the account is a setup
where nobody ever creates one, and then none of the above is enforced by
anything but goodwill.

Three things it adds. Not more than three:

- **the grant** — a zone opens for one task on one branch, and closes when the
  work is handed in, rather than staying open because nobody remembered
- **somebody to ask** — a high-risk zone asks its owner, and the answer arrives
  where the work is happening
- **a trail past this machine** — what was declared, what was blocked, what was
  approved, kept somewhere a dead laptop does not take with it

Then ask which of three they are: they have a board already, they want one now,
or they want to run locally first.

**They want one now.** Say the sign-in is an address and a six-digit code, and
hand them the command to run — `cycle login`. **Do not run it for them and never
handle the code.** It is a credential, and an agent typing one on somebody's
behalf is the exact shape this product exists to make impossible. Wait, then
continue with the address and organization below.

**There is no locally-first answer, and do not offer one.** Without a board there
is no gate; without a gate no grant; and the hook then refuses every write with
no way to open a task — a repository set up that way is stuck until `.zones/` is
deleted. So if they do not want an account, say that plainly and **do not write
a zone map**: leave the repository as you found it and offer to come back when
they do. A guardrail that bricks the project is worse than none.

**They have one already** — ask for the address and the organization, and write
`.zones/board.json`:

```json
{ "api_url": "https://dash.commitcycle.com", "tenant": "their-org", "repo": "this-repo" }
```

**Never guess the organization.** A guessed one writes zones, events and grants
into an organization nobody created, silently, and the person then watches a
board that never sees any of it. If they do not know it, write no file and say
which commands will refuse until one exists.

Never put a token in that file, or in any file in the repository.

## Step five: say what changed, and what did not

List the files written. Then say the two things people get wrong:

- everything outside the zones is unprotected and needs no approval
- enforcement is not installed yet by this skill alone — the hook is what
  actually blocks a write, and it is a per-project install today

One mechanic worth a sentence: the committed AGENTS.md block is deliberately
byte-stable — it never names the active task, so it never merge-conflicts.
Task context lives in a gitignored CLAUDE.local.md the binary maintains, and
`cycle init`/`cycle sync` wire a git merge driver (`cycle merge-driver`, inside
the binary — nothing to vendor) as the net for branches that predate this
(CC-543/CC-551/CC-590).

Offer the first task rather than leaving them at a prompt. If a board was
configured, the `cc_intake` tool files one in a line, and `cc_interview` drafts
the four answers as choices they correct.

## Rules that are not yours to relax

- **Propose, never assume.** Every zone, owner and board answer is theirs. If
  they decline everything, write nothing and say so.
- **Do not invent an owner or an organization.** A placeholder that admits it is
  missing beats an address nobody agreed to.
- **Do not offer to loosen the gate.** If a zone blocks them later, the answer
  is to request access, not to remove the zone. Removing a zone to get work done
  is the failure this product exists to prevent, and an agent proposing it is
  worse than the block.
