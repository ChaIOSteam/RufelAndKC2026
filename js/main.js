(() => {
  'use strict';

  /* ---------- Scroll reveal ----------
     Content is visible by default. JS only hides elements that are still
     below the fold, then fades them in as they arrive, so nothing flashes
     and everything still works with JS disabled. */
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const items = Array.from(document.querySelectorAll('.reveal'));

  if (!reducedMotion && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.remove('is-pending');
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 }
    );

    for (const el of items) {
      if (el.getBoundingClientRect().top < window.innerHeight) continue; // already on screen
      el.classList.add('is-pending');
      observer.observe(el);
    }
  }

  /* ---------- Countdown ----------
     data-countdown holds the ceremony start (with its UTC offset), so the
     result is the same for guests in any timezone. */
  const box = document.querySelector('[data-countdown]');
  if (!box) return;

  const startAttr = box.getAttribute('data-countdown');
  const start = new Date(startAttr);
  if (Number.isNaN(start.getTime())) return;

  // Midnight at the start of the wedding day, in the wedding's own timezone
  const dayStart = new Date(`${startAttr.slice(0, 10)}T00:00:00${startAttr.slice(-6)}`);
  const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000);

  const label = box.querySelector('[data-countdown-label]');
  const value = box.querySelector('.countdown__value');
  const num = box.querySelector('[data-countdown-num]');
  const unit = box.querySelector('[data-countdown-unit]');

  const render = () => {
    const now = new Date();

    if (now >= dayEnd) {
      label.textContent = 'With love and gratitude';
      value.classList.add('countdown__value--text');
      value.textContent = 'Thank you for celebrating with us';
    } else if (now >= dayStart) {
      label.textContent = 'Boarding now';
      value.classList.add('countdown__value--text');
      value.textContent = 'Today is the day!';
    } else {
      const days = Math.ceil((dayStart - now) / 86400000);
      num.textContent = String(days);
      unit.textContent = days === 1 ? 'day' : 'days';
    }
    box.hidden = false;
  };

  render();
  setInterval(render, 60 * 1000);
})();
