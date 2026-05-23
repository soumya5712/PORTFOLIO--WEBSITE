/* ============================================
   SOUMYA RANJAN BARIK — PORTFOLIO SCRIPT
   Handles all interactions, animations, effects
   ============================================ */

'use strict';

/* ====================================
   LOADING SCREEN
   ==================================== */
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('loader');
    loader.classList.add('hidden');
    // Trigger initial hero animations
    document.querySelectorAll('.hero .reveal-up').forEach((el, i) => {
      setTimeout(() => el.classList.add('visible'), 300 + i * 120);
    });
  }, 1800);
});

/* ====================================
   CUSTOM CURSOR
   ==================================== */
const cursorDot  = document.getElementById('cursorDot');
const cursorRing = document.getElementById('cursorRing');

let mouseX = 0, mouseY = 0;
let ringX = 0, ringY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursorDot.style.left = mouseX + 'px';
  cursorDot.style.top  = mouseY + 'px';
});

// Smooth ring follow
(function animateRing() {
  ringX += (mouseX - ringX) * 0.18;
  ringY += (mouseY - ringY) * 0.18;
  cursorRing.style.left = ringX + 'px';
  cursorRing.style.top  = ringY + 'px';
  requestAnimationFrame(animateRing);
})();

// Ring hover expansion on interactive elements
document.querySelectorAll('a, button, .glass-card, .project-card').forEach(el => {
  el.addEventListener('mouseenter', () => cursorRing.classList.add('hovering'));
  el.addEventListener('mouseleave', () => cursorRing.classList.remove('hovering'));
});

/* ====================================
   SCROLL PROGRESS BAR
   ==================================== */
const scrollBar = document.getElementById('scrollProgress');

window.addEventListener('scroll', () => {
  const scrollTop = document.documentElement.scrollTop;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress  = (scrollTop / docHeight) * 100;
  scrollBar.style.width = progress + '%';
}, { passive: true });

/* ====================================
   NAVBAR
   ==================================== */
const navbar    = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

// Scroll class
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
  // Back to top button
  document.getElementById('backToTop').classList.toggle('visible', window.scrollY > 400);
}, { passive: true });

// Hamburger toggle
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

// Close mobile menu on link click
navLinks.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

/* ====================================
   ACTIVE NAV LINK — INTERSECTION
   ==================================== */
const sections = document.querySelectorAll('section[id]');
const navItems  = document.querySelectorAll('.nav-link');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navItems.forEach(link => link.classList.remove('active'));
      const active = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
      if (active) active.classList.add('active');
    }
  });
}, { threshold: 0.35 });

sections.forEach(s => sectionObserver.observe(s));

/* ====================================
   PARTICLE CANVAS — HERO
   ==================================== */
const canvas = document.getElementById('particleCanvas');
const ctx    = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
  canvas.width  = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x    = Math.random() * canvas.width;
    this.y    = Math.random() * canvas.height;
    this.size = Math.random() * 1.5 + 0.3;
    this.speedX = (Math.random() - 0.5) * 0.35;
    this.speedY = (Math.random() - 0.5) * 0.35;
    this.opacity = Math.random() * 0.5 + 0.1;
    this.color = Math.random() > 0.5 ? '0,245,255' : '168,85,247';
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
  }
  draw() {
    ctx.save();
    ctx.globalAlpha = this.opacity;
    ctx.fillStyle = `rgb(${this.color})`;
    ctx.shadowBlur = 6;
    ctx.shadowColor = `rgba(${this.color},0.5)`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

// Create particles
for (let i = 0; i < 90; i++) particles.push(new Particle());

// Mouse interaction
let mx = -9999, my = -9999;
canvas.addEventListener('mousemove', e => {
  const rect = canvas.getBoundingClientRect();
  mx = e.clientX - rect.left;
  my = e.clientY - rect.top;
});

function drawConnections() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx   = particles[i].x - particles[j].x;
      const dy   = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 100) {
        ctx.save();
        ctx.globalAlpha = (1 - dist / 100) * 0.1;
        ctx.strokeStyle = 'rgba(0,245,255,1)';
        ctx.lineWidth   = 0.5;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
        ctx.restore();
      }
    }
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => {
    // Mouse repel
    const dx = p.x - mx, dy = p.y - my;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 100) {
      p.x += dx / dist * 1.5;
      p.y += dy / dist * 1.5;
    }
    p.update();
    p.draw();
  });
  drawConnections();
  requestAnimationFrame(animateParticles);
}
animateParticles();

/* ====================================
   TYPING ANIMATION
   ==================================== */
const roles = ['Frontend Developer', 'Web Developer', 'UI Enthusiast', 'React Developer'];
let roleIdx = 0, charIdx = 0, isDeleting = false;
const typedEl = document.getElementById('typedText');

function typeLoop() {
  const currentRole = roles[roleIdx];
  if (!isDeleting) {
    typedEl.textContent = currentRole.substring(0, charIdx + 1);
    charIdx++;
    if (charIdx === currentRole.length) {
      isDeleting = true;
      setTimeout(typeLoop, 1800);
      return;
    }
  } else {
    typedEl.textContent = currentRole.substring(0, charIdx - 1);
    charIdx--;
    if (charIdx === 0) {
      isDeleting = false;
      roleIdx = (roleIdx + 1) % roles.length;
    }
  }
  setTimeout(typeLoop, isDeleting ? 60 : 100);
}
setTimeout(typeLoop, 2200); // Start after loader

/* ====================================
   SCROLL REVEAL
   ==================================== */
const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

revealEls.forEach(el => revealObserver.observe(el));

/* ====================================
   ANIMATED COUNTER
   ==================================== */
const counters = document.querySelectorAll('.stat-num');

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el     = entry.target;
      const target = parseInt(el.dataset.target);
      let current  = 0;
      const step   = Math.max(1, Math.floor(target / 30));
      const timer  = setInterval(() => {
        current += step;
        if (current >= target) { current = target; clearInterval(timer); }
        el.textContent = current;
      }, 50);
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

counters.forEach(c => counterObserver.observe(c));

/* ====================================
   SKILL BAR ANIMATION
   ==================================== */
const skillFills = document.querySelectorAll('.skill-fill');

const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      setTimeout(() => {
        el.style.width = el.dataset.w + '%';
      }, 200);
      skillObserver.unobserve(el);
    }
  });
}, { threshold: 0.3 });

skillFills.forEach(f => skillObserver.observe(f));

/* ====================================
   CONTACT FORM
   ==================================== */
const form = document.getElementById('contactForm');
const successMsg = document.getElementById('formSuccess');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const btn = form.querySelector('.form-submit span');
  btn.textContent = 'Sending...';
  setTimeout(() => {
    btn.textContent = 'Send Message';
    successMsg.classList.add('show');
    form.reset();
    setTimeout(() => successMsg.classList.remove('show'), 4000);
  }, 1200);
});

/* ====================================
   BACK TO TOP
   ==================================== */
document.getElementById('backToTop').addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ====================================
   SMOOTH SCROLL FOR NAV LINKS
   ==================================== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ====================================
   PARALLAX — HERO GLOWS
   ==================================== */
document.addEventListener('mousemove', (e) => {
  const x = (e.clientX / window.innerWidth  - 0.5) * 2;
  const y = (e.clientY / window.innerHeight - 0.5) * 2;
  const glows = document.querySelectorAll('.hero-glow');
  glows.forEach((g, i) => {
    const factor = (i + 1) * 15;
    g.style.transform = `translate(${x * factor}px, ${y * factor}px)`;
  });
});

/* ====================================
   CARD TILT EFFECT — Project Cards
   ==================================== */
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect   = card.getBoundingClientRect();
    const cx     = rect.left + rect.width  / 2;
    const cy     = rect.top  + rect.height / 2;
    const rotateX = ((e.clientY - cy) / (rect.height / 2)) * -5;
    const rotateY = ((e.clientX - cx) / (rect.width  / 2)) *  5;
    card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'transform 0.5s ease';
  });
  card.addEventListener('mouseenter', () => {
    card.style.transition = 'transform 0.1s linear';
  });
});

/* ====================================
   GLASS CARD SUBTLE SHIMMER
   ==================================== */
document.querySelectorAll('.glass-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width)  * 100;
    const y = ((e.clientY - rect.top)  / rect.height) * 100;
    card.style.background = `radial-gradient(circle at ${x}% ${y}%, rgba(0,245,255,0.04) 0%, rgba(255,255,255,0.02) 50%, rgba(255,255,255,0.01) 100%)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.background = '';
  });
});

/* ====================================
   TIMELINE LINE GROW ANIMATION
   ==================================== */
document.querySelectorAll('.timeline-line').forEach(line => {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        line.style.opacity = '0.3';
        obs.unobserve(line);
      }
    });
  }, { threshold: 0.1 });
  obs.observe(line);
});

console.log('%c SRB Portfolio 🚀', 'font-size:20px; color:#00f5ff; font-weight:bold;');
console.log('%c Built with HTML, CSS & JS', 'font-size:12px; color:#a855f7;');
