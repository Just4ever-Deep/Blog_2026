(function () {
  const codeBlocks = document.querySelectorAll('.post-content pre');
  if (!codeBlocks.length) return;

  const i18n = (window.TML_I18N && window.TML_I18N.copy) || {};
  const copyText = i18n.copy || 'COPY';
  const copiedText = i18n.copied || 'COPIED';
  const failedText = i18n.failed || 'FAILED';

  codeBlocks.forEach((pre) => {
    if (pre.closest('td.gutter')) return;

    const button = document.createElement('button');
    button.className = 'copy-code-btn';
    button.type = 'button';
    button.textContent = copyText;
    Object.assign(button.style, {
      position: 'absolute',
      top: '8px',
      right: '8px',
      border: '1px solid rgba(31,111,235,.35)',
      background: '#0a0f17',
      color: '#39FF88',
      padding: '2px 8px',
      cursor: 'pointer',
      fontSize: '12px'
    });

    button.addEventListener('click', async () => {
      const rawText = (pre.textContent || '').trim();
      try {
        await navigator.clipboard.writeText(rawText);
        const prev = button.textContent;
        button.textContent = copiedText;
        setTimeout(() => {
          button.textContent = prev;
        }, 1200);
      } catch (_error) {
        button.textContent = failedText;
        setTimeout(() => {
          button.textContent = copyText;
        }, 1200);
      }
    });

    pre.appendChild(button);
  });
})();
