(function () {
  const input = document.getElementById('search-input');
  const result = document.getElementById('search-result');
  if (!input || !result) return;

  const i18n = (window.TML_I18N && window.TML_I18N.search) || {};
  const noMatchText = i18n.no_match || 'No matching records.';
  const indexMissingText = i18n.index_missing || 'Search index not found. Run <code>hexo generate</code> first.';
  const untitledText = i18n.untitled || 'Untitled';

  const searchPath = `${window.location.origin}${window.CONFIG && window.CONFIG.root ? window.CONFIG.root : '/'}search.xml`;

  const escapeHtml = (text) => {
    return String(text || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\"/g, '&quot;')
      .replace(/'/g, '&#39;');
  };

  const render = (items) => {
    if (!items.length) {
      result.innerHTML = `<p>${escapeHtml(noMatchText)}</p>`;
      return;
    }
    result.innerHTML = items.map((item) => {
      const tags = Array.isArray(item.tags) ? item.tags.join(', ') : '';
      const categories = Array.isArray(item.categories) ? item.categories.join(', ') : '';
      return `<article>
        <h3><a href="${escapeHtml(item.url)}">${escapeHtml(item.title || untitledText)}</a></h3>
        <p>${escapeHtml((item.content || '').replace(/<[^>]+>/g, '').slice(0, 180))}...</p>
        <small>${escapeHtml(item.date || '')} · ${escapeHtml(categories)} · ${escapeHtml(tags)}</small>
      </article>`;
    }).join('');
  };

  fetch(searchPath)
    .then((res) => res.text())
    .then((xmlText) => {
      const parser = new DOMParser();
      const xml = parser.parseFromString(xmlText, 'application/xml');
      const entries = Array.from(xml.querySelectorAll('entry')).map((entry) => {
        const title = entry.querySelector('title')?.textContent || '';
        const content = entry.querySelector('content')?.textContent || '';
        const url = entry.querySelector('url')?.textContent || '#';
        const date = entry.querySelector('date')?.textContent || '';
        const categories = Array.from(entry.querySelectorAll('categories > category')).map((n) => n.textContent || '').filter(Boolean);
        const tags = Array.from(entry.querySelectorAll('tags > tag')).map((n) => n.textContent || '').filter(Boolean);
        return { title, content, url, date, categories, tags };
      });

      render(entries.slice(0, 20));

      input.addEventListener('input', () => {
        const q = input.value.trim().toLowerCase();
        if (!q) {
          render(entries.slice(0, 20));
          return;
        }
        const filtered = entries.filter((item) => {
          return [item.title, item.content, item.categories.join(' '), item.tags.join(' ')]
            .join(' ')
            .toLowerCase()
            .includes(q);
        });
        render(filtered.slice(0, 50));
      });
    })
    .catch(() => {
      result.innerHTML = `<p>${indexMissingText}</p>`;
    });
})();
