---
title: "A team of more than one"
date: 2026-10-23
summary: Forge has a Team page with invites and roles, the engine now knows who is editing, DD-ReForged connects to GitHub on its own and got a 0.3.5 build, and the phone app is drawn before any code.
cover: images/2026-10-23-a-team-of-more-than-one/team-people.png
---

Yesterday Forge got a front door. Since then the rest of the house caught up: Forge knows who is on the team, the engine knows who is editing, and DD-ReForged learned to talk to GitHub without borrowing anyone's token.

## Forge has a team

![The Team page: me as the Super User and one invited developer, with their GitHub name, role and last sign-in](images/2026-10-23-a-team-of-more-than-one/team-people.png)

Forge now has a Team page, and only Admins and the Super User can see it. It lists the people who can sign in, what role each one holds and when they last signed in, and you can disable someone without deleting their history.

Adding someone starts with an invite. You pick the role, Forge makes a link, and the link works once and expires after a week. The person opening it sees who invited them and what the role allows, then joins with GitHub or sets a password.

![The invite page: who sent it, the role and what it allows, and the choice of GitHub or a password](images/2026-10-23-a-team-of-more-than-one/invite-page.png)

Roles are a grid. Each row is one permission and each column is a role, with the built-in ones (admin, dev, member, player) beside any you make yourself. The Super User holds every key and isn't a role at all, so nobody can edit themselves into it.

![The roles grid: Anvil, Bench and Kiln permissions down the side, the roles across the top](images/2026-10-23-a-team-of-more-than-one/roles-matrix.png)

There are service tokens for scripts too. A token is shown once, can be revoked, and can never hold more than the person who made it. That rule, that you can only hand out what you already have, is checked on every write to a person, a role or a token. The first review found a write that skipped it, so now each one has its own test.

## The engine knows who you are

Until now the engine trusted one shared key, the same mistake Forge used to make. Now it accepts Forge's sign-in on its REST routes and on the live socket the editor uses. A session can only be picked up again by the person who started it. Every edit, version and session records who made it, so when two people collide, the editor names the other person instead of just saying "conflict". Settings belong to each person, and asset downloads use short tickets tied to one session.

The editor's half is in. It signs in and refreshes quietly. Until the asset tickets reach the editor, a signed-in session opens scenes read-only, so you can't make edits the engine would refuse. Last night the signed-in socket went in too: a dropped connection holds your edits for a moment, then sends them once when it comes back.

None of this is switched on for my own setup yet. The last steps are mine: replace the shipped default key and point the engine at Forge.

Every review across these two days found at least one real defect. One of yesterday's was a reset code that could be used twice if two requests raced, so the claim and the new password now go through in a single database transaction.

## Who sees which repos

The rule I wrote about yesterday, that a teammate only ever sees repos their own GitHub account can reach, now has a plan. It went through a critique first, which found six problems worth fixing before any code, and then I answered its four open questions. Teammates won't be able to push, merge or open pull requests through my GitHub token in Forge. They do that from DD-ReForged with their own login. Repos are shown only to collaborators, even public ones, and GitHub content Forge doesn't track stays hidden. The build starts with a read-only check of the token before anything else.

## DD-ReForged connects to GitHub itself

![Wake showing a file from a commit as a side-by-side diff](images/2026-10-23-a-team-of-more-than-one/wake-file-diff.png)

DD-ReForged on your own PC can now connect to GitHub through Git Credential Manager, the same sign-in git itself uses, or with a pasted token. That switches on the GitHub features that were already built but had no way to reach GitHub, including a pull request sweep that had been sitting there unreachable.

The rest of the day's DD work:

- Work, the company profile, shows nothing until the server confirms you're an employee, and the team build asks for the server address first.
- Personal can join a Forge from an invite link, and its screens follow what your role on that Forge allows.
- VS Code shows who you're signed in to Forge as.
- In Wake, clicking a file in a commit opens its diff in place, and the sidebar folds away into a drawer.

Before building any of that, I had the whole tool audited against what it's supposed to do, checking the code itself and not just the cards. It came back with a measured list of what's left, roughly 80 to 110 hours on the DD side. It also found about 45 cards that are finished and only waiting for me to close them.

Review build 0.3.5 went out tonight in two versions: mine and the team's. The first build failed its own smoke test because the new Work sign-in check stopped it at the door. The smoke test now understands that check, and both versions pass.

## A phone app, drawn first

![Pull requests on the phone: Needs review, Mine and Open, with checks and approvals on each row](images/2026-10-23-a-team-of-more-than-one/mobile-pull-requests.png)

DD-ReForged is getting a phone app for reviewing and merging pull requests and moving cards. Same rule as the editor: Figma before code. Nineteen screens are drawn in both themes, from sign-in to the inbox, a diff, the merge sheet and the boards, built from DD's own theme variables and components.

The interesting part is Personal Forge. It runs on my PC at home, so the phone can only reach it on the home Wi-Fi until it's hosted somewhere. The app is upfront about that: it shows the last thing it read and says why.

![Away from home: the last read is kept, with a note that Personal Forge is on the home network](images/2026-10-23-a-team-of-more-than-one/mobile-away-from-home.png)

## Next

Repo visibility on Forge, the Forge event stream, and the rest of the audit's list. After that, DD-ReForged is done enough to step back and get back to the engine.
