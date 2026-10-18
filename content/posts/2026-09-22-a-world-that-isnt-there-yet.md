---
title: A world that isn't there yet
date: 2026-09-22
summary: Ground nobody has reached doesn't exist. Here's what that rule asks of the engine.
---

This week I pinned down one of the most important rules of the game world, and it changes what
the engine has to do.

**Ground that nobody has reached does not exist.** It isn't hidden or fogged over; it hasn't been
generated. The dungeon is endless, so it gets built as it's explored.

## Monsters explore too

Monsters don't idle in rooms waiting for a player to show up. They wander, head home, follow
routes, and keep doing it when no player is anywhere near. When a monster walks toward the edge
of the known world, terrain is generated for its path, and only its path. It learns the ground
it has actually walked, not a circle of everything around it, and none of that reveals anything
to players.

Terrain is shared: once it exists, it exists for everyone. Maps aren't. What each player has
discovered is theirs alone by default.

## The rules that hold it together

A few engine rules fall out of that:

- **Nothing walks on nothing.** Before any actor, player or monster, moves into new ground, that
  ground is generated and committed, with its collision and navigation. Nobody crosses a blank
  region, a guessed bridge or a floor that doesn't exist yet.
- **First come, first fixed.** Once ground exists, it stays. Otherwise a monster could head home
  to its den and find a lake there, because a player's arrival had regenerated the area. A player
  who turns up later finds the same trails, dens and residents the monster left.
- **Budgets.** An endlessly wandering monster could otherwise generate an endless world with
  nobody in it. Generation distance, active populations and simulation time all have limits,
  and when one runs out a monster waits at the edge rather than inventing ground.
- **Reproducible from history.** A seed alone can't rebuild a world shaped by what happened in
  it, so the engine keeps the seed, the generator version, the behaviour that shaped the world
  and everything that was committed.
- **Not flat.** Hills, valleys, cliffs, gaps and water. One spot on the map can hold a bridge
  above a cave, so a single height per point isn't enough.

## Where it starts

None of this is gameplay yet. These are engine requirements, and the first building block
arrived the same day: navigation. The editor can now bake a grid that says where an agent of a
given size fits, and find a route across it.

![A baked navigation grid: green cells fit an agent, red cells are blocked, and the pink line is a route](images/2026-09-22-a-world-that-isnt-there-yet/navigation-grid.png)

Today that works on flat floors in scenes I've built by hand. Terrain that generates itself as
monsters walk into it is the long road from here.
