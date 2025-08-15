  (function () {
    const nav = document.getElementById('fly-nav');

    const thresholdShow = 540;
    const thresholdHide = 520;

    let visible = false;

    function applyVisibility() {
      nav.classList.toggle('visible', visible);
    }

    function updateOnScroll() {
      const y = window.scrollY || document.documentElement.scrollTop || 0;

      if (!visible && y > thresholdShow) {
        visible = true;
        applyVisibility();
        return;
      }

      if (visible && y < thresholdHide) {
        visible = false;
        applyVisibility();
        return;
      }
    }

    function initFromCurrentScroll() {
      const y = window.scrollY || document.documentElement.scrollTop || 0;
      visible = y > thresholdShow;
      applyVisibility();
    }

    initFromCurrentScroll();
    window.addEventListener('scroll', updateOnScroll, { passive: true });
  })();