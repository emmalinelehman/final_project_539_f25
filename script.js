/*
  Flight Patterns interactions
  - Section reveal on scroll
  - Subtle bird flapping + pathing
  - Respects prefers-reduced-motion
*/

(function () {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Section reveal using IntersectionObserver
  const stages = Array.from(document.querySelectorAll('.migration-stage'));

  // Apply background images from data-image attributes (plug-in point for JPGs)
  stages.forEach((el) => {
    const bg = el.getAttribute('data-image');
    if (bg) {
      el.style.backgroundImage = `url('${bg}')`;
    }
  });
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add('is-visible');
      });
    }, { root: null, rootMargin: '0px 0px -10% 0px', threshold: 0.2 });

    stages.forEach((el) => io.observe(el));
  } else {
    // Fallback: reveal all
    stages.forEach((el) => el.classList.add('is-visible'));
  }

  // Bird animation setup
  const birdUp = document.getElementById('tern-wings-up');
  const birdDown = document.getElementById('tern-wings-down');
  let lastTime = 0;
  let flapTimer = 0;
  const flapInterval = 180; // ms between wing frames
  

  // Cache document metrics
  let docHeight = 0;
  let winHeight = 0;
  const updateMetrics = () => {
    docHeight = Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight,
      document.body.offsetHeight,
      document.documentElement.offsetHeight,
      document.documentElement.clientHeight
    );
    winHeight = window.innerHeight || document.documentElement.clientHeight;
  };

  updateMetrics();
  window.addEventListener('resize', updateMetrics);

  const setBirdTransform = (xPercent, yPx, rotateDeg) => {
    const transform = `translate(${xPercent}%, ${yPx}px) rotate(${rotateDeg}deg)`;
    if (birdUp) birdUp.style.transform = transform;
    if (birdDown) birdDown.style.transform = transform;
  };

  let rafId = null;
  const tick = (now) => {
    rafId = null;

    if (prefersReduced || !birdUp || !birdDown) return; // Bail if no motion desired

    // Wing flapping
    const dt = lastTime ? now - lastTime : 0;
    lastTime = now;
    flapTimer += dt;
    if (flapTimer >= flapInterval) {
      flapTimer = 0;
      birdUp.classList.toggle('active');
      birdDown.classList.toggle('active');
      // small bounce effect
      birdUp.classList.add('flapping');
      birdDown.classList.add('flapping');
      setTimeout(() => {
        birdUp.classList.remove('flapping');
        birdDown.classList.remove('flapping');
      }, 220);
    }

    // Scroll progress 0..1
    const maxScroll = Math.max(1, docHeight - winHeight);
    const scrollY = window.scrollY || window.pageYOffset || 0;
    const p = Math.min(1, Math.max(0, scrollY / maxScroll));

    // Horizontal traverse and gentle vertical sine drift
    const x = -50 + p * 100; // -50% to 50% (center baseline)
    const y = Math.sin(p * Math.PI * 4) * 12; // oscillate up/down
    const r = Math.sin(p * Math.PI * 2) * -4; // slight tilt

    setBirdTransform(x, y, r);
  };

  const onScrollOrResize = () => {
    if (rafId === null) rafId = requestAnimationFrame(tick);
  };

  if (!prefersReduced) {
    // Initialize once so the bird is placed even before scroll
    requestAnimationFrame(tick);
    window.addEventListener('scroll', onScrollOrResize, { passive: true });
    window.addEventListener('resize', onScrollOrResize);
  } else {
    // Ensure both frames are centered without motion when reduced
    setBirdTransform(-50, 0, 0);
    if (birdDown) birdDown.classList.remove('active');
    if (birdUp) birdUp.classList.add('active');
  }

  // Enhance in-page anchor navigation for older browsers (optional)
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute('href');
    if (id.length > 1) {
      const el = document.querySelector(id);
      if (el) {
        e.preventDefault();
        el.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth' });
      }
    }
  });
})();
