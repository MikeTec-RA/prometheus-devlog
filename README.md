# Prometheus devlog

Source for the Prometheus devlog site and its feeds. Markdown in `content/` becomes a small
static site (Devlog, Roadmap, Gallery and About tabs) plus RSS and Atom feeds. GitHub Pages
serves it, and GameDev.net can import new posts from the feed.

- Site: https://miketec-ra.github.io/prometheus-devlog/
- Feeds: [feed.xml](https://miketec-ra.github.io/prometheus-devlog/feed.xml) (RSS),
  [feed.rss](https://miketec-ra.github.io/prometheus-devlog/feed.rss) (the same, served as RSS),
  [atom.xml](https://miketec-ra.github.io/prometheus-devlog/atom.xml) (Atom)

## Where things live

| Edit | What it is |
|---|---|
| `content/posts/YYYY-MM-DD-slug.md` | One post each |
| `content/pages/roadmap.md` | The Roadmap tab; its `status:` line is also the pill on the home page |
| `content/pages/about.md` | The About tab |
| `images/<post slug>/` | Screenshots for that post; they appear in the Gallery automatically |
| `assets/` | Styles, the small script (theme switch, full-size images, contents highlight), favicon |
| `build.mjs` | Site title, description, tabs and the page templates |

`index.html`, `posts/`, `roadmap/`, `gallery/`, `about/`, `404.html` and the feeds are
generated. Don't edit them by hand; `npm run build` replaces them.

## Adding a post

1. Create `content/posts/YYYY-MM-DD-slug.md`:

   ```markdown
   ---
   title: Post title
   date: 2026-10-18
   summary: Optional. Used on the post card; the first paragraph is used otherwise.
   ---

   First paragraph...

   ## A section

   ![What the screenshot shows](images/YYYY-MM-DD-slug/name.png)
   ```

   Each `##` heading becomes an entry in the post's contents menu. An image on its own line
   becomes a captioned figure (the alt text is the caption) that opens full size.
2. `npm install` once, then `npm run build`.
3. `npm run preview` and open http://localhost:4173/ to check it.
4. Commit everything, generated files included, and push.

The file name is the post's permanent ID in the feeds. Renaming a published post's file makes
feed readers, GameDev.net included, see it as a new post.

## One-time setup

1. GitHub: **Settings → Pages → Build and deployment → Deploy from a branch → `main` / `(root)`**.
2. GameDev.net: on the blog, **Manage Blog → Atom/RSS Import**, and paste a feed URL above.
