---
title: Will it run on a phone?
date: 2026-10-09
summary: Budgets, streaming, static exports and the first numbers from real phones.
---

The game is meant for phones first, so this week was about finding out how far the engine is
from that, with real numbers instead of hopes.

## A budget you can see

The editor now measures a scene against a device budget (triangles, draw calls, texture memory,
sprite sheets and entity counts) with separate limits for mobile, browser and desktop. The first
time I pointed it at the showcase scene, it said texture memory was 78% over the mobile budget.

![The budget readout on the showcase scene, flagging texture memory](images/2026-10-09-will-it-run-on-a-phone/budget-hud.png)

That turned out to be the meter: it was counting shared textures more than once. Counted
properly, the scene was under budget all along. Phones still shouldn't download desktop-sized
textures, though, so a new asset pipeline publishes a separate version of each texture per
device, with phone textures capped at 512 pixels. On the showcase scene that takes texture memory
from 131.9 MiB to 83.9 MiB on mobile, well inside the 192 MB budget.

Draw calls are the open problem. The showcase scene makes 178 of them, and the mobile limit is
100.

## Streaming the world in

The world is split into regions. As the camera moves, nearby regions stay loaded, the next ones
wait warm, and distant ones give back their memory, then come back intact when you return.

## Exporting a game

A scene can now be exported as a static build: plain files that run in a browser with no server
behind them, with the simulation running on the device. That's the shape a shipped game will
take.

![A static mobile export running on its own, with its own controls](images/2026-10-09-will-it-run-on-a-phone/static-export.png)

## Real phones

Then the real test. A profiling page runs a fixed workload on the phone itself and records the
results. I ran it on a Galaxy Z Fold7, folded and unfolded, and on an iPhone 14 Pro, against a
hall of about 60 sprites.

![The on-device profiler, set up on an iPhone 14 Pro](images/2026-10-09-will-it-run-on-a-phone/phone-profiler.png)

The median frame came in right on 60 fps on the Fold7 (16.6 to 16.7 ms) and a little slower on
the iPhone (19 to 21 ms). The slowest frames ran past the 60 fps budget on both. Treat these as
early samples rather than benchmarks, but the verdict is clear enough: close, not there yet, and
now it's something I can measure instead of guess.
