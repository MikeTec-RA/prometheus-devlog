---
title: Six times faster type checking
date: 2026-09-11
summary: Moving to TypeScript 7's native compiler, and the command it quietly took over.
---

Prometheus is TypeScript across three workspaces: the editor, the engine backend and Forge, my
project tools. Type checking the lot took about 19 seconds. Today I switched to TypeScript 7,
the native rewrite of the compiler, and it takes under 7.

| What | TypeScript 5.9 | TypeScript 7 | Faster |
|---|---|---|---|
| The editor, whole program | 6.6 s | 0.84 s | 7.9× |
| All three workspaces, compiler only | 15.8 s | 2.5 s | 6.3× |
| All three workspaces, full typecheck scripts | 19.3 s | 6.6 s | 2.9× |

The full-script number improves less because some of that time isn't the compiler at all, like
building the shared libraries first.

## Two catches

**No language service.** TypeScript 7 doesn't ship `tsserver`, the part a code editor talks to
for autocomplete and red squiggles. Upgrading in place would have quietly broken my editor. So
the new compiler is installed under an alias beside the old one: TypeScript 7 does the checking
and building, and 5.9 keeps the code editor happy.

**Two programs, one name.** Both versions install a command called `tsc`, and whichever installs
last wins. Installing the alias really did repoint `tsc` at the new compiler; I checked rather
than assumed. So no script in the project says a bare `tsc` any more. Every one names its
compiler by its full path.
