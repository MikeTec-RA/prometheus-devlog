// Builds feed.xml (RSS 2.0, imported by GameDev.net) and index.html (the GitHub Pages
// front page) from posts/*.md. Each post starts with a front-matter block:
//
//   ---
//   title: Post title
//   date: 2026-10-18
//   ---
//
// Images are referenced relative to the repo root (images/<post>/<file>.png) and are
// rewritten to absolute URLs, because an imported post lives on GameDev.net, not here.
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { marked } from 'marked';

const SITE_URL = 'https://miketec-ra.github.io/prometheus-devlog/';
const FEED_TITLE = 'Prometheus devlog';
const FEED_DESCRIPTION =
  'Building Prometheus, a custom 2.5D engine and browser editor, on the way to Forgotten Memories, Endless Abyss.';

function parsePost(file) {
  const raw = readFileSync(`posts/${file}`, 'utf8').replace(/\r\n/g, '\n');
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) throw new Error(`${file}: missing front matter`);
  const meta = Object.fromEntries(
    match[1].split('\n').filter(Boolean).map((line) => {
      const at = line.indexOf(':');
      return [line.slice(0, at).trim(), line.slice(at + 1).trim()];
    }),
  );
  for (const key of ['title', 'date']) {
    if (!meta[key]) throw new Error(`${file}: front matter needs "${key}"`);
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(meta.date)) throw new Error(`${file}: date must be YYYY-MM-DD`);
  const slug = file.replace(/\.md$/, '');
  const html = marked.parse(match[2]).replace(
    /(src|href)="(?!https?:|#|mailto:)([^"]+)"/g,
    (_, attr, path) => `${attr}="${new URL(path, SITE_URL)}"`,
  );
  return { ...meta, slug, html, link: `${SITE_URL}#${slug}` };
}

const escapeXml = (s) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const cdata = (s) => `<![CDATA[${s.replace(/]]>/g, ']]]]><![CDATA[>')}]]>`;
// Noon UTC on the post's date, but never later than the build: an importer may hold back or
// future-date an entry whose pubDate hasn't arrived yet.
const buildTime = new Date();
const rfc822 = (date) => {
  const noon = new Date(`${date}T12:00:00Z`);
  return (noon > buildTime ? buildTime : noon).toUTCString();
};

const posts = readdirSync('posts')
  .filter((f) => f.endsWith('.md'))
  .map(parsePost)
  .sort((a, b) => b.date.localeCompare(a.date) || b.slug.localeCompare(a.slug));

const items = posts.map((p) => `    <item>
      <title>${escapeXml(p.title)}</title>
      <link>${p.link}</link>
      <guid isPermaLink="false">prometheus-devlog:${p.slug}</guid>
      <pubDate>${rfc822(p.date)}</pubDate>
      <description>${cdata(p.html)}</description>
      <content:encoded>${cdata(p.html)}</content:encoded>
    </item>`).join('\n');

writeFileSync('feed.xml', `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>${escapeXml(FEED_TITLE)}</title>
    <link>${SITE_URL}</link>
    <description>${escapeXml(FEED_DESCRIPTION)}</description>
    <language>en</language>
    <atom:link href="${SITE_URL}feed.xml" rel="self" type="application/rss+xml"/>
    <lastBuildDate>${buildTime.toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>
`);

const articles = posts.map((p) => `<article id="${p.slug}">
<p class="date">${p.date}</p>
<h2><a href="#${p.slug}">${escapeXml(p.title)}</a></h2>
${p.html}
</article>`).join('\n<hr>\n');

writeFileSync('index.html', `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeXml(FEED_TITLE)}</title>
<link rel="alternate" type="application/rss+xml" title="${escapeXml(FEED_TITLE)}" href="feed.xml">
<style>
  :root { --bg: #fbfaf8; --fg: #1d1d1f; --muted: #6b6b70; --link: #b4441c; --rule: #e3e0da; }
  @media (prefers-color-scheme: dark) {
    :root { --bg: #151517; --fg: #e8e6e3; --muted: #9a9aa0; --link: #f08a5d; --rule: #2c2c30; }
  }
  body { background: var(--bg); color: var(--fg); font: 17px/1.6 system-ui, sans-serif; margin: 0; padding: 0 16px; }
  main { max-width: 760px; margin: 48px auto; }
  header p, .date { color: var(--muted); }
  a { color: var(--link); }
  h2 a { color: inherit; text-decoration: none; }
  img { max-width: 100%; height: auto; border-radius: 6px; }
  hr { border: 0; border-top: 1px solid var(--rule); margin: 48px 0; }
  code { font-size: 0.9em; }
</style>
</head>
<body>
<main>
<header>
<h1>${escapeXml(FEED_TITLE)}</h1>
<p>${escapeXml(FEED_DESCRIPTION)} <a href="feed.xml">RSS</a></p>
</header>
${articles}
</main>
</body>
</html>
`);

console.log(`Built ${posts.length} post(s): feed.xml, index.html`);
