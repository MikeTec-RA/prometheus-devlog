---
title: The save that deleted things
date: 2026-09-10
summary: Four bugs that could lose work for good, one shape behind all of them, and three rules that came out of it.
---

This week I found four bugs that could permanently lose work. They looked unrelated. They turned
out to be the same bug wearing four hats.

## Four ways to lose a scene

- A save that quietly dropped the scene's camera fly-through.
- A loader that gave up waiting a moment too early on a cold start, and threw away every rail
  that objects were riding along.
- An auto-save guard that pressing Pause switched off, so a running simulation, mid-tumble,
  could be saved over the scene you'd actually built.
- An object whose model couldn't be found was skipped when the scene loaded, and the next
  auto-save, sixty seconds later, wrote the scene without it. Opening a scene while the backend
  was restarting was enough. No edit required.

## The shape

Every one went the same way. Something failed to load, for a reason that wasn't its own fault:
the server was restarting, a cache was cold, a load was still in flight. So it never made it into
the live scene. Then a save came along, looked at the live scene, and wrote down what it saw.

To a save, something that failed to load looks exactly like something you deleted on purpose.
Nothing complains on either side. The load logs a warning and carries on, and the save looks
perfectly normal. You find out when the thing is gone.

## Three rules

1. **Missing isn't the same as unavailable.** "This doesn't exist" and "I couldn't reach it just
   now" are different answers, and only the first is allowed to remove anything. A comment in
   the code puts it best: collapsing the two is what let "a backend that was merely restarting
   look like a mass deletion."
2. **Hold, don't drop.** If something can't be loaded, keep its saved record and write it back
   out unchanged. It's missing from the screen, which is honest. It isn't missing from the file.
3. **Teach the guard you already have.** There was already a check that stops a half-loaded scene
   being saved over a full one. Teaching it about these cases beat bolting a second guard on
   beside it.

All four bugs are fixed. The rules stay: anything new that saves data gets asked what the next
save writes when its load goes wrong.
