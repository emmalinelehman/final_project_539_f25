/*
  Flight Patterns interactions
  - Section reveal on scroll
  - Continuous bird flapping + pathing
  - Respects prefers-reduced-motion
*/

(function () {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Section reveal using IntersectionObserver
  const stages = Array.from(document.querySelectorAll('.migration-stage'));

  // Apply background images from data-image attributes
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
    stages.forEach((el) => el.classList.add('is-visible'));
  }

  // Bird animation setup
  const birdUp = document.getElementById('tern-wings-up');
  const birdDown = document.getElementById('tern-wings-down');

  // Animation state
  let lastTime = 0;
  let flapTimer = 0;
  const flapInterval = 150; // ms between wing frames (faster flapping)

  // Flight path variables
  let flightX = 50; // Starting X position (%)
  let flightY = 50; // Starting Y position (%)
  let timeOffset = 0;

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

  const setBirdTransform = (xPercent, yPercent, rotateDeg, scale) => {
    // Convert percentages to viewport-relative units for smoother motion
    // But keep it simple: translate(-50%, -50%) is already in CSS for centering
    // We add the dynamic position:
    const transform = `translate(calc(-50% + ${xPercent}vw), calc(-50% + ${yPercent}vh)) rotate(${rotateDeg}deg) scale(${scale})`;

    if (birdUp) birdUp.style.transform = transform;
    if (birdDown) birdDown.style.transform = transform;
  };

  const tick = (now) => {
    if (prefersReduced || !birdUp || !birdDown) return;

    const dt = lastTime ? now - lastTime : 0;
    lastTime = now;

    // --- Flapping Logic ---
    flapTimer += dt;
    if (flapTimer >= flapInterval) {
      flapTimer = 0;
      birdUp.classList.toggle('active');
      birdDown.classList.toggle('active');
    }

    // --- Flight Path Logic ---
    // Continuous time-based movement
    timeOffset += dt * 0.001; // seconds

    // Scroll influence
    const scrollY = window.scrollY || window.pageYOffset || 0;
    const maxScroll = Math.max(1, docHeight - winHeight);
    const scrollProgress = Math.min(1, Math.max(0, scrollY / maxScroll));

    // Calculate position

    // ALL MATH WAS COMPLETED BY AI ASSISTANCE!!!!!!!!!!!

    // Responsive Offset: Move bird away from text
    // Desktop: Fly to the right. Mobile: Fly higher up.
    let baseX = 0;
    let baseY = -10; // Default slightly up

    if (window.innerWidth > 768) {
      baseX = 35; // Push to the right on desktop (35vw from center)
      baseY = 0;  // Center vertically
    } else {
      baseX = 0;  // Center horizontally on mobile
      baseY = -35; // Push higher up on mobile to clear text
    }

    // Base horizontal oscillation (hovering)
    const hoverX = Math.sin(timeOffset * 0.5) * 10;

    // Scroll-based horizontal traverse (flying across the map)
    // Reduced amplitude to keep it from going off-screen with the offset
    const scrollX = Math.sin(scrollProgress * Math.PI * 3) * 10;

    const currentX = baseX + hoverX + scrollX;

    // Y: Vertical position
    const hoverY = Math.sin(timeOffset * 1.2) * 5;
    const currentY = baseY + hoverY;

    // Rotation: Tilt based on horizontal velocity
    const velocityX = (Math.cos(timeOffset * 0.5) * 0.5 * 10) + (Math.cos(scrollProgress * Math.PI * 3) * Math.PI * 3 * 0.01 * 10);
    const tilt = velocityX * 1.5;

    // Scale: Simulate depth (breathing)
    const scale = 0.8 + Math.sin(timeOffset * 0.8) * 0.1;

    setBirdTransform(currentX, currentY, tilt, scale);

    requestAnimationFrame(tick);
  };

  if (!prefersReduced) {
    // Initialize state
    birdUp.classList.add('active');
    birdDown.classList.remove('active');

    requestAnimationFrame(tick);
  } else {
    // Static center position for reduced motion
    setBirdTransform(0, 0, 0, 1);
    birdUp.classList.add('active');
    birdDown.classList.remove('active');
  }

  // Enhance in-page anchor navigation
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