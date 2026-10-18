---
title: The game behind the engine
date: 2026-09-04
summary: What Forgotten Memories, Endless Abyss is about, and why it needs an engine of its own.
---

Before the engine posts start, here's what all of it is for.

*Forgotten Memories, Endless Abyss* is an online MMO built around one shared goal: dive as
deep and as far as possible. Humanity has found a dungeon that seems to have no bottom. It's so
vast that towns have sprung up just to keep adventurers supplied, and everyone is chasing the
same questions. Does it end? Why does it exist? Is there a story beneath it all?

The name has some history. *Forgotten Memories* was a game idea of mine from college, and it
still has a Steam page from back then. Once there's a game to talk about, that page will be
carrying this one.

## A dungeon that reads its players

The dungeon isn't just procedurally generated; it's behaviourally generated. It watches what
its players do, in aggregate, and reshapes its landscapes, difficulty and monsters to match.
Every layer sits somewhere between order and anarchy.

- **Order** comes from cooperation, guild work and players policing each other. Monster
  pressure eases, towns grow, and blighted ground heals into livable land.
- **Anarchy** comes from player-killing and hostility. Spawns get nastier, the terrain
  degrades toward a hellscape, and town defences can be overrun.

Anarchy spreads like a sickness: one pocket, then many, then faster and faster. A layer that
flips blocks fast travel through it and creeps back up toward the shallower layers, so griefing
on a deep floor becomes everyone's emergency. Nothing is permanently solved. A paradise left
alone can fall again.

## You can't die, but you can forget

There's no permadeath. Every revival costs you something instead: fragments of memory.
Abilities you've earned can weaken with each revival until they're gone, becoming Forgotten
Memories. You feel yourself slipping before anything is lost outright.

The way to get them back is to go deeper. Clearing the dungeon and discovering new layers
recovers what death took, so loss pushes you forward rather than back toward safety. That's the
title: the endless abyss is the dungeon, and Forgotten Memories are what it costs you, and
what it repays.

## Holding the line

Roughly every ten layers a raid boss blocks the way. Beat it and travel to that depth unlocks
for everyone. But bosses come back. As one nears its return, monsters surge until the layer
breaks out in a stampede, and an ignored break loses that layer, then the ones above it, one by
one. The frontier and the homeland are the same responsibility.

Towns need supplying too. Players haul materials to keep them running, and an under-supplied
town dries up and loses its services. Guilds form around defence, expansion, exploration or
policing, and a big enough guild can hold a layer, for a while.

There's more under the surface than this, and some of it is meant to be discovered by players
rather than read in a devlog, so I'll leave it there.

## Why build an engine for it

A world like this needs things an off-the-shelf engine doesn't hand you: a server that owns the
simulation for everyone, the same simulation running on the player's device in a shipped game,
and a pipeline that turns 3D models into the pixel-art sprites that live in its 3D dungeon. It
also has to run well on phones.

So I'm building **Prometheus**, a custom 2.5D engine and editor on an all-open-source stack with
no vendor royalties. The next posts are about that.
