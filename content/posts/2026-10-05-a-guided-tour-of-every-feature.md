---
title: A guided tour of every feature
date: 2026-10-05
summary: The showcase scene became a hall with ten stations, and a dry run caught three mistakes before I saved it.
---

Every feature that lands goes into one showcase scene, Re-Forged. By this month it had become a
pile: lights, particles, sprites, widgets and physics props all fighting over the same patch of
floor. So I rebuilt it as a tour.

![The tour hall from above: ten stations down a long hall, with the camera flight weaving between them](images/2026-10-05-a-guided-tour-of-every-feature/overview.png)

## Ten stations

It's now a hall 40 metres wide and 140 long, with numbered stations down its length, each with a
sign: a welcome, then sprites and paths, behaviour trees, scripting, physics, lighting,
particles, UI widgets, shared simulation, and a wall of materials. A saved camera flight weaves
between them, so the whole tour plays as a fly-through.

![The physics station: a scripted spawner sends balls rolling down a ramp](images/2026-10-05-a-guided-tour-of-every-feature/physics.png)

![Particles and effects: campfire, torch, pyre, fog and lightning](images/2026-10-05-a-guided-tour-of-every-feature/particles.png)

![The materials wall: brick lit by three spotlights over a row of materials](images/2026-10-05-a-guided-tour-of-every-feature/materials.png)

## The dry run caught three mistakes

I didn't build the new layout straight into the saved scene. A script built the proposed version
as a private copy, flew a camera to each station and took a picture, without saving anything.
Those pictures caught three problems:

- **Invisible signs.** They stood outside the camera's view from the walking line, so nobody
  would ever have read them. They moved five metres in.
- **A moonlit wall.** The three spotlights on the brick wall were 30 candela each, eight metres
  away. That works out to roughly the light of two full moons. Atmospheric, but not what a
  showcase wall needs. They went up to 140.
- **A distracted camera.** The fly-through was pointing at the wrong places, and now looks at
  the stations.

At the physics station the spawner dropped four balls while the scene played, and none were left
after Stop, so stopping really does put the world back. Then the layout was saved, and the same
camera run against the saved scene gave the same pictures.
