---
title: A plugin-shaped future
date: 2026-10-18
summary: Why Prometheus is being rebuilt around plugins, and the one rule the rebuild can't break.
---

The [catching-up post](posts/2026-10-18-catching-up/) ended with development pausing for a
rebuild. Here's the thinking behind it.

## The problem

Today, adding something to Prometheus means editing the core in a dozen places: the list of
entity kinds, the component registry, the inspector, the menus, the tool windows, the frame loop,
the save system, the event catalogue, script commands, the exporter and the server's validators.
Nothing can be switched off without deleting code, and nothing outside the core can add to the
engine.

## Plugins, widgets and modes

The rebuild turns each of those places into a socket.

![The planned layers: a core every project needs, built-in plugins on by default, optional plugins on top, and modes that bundle them](images/2026-10-18-plugins-and-the-rebuild/plugin-layers.png)

- A **plugin** is a package that adds capabilities: new kinds of entity, components, simulation
  systems, script commands, importers, server jobs.
- A **widget** is a piece of UI a plugin brings with it: a tool window, an inspector section, a
  menu item.
- A **mode** is a named bundle of plugins.

Modes are the part I'm most excited about. The same engine could be a game, a simulation or a 3D
development tool depending on which mode you load, even one that renders apps or websites in 3D
and lets you take them apart.

## What stays in the core

Not everything becomes optional. The core keeps what every project needs: scene formats, edits
and undo, saving and recovery, and the renderer and simulation lifecycle. The everyday tools,
like the hierarchy, inspectors, scene browser and asset browser, ship as built-in plugins that
are on by default. Specialist tools become optional plugins: sprite tools, retargeting,
behaviour-tree authoring, generation labs, and git and review tools.

## The rule it can't break

**Unloading a plugin never loses data.** A scene that uses a plugin you don't have loaded must
still open, save, restore and export with that plugin's data intact, held exactly as it was.
It's [the save that deleted things](posts/2026-09-10-the-save-that-deleted-things/), grown up:
missing isn't the same as unavailable, so hold, don't drop.

## The desktop and beyond

The editor is moving into a desktop app built on Electron, and it will keep running in a browser
too. Further out there are two ideas: a faster backend, possibly in Rust, that can still run the
TypeScript plugins, and a Figma connection for managing models and their updates. Those are
plans, not promises.

The order is: settle the plugin contracts, build a minimal desktop editor, then move the first
tool out of the core and into a plugin. After that the rest follow, one at a time.
