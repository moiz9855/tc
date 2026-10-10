/* ═══════════════════════════════════════════════════════════════
   Feel Better Soon — Dark Botanical Theme
   Vanilla JS: scroll reveal, surprise modal, confetti/petals
   ═══════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  initScrollReveal();
  initHeroPetals();
  initSurprise();
});

/* ──────────────────────────────────────
   1. Scroll Fade-In (Intersection Observer)
   ────────────────────────────────────── */
function initScrollReveal() {
  const els = document.querySelectorAll('.fade-in');

  if (!('IntersectionObserver' in window)) {
    els.forEach(el => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          observer.unobserve(e.target);      // animate once
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -30px 0px' }
  );

  els.forEach(el => observer.observe(el));
}

/* ──────────────────────────────────────
   1b. Hero Drifting Petals (gentle, sparse)
   ────────────────────────────────────── */
function initHeroPetals() {
  const container = document.getElementById('heroDriftPetals');
  if (!container) return;

  const PETAL_COUNT = 6;
  const colors = [
    'rgba(168,139,199,0.35)',
    'rgba(107,78,142,0.3)',
    'rgba(196,166,217,0.3)',
    'rgba(212,184,232,0.25)',
  ];

  function spawnPetal() {
    const petal = document.createElement('div');
    petal.classList.add('drift-petal');

    const size = 8 + Math.random() * 10;
    petal.style.width  = size + 'px';
    petal.style.height = (size * 1.4) + 'px';
    petal.style.left   = (30 + Math.random() * 40) + '%';
    petal.style.background = `linear-gradient(135deg, ${colors[Math.floor(Math.random() * colors.length)]}, rgba(168,139,199,0.1))`;

    const duration = 10 + Math.random() * 8;
    const delay    = Math.random() * 6;
    petal.style.animationDuration = duration + 's';
    petal.style.animationDelay    = delay + 's';

    container.appendChild(petal);

    // Remove and recycle after one full cycle
    setTimeout(() => {
      petal.remove();
      spawnPetal();
    }, (duration + delay) * 1000);
  }

  for (let i = 0; i < PETAL_COUNT; i++) {
    spawnPetal();
  }
}

/* ──────────────────────────────────────
   2. Surprise Modal + Confetti / Petals
   ────────────────────────────────────── */
function initSurprise() {
  const btn        = document.getElementById('surpriseBtn');
  const modal      = document.getElementById('surpriseModal');
  const closeBtn   = document.getElementById('modalClose');
  const anotherBtn = document.getElementById('anotherBtn');
  const signoff    = document.getElementById('modalSignoff');

  if (!btn || !modal) return;

  const notes = [
    'You are so strong, but today you don\'t have to be. It\'s 100% okay to do nothing and let the world wait. 💛',
    'Reminder: drinking one glass of water and taking a cozy nap is a 10/10 productive day today. 🌸',
    'Close your eyes, let your shoulders drop, unclench your jaw. You\'re doing amazing. ☁️',
    'Someone out there is rooting hard for you and hoping you feel lighter soon. 🧸',
    'No deadlines, no rush, no pressure. Your only job today is resting. 🌿',
    'Warm blankets, dim lights, absolute peaceful silence — that\'s your prescription. ✨',
  ];
  let noteIdx = 0;

  function open() {
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    launchPetals();
  }
  function close() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
  }

  btn.addEventListener('click', open);
  closeBtn?.addEventListener('click', close);
  modal.addEventListener('click', e => { if (e.target === modal) close(); });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && modal.classList.contains('open')) close();
  });

  anotherBtn?.addEventListener('click', () => {
    noteIdx = (noteIdx + 1) % notes.length;
    if (signoff) {
      signoff.style.opacity = '0';
      signoff.style.transform = 'translateY(6px)';
      setTimeout(() => {
        signoff.textContent = notes[noteIdx];
        signoff.style.opacity = '1';
        signoff.style.transform = 'translateY(0)';
      }, 220);
    }
    launchPetals();
  });
}

/* ──────────────────────────────────────
   3. Falling Petals / Soft Confetti
   ────────────────────────────────────── */
function launchPetals() {
  const canvas = document.getElementById('petalCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;

  const palette = [
    '#a88bc7',   // soft purple
    '#6b4e8e',   // deep purple
    '#c4a6d9',   // light lavender
    '#f5f5f0',   // cream
    '#d4b8e8',   // lilac
    '#8b6baf',   // mid purple
  ];

  const emojis = ['🌸', '✨', '💛', '🌿', '☁️'];
  const particles = [];

  // Burst from center-top area
  for (let i = 0; i < 50; i++) {
    const isEmoji = Math.random() < 0.28;
    particles.push({
      x:  canvas.width / 2 + (Math.random() - 0.5) * 120,
      y:  canvas.height * 0.35 + (Math.random() - 0.5) * 80,
      vx: (Math.random() - 0.5) * 7,
      vy: (Math.random() * -7) - 3,
      size: isEmoji ? 14 + Math.random() * 10 : 5 + Math.random() * 7,
      color: palette[Math.floor(Math.random() * palette.length)],
      emoji: isEmoji ? emojis[Math.floor(Math.random() * emojis.length)] : null,
      rot: Math.random() * 360,
      rotV: (Math.random() - 0.5) * 5,
      alpha: 1,
      gravity: 0.18 + Math.random() * 0.06,
      fade: 0.008 + Math.random() * 0.008,
    });
  }

  let raf;

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let alive = false;

    for (const p of particles) {
      if (p.alpha <= 0) continue;
      alive = true;

      p.x  += p.vx;
      p.y  += p.vy;
      p.vy += p.gravity;
      p.vx *= 0.985;
      p.rot += p.rotV;
      p.alpha -= p.fade;

      ctx.save();
      ctx.globalAlpha = Math.max(0, p.alpha);
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rot * Math.PI) / 180);

      if (p.emoji) {
        ctx.font = `${p.size}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(p.emoji, 0, 0);
      } else {
        ctx.fillStyle = p.color;
        ctx.beginPath();
        // petal-ish shape
        ctx.ellipse(0, 0, p.size * 0.45, p.size, 0, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    if (alive) {
      raf = requestAnimationFrame(draw);
    } else {
      cancelAnimationFrame(raf);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  draw();
}
