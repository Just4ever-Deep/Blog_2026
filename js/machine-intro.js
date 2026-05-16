(() => {
  const INTRO_SELECTOR = "[data-machine-intro]";
  const DISMISSED_KEY = "the-machine-log:intro-dismissed";

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const intro = document.querySelector(INTRO_SELECTOR);

  if (!intro) return;

  const skip = intro.querySelector("[data-machine-intro-skip]");
  const clock = intro.querySelector("[data-machine-intro-clock]");
  const lines = Array.from(intro.querySelectorAll("[data-intro-line]"));

  const shouldReplay = new URLSearchParams(window.location.search).has("intro");
  const alreadyDismissed = sessionStorage.getItem(DISMISSED_KEY) === "1";

  const updateClock = () => {
    if (!clock) return;
    const now = new Date();
    clock.textContent = now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    });
  };

  const hideIntro = () => {
    intro.classList.add("is-hidden");
    sessionStorage.setItem(DISMISSED_KEY, "1");
    window.setTimeout(() => {
      intro.classList.add("is-dismissed");
      intro.setAttribute("aria-hidden", "true");
    }, prefersReducedMotion ? 0 : 760);
  };

  if (alreadyDismissed && !shouldReplay) {
    intro.classList.add("is-dismissed");
    intro.setAttribute("aria-hidden", "true");
    return;
  }

  updateClock();
  const clockTimer = window.setInterval(updateClock, 1000);

  const lineDelay = prefersReducedMotion ? 0 : 330;
  lines.forEach((line, index) => {
    window.setTimeout(() => line.classList.add("is-visible"), 280 + index * lineDelay);
  });

  const totalDuration = prefersReducedMotion ? 300 : 3900;
  const autoCloseTimer = window.setTimeout(hideIntro, totalDuration);

  const close = () => {
    window.clearTimeout(autoCloseTimer);
    window.clearInterval(clockTimer);
    hideIntro();
  };

  skip?.addEventListener("click", close);
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !intro.classList.contains("is-hidden")) close();
  }, { once: true });
})();
