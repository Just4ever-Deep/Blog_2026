(function () {
  const page = document.querySelector('[data-taxonomy-page]');
  if (!page) return;

  const mode = page.getAttribute('data-taxonomy-page');
  const listItems = Array.from(page.querySelectorAll('[data-taxonomy-item]'));
  const chips = Array.from(page.querySelectorAll('[data-taxonomy-chip]'));
  const emptyState = page.querySelector('[data-taxonomy-empty]');
  const clearLink = page.querySelector('[data-taxonomy-clear]');

  const params = new URLSearchParams(window.location.search);
  const selectedCategory = params.get('c') || '';
  const selectedTag = params.get('t') || '';
  const hasSelection = mode === 'category' ? Boolean(selectedCategory) : Boolean(selectedTag);

  const matches = (item) => {
    if (mode === 'category') {
      if (!selectedCategory) return false;
      const categories = (item.getAttribute('data-categories') || '').split('|').filter(Boolean);
      return categories.includes(selectedCategory);
    }
    if (!selectedTag) return false;
    const tags = (item.getAttribute('data-tags') || '').split('|').filter(Boolean);
    return tags.includes(selectedTag);
  };

  let visibleCount = 0;
  listItems.forEach((item) => {
    const visible = matches(item);
    item.hidden = !visible;
    if (visible) visibleCount += 1;
  });

  chips.forEach((chip) => {
    const value = mode === 'category' ? chip.getAttribute('data-category') : chip.getAttribute('data-tag');
    const isActive = mode === 'category' ? value === selectedCategory : value === selectedTag;
    chip.classList.toggle('is-active', Boolean(isActive));
  });

  if (emptyState) {
    emptyState.hidden = !hasSelection || visibleCount !== 0;
  }

  if (clearLink) {
    clearLink.hidden = !hasSelection;
  }
})();
