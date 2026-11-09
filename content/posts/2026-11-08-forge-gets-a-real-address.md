---
title: "Forge gets a real address"
date: 2026-11-08
summary: I bought a domain and Forge moved in, a new desktop app runs the whole stack from one window, the phone signs in with a fingerprint, and the first run as a brand new user didn't pass.
---

Until this weekend, Forge lived at an address that only meant something on my own network. Now it has a real one, and so does this blog.

## prometheanworks.dev

I bought **prometheanworks.dev** for the whole project and put Forge on it. I'm still looking into proper server hosting, so for now I'm self-hosting on Linux and reaching the internet through a Cloudflare tunnel, which means I didn't have to open anything on my home network. The web pages sit behind a second login on top of Forge's own.

My local Forge data got copied across, I claimed my account on the hosted copy, and GitHub sign-in works there. DD-ReForged now has the address built in, with a switch if you'd rather point it at your own server. The test I cared about most: my phone, off Wi-Fi, on cellular, signing in to Forge. It works.

Development stays on my own PC. There's one self-hosted Forge, and that's all that's hosted for now. Updating it is one command, and it has a way back if an update fails.

The devlog moved too. It now lives at [blog.prometheanworks.dev](https://blog.prometheanworks.dev/), and the old address redirects here. If you follow the RSS feed, it's worth updating the link.

## Stoker

Running all of this had turned into a pile of console windows and commands I had to remember, so I built **Stoker**, in keeping with the fire names. It's one desktop window that starts and stops everything, shows the logs, and watches both the local stack and the hosted Forge. A button rebuilds and reinstalls DD-ReForged. It stores no secrets at all, so the dangerous jobs aren't buttons.

## The phone

Last time I said app lock had only been tried on an emulator. It has now passed on my real phone, including the fingerprint and a wrong finger. When a session ends, the phone can now renew it with your fingerprint instead of going through a code and a browser again. The first sign-in on a phone still uses the code, and revoking a device on Forge still ends it.

I also made the first properly signed Android build, which the phone needs before anyone else can install it.

## The test that didn't pass

Before anyone else gets DD-ReForged, I want to see what a stranger sees, so I made a brand new Windows user and went through the whole thing from download to uninstall.

It didn't pass. Some of what I meant to record never got recorded, so I'm treating it as a baseline, and nobody gets a build until a run does pass. What it did do is convince me to redo accounts first.

The new rule is simple: an account reaches whatever its own GitHub account can reach. You sign in to GitHub yourself, the sign-in stays on your PC, and no server token is involved. If you run your own server, the server decides what shows. The first pieces are in: the Repos page now tells the truth about what it can see, and when GitHub refuses a clone, fetch or push, the app says it was GitHub.

## On the list

Three plans got written down this weekend:

- **Encrypted by default.** Forge's data, in transit and at rest, and end to end where only the apps need to read it. I'm being careful with that promise, because review diffs, search and git itself all run on the server and have to read the content. So it's layers, with the strict meaning kept for what no server feature needs.
- **One look.** A shared theme across every app, so the tools feel like one family.
- **Every app updates itself,** from a signed list on Forge. On Android you'll still get asked once, because Android always asks.

## Next

Finish the accounts work, run the brand new user test again, and then the first testers.
