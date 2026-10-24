---
title: "A team of more than one"
date: 2026-10-23
summary: Forge has a Team page with invites and roles, the engine now knows who is editing, DD-ReForged connects to GitHub on its own and got a 0.3.5 build, and the phone app is drawn before any code.
cover: images/2026-10-23-a-team-of-more-than-one/team-people.png
---

Yesterday Forge got a front door. Since then I've been getting the rest of the house ready for guests: Forge knows who is on the team, the engine knows who is editing, and DD-ReForged can talk to GitHub without borrowing anyone's token.

## Forge has a team

![The Team page: me as the Super User and one invited developer, with their GitHub name, role and last sign-in](images/2026-10-23-a-team-of-more-than-one/team-people.png)

Forge now has a Team page that only Admins and the Super User can see. It lists everyone who can sign in, their role and when they last signed in. If someone needs to go, I can disable them without wiping their history.

Adding someone starts with an invite. I pick a role, Forge gives me a link, and that link works once and expires after a week. Whoever opens it sees who invited them and what the role lets them do, then joins with GitHub or sets a password.

![The invite page: who sent it, the role and what it allows, and the choice of GitHub or a password](images/2026-10-23-a-team-of-more-than-one/invite-page.png)

Roles are a grid: one row per permission, one column per role. The built-in ones (admin, dev, member, player) sit next to any I make myself. The Super User has every key and isn't a role at all, so nobody can edit their way into it.

![The roles grid: Anvil, Bench and Kiln permissions down the side, the roles across the top](images/2026-10-23-a-team-of-more-than-one/roles-matrix.png)

There are service tokens for scripts too. A token is shown once, can be revoked, and can never do more than the person who made it. That's the rule everywhere on this page: you can only hand out what you already have. I found one spot where a change skipped that check, so now every kind of change has its own test for it.

## The engine knows who you are

Until now the engine trusted one shared key, the same mistake Forge used to make. Now it accepts a Forge sign-in, both on its regular API and on the live connection the editor uses. A session can only be picked back up by the person who started it. Every edit, version and session records who made it, so when two people bump into each other the editor tells you who, not just "conflict". Settings are per person now, and asset downloads use short-lived tickets tied to one session.

The editor's side is in as well. It signs in and keeps the session fresh in the background. Until the editor learns to use those asset tickets, a signed-in session opens scenes read-only, so you can't make edits the engine would just refuse. Last night the signed-in live connection went in too: if it drops, your edits wait a moment and go through once when it comes back.

None of this is switched on for my own setup yet. That's on me: swap out the default key it shipped with and point the engine at Forge.

I tested all of this hard before it went in, and it paid off. One bug was a password reset code that could be used twice if two requests landed at the same moment. Now using the code and setting the new password happen together in one step, so the second request gets nothing.

## Who sees which repos

Yesterday I said a teammate should only ever see the repos their own GitHub account can reach. That now has a plan, and I've made the calls it needed. Teammates won't be able to push, merge or open pull requests through my GitHub token in Forge; they'll do that from DD-ReForged with their own login. Repos show up only for people who are collaborators on them, even public ones, and anything on GitHub that Forge doesn't track stays hidden. Building it starts with a read-only check of the token, before anything can write.

## DD-ReForged connects to GitHub itself

![DD-ReForged's Wake view, with a file from a commit open as a side-by-side diff](images/2026-10-23-a-team-of-more-than-one/wake-file-diff.png)

DD-ReForged can now connect to GitHub on your own PC through Git Credential Manager, the same sign-in git already uses, or with a pasted token. That turns on GitHub features that were already built but had no way to reach GitHub, including a pull request sweep that had been sitting there unused.

Also new in DD-ReForged:

- It can join a Forge from an invite link, and its screens follow what your role on that Forge allows.
- VS Code shows who you're signed in to Forge as.
- In Wake, clicking a file in a commit opens its diff right there, and the sidebar folds away into a drawer.

Before starting on those, I went through the whole tool against what I want it to do, checking the actual code and not just my task list. What's left on the DD side comes to roughly 80 to 110 hours. It also turned out about 45 tasks were done and just never closed.

Review build 0.3.5 went out tonight in two versions, mine and the team's. The first attempt failed its own smoke test, because the new sign-in check stopped it at the door. I taught the smoke test about the check, and both versions pass now.

## A phone app, drawn first

DD-ReForged is getting a phone app for reviewing and merging pull requests and moving cards around. Same rule as the editor: Figma before code. I've drawn nineteen screens in both themes, from sign-in to the inbox, a diff, the merge sheet and the boards, all built from DD's own theme and components.

The interesting part is Personal Forge. It runs on my PC at home, so until it's hosted somewhere the phone can only reach it on the home Wi-Fi. The app is upfront about that: it shows the last thing it read and tells you why.

![Away from home: the last read is kept, with a note that Personal Forge is on the home network](images/2026-10-23-a-team-of-more-than-one/mobile-away-from-home.png)

## Next

Repo visibility on Forge, a live event stream from Forge, and the rest of that list. Once that's done, DD-ReForged is in good enough shape that I can get back to the engine.
