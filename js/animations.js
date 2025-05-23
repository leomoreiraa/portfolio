/**
 * Animações e transições para o portfólio
 * Implementa animações de surgimento e transições suaves
 * Respeita preferências de acessibilidade
 */

// Verificar se o usuário prefere redução de movimento
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Configurar observador para elementos com animação de surgimento
function setupFadeAnimations() {
  // Pular configuração se o usuário prefere redução de movimento
  if (prefersReducedMotion) {
    // Mostrar todos os elementos imediatamente
    document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right, .stagger-item').forEach(el => {
      el.classList.add('visible');
    });
    return;
  }
  
  // Configurar Intersection Observer para elementos com fade-in
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
  
  // Observar todos elementos com classes de animação
  document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right').forEach(el => {
    fadeObserver.observe(el);
  });
  
  // Configurar observador separado para elementos com efeito sequencial
  const staggerObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Encontrar todos os itens filhos para aplicar o efeito sequencial
        entry.target.querySelectorAll('.stagger-item').forEach((item, index) => {
          // Adicionar classe visible com um pequeno atraso para cada item
          setTimeout(() => {
            item.classList.add('visible');
          }, 100 * index);
        });
        
        // Parar de observar após aplicar o efeito
        staggerObserver.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    threshold: 0.1
  });
  
  // Observar containers de itens sequenciais
  document.querySelectorAll('.stagger-container').forEach(el => {
    staggerObserver.observe(el);
  });
}

// Adicionar classe scrolled ao header quando a página é rolada
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
  
  // Verificar posição inicial
  if (window.scrollY > scrollThreshold) {
    header.classList.add('scrolled');
  }
}

// Configurar menu mobile
function setupMobileMenu() {
  const menuToggle = document.querySelector('.mobile-menu');
  const navLinks = document.querySelector('.nav-links');
  
  if (!menuToggle || !navLinks) return;
  
  menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    
    // Atualizar aria-expanded para acessibilidade
    const isExpanded = navLinks.classList.contains('active');
    menuToggle.setAttribute('aria-expanded', isExpanded);
  });
  
  // Fechar menu ao clicar em um link
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });
  
  // Fechar menu ao clicar fora
  document.addEventListener('click', (e) => {
    if (!navLinks.contains(e.target) && !menuToggle.contains(e.target) && navLinks.classList.contains('active')) {
      navLinks.classList.remove('active');
      menuToggle.setAttribute('aria-expanded', 'false');
    }
  });
}

// Suavizar rolagem para links de âncora
function setupSmoothScroll() {
  // Pular se o usuário prefere redução de movimento
  if (prefersReducedMotion) return;
  
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (!targetElement) return;
      
      // Calcular posição considerando o header fixo
      const headerHeight = document.querySelector('header').offsetHeight;
      const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
      
      // Atualizar foco para o elemento alvo (acessibilidade)
      targetElement.setAttribute('tabindex', '-1');
      targetElement.focus({ preventScroll: true });
    });
  });
}

// Inicializar todas as animações e efeitos
function initAnimations() {
  setupFadeAnimations();
  setupScrollEffects();
  setupMobileMenu();
  setupSmoothScroll();
}

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', initAnimations);

// Ouvir mudanças na preferência de redução de movimento
window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
  if (e.matches) {
    // Usuário ativou a preferência de redução de movimento
    document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right, .stagger-item').forEach(el => {
      el.classList.add('visible');
    });
  } else {
    // Usuário desativou a preferência de redução de movimento
    // Reconfigurar animações
    document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right, .stagger-item').forEach(el => {
      el.classList.remove('visible');
    });
    setupFadeAnimations();
  }
});

// Exportar funções para uso em outros scripts
window.animationUtils = {
  initAnimations,
  setupFadeAnimations
};
