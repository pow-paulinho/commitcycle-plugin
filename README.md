# CommitCycle plugin

The [CommitCycle](https://commitcycle.com) plugin for Claude Code: the
`cycle` CLI, the enforcement hook, and the skills that set a repository up.

```
/plugin marketplace add pow-paulinho/commitcycle-plugin
/plugin install commitcycle@commitcycle
```

The CLI alone installs from npm — `npm i -g commitcycle` — and answers to
`cycle`.

With the hook installed, writes into a zone your repository closed are denied
at the tool call — before they land. Repositories without a `.zones/zones.yml`
are ignored entirely, so the plugin is safe to install user-wide.

Everything in here is a built artefact, published from the CommitCycle
repository by `scripts/publish-plugin.sh`. Version: v0.1.5.
