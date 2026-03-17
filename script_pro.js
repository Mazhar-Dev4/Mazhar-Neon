const body = document.body;
const cursor = document.getElementById('cursor');
const ring = document.getElementById('cursorRing');
const progressBar = document.getElementById('progressBar');
const navbar = document.getElementById('navbar');
const mobileMenu = document.getElementById('mobileMenu');
const hamburger = document.getElementById('hamburger');
const menuClose = document.getElementById('menuClose');
const toast = document.getElementById('toast');

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isTouchDevice = window.matchMedia('(max-width: 900px)').matches;

let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let ringX = mouseX;
let ringY = mouseY;

if (!isTouchDevice && !prefersReducedMotion && cursor && ring) {
  document.addEventListener('mousemove', (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;
  });

  const animateCursor = () => {
    cursor.style.left = `${mouseX}px`;
    cursor.style.top = `${mouseY}px`;

    ringX += (mouseX - ringX) * 0.14;
    ringY += (mouseY - ringY) * 0.14;

    ring.style.left = `${ringX}px`;
    ring.style.top = `${ringY}px`;

    window.requestAnimationFrame(animateCursor);
  };

  animateCursor();

  document.querySelectorAll('a, button, .service-card, .highlight-card, .profile-link, .contact-item, .action-card').forEach((element) => {
    element.addEventListener('mouseenter', () => {
      ring.style.width = '62px';
      ring.style.height = '62px';
      ring.style.borderColor = 'rgba(255, 79, 159, 0.72)';
    });

    element.addEventListener('mouseleave', () => {
      ring.style.width = '42px';
      ring.style.height = '42px';
      ring.style.borderColor = 'rgba(89, 240, 255, 0.42)';
    });
  });
}

const updateProgressBar = () => {
  const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollableHeight > 0 ? (window.scrollY / scrollableHeight) * 100 : 0;
  progressBar.style.width = `${progress}%`;
  navbar.classList.toggle('scrolled', window.scrollY > 16);
};

window.addEventListener('scroll', updateProgressBar, { passive: true });
window.addEventListener('load', updateProgressBar);

const revealElements = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.16 });

revealElements.forEach((element) => observer.observe(element));

const toggleMenu = (forceState) => {
  const willOpen = typeof forceState === 'boolean' ? forceState : !mobileMenu.classList.contains('open');
  mobileMenu.classList.toggle('open', willOpen);
  hamburger?.setAttribute('aria-expanded', String(willOpen));
  body.style.overflow = willOpen ? 'hidden' : '';
};

hamburger?.addEventListener('click', () => toggleMenu(true));
menuClose?.addEventListener('click', () => toggleMenu(false));

mobileMenu?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => toggleMenu(false));
});

window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') toggleMenu(false);
});

const particleContainer = document.getElementById('particles');
const colors = ['rgba(89, 240, 255, 0.85)', 'rgba(255, 79, 159, 0.8)', 'rgba(176, 108, 255, 0.82)'];

const createParticle = () => {
  if (!particleContainer || prefersReducedMotion) return;
  const particle = document.createElement('span');
  particle.className = 'particle';

  const size = Math.random() * 3 + 1.8;
  particle.style.width = `${size}px`;
  particle.style.height = `${size}px`;
  particle.style.left = `${Math.random() * 100}%`;
  particle.style.background = colors[Math.floor(Math.random() * colors.length)];
  particle.style.boxShadow = `0 0 14px ${particle.style.background}`;
  particle.style.animationDuration = `${Math.random() * 7 + 8}s`;
  particle.style.animationDelay = `${Math.random() * 1.5}s`;

  particleContainer.appendChild(particle);
  window.setTimeout(() => particle.remove(), 11000);
};

if (!prefersReducedMotion) {
  for (let i = 0; i < 14; i += 1) createParticle();
  window.setInterval(createParticle, 700);
}

const countUp = (element) => {
  const target = Number(element.dataset.target || 0);
  const duration = 1500;
  const start = performance.now();

  const step = (time) => {
    const progress = Math.min((time - start) / duration, 1);
    const value = Math.floor(progress * target);
    element.textContent = value;
    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      element.textContent = `${target}`;
    }
  };

  requestAnimationFrame(step);
};

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    countUp(entry.target);
    counterObserver.unobserve(entry.target);
  });
}, { threshold: 0.7 });

document.querySelectorAll('.count').forEach((counter) => counterObserver.observe(counter));

const navSections = document.querySelectorAll('main section[id], header[id]');
const navLinks = document.querySelectorAll('.nav-links a');

const setActiveLink = () => {
  const midpoint = window.scrollY + window.innerHeight * 0.35;
  let currentId = 'home';

  navSections.forEach((section) => {
    if (midpoint >= section.offsetTop) currentId = section.id;
  });

  navLinks.forEach((link) => {
    const active = link.getAttribute('href') === `#${currentId}`;
    link.classList.toggle('active', active);
  });
};

window.addEventListener('scroll', setActiveLink, { passive: true });
window.addEventListener('load', setActiveLink);

const showToast = (message) => {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  window.clearTimeout(showToast.hideTimer);
  showToast.hideTimer = window.setTimeout(() => {
    toast.classList.remove('show');
  }, 2000);
};

const copyButtons = document.querySelectorAll('.copy-btn');
copyButtons.forEach((button) => {
  button.addEventListener('click', async () => {
    const value = button.getAttribute('data-copy');
    if (!value) return;

    try {
      await navigator.clipboard.writeText(value);
      showToast(`Copied: ${value}`);
    } catch (error) {
      const input = document.createElement('input');
      input.value = value;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      input.remove();
      showToast(`Copied: ${value}`);
    }
  });
});
