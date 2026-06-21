/* =====================================================
   MAIN.JS — Día del Padre experience
   GSAP + ScrollTrigger + Lenis smooth scroll
   ===================================================== */

/* ── 1. SMOOTH SCROLL (Lenis) ─────────────────────── */
const lenis = new Lenis({
  duration: 1.4,
  easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
});

function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
requestAnimationFrame(raf);

// Connect GSAP ScrollTrigger to Lenis
gsap.ticker.add(time => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);

ScrollTrigger.scrollerProxy(document.body, {
  scrollTop(value) {
    if (arguments.length) lenis.scrollTo(value);
    return lenis.scroll;
  },
  getBoundingClientRect() {
    return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
  },
});

lenis.on('scroll', ScrollTrigger.update);

/* ── 2. GSAP PLUGINS ─────────────────────────────── */
gsap.registerPlugin(ScrollTrigger);

/* ── 3. HERO ENTRANCE ─────────────────────────────── */
const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
heroTl
  .to('.hero-line',  { y: '0%', duration: 1.2, delay: 0.3 })
  .to('.hero-sub',   { opacity: 1, y: 0, duration: 1, from: { y: 20 } }, '-=0.6')
  .to('.hero-date',  { opacity: 1, y: 0, duration: 1, from: { y: 20 } }, '-=0.7');

/* Hero Ken Burns */
gsap.to('.hero-img', {
  scale: 1.12,
  duration: 14,
  ease: 'power1.inOut',
  repeat: -1,
  yoyo: true,
});

/* ── 4. DEDICATORIA — word-by-word reveal ─────────── */
(function() {
  const el = document.querySelector('.dedication-text');
  if (!el) return;
  const raw = el.textContent.trim();
  const words = raw.split(/\s+/);
  el.innerHTML = words.map(w => `<span class="word" style="opacity:0;display:inline-block;margin-right:0.25em">${w}</span>`).join('');

  ScrollTrigger.create({
    trigger: el,
    start: 'top 75%',
    onEnter() {
      gsap.to(el.querySelectorAll('.word'), {
        opacity: 1,
        y: 0,
        stagger: 0.06,
        duration: 0.8,
        ease: 'power3.out',
        from: { y: 20, opacity: 0 },
      });
    },
  });
})();

/* ── 5. ADMIRO — parallax + text reveal ─────────────*/
document.querySelectorAll('.admiro-card').forEach(card => {
  const img  = card.querySelector('.admiro-photo');
  const text = card.querySelector('.admiro-text');
  const num  = card.querySelector('.admiro-number');
  const h2   = card.querySelector('h2');
  const p    = card.querySelector('p');

  // Parallax on photo
  gsap.to(img, {
    yPercent: -20,
    ease: 'none',
    scrollTrigger: { trigger: card, start: 'top bottom', end: 'bottom top', scrub: 1.5 },
  });

  // Text reveal
  const tl = gsap.timeline({
    scrollTrigger: { trigger: card, start: 'top 70%', once: true },
  });
  tl.from(num, { opacity: 0, x: -30, duration: 0.7, ease: 'power3.out' })
    .from(h2,  { opacity: 0, y: 30,  duration: 0.7, ease: 'power3.out' }, '-=0.4')
    .from(p,   { opacity: 0, y: 20,  duration: 0.8, ease: 'power3.out' }, '-=0.4');
});

/* ── 6. GENERIC REVEAL HELPERS ─────────────────────── */
function revealAll(selector, vars = {}) {
  document.querySelectorAll(selector).forEach(el => {
    gsap.to(el, {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      duration: 0.9,
      ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 82%', once: true },
      delay: parseFloat(el.dataset.delay || 0),
      ...vars,
    });
  });
}

// Stagger delays from CSS classes
document.querySelectorAll('.delay-1').forEach(el => el.dataset.delay = '0.15');
document.querySelectorAll('.delay-2').forEach(el => el.dataset.delay = '0.30');
document.querySelectorAll('.delay-3').forEach(el => el.dataset.delay = '0.45');

revealAll('.reveal-up');
revealAll('.reveal-left');
revealAll('.reveal-right');
revealAll('.reveal-scale');

/* ── 7. SECTION TITLES — char-by-char ──────────────── */
document.querySelectorAll('.split-title').forEach(el => {
  const text = el.textContent;
  el.innerHTML = text.split('').map(c =>
    c === ' ' ? ' ' : `<span class="char" style="display:inline-block;opacity:0;transform:translateY(40px)">${c}</span>`
  ).join('');

  gsap.to(el.querySelectorAll('.char'), {
    opacity: 1, y: 0,
    stagger: 0.03,
    duration: 0.6,
    ease: 'power3.out',
    scrollTrigger: { trigger: el, start: 'top 85%', once: true },
  });
});

/* ── 8. PAREJA — subtle parallax on photos ──────────── */
document.querySelectorAll('.pareja-photo').forEach((ph, i) => {
  gsap.from(ph, {
    opacity: 0,
    y: i % 2 === 0 ? 60 : -40,
    duration: 1,
    ease: 'power3.out',
    scrollTrigger: { trigger: ph, start: 'top 85%', once: true, delay: i * 0.15 },
  });
});

/* ── 9. CARTA — fade up on scroll ──────────────────── */
gsap.from('.carta-inner', {
  opacity: 0,
  y: 60,
  duration: 1.2,
  ease: 'power3.out',
  scrollTrigger: { trigger: '.carta-inner', start: 'top 80%', once: true },
});

/* ── 10. CIERRE — floating hearts canvas ─────────── */
(function heartsCanvas() {
  const canvas = document.getElementById('heartsCanvas');
  if (!canvas) return;
  const ctx    = canvas.getContext('2d');

  function resize() { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; }
  resize();
  window.addEventListener('resize', resize);

  const hearts = Array.from({ length: 28 }, () => ({
    x: Math.random() * canvas.width,
    y: canvas.height + Math.random() * 200,
    size: 8 + Math.random() * 18,
    speed: 0.4 + Math.random() * 0.8,
    drift: (Math.random() - 0.5) * 0.6,
    opacity: 0.15 + Math.random() * 0.5,
  }));

  function drawHeart(x, y, size, opacity) {
    ctx.save();
    ctx.globalAlpha = opacity;
    ctx.fillStyle = '#e8c08a';
    ctx.translate(x, y);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(-size / 2, -size / 2,  -size,      size / 4, 0,      size);
    ctx.bezierCurveTo( size,      size / 4,    size / 2, -size / 2, 0,      0);
    ctx.fill();
    ctx.restore();
  }

  let active = false;
  const observer = new IntersectionObserver(entries => {
    active = entries[0].isIntersecting;
    if (active) tick();
  }, { threshold: 0.1 });
  observer.observe(canvas);

  function tick() {
    if (!active) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    hearts.forEach(h => {
      h.y  -= h.speed;
      h.x  += h.drift;
      h.opacity = 0.15 + Math.random() * 0.35;
      if (h.y < -50) {
        h.y    = canvas.height + 20;
        h.x    = Math.random() * canvas.width;
        h.size = 8 + Math.random() * 18;
      }
      drawHeart(h.x, h.y, h.size, h.opacity);
    });
    requestAnimationFrame(tick);
  }
})();

/* ── 11. CIERRE REVEAL ─────────────────────────────── */
gsap.from('.cierre-icon',  { opacity: 0, scale: 0.3, duration: 1, ease: 'elastic.out(1,0.5)', scrollTrigger: { trigger: '.cierre', start: 'top 70%', once: true } });
gsap.from('.cierre-title', { opacity: 0, y: 40,  duration: 0.9, delay: 0.3, ease: 'power3.out', scrollTrigger: { trigger: '.cierre', start: 'top 70%', once: true } });
gsap.from('.cierre-sub',   { opacity: 0, y: 30,  duration: 0.9, delay: 0.5, ease: 'power3.out', scrollTrigger: { trigger: '.cierre', start: 'top 70%', once: true } });
gsap.from('.cierre-firma', { opacity: 0, y: 20,  duration: 0.9, delay: 0.7, ease: 'power3.out', scrollTrigger: { trigger: '.cierre', start: 'top 70%', once: true } });

/* ── 12. MUSIC BUTTON ─────────────────────────────── */
(function() {
  const btn   = document.getElementById('musicBtn');
  const audio = document.getElementById('bgMusic');
  const play  = btn.querySelector('.play-icon');
  const pause = btn.querySelector('.pause-icon');
  if (!btn || !audio) return;

  let playing = false;
  btn.addEventListener('click', () => {
    if (!playing) {
      audio.volume = 0;
      audio.play().then(() => {
        playing = true;
        play.classList.add('hidden');
        pause.classList.remove('hidden');
        // Fade in
        let v = 0;
        const fade = setInterval(() => { v = Math.min(v + 0.04, 0.55); audio.volume = v; if (v >= 0.55) clearInterval(fade); }, 80);
      }).catch(() => {});
    } else {
      // Fade out then pause
      let v = audio.volume;
      const fade = setInterval(() => { v = Math.max(v - 0.04, 0); audio.volume = v; if (v <= 0) { clearInterval(fade); audio.pause(); } }, 80);
      playing = false;
      play.classList.remove('hidden');
      pause.classList.add('hidden');
    }
  });
})();
