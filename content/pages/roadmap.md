---
title: Roadmap
status: "Tools first: finishing the apps and getting them to the first testers"
---

Where Prometheus stands and what has to happen before launch. Dates are hopes, not promises.

## Done: the engine foundations

- A browser editor driving a simulation the server owns, with several tabs editing one scene live
- Frieze, which bakes 3D models into pixel-art sprite sheets that catch the scene's light
- Delve, the first mode for walking around the 2.5D world
- Gameplay groundwork: input, UI, scripting, AI and navigation, physics queries, dialogue
- Device budgets, region streaming and a static export for phones

## Done: the rebuild so far

- The new editor designed in Figma before building it: round one approved October 20, round two
  October 21, round three October 29
- The editor as a desktop app with its own installer, the new shell, and a real sign-in screen
- A plugin host with Jobs as the first plugin; plugins can add panels and status items, declare
  their permissions and carry a licence
- Scene saves that are safe when a plugin is off: anything the engine can't load is kept, shown
  read-only in the editor, and saved back untouched (October 27)
- Sign-in, invites, roles and an audit log on Forge
- Licences for DD-ReForged and the editor plugins, with a free version that never locks
  (working end to end since October 29)
- DD-ReForged's git toolkit, where every write can be undone (October 31), and Watchfire, a first
  page for everything that needs you (November 7)
- The DD-ReForged phone app, running on a real phone
- Forge on its own domain, prometheanworks.dev (November 8), self-hosted on Linux through
  Cloudflare for now

## Now: tools first

No new game content until the tools and every app work properly. I decided that on October 31.

- Accounts that follow GitHub: each account reaches what its own GitHub account can reach
- Passing the brand new Windows user test, then getting DD-ReForged to the first testers
- One look across every app, starting with DD-ReForged and Forge
- Every app updating itself, from a signed list on Forge
- Forge's data encrypted by default, in layers
- Looking into proper server hosting
- Switching the engine over to per-person sign-in, so it records who made each edit (in code since
  October 22, waiting on my setup steps)
- The rest of the plugin platform, starting with plugins that own scene data

## Next: back to the game

- Rewriting the rendering parts of the engine on Vulkan for maximum performance. WebGL has been
  great, but the world I have in mind is huge, and I'd rather optimize early. Not everything gets
  rewritten, just the rendering parts that matter for the graphics
- Export targets for Android, iOS and Steam
- The game-building tools, starting with the living world: terrain that only exists once a
  player or a monster travels into it
- The first vertical slice, now looking like mid to late 2027 (first hoped for late 2026 or early
  2027)
- My teenagers, who are studying engineering, helping to design and build the game world
- Friends writing the music and ambience while they play the slice

## Then: launch

- A mobile version for the App Store and Google Play
- A Steam version for PC
- All three released on the same day
- The engine released for free once my game is built with it, with a documented way to build
  your own plugins
