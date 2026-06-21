/* =====================================================
   MAIN.JS — Día del Padre — Awwwards-level experience
   GSAP 3 + ScrollTrigger + Lenis
   ===================================================== */

gsap.registerPlugin(ScrollTrigger);

/* ═══════════════════════════════════════════
   1. LENIS SMOOTH SCROLL
═══════════════════════════════════════════ */
const lenis = new Lenis({
  duration: 1.35,
  easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
  wheelMultiplier: 0.9,
});

lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add(time => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);

/* ═══════════════════════════════════════════
   2. SCROLL PROGRESS BAR
═══════════════════════════════════════════ */
const progressBar = document.getElementById('scrollProgress');
lenis.on('scroll', ({ progress }) => {
  progressBar.style.width = (progress * 100) + '%';
});

/* ═══════════════════════════════════════════
   3. CURSOR DECORATIVO (glow dorado, no reemplaza el cursor del sistema)
═══════════════════════════════════════════ */
(function setupCursor() {
  const glow = document.getElementById('cursor');
  const ring = document.getElementById('cursorRing');
  if (!glow || window.matchMedia('(hover: none)').matches) return;

  let mx = -200, my = -200;
  let rx = -200, ry = -200;

  window.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    // El glow sigue el cursor casi instantáneamente
    gsap.to(glow, { x: mx, y: my, duration: 0.18, ease: 'power2.out' });
  });

  // El ring sigue con más inercia para un efecto decorativo suave
  gsap.ticker.add(() => {
    rx += (mx - rx) * 0.07;
    ry += (my - ry) * 0.07;
    gsap.set(ring, { x: rx, y: ry });
  });

  // En hover de elementos interactivos, el glow crece un poco
  const interactives = 'a, button, img, .tilt-card, .fm-item, .pareja-photo, video';
  document.querySelectorAll(interactives).forEach(el => {
    el.addEventListener('mouseenter', () => {
      gsap.to(glow, { scale: 2.2, opacity: 0.9, duration: 0.35, ease: 'power3.out' });
      gsap.to(ring, { scale: 1.5, opacity: 0.5, duration: 0.4, ease: 'power3.out' });
    });
    el.addEventListener('mouseleave', () => {
      gsap.to(glow, { scale: 1, opacity: 1, duration: 0.4, ease: 'power3.out' });
      gsap.to(ring, { scale: 1, opacity: 1, duration: 0.4, ease: 'power3.out' });
    });
  });
})();

/* ═══════════════════════════════════════════
   4. PRELOADER
═══════════════════════════════════════════ */
(function preloader() {
  const pre    = document.getElementById('preloader');
  const heart  = pre.querySelector('.pre-heart');
  const text   = pre.querySelector('.pre-text');
  const bar    = pre.querySelector('.pre-bar');

  const tl = gsap.timeline({
    delay: 0.2,
    onComplete() {
      gsap.to(pre, { yPercent: -100, duration: 0.9, ease: 'power4.inOut',
        onComplete() { pre.remove(); initSite(); }
      });
    }
  });

  tl.to(bar, { width: '100%', duration: 2.2, ease: 'power2.inOut' })
    .to(text, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, '-=1.6');
})();

/* ═══════════════════════════════════════════
   5. SITE INIT (after preloader)
═══════════════════════════════════════════ */
function initSite() {
  heroEntrance();
  setupNavDots();
  setupApertura();
  setupHorizontalScroll();
  setupAdmiro();
  setupFamilia();
  setupPareja();
  setupMomentos();
  setupCarta();
  setupCierre();
  setupVideo();
  setupMusic();
  refreshScrollTrigger();
}

/* ═══════════════════════════════════════════
   6. HERO ENTRANCE
═══════════════════════════════════════════ */
function heroEntrance() {
  const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

  tl.to('.h-line',         { y: '0%',   duration: 1.4 }, 0)
    .to('.h-word',         { y: '0%', opacity: 1, stagger: 0.1, duration: 0.9 }, 0.5)
    .to('.hero-date',      { opacity: 1, y: 0, duration: 0.8 }, 0.9)
    .to('.hero-scroll-hint', { opacity: 1, y: 0, duration: 0.8 }, 1.1)
    .to('.scroll-line',    { scaleX: 1, duration: 0.7, ease: 'power2.out' }, 1.2)
    .to('.hero-number',    { opacity: 1, duration: 0.8 }, 1.3)
    .to('.nav-dots',       { opacity: 1, duration: 0.6 }, 1.5)
    .to('.music-btn',      { opacity: 1, y: 0, duration: 0.6 }, 1.5);

  /* Hero image Ken Burns */
  gsap.to('.hero-img', {
    scale: 1, duration: 2.5, ease: 'power3.out',
  });

  /* Parallax hero image on scroll */
  gsap.to('.hero-img', {
    yPercent: 18,
    ease: 'none',
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top', end: 'bottom top',
      scrub: 1.5,
    }
  });

  /* Hero text fades on scroll */
  gsap.to('.hero-text-wrap', {
    opacity: 0, y: -40,
    ease: 'none',
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top', end: '40% top',
      scrub: 1,
    }
  });
}

/* ═══════════════════════════════════════════
   7. NAV DOTS
═══════════════════════════════════════════ */
function setupNavDots() {
  const dots    = document.querySelectorAll('.dot');
  const sections = document.querySelectorAll('.section');

  sections.forEach((sec, i) => {
    ScrollTrigger.create({
      trigger: sec,
      start: 'top 55%',
      end: 'bottom 55%',
      onEnter()      { setDot(i); },
      onEnterBack()  { setDot(i); },
    });
  });

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      lenis.scrollTo(document.querySelector(`#s${i}`), { offset: 0, duration: 1.4 });
    });
  });

  function setDot(idx) {
    dots.forEach((d, i) => d.classList.toggle('active', i === idx));
  }
}

/* ═══════════════════════════════════════════
   8. APERTURA — big words reveal
═══════════════════════════════════════════ */
function setupApertura() {
  const texts = document.querySelectorAll('.bw-text');

  texts.forEach((t, i) => {
    gsap.to(t, {
      y: '0%',
      duration: 1,
      ease: 'power4.out',
      scrollTrigger: {
        trigger: t.closest('.bw-line'),
        start: 'top 88%',
        once: true,
      },
      delay: i * 0.09,
    });
  });

  gsap.to('.apertura-sub', {
    opacity: 1, x: 0,
    duration: 1, ease: 'power3.out',
    scrollTrigger: { trigger: '.apertura-sub', start: 'top 85%', once: true },
    delay: 0.4,
  });
}

/* ═══════════════════════════════════════════
   9. HORIZONTAL SCROLL
═══════════════════════════════════════════ */
function setupHorizontalScroll() {
  const section  = document.querySelector('.h-scroll-section');
  const wrapper  = document.getElementById('hPanelsWrapper');
  const panels   = gsap.utils.toArray('.h-panel');
  const counter  = document.getElementById('hCurrent');
  if (!section || !panels.length) return;

  /* ── Mobile: vertical stack, no GSAP pin ── */
  if (window.innerWidth <= 768) {
    section.classList.add('mobile-stack');
    panels.forEach(p => {
      p.classList.add('in-view');
      const img = p.querySelector('.h-panel-img img');
      if (img) img.classList.add('active');
    });
    return;
  }

  /* Activate first panel immediately */
  panels[0].classList.add('in-view');
  panels[0].querySelector('.h-panel-img img').classList.add('active');
  if (counter) counter.textContent = '01';

  let counterTween = null;
  const totalScroll = wrapper.scrollWidth - window.innerWidth;

  gsap.to(wrapper, {
    x: -totalScroll,
    ease: 'none',
    scrollTrigger: {
      trigger: section,
      start: 'top top',
      end: () => '+=' + totalScroll,
      pin: true,
      scrub: 1.2,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate(self) {
        const idx = Math.round(self.progress * (panels.length - 1));
        const num = String(idx + 1).padStart(2, '0');
        if (counter.textContent !== num) {
          if (counterTween) counterTween.kill();
          counterTween = gsap.to(counter, { opacity: 0, y: -8, duration: 0.12,
            onComplete() {
              counter.textContent = num;
              counterTween = gsap.to(counter, { opacity: 1, y: 0, duration: 0.18 });
            }
          });
        }
        panels.forEach((p, i) => {
          const active = i === idx;
          p.classList.toggle('in-view', active);
          p.querySelector('.h-panel-img img').classList.toggle('active', active);
        });
      }
    }
  });
}

/* ═══════════════════════════════════════════
   10. ADMIRO — clip reveal + parallax + text
═══════════════════════════════════════════ */
function setupAdmiro() {
  /* Clip-path reveals for all .clip-reveal elements */
  document.querySelectorAll('.clip-reveal').forEach(el => {
    ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      once: true,
      onEnter() { el.classList.add('revealed'); }
    });
  });

  /* Parallax images */
  document.querySelectorAll('.parallax-img').forEach(img => {
    gsap.to(img, {
      yPercent: -20,
      ease: 'none',
      scrollTrigger: {
        trigger: img.closest('.admiro-photo-wrap') || img.parentElement,
        start: 'top bottom', end: 'bottom top',
        scrub: 1.8,
      }
    });
  });

  /* Text reveals per row */
  document.querySelectorAll('.admiro-row').forEach(row => {
    const heading = row.querySelector('.admiro-heading');
    const copy    = row.querySelector('.admiro-copy p');
    if (!heading) return;

    const tl = gsap.timeline({
      scrollTrigger: { trigger: row, start: 'top 70%', once: true }
    });
    tl.to(heading, { opacity: 1, y: 0, duration: 1.0, ease: 'power3.out' })
      .to(copy,    { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' }, '-=0.5');
  });
}

/* ═══════════════════════════════════════════
   11. FAMILIA — clip reveals + marquee
═══════════════════════════════════════════ */
function setupFamilia() {
  gsap.from('.familia-header', {
    opacity: 0, y: 40, duration: 1, ease: 'power3.out',
    scrollTrigger: { trigger: '.familia-header', start: 'top 85%', once: true }
  });

  document.querySelectorAll('.fm-item').forEach((item, i) => {
    ScrollTrigger.create({
      trigger: item,
      start: 'top 88%',
      once: true,
      delay: i * 0.08,
      onEnter() {
        gsap.delayedCall(i * 0.08, () => item.classList.add('revealed'));
      }
    });
  });
}

/* ═══════════════════════════════════════════
   12. PAREJA — section reveal + 3D tilt
═══════════════════════════════════════════ */
function setupPareja() {
  gsap.from('.pareja-left', {
    opacity: 0, x: -50, duration: 1.1, ease: 'power3.out',
    scrollTrigger: { trigger: '.pareja', start: 'top 75%', once: true }
  });

  document.querySelectorAll('.pareja-photo').forEach((ph, i) => {
    ScrollTrigger.create({
      trigger: ph,
      start: 'top 88%',
      once: true,
      onEnter() {
        gsap.delayedCall(i * 0.12, () => ph.classList.add('revealed'));
      }
    });
  });

  /* 3D tilt on pareja photos */
  document.querySelectorAll('.tilt-card').forEach(setupTilt);
}

/* ═══════════════════════════════════════════
   13. 3D CARD TILT
═══════════════════════════════════════════ */
function setupTilt(card) {
  if (window.matchMedia('(hover: none)').matches) return;

  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width  - 0.5) * 16;
    const y = ((e.clientY - r.top)  / r.height - 0.5) * -16;
    gsap.to(card, {
      rotateY: x, rotateX: y,
      transformPerspective: 900,
      duration: 0.5, ease: 'power3.out'
    });
  });

  card.addEventListener('mouseleave', () => {
    gsap.to(card, { rotateY: 0, rotateX: 0, duration: 0.7, ease: 'elastic.out(1,0.5)' });
  });
}

/* ═══════════════════════════════════════════
   14. MOMENTOS + VIDEO
═══════════════════════════════════════════ */
function setupMomentos() {
  gsap.from('.momentos-header', {
    opacity: 0, y: 40, duration: 1, ease: 'power3.out',
    scrollTrigger: { trigger: '.momentos-header', start: 'top 85%', once: true }
  });

  document.querySelectorAll('.momento-item').forEach((item, i) => {
    ScrollTrigger.create({
      trigger: item,
      start: 'top 88%',
      once: true,
      onEnter() {
        gsap.delayedCall(i * 0.1, () => item.classList.add('revealed'));
      }
    });
    setupTilt(item);
  });

  /* Video clip reveal */
  ScrollTrigger.create({
    trigger: '.video-wrap',
    start: 'top 85%',
    once: true,
    onEnter() { document.querySelector('.video-wrap').classList.add('revealed'); }
  });
}

/* ═══════════════════════════════════════════
   15. VIDEO PLAYER
═══════════════════════════════════════════ */
function setupVideo() {
  const video  = document.getElementById('mainVideo');
  const btn    = document.getElementById('videoPlayBtn');
  const wrap   = video?.closest('.video-wrap');
  if (!video || !btn) return;

  const toggle = () => {
    if (video.paused) {
      video.play();
      wrap.classList.add('playing');
    } else {
      video.pause();
      wrap.classList.remove('playing');
    }
  };

  btn.addEventListener('click', e => { e.stopPropagation(); toggle(); });
  video.addEventListener('click', toggle);
  video.addEventListener('ended', () => wrap.classList.remove('playing'));
}

/* ═══════════════════════════════════════════
   16. CARTA — paragraph reveals
═══════════════════════════════════════════ */
function setupCarta() {
  gsap.from('.carta-meta', {
    opacity: 0, x: -30, duration: 1, ease: 'power3.out',
    scrollTrigger: { trigger: '.carta-meta', start: 'top 80%', once: true }
  });

  document.querySelectorAll('.para-reveal').forEach((p, i) => {
    gsap.to(p, {
      opacity: 1, y: 0,
      duration: 0.9, ease: 'power3.out',
      scrollTrigger: { trigger: p, start: 'top 88%', once: true },
      delay: 0.05 * i,
    });
  });
}

/* ═══════════════════════════════════════════
   17. CIERRE — hearts canvas + reveals
═══════════════════════════════════════════ */
function setupCierre() {
  /* Section title reveals */
  const cierreReveal = document.querySelectorAll('.cierre .reveal-el');
  const tl = gsap.timeline({
    scrollTrigger: { trigger: '.cierre', start: 'top 65%', once: true }
  });
  tl.to('.cierre-heart',  { opacity: 1, scale: 1, duration: 1.2, ease: 'elastic.out(1,0.4)' })
    .to('.cierre-title',  { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' }, '-=0.4')
    .to('.cierre-sub',    { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.5')
    .to('.cierre-firma',  { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, '-=0.4');

  /* Hearts canvas */
  const canvas = document.getElementById('heartsCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let active = false;

  function resize() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const HEART_COUNT = 30;
  const hearts = Array.from({ length: HEART_COUNT }, () => newHeart(canvas));

  function newHeart(c) {
    return {
      x:       Math.random() * c.width,
      y:       c.height + Math.random() * 300,
      size:    6 + Math.random() * 20,
      speed:   0.3 + Math.random() * 0.7,
      drift:   (Math.random() - 0.5) * 0.5,
      opacity: 0.08 + Math.random() * 0.3,
      pulse:   Math.random() * Math.PI * 2,
    };
  }

  function drawHeart(ctx, x, y, s, a) {
    ctx.save();
    ctx.globalAlpha = a;
    ctx.fillStyle   = '#E0B870';
    ctx.translate(x, y);
    ctx.scale(s * 0.1, s * 0.1);
    ctx.beginPath();
    ctx.moveTo(0, -3);
    ctx.bezierCurveTo(-5, -8,  -10, -3, -10, 2);
    ctx.bezierCurveTo(-10, 8,    0, 13,   0, 18);
    ctx.bezierCurveTo( 0, 13,   10, 8,   10, 2);
    ctx.bezierCurveTo( 10, -3,   5, -8,   0, -3);
    ctx.fill();
    ctx.restore();
  }

  function tick() {
    if (!active) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    hearts.forEach(h => {
      h.pulse += 0.02;
      h.y    -= h.speed;
      h.x    += h.drift;
      const s = h.size + Math.sin(h.pulse) * 1.5;
      drawHeart(ctx, h.x, h.y, s, h.opacity);
      if (h.y < -60) {
        const nh = newHeart(canvas);
        Object.assign(h, nh);
      }
    });
    requestAnimationFrame(tick);
  }

  const io = new IntersectionObserver(entries => {
    active = entries[0].isIntersecting;
    if (active) tick();
  }, { threshold: 0.15 });
  io.observe(canvas);
}

/* ═══════════════════════════════════════════
   18. MÚSICA — Salamander Grand Piano (muestras reales)
   Ballad emotiva: C → Am → F → G, 48 BPM
═══════════════════════════════════════════ */
function setupMusic() {
  const btn   = document.getElementById('musicBtn');
  const play  = btn?.querySelector('.play-icon');
  const pause = btn?.querySelector('.pause-icon');
  if (!btn || typeof Tone === 'undefined') return;

  let playing  = false;
  let loading  = false;
  let built    = false;
  let sampler, padSynth, masterVol;

  async function buildChain() {
    if (built) return;
    built = true;

    /* ── Cadena de efectos ── */
    masterVol = new Tone.Volume(-9).toDestination();
    const limiter = new Tone.Limiter(-3);
    limiter.connect(masterVol);

    const reverb = new Tone.Reverb({ decay: 10, wet: 0.52 });
    await reverb.ready;
    reverb.connect(limiter);

    const delay = new Tone.FeedbackDelay({ delayTime: '8n.', feedback: 0.16, wet: 0.12 });
    delay.connect(reverb);

    /* ── Pad de cuerdas suaves (sintetizado, debajo del piano) ── */
    const padReverb = new Tone.Reverb({ decay: 14, wet: 0.75 });
    await padReverb.ready;
    padReverb.connect(limiter);

    padSynth = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: 'sine' },
      envelope: { attack: 3.5, decay: 1, sustain: 0.8, release: 9 },
      volume: -22,
    }).connect(padReverb);

    /* ── Sampler: Salamander Grand Piano (notas reales grabadas) ── */
    sampler = new Tone.Sampler({
      urls: {
        A0: 'A0.mp3', C1: 'C1.mp3',
        'D#1': 'Ds1.mp3', 'F#1': 'Fs1.mp3', A1: 'A1.mp3', C2: 'C2.mp3',
        'D#2': 'Ds2.mp3', 'F#2': 'Fs2.mp3', A2: 'A2.mp3', C3: 'C3.mp3',
        'D#3': 'Ds3.mp3', 'F#3': 'Fs3.mp3', A3: 'A3.mp3', C4: 'C4.mp3',
        'D#4': 'Ds4.mp3', 'F#4': 'Fs4.mp3', A4: 'A4.mp3', C5: 'C5.mp3',
        'D#5': 'Ds5.mp3', 'F#5': 'Fs5.mp3', A5: 'A5.mp3', C6: 'C6.mp3',
        'D#6': 'Ds6.mp3', 'F#6': 'Fs6.mp3', A6: 'A6.mp3', C7: 'C7.mp3',
        A7: 'A7.mp3', C8: 'C8.mp3',
      },
      release: 2.5,
      baseUrl: 'https://tonejs.github.io/audio/salamander/',
    }).connect(delay);

    /* Esperar a que carguen todas las muestras */
    await Tone.loaded();

    /* ── Arreglo: ballad en C mayor / La menor ─────────────────
       Progresión: C  →  Am  →  F  →  G
       Patrón por compás:
         beat 1:   bajo + acorde amplio
         beat 2.5: nota media interior (inner voice)
         beat 3:   melodía aguda
         beat 4:   nota de paso
    ─────────────────────────────────────────────────────────── */
    const harmony = [
      {
        pad:    ['C3', 'G3', 'E4'],
        bass:   'C2',
        chord:  [['G3','E4','G4'], ['E4'], ['C5'], ['G4']],
      },
      {
        pad:    ['A2', 'E3', 'C4'],
        bass:   'A2',
        chord:  [['E3','C4','E4'], ['C4'], ['A4'], ['E4']],
      },
      {
        pad:    ['F2', 'C3', 'A3'],
        bass:   'F2',
        chord:  [['C3','A3','C4'], ['A3'], ['F4'], ['C4']],
      },
      {
        pad:    ['G2', 'D3', 'B3'],
        bass:   'G2',
        chord:  [['D3','B3','D4'], ['B3'], ['G4'], ['D4']],
      },
    ];

    let bar = 0;
    const q = () => Tone.Time('4n').toSeconds();

    const loop = new Tone.Loop(time => {
      const h = harmony[bar % 4];

      /* Pad (cuerdas debajo) — ataque largo, suena lleno */
      padSynth.triggerAttackRelease(h.pad, '1m', time, 0.7);

      /* Bajo: beat 1, velocity un poco más fuerte */
      sampler.triggerAttackRelease(h.bass, '2n', time, 0.55 + Math.random() * 0.06);

      /* Acorde y melodía: 4 eventos distribuidos en el compás */
      h.chord.forEach((notes, step) => {
        const stepTime = time + q() * step + (Math.random() * 0.02 - 0.01);
        const vel = step === 0 ? 0.38 + Math.random() * 0.06
                  : step === 2 ? 0.42 + Math.random() * 0.07
                  : 0.28 + Math.random() * 0.06;
        notes.forEach((n, ni) => {
          sampler.triggerAttackRelease(n, '2n', stepTime + ni * 0.04, vel);
        });
      });

      bar++;
    }, '1m');

    Tone.Transport.bpm.value = 48;
    loop.start(0);
  }

  btn.addEventListener('click', async () => {
    if (loading) return;

    if (!playing) {
      loading = true;
      btn.classList.add('btn-loading');
      await Tone.start();
      await buildChain();
      btn.classList.remove('btn-loading');
      loading = false;
      Tone.Transport.start();
      masterVol.volume.rampTo(-9, 1.5);
      playing = true;
      play.classList.add('hidden');
      pause.classList.remove('hidden');
    } else {
      masterVol.volume.rampTo(-60, 1.8);
      setTimeout(() => Tone.Transport.stop(), 1900);
      playing = false;
      play.classList.remove('hidden');
      pause.classList.add('hidden');
    }
  });
}

/* ═══════════════════════════════════════════
   19. REFRESH & RESIZE
═══════════════════════════════════════════ */
function refreshScrollTrigger() {
  window.addEventListener('load', () => {
    ScrollTrigger.refresh();
  });

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      ScrollTrigger.refresh(true);
    }, 220);
  });
}

/* ═══════════════════════════════════════════
   INITIAL GSAP STATES (before preloader ends)
═══════════════════════════════════════════ */
gsap.set('.h-line',          { y: '110%' });
gsap.set('.h-word',          { y: '100%', opacity: 0 });
gsap.set('.hero-date',       { opacity: 0, y: 14 });
gsap.set('.hero-scroll-hint',{ opacity: 0, y: 10 });
gsap.set('.scroll-line',     { scaleX: 0 });
gsap.set('.hero-number',     { opacity: 0 });
gsap.set('.nav-dots',        { opacity: 0 });
gsap.set('.music-btn',       { opacity: 0, y: -10 });
