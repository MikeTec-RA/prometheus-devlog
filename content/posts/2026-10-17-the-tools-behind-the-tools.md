---
title: The tools behind the tools
date: 2026-10-17
summary: Forge, the project tools that live beside the engine, and why plain files are the source of truth.
---

Prometheus has a sibling: **Forge**, a set of project tools that lives in the same repository and
runs beside the editor. It started life as tools I'd built for earlier projects, got ported in
under new names, and has grown since.

## What's in it

The names follow the rule from [the start of the project](posts/2026-07-20-reforged-from-the-ashes/):
tools that build the game get fire and forging names, and systems inside the game get abyss and
memory names.

- **Anvil** handles repositories, branches, git operations, code review and pull requests.
- **Ember** is Anvil's commit graph.
- **Bench** has the boards and cards, a burndown chart and a roadmap.
- **Kiln** is the documentation library. Every project document is versioned and has a review
  queue: propose a change, approve it or send it back, and the approved version is written to
  disk.

## The file is the truth

Work is tracked as plain Markdown files, one per issue, numbered, with a status line at the top.
The board cards are a mirror of those files, not the other way round. As of this week the
mirroring is automatic: change a file and its card updates within seconds, and Forge syncs
everything once when it starts.

Why files? Because they live in git with the code. An issue's history sits next to the commits
that closed it, nothing is locked inside a database, and the whole plan for the game is
something I can search.
