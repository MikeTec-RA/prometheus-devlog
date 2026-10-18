// Builds the devlog site and its feeds from content/.
//
//   content/posts/YYYY-MM-DD-slug.md   one post each; front matter: title, date, optional summary
//   content/pages/roadmap.md           the Roadmap tab; front matter: title, status
//   content/pages/about.md             the About tab; front matter: title
//   images/<post slug>/*.png           screenshots, referenced as images/<post slug>/<file>.png
//
// Output: index.html, posts/<slug>/index.html, roadmap/, gallery/, about/, 404.html, and
// feed.xml / feed.rss / atom.xml for GameDev.net and feed readers. Everything in the output
// folders is regenerated; edit content/ and assets/, never the output.
import { mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { marked } from 'marked';

const SITE_URL = 'https://miketec-ra.github.io/prometheus-devlog/';
const SITE_TITLE = 'Prometheus devlog';
const SITE_DESCRIPTION =
  'Building Prometheus, a custom 2.5D engine and editor, on the way to Forgotten Memories, Endless Abyss.';
const AUTHOR = 'MikeTec-RA';
const GAMEDEV_URL = 'https://gamedev.net/projects/431-prometheus/';
const HOME_LEDE =
  'A custom 2.5D engine and editor, built for <em>Forgotten Memories, Endless Abyss</em>: an online MMO set in an endless dungeon that reshapes itself around its players.';
const TABS = [
  { key: 'devlog', label: 'Devlog', path: '' },
  { key: 'roadmap', label: 'Roadmap', path: 'roadmap/' },
  { key: 'gallery', label: 'Gallery', path: 'gallery/' },
  { key: 'about', label: 'About', path: 'about/' },
];

// ---- helpers ------------------------------------------------------------------------------

const escapeHtml = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const cdata = (s) => `<![CDATA[${s.replace(/]]>/g, ']]]]><![CDATA[>')}]]>`;
const stripTags = (html) => html.replace(/<[^>]+>/g, '').replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, '&');
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August',
  'September', 'October', 'November', 'December'];
const longDate = (iso) => {
  const [y, m, d] = iso.split('-').map(Number);
  return `${MONTHS[m - 1]} ${d}, ${y}`;
};

// Noon UTC on the post's date, but never later than the build: an importer may hold back or
// future-date an entry whose date hasn't arrived yet.
const buildTime = new Date();
const postTime = (date) => {
  const noon = new Date(`${date}T12:00:00Z`);
  return noon > buildTime ? buildTime : noon;
};

// Content links are written relative to the site root (images/...). Rebase them for a page
// `prefix` levels deep, or make them absolute for the feeds.
const rebase = (html, prefix) =>
  html.replace(/(src|href)="(?!https?:|#|mailto:|\/)([^"]+)"/g, (_, attr, path) => `${attr}="${prefix}${path}"`);
const absolute = (html) =>
  html.replace(/(src|href)="(?!https?:|#|mailto:)([^"]+)"/g, (_, attr, path) => `${attr}="${new URL(path, SITE_URL)}"`);

function readDoc(path) {
  const raw = readFileSync(path, 'utf8').replace(/\r\n/g, '\n');
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) throw new Error(`${path}: missing front matter`);
  const meta = Object.fromEntries(
    match[1].split('\n').filter(Boolean).map((line) => {
      const at = line.indexOf(':');
      return [line.slice(0, at).trim(), line.slice(at + 1).trim().replace(/^"(.*)"$/, '$1')];
    }),
  );
  if (!meta.title) throw new Error(`${path}: front matter needs "title"`);
  return { meta, body: match[2] };
}

// Gives every h2 an id and returns the list for a contents menu.
function withHeadingIds(html) {
  const headings = [];
  const used = new Set();
  const out = html.replace(/<h2>([\s\S]*?)<\/h2>/g, (_, inner) => {
    let id = stripTags(inner).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'section';
    while (used.has(id)) id += '-2';
    used.add(id);
    headings.push({ id, html: inner });
    return `<h2 id="${id}">${inner}</h2>`;
  });
  return { html: out, headings };
}

// A paragraph holding only an image becomes a figure that opens full size; the alt text is
// its caption.
const withFigures = (html) =>
  html.replace(/<p>(<img [^>]*>)<\/p>/g, (_, img) => {
    const src = img.match(/src="([^"]+)"/)[1];
    const alt = (img.match(/alt="([^"]*)"/) || [])[1] || '';
    return `<figure><a class="zoom" href="${src}" data-caption="${alt}">${img.replace('<img ', '<img loading="lazy" ')}</a>${alt ? `<figcaption>${alt}</figcaption>` : ''}</figure>`;
  });

// ---- content ------------------------------------------------------------------------------

const posts = readdirSync('content/posts')
  .filter((f) => f.endsWith('.md'))
  .map((file) => {
    const { meta, body } = readDoc(`content/posts/${file}`);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(meta.date || '')) throw new Error(`${file}: date must be YYYY-MM-DD`);
    const slug = file.replace(/\.md$/, '');
    const raw = marked.parse(body);
    const { html, headings } = withHeadingIds(withFigures(raw));
    const firstPara = (raw.match(/<p>(?!<img)([\s\S]*?)<\/p>/) || [])[1] || '';
    const images = [...raw.matchAll(/<img [^>]*?src="([^"]+)"[^>]*?alt="([^"]*)"/g)]
      .map(([, src, alt]) => ({ src, alt }));
    return {
      ...meta,
      slug,
      feedHtml: absolute(raw),
      html,
      headings,
      images,
      cover: images[0]?.src,
      excerpt: meta.summary || stripTags(firstPara).replace(/\s+/g, ' ').trim(),
      minutes: Math.max(1, Math.round(body.split(/\s+/).length / 225)),
      path: `posts/${slug}/`,
    };
  })
  .sort((a, b) => b.date.localeCompare(a.date) || b.slug.localeCompare(a.slug));

const roadmap = readDoc('content/pages/roadmap.md');
const about = readDoc('content/pages/about.md');

// ---- page shell ---------------------------------------------------------------------------

const ICONS = {
  flame: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2c1 3.5-1.5 5.2-2.8 7.1C7.9 11 7 12.6 7 14.6A5 5 0 0 0 12 20a5 5 0 0 0 5-5.2c0-2.3-1.2-4-2.3-5.3-.4 1.5-1.1 2.4-2.1 2.9.6-3.4-.1-6.9-.6-10.4Z" fill="currentColor"/></svg>',
  rss: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4a15 15 0 0 1 15 15h-3A12 12 0 0 0 5 7V4Zm0 6a9 9 0 0 1 9 9h-3a6 6 0 0 0-6-6v-3Zm1.5 5.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z" fill="currentColor"/></svg>',
  theme: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3a9 9 0 1 0 0 18V3Z" fill="currentColor"/><circle cx="12" cy="12" r="8.25" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>',
};

function page({ prefix, tab, title, description, image, type = 'website', url, main }) {
  const fullTitle = title ? `${title} · ${SITE_TITLE}` : SITE_TITLE;
  const tabs = TABS.map((t) =>
    `<a href="${prefix}${t.path}"${t.key === tab ? ' aria-current="page"' : ''}>${t.label}</a>`).join('');
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(fullTitle)}</title>
<meta name="description" content="${escapeHtml(description || SITE_DESCRIPTION)}">
<meta property="og:site_name" content="${SITE_TITLE}">
<meta property="og:title" content="${escapeHtml(title || SITE_TITLE)}">
<meta property="og:description" content="${escapeHtml(description || SITE_DESCRIPTION)}">
<meta property="og:type" content="${type}">
<meta property="og:url" content="${SITE_URL}${url || ''}">
${image ? `<meta property="og:image" content="${new URL(image, SITE_URL)}">\n<meta name="twitter:card" content="summary_large_image">\n` : ''}<link rel="icon" href="${prefix}assets/favicon.svg" type="image/svg+xml">
<link rel="alternate" type="application/rss+xml" title="${SITE_TITLE}" href="${prefix}feed.xml">
<link rel="alternate" type="application/atom+xml" title="${SITE_TITLE}" href="${prefix}atom.xml">
<link rel="stylesheet" href="${prefix}assets/site.css">
<script>try{var t=localStorage.getItem('theme');if(t)document.documentElement.dataset.theme=t}catch(e){}</script>
<script src="${prefix}assets/site.js" defer></script>
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
<header class="site-nav">
  <div class="nav-inner">
    <a class="brand" href="${prefix}">${ICONS.flame}<span>Prometheus</span><span class="brand-sub">devlog</span></a>
    <nav class="tabs" aria-label="Sections">${tabs}</nav>
    <div class="nav-actions">
      <a class="icon-btn" href="${prefix}feed.xml" title="RSS feed" aria-label="RSS feed">${ICONS.rss}</a>
      <button class="icon-btn" type="button" data-theme-toggle title="Switch light/dark" aria-label="Switch light or dark theme">${ICONS.theme}</button>
    </div>
  </div>
</header>
<main id="main">
${main}
</main>
<footer class="site-footer">
  <p>Prometheus and <em>Forgotten Memories, Endless Abyss</em> are made by ${AUTHOR}.</p>
  <p><a href="${GAMEDEV_URL}">GameDev.net project</a> · <a href="${prefix}feed.xml">RSS</a> · <a href="${prefix}atom.xml">Atom</a></p>
</footer>
</body>
</html>
`;
}

function write(path, html) {
  mkdirSync(path.split('/').slice(0, -1).join('/') || '.', { recursive: true });
  writeFileSync(path, html);
}

// ---- pages --------------------------------------------------------------------------------

for (const dir of ['posts', 'roadmap', 'gallery', 'about']) rmSync(dir, { recursive: true, force: true });

const postCard = (p, prefix, featured) => `<a class="card${featured ? ' featured' : ''}" href="${prefix}${p.path}">
  ${p.cover ? `<img class="card-cover" src="${prefix}${p.cover}" alt="" loading="lazy">` : `<div class="card-cover placeholder" aria-hidden="true">${ICONS.flame}</div>`}
  <div class="card-body">
    <p class="meta"><time datetime="${p.date}">${longDate(p.date)}</time> · ${p.minutes} min read</p>
    <h3>${escapeHtml(p.title)}</h3>
    <p class="excerpt">${escapeHtml(p.excerpt)}</p>
    <span class="more">Read the post <span aria-hidden="true">→</span></span>
  </div>
</a>`;

// Older posts as a compact list grouped by month, so the home page doesn't become a wall of cards.
function archive(list) {
  const months = new Map();
  for (const p of list) {
    const [y, m] = p.date.split('-').map(Number);
    const key = `${MONTHS[m - 1]} ${y}`;
    if (!months.has(key)) months.set(key, []);
    months.get(key).push(p);
  }
  return `<div class="archive">${[...months].map(([month, items]) => `<section>
    <h3>${month}</h3>
    <ul>${items.map((p) => `<li><a href="${p.path}"><time datetime="${p.date}">${longDate(p.date).replace(/, \d{4}$/, '')}</time><span class="title">${escapeHtml(p.title)}</span><span class="excerpt">${escapeHtml(p.excerpt)}</span></a></li>`).join('')}</ul>
  </section>`).join('')}</div>`;
}

// The roadmap's current status, as a link from the home page and plain text on the roadmap.
const statusPill = (href) => {
  if (!roadmap.meta.status) return '';
  const text = `<span class="dot" aria-hidden="true"></span>${escapeHtml(roadmap.meta.status)}`;
  return href ? `<a class="status" href="${href}">${text}<span aria-hidden="true">→</span></a>` : `<p class="status">${text}</p>`;
};

write('index.html', page({
  prefix: '',
  tab: 'devlog',
  description: SITE_DESCRIPTION,
  image: posts[0]?.cover,
  main: `<div class="wrap">
<section class="intro">
  <p class="eyebrow">A solo-built 2.5D engine and MMO</p>
  <h1>Building Prometheus</h1>
  <p class="lede">${HOME_LEDE}</p>
  ${statusPill('roadmap/')}
</section>
<section class="post-index" aria-label="Posts">
  <h2 class="section-label">Latest</h2>
  ${posts[0] ? postCard(posts[0], '', true) : '<p>No posts yet.</p>'}
  ${posts.length > 1 ? `<h2 class="section-label">Recent posts</h2>
  <div class="card-grid">${posts.slice(1, 7).map((p) => postCard(p, '', false)).join('\n')}</div>` : ''}
  ${posts.length > 7 ? `<h2 class="section-label">Older posts</h2>
  ${archive(posts.slice(7))}` : ''}
</section>
</div>`,
}));

posts.forEach((p, i) => {
  const prefix = '../../';
  const newer = posts[i - 1];
  const older = posts[i + 1];
  const toc = p.headings.map((h) => `<li><a href="#${h.id}">${h.html}</a></li>`).join('');
  write(`${p.path}index.html`, page({
    prefix,
    tab: 'devlog',
    title: p.title,
    description: p.excerpt,
    image: p.cover,
    type: 'article',
    url: p.path,
    main: `<div class="post-layout">
<article class="post">
  <header class="post-head">
    <a class="back" href="${prefix}"><span aria-hidden="true">←</span> All posts</a>
    <h1>${escapeHtml(p.title)}</h1>
    <p class="meta"><time datetime="${p.date}">${longDate(p.date)}</time> · ${p.minutes} min read</p>
  </header>
  ${toc ? `<details class="toc-inline"><summary>Contents</summary><ol>${toc}</ol></details>` : ''}
  <div class="prose">
${rebase(p.html, prefix)}
  </div>
  <nav class="post-nav" aria-label="More posts">
    ${older ? `<a class="older" href="${prefix}${older.path}"><span>← Older</span>${escapeHtml(older.title)}</a>` : '<span></span>'}
    ${newer ? `<a class="newer" href="${prefix}${newer.path}"><span>Newer →</span>${escapeHtml(newer.title)}</a>` : ''}
  </nav>
</article>
${toc ? `<aside class="toc" aria-label="On this page"><p>On this page</p><ol>${toc}</ol></aside>` : ''}
</div>`,
  }));
});

write('roadmap/index.html', page({
  prefix: '../',
  tab: 'roadmap',
  title: roadmap.meta.title,
  description: roadmap.meta.status,
  url: 'roadmap/',
  main: `<div class="wrap narrow">
<section class="page-head"><h1>${escapeHtml(roadmap.meta.title)}</h1>${statusPill(null)}</section>
<div class="prose roadmap">
${rebase(withHeadingIds(marked.parse(roadmap.body)).html, '../')}
</div>
</div>`,
}));

const gallery = posts.flatMap((p) => p.images.map((img) => ({ ...img, post: p })));
write('gallery/index.html', page({
  prefix: '../',
  tab: 'gallery',
  title: 'Gallery',
  description: 'Screenshots from the Prometheus devlog.',
  image: gallery[0]?.src,
  url: 'gallery/',
  main: `<div class="wrap wide">
<section class="page-head"><h1>Gallery</h1><p class="lede">Every screenshot from the devlog, newest first. Select one to see it full size.</p></section>
<div class="gallery">
${gallery.map((g) => `<figure>
  <a class="zoom" href="../${g.src}" data-caption="${g.alt}"><img src="../${g.src}" alt="${g.alt}" loading="lazy"></a>
  <figcaption>${g.alt}<a href="../${g.post.path}">${escapeHtml(g.post.title)}</a></figcaption>
</figure>`).join('\n')}
</div>
</div>`,
}));

write('about/index.html', page({
  prefix: '../',
  tab: 'about',
  title: about.meta.title,
  description: 'About Prometheus, Forgotten Memories, Endless Abyss and the people making them.',
  url: 'about/',
  main: `<div class="wrap narrow">
<section class="page-head"><h1>${escapeHtml(about.meta.title)}</h1></section>
<div class="prose">
${rebase(marked.parse(about.body), '../')}
</div>
</div>`,
}));

// GitHub Pages serves 404.html from any depth, so it uses absolute links.
write('404.html', page({
  prefix: SITE_URL,
  tab: '',
  title: 'Not found',
  main: `<div class="wrap narrow"><section class="page-head"><h1>Lost in the abyss</h1><p class="lede">That page doesn't exist. <a href="${SITE_URL}">Back to the devlog</a>.</p></section></div>`,
}));

// ---- feeds --------------------------------------------------------------------------------

const items = posts.map((p) => `    <item>
      <title>${escapeHtml(p.title)}</title>
      <link>${SITE_URL}${p.path}</link>
      <guid isPermaLink="false">prometheus-devlog:${p.slug}</guid>
      <pubDate>${postTime(p.date).toUTCString()}</pubDate>
      <description>${cdata(p.feedHtml)}</description>
      <content:encoded>${cdata(p.feedHtml)}</content:encoded>
    </item>`).join('\n');

// The same RSS is published twice: feed.xml (served as application/xml) and feed.rss
// (served as application/rss+xml), for importers that judge a feed by its content type.
for (const file of ['feed.xml', 'feed.rss']) {
  writeFileSync(file, `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>${escapeHtml(SITE_TITLE)}</title>
    <link>${SITE_URL}</link>
    <description>${escapeHtml(SITE_DESCRIPTION)}</description>
    <language>en</language>
    <atom:link href="${SITE_URL}${file}" rel="self" type="application/rss+xml"/>
    <lastBuildDate>${buildTime.toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>
`);
}

const entries = posts.map((p) => `  <entry>
    <title>${escapeHtml(p.title)}</title>
    <link href="${SITE_URL}${p.path}" rel="alternate" type="text/html"/>
    <id>tag:miketec-ra.github.io,2026:prometheus-devlog:${p.slug}</id>
    <published>${postTime(p.date).toISOString()}</published>
    <updated>${postTime(p.date).toISOString()}</updated>
    <content type="html">${escapeHtml(p.feedHtml)}</content>
  </entry>`).join('\n');

writeFileSync('atom.xml', `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>${escapeHtml(SITE_TITLE)}</title>
  <subtitle>${escapeHtml(SITE_DESCRIPTION)}</subtitle>
  <link href="${SITE_URL}" rel="alternate" type="text/html"/>
  <link href="${SITE_URL}atom.xml" rel="self" type="application/atom+xml"/>
  <id>${SITE_URL}</id>
  <updated>${buildTime.toISOString()}</updated>
  <author><name>${AUTHOR}</name></author>
${entries}
</feed>
`);

console.log(`Built ${posts.length} post(s), ${gallery.length} gallery image(s), 3 feeds.`);
