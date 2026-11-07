---
title: Why I'm building all this
---

## The mission

Make the game I've wanted to make since college, and build tools I actually want to use on the way there. Tools that work on my own machine, that stay mine once I have them, and that don't charge me rent for the privilege. Then hand them to anyone else who's tired of the same things I am.

I'm a web developer by day and a game developer at night and on weekends. I have a family and a full-time job, and this is my passion project. I love to build stuff.

## Why my own engine

[*Forgotten Memories, Endless Abyss*](posts/2026-09-04-the-game-behind-the-engine/) needs things an off-the-shelf engine doesn't hand you: a server that owns the simulation for everyone, the same simulation running on the player's device in a shipped game, and a pipeline that turns 3D models into pixel-art sprites that live in a 3D dungeon. It also has to run well on phones.

So I'm building **Prometheus**, on an all-open-source stack with no vendor royalties. The engine will be free once I'm done building my game with it. The custom parts I build for the game, not so much, but there will be a way, with documentation, to build your own plugins and extend the engine to your heart's content.

## Why my own git tools

Git tooling sucks right now. It's all over the place, and it's filled with AI nobody asked for.

The best one I ever used went traitor. For years it had a desktop app that worked so well, with reviews that ran locally, in the app, offline. Then they took that away and forced everyone onto their website, which is garbage compared to what the desktop app was. Now it's web only, and token this and token that.

I have nothing against using AI. I use it. But let me use the harness I already pay for and already chose. Don't make me pay you and them too, and for what? Stupid reviews and excessive PR comments from a bot?

I liked my local review tooling the way it was. They took it away, so I've spent months building a wholesale replacement, and I'm going to release it for the world to use.

## What I'm building instead

**DD-ReForged** is the git tool I wanted to keep having:

- **Local first.** Reviews and boards live on your own PC and work offline. A server is an option, not the price of entry.
- **Where you work.** A desktop app and a VS Code extension, plus a phone app for when you're away from your desk.
- **Hard to hurt yourself with.** Every git write can be undone, because [I've learned that one the hard way](posts/2026-11-07-the-night-i-deleted-my-own-forge/).
- **AI on your terms.** There's no AI bill built into it. If you want an assistant involved, connect the one you already use, and it works through the same safety rules you do.

**Forge** is the optional server side, for when you want code review, boards and docs shared with other people.

It's not out yet. I use all of it myself every day as the test bed, friends and beta testers do the battle testing, and the first testers are next.

## What it will cost

Basically nothing. I'm sick of paying an arm and a leg for software. DD-ReForged has a free version that never locks, at the low, low cost of registering for a free licence, and no, I won't sell your stuff. Registering is how I find out how many real users I've got. Pro will come with a year of updates, and you keep the app. The details are in [the licensing post](posts/2026-11-07-seal-licences/).

Buy me enough cups of coffee and I won't need to buy my own anymore. Did I mention I love to build cool tools? The coffee just keeps the forge lit.

## Where it goes from here

This will be a helpful, fully supported tool, and there's more to come as people ask for it. If you need a new integration, or a way to run some other part of your workflow in local mode, tell me. That's how the list gets made.

And if you want a custom setup for your team, we can talk about that too.
