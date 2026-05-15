/* ==============================================
   Heritage Falodun — main.js
   Animations, Theme Toggle, Interactions
   ============================================== */

const isTouchDevice = () => window.matchMedia('(hover: none)').matches;

/* ─── THEME TOGGLE ─── */
const html = document.documentElement;
const toggleBtn = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');

const savedTheme = localStorage.getItem('hf-theme') || 'dark';
applyTheme(savedTheme, false);

toggleBtn.addEventListener('click', () => {
  const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  applyTheme(next, true);
});

function applyTheme(theme, animate) {
  if (animate) {
    html.classList.add('theme-transitioning');
    setTimeout(() => html.classList.remove('theme-transitioning'), 500);
  }
  html.setAttribute('data-theme', theme);
  localStorage.setItem('hf-theme', theme);
  themeIcon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}

/* ─── SCROLL PROGRESS BAR ─── */
const progressBar = document.getElementById('scroll-progress');

function updateProgress() {
  const scrolled = window.scrollY;
  const total = document.documentElement.scrollHeight - window.innerHeight;
  progressBar.style.width = total > 0 ? (scrolled / total * 100) + '%' : '0%';
}

/* ─── NAV SCROLL EFFECT ─── */
const nav = document.getElementById('nav');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
  updateProgress();
}, { passive: true });

/* ─── SCROLL REVEAL ─── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ─── SMOOTH SCROLL ─── */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ─── TYPEWRITER ─── */
const roles = [
  'Fintech Founder',
  'Bitcoin Researcher',
  'Product Developer',
  'Africa Builder',
  'Payments Innovator',
];
let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typeEl = document.getElementById('typewriter');

function typeWriter() {
  const currentRole = roles[roleIndex];
  if (isDeleting) {
    typeEl.textContent = currentRole.slice(0, --charIndex);
  } else {
    typeEl.textContent = currentRole.slice(0, ++charIndex);
  }

  let delay = isDeleting ? 55 : 100;

  if (!isDeleting && charIndex === currentRole.length) {
    delay = 1800;
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    roleIndex = (roleIndex + 1) % roles.length;
    delay = 300;
  }

  setTimeout(typeWriter, delay);
}

typeWriter();

/* ─── PARTICLE CANVAS ─── */
const canvas = document.getElementById('hero-canvas');
const ctx = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
}

class Particle {
  constructor() { this.reset(true); }

  reset(randomY = false) {
    this.x = Math.random() * canvas.width;
    this.y = randomY ? Math.random() * canvas.height : canvas.height + 10;
    this.vx = (Math.random() - 0.5) * 0.5;
    this.vy = -(Math.random() * 0.4 + 0.15);
    this.r = Math.random() * 2 + 0.5;
    this.alpha = Math.random() * 0.45 + 0.1;
    this.life = 1;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.y < -10 || this.x < -10 || this.x > canvas.width + 10) this.reset();
  }

  draw() {
    const dark = html.getAttribute('data-theme') !== 'light';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = dark
      ? `rgba(247,147,26,${this.alpha})`
      : `rgba(217,119,6,${this.alpha * 0.5})`;
    ctx.fill();
  }
}

function initParticles() {
  particles = [];
  const count = Math.min(30, Math.floor(canvas.width / 40));
  for (let i = 0; i < count; i++) particles.push(new Particle());
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  requestAnimationFrame(animateParticles);
}

resizeCanvas();
initParticles();
animateParticles();

const resizeObserver = new ResizeObserver(() => {
  resizeCanvas();
  initParticles();
});
resizeObserver.observe(canvas);

/* ─── 3D CARD TILT ─── */
if (!isTouchDevice()) {
  document.querySelectorAll('.tilt-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width / 2) / (r.width / 2);
      const y = (e.clientY - r.top - r.height / 2) / (r.height / 2);
      card.style.transition = 'transform 0.05s linear, box-shadow 0.25s ease';
      card.style.transform = `perspective(700px) rotateX(${-y * 6}deg) rotateY(${x * 6}deg) translateZ(10px)`;
      card.style.boxShadow = `${-x * 10}px ${-y * 10}px 30px rgba(0,0,0,0.15)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transition = 'transform 0.6s ease, box-shadow 0.6s ease';
      card.style.transform = '';
      card.style.boxShadow = '';
    });
  });
}

/* ─── MAGNETIC BUTTONS ─── */
if (!isTouchDevice()) {
  document.querySelectorAll('.magnetic').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top - r.height / 2;
      btn.style.transform = `translate(${x * 0.28}px, ${y * 0.38}px)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transition = 'transform 0.5s cubic-bezier(0.34,1.56,0.64,1)';
      btn.style.transform = '';
      setTimeout(() => { btn.style.transition = ''; }, 500);
    });

    btn.addEventListener('mouseenter', () => {
      btn.style.transition = 'transform 0.1s ease';
    });
  });
}

/* ─── CUSTOM CURSOR ─── */
if (!isTouchDevice()) {
  document.body.classList.add('custom-cursor');

  const dot = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  let mx = 0, my = 0, rx = 0, ry = 0;
  let rafCursor;

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top = my + 'px';
  }, { passive: true });

  function animateCursor() {
    rx += (mx - rx) * 0.13;
    ry += (my - ry) * 0.13;
    ring.style.left = rx + 'px';
    ring.style.top = ry + 'px';
    rafCursor = requestAnimationFrame(animateCursor);
  }
  animateCursor();

  const interactables = 'a, button, .tilt-card, .about-link, .social-btn';
  document.querySelectorAll(interactables).forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('hover'));
    el.addEventListener('mouseleave', () => ring.classList.remove('hover'));
  });

  document.addEventListener('mouseleave', () => {
    dot.style.opacity = '0';
    ring.style.opacity = '0';
  });

  document.addEventListener('mouseenter', () => {
    dot.style.opacity = '1';
    ring.style.opacity = '1';
  });
}

/* ─── NUMBER COUNTER ─── */
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = parseInt(el.getAttribute('data-target'), 10);
    const prefix = el.getAttribute('data-prefix') || '';
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 1400;
    const start = performance.now();

    function tick(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = prefix + Math.round(eased * target) + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
    counterObserver.unobserve(el);
  });
}, { threshold: 0.6 });

document.querySelectorAll('.stat-number[data-target]').forEach(el => {
  counterObserver.observe(el);
});
