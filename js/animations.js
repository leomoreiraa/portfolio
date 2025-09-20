 
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function setupFadeAnimations() {
  if (prefersReducedMotion) {
    document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right, .stagger-item').forEach(el => {
      el.classList.add('visible');
    });
    return;
  }
  
  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, {
    root: null,
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });
  
  document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right').forEach(el => {
    fadeObserver.observe(el);
  });
  
  const staggerObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.stagger-item').forEach((item, index) => {
          setTimeout(() => {
            item.classList.add('visible');
          }, 100 * index);
        });
        staggerObserver.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    threshold: 0.1
  });
  
  document.querySelectorAll('.stagger-container').forEach(el => {
    staggerObserver.observe(el);
  });
}

function setupScrollEffects() {
  const header = document.querySelector('header');
  if (!header) return;
  
  const scrollThreshold = 50;
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > scrollThreshold) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
  
  if (window.scrollY > scrollThreshold) {
    header.classList.add('scrolled');
  }
}

function setupMobileMenu() {
  const menuToggle = document.querySelector('.mobile-menu');
  const navLinks = document.querySelector('.nav-links');
  
  if (!menuToggle || !navLinks) return;
  
  menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    const isExpanded = navLinks.classList.contains('active');
    menuToggle.setAttribute('aria-expanded', isExpanded);
  });
  
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });
  
  document.addEventListener('click', (e) => {
    if (!navLinks.contains(e.target) && !menuToggle.contains(e.target) && navLinks.classList.contains('active')) {
      navLinks.classList.remove('active');
      menuToggle.setAttribute('aria-expanded', 'false');
    }
  });
}

function setupSmoothScroll() {
  if (prefersReducedMotion) return;
  
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (!targetElement) return;
      
      const headerHeight = document.querySelector('header').offsetHeight;
      const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
      
      targetElement.setAttribute('tabindex', '-1');
      targetElement.focus({ preventScroll: true });
    });
  });
}

function initAnimations() {
  setupFadeAnimations();
  setupScrollEffects();
  setupMobileMenu();
  setupSmoothScroll();
}

document.addEventListener('DOMContentLoaded', initAnimations);

window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
  if (e.matches) {
    document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right, .stagger-item').forEach(el => {
      el.classList.add('visible');
    });
  } else {
    document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right, .stagger-item').forEach(el => {
      el.classList.remove('visible');
    });
    setupFadeAnimations();
  }
});

window.animationUtils = {
  initAnimations,
  setupFadeAnimations
};
