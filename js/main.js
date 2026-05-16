(function () {
  const backToTop = document.getElementById('back-to-top');
  if (backToTop) {
    const updateButton = () => {
      if (window.scrollY > 320) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    };
    window.addEventListener('scroll', updateButton, { passive: true });
    updateButton();
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  const navToggle = document.getElementById('nav-toggle');
  const nav = document.getElementById('main-nav');
  if (navToggle && nav) {
    navToggle.addEventListener('click', () => {
      const expanded = nav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', expanded ? 'true' : 'false');
    });
  }

  const tocRoot = document.querySelector('#post-toc');
  if (tocRoot) {
    const links = Array.from(tocRoot.querySelectorAll('a'));
    const headings = links
      .map((link) => document.getElementById(decodeURIComponent(link.getAttribute('href').slice(1))))
      .filter(Boolean);

    const setActive = () => {
      let activeIndex = -1;
      for (let i = 0; i < headings.length; i += 1) {
        const rect = headings[i].getBoundingClientRect();
        if (rect.top <= 110) activeIndex = i;
      }
      links.forEach((link, idx) => {
        if (idx === activeIndex) link.classList.add('active');
        else link.classList.remove('active');
      });
    };

    links.forEach((link) => {
      link.addEventListener('click', (event) => {
        const id = decodeURIComponent(link.getAttribute('href').slice(1));
        const target = document.getElementById(id);
        if (!target) return;
        event.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });

    window.addEventListener('scroll', setActive, { passive: true });
    setActive();
  }

  const codeBlocks = document.querySelectorAll('.post-content pre');
  codeBlocks.forEach((pre) => {
    if (pre.closest('td.gutter')) return;
    let lang = 'CODE';
    const figure = pre.closest('figure.highlight');
    if (figure) {
      const figureClass = figure.className || '';
      const figureMatch = figureClass.match(/highlight\s+([a-z0-9+#-]+)/i);
      if (figureMatch) lang = figureMatch[1].toUpperCase();
    } else {
      const className = pre.className || '';
      const match = className.match(/language-([a-z0-9+#-]+)/i);
      if (match) lang = match[1].toUpperCase();
    }
    pre.setAttribute('data-lang', lang);
  });

  const heroTerminal = document.getElementById('hero-terminal');
  if (heroTerminal) {
    const lines = heroTerminal.textContent.trim().split('\n');
    heroTerminal.textContent = '';
    lines.forEach((line, index) => {
      setTimeout(() => {
        heroTerminal.textContent += `${line}\n`;
      }, 230 * (index + 1));
    });
  }

  if (window.TML_FEATURES && window.TML_FEATURES.mermaid && window.mermaid) {
    window.mermaid.initialize({ startOnLoad: false, theme: 'dark' });
    document.querySelectorAll('.post-content pre').forEach((pre) => {
      if (pre.closest('td.gutter')) return;
      const graphText = (pre.textContent || '').trim();
      const isMermaid = /^(graph|flowchart|sequenceDiagram|classDiagram|stateDiagram|erDiagram|journey|gantt|pie|mindmap)\b/m.test(graphText);
      if (!graphText || !isMermaid) return;
      const mermaidContainer = document.createElement('div');
      mermaidContainer.className = 'mermaid';
      mermaidContainer.textContent = graphText;
      const figure = pre.closest('figure.highlight');
      if (figure) figure.replaceWith(mermaidContainer);
      else pre.replaceWith(mermaidContainer);
    });
    window.mermaid.run({ querySelector: '.mermaid' });
  }
})();
