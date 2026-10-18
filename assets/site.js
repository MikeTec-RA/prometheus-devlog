// Theme toggle, full-size image viewer and the contents highlight. The site works without it.

// Light/dark toggle. The choice is remembered when storage is available; otherwise the system
// setting applies on the next visit.
document.querySelectorAll('[data-theme-toggle]').forEach((button) => {
  button.addEventListener('click', () => {
    const root = document.documentElement;
    const current = root.dataset.theme
      || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    const next = current === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next;
    try { localStorage.setItem('theme', next); } catch (e) { /* private window */ }
  });
});

// Screenshots open full size in a dialog instead of leaving the page.
const zooms = document.querySelectorAll('a.zoom');
if (zooms.length && 'HTMLDialogElement' in window) {
  const dialog = document.createElement('dialog');
  dialog.className = 'lightbox';
  dialog.innerHTML = '<img alt=""><p></p>';
  document.body.append(dialog);
  const img = dialog.querySelector('img');
  const caption = dialog.querySelector('p');
  zooms.forEach((link) => {
    link.addEventListener('click', (event) => {
      if (event.metaKey || event.ctrlKey || event.shiftKey) return;
      event.preventDefault();
      img.src = link.href;
      img.alt = link.dataset.caption || '';
      caption.textContent = link.dataset.caption || '';
      dialog.showModal();
    });
  });
  dialog.addEventListener('click', () => dialog.close());
}

// Highlight the section being read in the "On this page" list.
const tocLinks = [...document.querySelectorAll('.toc a')];
if (tocLinks.length && 'IntersectionObserver' in window) {
  const byId = new Map(tocLinks.map((a) => [a.hash.slice(1), a]));
  const visible = new Set();
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((e) => (e.isIntersecting ? visible.add(e.target.id) : visible.delete(e.target.id)));
    const headings = [...byId.keys()].map((id) => document.getElementById(id));
    const current = headings.find((h) => visible.has(h.id))
      || headings.filter((h) => h.getBoundingClientRect().top < 120).pop();
    tocLinks.forEach((a) => a.classList.toggle('active', current && a.hash === `#${current.id}`));
  }, { rootMargin: '-80px 0px -55% 0px' });
  byId.forEach((_, id) => observer.observe(document.getElementById(id)));
}
