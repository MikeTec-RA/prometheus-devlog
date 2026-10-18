---
title: The server owns the world
date: 2026-09-12
summary: The editor passed its first real milestone today. Here's the decision underneath it.
---

The editor passed its first real milestone today, so it's a good moment to explain the decision
underneath it.

## Two ways to put a game in a browser

The Prometheus editor runs in a web browser, but the scene lives on a server. There were two ways
to build that.

**Pixel streaming** renders every frame on the server and streams video to the browser, the way
cloud gaming does; the browser is a remote monitor. That costs a GPU video encoder per viewer,
tens of megabits a second, text and thin lines softened by video compression, and input lag on
every click.

**State streaming** keeps the renderer in the browser. The server runs the authoritative
simulation (physics, behaviour, game rules) and sends compact updates about what changed; the
browser draws them locally and sends edits back. The research I did put that at a few hundred
times less bandwidth than video, with no server GPU per viewer and a UI that responds at local
speed.

Prometheus streams state.

## One simulation, two homes

The simulation is a standalone TypeScript package with no browser or server dependencies. In
the editor it runs on the server, which is the authority. In a shipped game there's no editor
server, so the same package runs on the player's device.

Writing it once and hosting it twice is why the backend is TypeScript rather than something
like Rust: the code that ships to players is the code I test in the editor.

## The milestone

Today two fresh browser tabs edited the same scene on the server at once. One tab was refreshed
mid-edit and lost nothing, and undo worked across both tabs. Then I pressed Play in one tab and
watched the simulation from the other, through a full stop and restart of the backend.

It doesn't look like much in a screenshot, but everything else stands on it: the editor is a
window onto a world the server owns, and that world survives the window closing.

## A scene for every feature

![The showcase scene in its first week: lights, shiny materials, particle fire and smoke, and a camera rail](images/2026-09-12-the-server-owns-the-world/early-showcase.png)

Every feature also goes into one scene, **Re-Forged**, so new work can be seen rather than read
about. This is how it looked in its first week: a handful of lights, shiny materials, particle
fire and smoke, and a camera rail for fly-throughs. It will grow with everything that lands.
