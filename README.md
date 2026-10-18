# Prometheus devlog

Source for the Prometheus devlog. Posts are Markdown files in `posts/`; `npm run build` turns
them into `feed.xml` (RSS) and `index.html`. GitHub Pages serves both, and GameDev.net imports
new posts from the feed.

- Site: https://miketec-ra.github.io/prometheus-devlog/
- Feed: https://miketec-ra.github.io/prometheus-devlog/feed.xml

## Adding a post

1. Create `posts/YYYY-MM-DD-slug.md` with front matter:

   ```markdown
   ---
   title: Post title
   date: 2026-10-18
   ---
   ```

2. Put screenshots in `images/YYYY-MM-DD-slug/` and reference them as
   `images/YYYY-MM-DD-slug/name.png`. The build rewrites them to absolute URLs so they still
   load inside the imported GameDev.net post.
3. `npm install` once, then `npm run build`.
4. Commit the post, its images, `feed.xml` and `index.html` together, and push.

The file name is the post's permanent ID in the feed. Renaming a published post's file makes
feed readers, GameDev.net included, see it as a new post.

## One-time setup

1. GitHub: **Settings → Pages → Build and deployment → Deploy from a branch → `main` / `(root)`**.
2. GameDev.net: on the blog, **Manage Blog → Atom/RSS Import**, and paste the feed URL above.
