---
title: Reforged from the ashes
date: 2026-07-20
summary: Prometheus started as the remains of a scrapped avatar project. Here's what survived, and where all the fire names come from.
---

Prometheus didn't start from nothing. It started from the ashes of something else.

For about a year before this, a friend and I built an avatar project: animated 3D characters in
the browser, with an editor for building the scenes they lived in. He did a lot of the animation
system and a good share of the engine work. As a product it didn't work out, but a lot of what
we built was good.

So rather than throw it away, I went through it for anything worth saving, and there was plenty:
the entity system, the editor's interface, the renderer and the animation work. The parts that
no longer fit, like the chat layer that let the avatars talk back, were cut out. What was left
is the starting point for something new.

## A new shape

The old project ran everything in the browser. The new one splits it in two: a server owns the
world and runs the simulation, and the browser becomes a window onto it, using the editor and
renderer we already had. The game all this is for is an MMO, so the server has to be in charge
anyway.

## Why the fire names

Everything rebuilt on top of the old project is named for fire and forging:

- **Prometheus**, who stole fire for humanity, is the engine.
- **Forge** is the project tools, with **Anvil**, **Ember**, **Bench** and **Kiln** inside it.
- **Re-Forged** is the showcase scene, where every rebuilt feature goes to prove it works.

The old project was melted down, and this is what gets hammered out of it.

From here on it's just me. I'm grateful for the year of work that got it this far. This is
where the devlog picks up.
