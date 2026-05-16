(function () {
  const clockNode = document.getElementById('system-clock');
  if (!clockNode) return;

  const locale = document.documentElement.lang || 'zh-CN';

  const render = () => {
    const now = new Date();
    const formatter = new Intl.DateTimeFormat(locale, {
      hour12: false,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
    clockNode.textContent = formatter.format(now);
  };

  render();
  setInterval(render, 1000);
})();
