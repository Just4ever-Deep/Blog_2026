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

  const formatCountdown = (seconds) => {
    const safeSeconds = Math.max(0, Math.ceil(seconds));
    const minutes = Math.floor(safeSeconds / 60);
    const rest = String(safeSeconds % 60).padStart(2, '0');
    return `${minutes}:${rest}`;
  };

  document.querySelectorAll('[data-home-countdown]').forEach((root) => {
    const totalSeconds = Math.max(1, Number(root.getAttribute('data-seconds')) || 60);
    const timeNode = root.querySelector('[data-countdown-time]');
    const bar = root.querySelector('[data-countdown-bar]');
    const toggle = root.querySelector('[data-countdown-toggle]');
    const reset = root.querySelector('[data-countdown-reset]');
    let remaining = totalSeconds;
    let timer = null;

    const setProgress = () => {
      const doneRatio = Math.min(1, Math.max(0, (totalSeconds - remaining) / totalSeconds));
      if (timeNode) timeNode.textContent = formatCountdown(remaining);
      if (bar) bar.style.width = `${Math.round(doneRatio * 100)}%`;
      if (toggle) {
        const isRunning = Boolean(timer);
        toggle.textContent = isRunning ? (toggle.dataset.pause || 'Pause') : (toggle.dataset.start || 'Start');
      }
    };

    const stop = () => {
      if (timer) window.clearInterval(timer);
      timer = null;
      setProgress();
    };

    if (toggle) {
      toggle.addEventListener('click', () => {
        if (timer) {
          stop();
          return;
        }
        if (remaining <= 0) remaining = totalSeconds;
        timer = window.setInterval(() => {
          remaining -= 1;
          if (remaining <= 0) {
            remaining = 0;
            stop();
            return;
          }
          setProgress();
        }, 1000);
        setProgress();
      });
    }

    if (reset) {
      reset.addEventListener('click', () => {
        stop();
        remaining = totalSeconds;
        setProgress();
      });
    }

    setProgress();
  });

  const readingCountdown = document.querySelector('[data-reading-countdown]');
  const postContent = document.querySelector('.post-content');
  if (readingCountdown && postContent) {
    const totalSeconds = Math.max(1, Number(readingCountdown.getAttribute('data-total-seconds')) || 60);
    const timeNode = readingCountdown.querySelector('[data-reading-time]');
    const progressNode = readingCountdown.querySelector('[data-reading-progress]');
    const bar = readingCountdown.querySelector('[data-reading-bar]');
    const doneLabel = readingCountdown.getAttribute('data-done-label') || 'Done';
    const progressLabel = progressNode ? (progressNode.textContent.split(':')[0] || 'Progress') : 'Progress';

    const updateReadingProgress = () => {
      const rect = postContent.getBoundingClientRect();
      const pageTop = window.scrollY + rect.top;
      const readableDistance = Math.max(1, postContent.offsetHeight - window.innerHeight * 0.45);
      const progress = Math.min(1, Math.max(0, (window.scrollY - pageTop + 120) / readableDistance));
      const percent = Math.round(progress * 100);
      const remaining = Math.ceil(totalSeconds * (1 - progress));
      if (timeNode) timeNode.textContent = percent >= 99 ? doneLabel : formatCountdown(remaining);
      if (progressNode) progressNode.textContent = `${progressLabel}: ${percent}%`;
      if (bar) bar.style.width = `${percent}%`;
    };

    window.addEventListener('scroll', updateReadingProgress, { passive: true });
    window.addEventListener('resize', updateReadingProgress);
    updateReadingProgress();
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
