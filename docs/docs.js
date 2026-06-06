/* ── Language redirect ── */
(() => {
  const path = location.pathname;
  const inEn = path.includes('/en/');
  const page = path.split('/').pop() || 'index.html';
  const lang = (navigator.language || navigator.userLanguage || '').toLowerCase();
  const isChinese = lang.startsWith('zh');
  /* Only redirect if user hasn't manually chosen a language (no ?lang param) */
  if (location.search.includes('lang=')) return;
  if (!isChinese && !inEn) {
    /* System is non-Chinese, but viewing Chinese docs → redirect to en/ */
    location.replace('en/' + page);
  } else if (isChinese && inEn) {
    /* System is Chinese, but viewing English docs → redirect to parent */
    location.replace('../' + page);
  }
})();

/* ── Language switch button ── */
document.addEventListener('DOMContentLoaded', () => {
  const nav = document.querySelector('.site-header nav');
  if (!nav) return;
  const path = location.pathname;
  const inEn = path.includes('/en/');
  const page = path.split('/').pop() || 'index.html';
  const btn = document.createElement('button');
  btn.className = 'lang-switch';
  btn.textContent = inEn ? '中文' : 'EN';
  btn.title = inEn ? '切換至中文' : 'Switch to English';
  btn.addEventListener('click', () => {
    const target = inEn ? '../' + page + '?lang=zh' : 'en/' + page + '?lang=en';
    location.href = target;
  });
  nav.insertBefore(btn, nav.querySelector('.menu-toggle'));
});

/* ── Mobile menu ── */
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.menu-toggle');
  const sidebar = document.querySelector('.sidebar');
  const backdrop = document.querySelector('.backdrop');
  if (!toggle || !sidebar) return;
  const close = () => { sidebar.classList.remove('open'); backdrop?.classList.remove('show'); };
  toggle.addEventListener('click', () => {
    sidebar.classList.toggle('open');
    backdrop?.classList.toggle('show');
  });
  backdrop?.addEventListener('click', close);
  sidebar.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
});

/* ── Active sidebar link ── */
document.addEventListener('DOMContentLoaded', () => {
  const current = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.sidebar a[href]').forEach(a => {
    if (a.getAttribute('href') === current) a.classList.add('active');
  });
});

/* ── Sidebar search / filter ── */
document.addEventListener('DOMContentLoaded', () => {
  const input = document.querySelector('.sidebar-search input');
  if (!input) return;
  const links = [...document.querySelectorAll('.sidebar a[href]')];
  const groups = [...document.querySelectorAll('.sidebar .group-title')];

  input.addEventListener('input', () => {
    const q = input.value.trim().toLowerCase();
    links.forEach(a => {
      const match = !q || a.textContent.toLowerCase().includes(q);
      a.classList.toggle('hidden', !match);
    });
    groups.forEach(g => {
      let next = g.nextElementSibling;
      let hasVisible = false;
      while (next && !next.classList.contains('group-title')) {
        if (next.tagName === 'A' && !next.classList.contains('hidden')) hasVisible = true;
        next = next.nextElementSibling;
      }
      g.style.display = hasVisible ? '' : 'none';
    });
  });
});
