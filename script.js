// Variáveis globais
const menuToggle = document.getElementById("menu-toggle");
const navLinks = document.getElementById("nav-links");
const header = document.querySelector("header");
const home = document.querySelector("#home");

// Função para verificar se estamos em modo mobile
function isMobile() {
    return window.innerWidth <= 768;
}

// Define padding-top baseado na altura da navbar
function ajustarEspacamentoHeader() {
    // Não adicionar padding-top ao body para manter o header transparente
    // sobre a primeira seção
}

// Função para atualizar a navegação ativa com base na seção visível
function updateActiveNavigation() {
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.nav-links a');
    
    // Encontrar a seção atualmente visível
    let currentSection = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });
    
    // Atualizar classe ativa na navegação
    navItems.forEach(item => {
        item.removeAttribute('aria-current');
        item.classList.remove('active'); // limpa antes
        const href = item.getAttribute('href').substring(1);
        if (href === currentSection) {
            item.setAttribute('aria-current', 'page');
            item.classList.add('active');
        }
    });
}

// Função para animar elementos quando entrarem na viewport
function setupScrollAnimations() {
    const fadeElements = document.querySelectorAll('.fade-in');
    
    const fadeInOnScroll = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Animar elementos filhos com delay
                const children = entry.target.querySelectorAll('.animate-child');
                children.forEach((child, index) => {
                    child.style.animationDelay = `${index * 0.1}s`;
                    child.classList.add('animate-fade-in');
                });
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.2,
        rootMargin: '0px 0px -100px 0px'
    });
    
    fadeElements.forEach(element => {
        fadeInOnScroll.observe(element);
    });
}

// Função para adicionar efeito de parallax no home
function setupParallaxEffect() {
    window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY;
        const homeSection = document.querySelector('#home');
        
        if (scrollPosition <= window.innerHeight) {
            const translateY = scrollPosition * 0.3;
            // Aplicar efeito de parallax ao conteúdo do home
            const homeContent = document.querySelector('.home-layout');
            if (homeContent) {
                homeContent.style.transform = `translateY(${translateY * 0.5}px)`;
            }
            
            // Efeito de fade out no indicador de scroll
            const scrollIndicator = document.querySelector('.scroll-indicator');
            if (scrollIndicator) {
                scrollIndicator.style.opacity = 1 - (scrollPosition / 300);
            }
        }
    });
}

// Função para gerenciar o menu mobile
function setupMobileMenu() {
    menuToggle.addEventListener('click', () => {
        const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
        menuToggle.setAttribute('aria-expanded', !expanded);
        navLinks.classList.toggle('active');
        
        // Animar itens do menu
        const menuItems = navLinks.querySelectorAll('a');
        menuItems.forEach((item, index) => {
            if (navLinks.classList.contains('active')) {
                item.style.animationDelay = `${index * 0.1}s`;
                item.classList.add('animate-slide-in');
            } else {
                item.classList.remove('animate-slide-in');
            }
        });
    });
    
    // Fechar menu ao clicar em um link
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            if (isMobile()) {
                navLinks.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
            }
        });
    });
}

// Função para adicionar smooth scroll aos links de navegação
function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Calcular posição considerando o header fixo
                const headerOffset = header.offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - headerOffset;
                
                // Animação de scroll suave
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Função para adicionar efeito de hover nos cards de projeto
function setupProjectHoverEffects() {
    const projects = document.querySelectorAll('.project');
    
    projects.forEach(project => {
        project.addEventListener('mouseenter', () => {
            project.classList.add('hover');
        });
        
        project.addEventListener('mouseleave', () => {
            project.classList.remove('hover');
        });
        
        // Garantir que o efeito funcione também com foco para acessibilidade
        const projectLink = project.querySelector('a');
        if (projectLink) {
            projectLink.addEventListener('focus', () => {
                project.classList.add('hover');
            });
            
            projectLink.addEventListener('blur', () => {
                project.classList.remove('hover');
            });
        }
    });
}

// Função para adicionar animação de digitação no título principal
function setupTypingAnimation() {
    const greeting = document.querySelector('#greeting');
    if (!greeting) return;
    
    const originalText = greeting.innerHTML;
    const nameSpan = greeting.querySelector('span');
    const nameText = nameSpan ? nameSpan.textContent : '';
    
    // Resetar o conteúdo para animação
    const baseText = originalText.replace(/<span>.*<\/span>/, '');
    greeting.innerHTML = baseText + '<span class="cursor"></span>';
    
    // Adicionar animação de digitação
    let charIndex = 0;
    const typingInterval = setInterval(() => {
        if (charIndex < nameText.length) {
            const cursor = greeting.querySelector('.cursor');
            cursor.textContent += nameText.charAt(charIndex);
            charIndex++;
        } else {
            clearInterval(typingInterval);
            // Restaurar o HTML original com a classe de estilo
            greeting.innerHTML = baseText + `<span class="highlight">${nameText}</span>`;
        }
    }, 150);
}

// Função para adicionar efeito de scroll no header
function setupHeaderScroll() {
    const observer = new IntersectionObserver(
        ([entry]) => {
            if (!isMobile()) {
                if (entry.isIntersecting) {
                    header.classList.remove("scrolled");
                } else {
                    header.classList.add("scrolled");
                }
            } else {
                // No mobile, o header é sempre visível com fundo
                header.classList.add("scrolled");
            }
        },
        {
            root: null,
            threshold: 0,
        }
    );
    
    observer.observe(home);
}

// Função para adicionar acessibilidade ao teclado
function setupKeyboardAccessibility() {
    // Adicionar navegação por teclado para o menu mobile
    menuToggle.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            menuToggle.click();
        }
    });
    
    // Adicionar navegação por teclado para os botões de idioma
    const languageButtons = document.querySelectorAll('.language-btn');
    languageButtons.forEach(button => {
        button.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                button.click();
            }
        });
    });
    
    // Adicionar skip link para acessibilidade
    const skipLink = document.querySelector('.skip-link');
    if (skipLink) {
        skipLink.addEventListener('focus', () => {
            skipLink.style.transform = 'translateY(0)';
            skipLink.style.opacity = '1';
        });
        
        skipLink.addEventListener('blur', () => {
            skipLink.style.transform = 'translateY(-100%)';
            skipLink.style.opacity = '0';
        });
    }
}

// Função para adicionar tema escuro
function setupDarkMode() {
    const themeToggle = document.createElement('button');
    themeToggle.className = 'theme-toggle';
    themeToggle.setAttribute('aria-label', 'Alternar tema escuro');
    themeToggle.innerHTML = '<i class="fas fa-moon"></i>';

    document.querySelector('header .container').appendChild(themeToggle);

    // Detectar preferência do sistema
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    let savedTheme = localStorage.getItem('theme');

    function applyTheme(theme) {
        if (theme === 'dark') {
            document.body.classList.add('dark-theme');
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
            themeToggle.setAttribute('aria-label', 'Mudar para tema claro');
        } else {
            document.body.classList.remove('dark-theme');
            themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
            themeToggle.setAttribute('aria-label', 'Mudar para tema escuro');
        }
    }

    // Inicialização
    if (savedTheme) {
        applyTheme(savedTheme);
    } else {
        applyTheme(prefersDark.matches ? 'dark' : 'light');
    }

    // Botão de alternância
    themeToggle.addEventListener('click', () => {
        const isDark = document.body.classList.toggle('dark-theme');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        applyTheme(isDark ? 'dark' : 'light');
    });

    // Mudança automática se o usuário mudar o tema do sistema
    prefersDark.addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            applyTheme(e.matches ? 'dark' : 'light');
        }
    });
}

// Função para adicionar prefers-reduced-motion
function setupReducedMotion() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    function handleReducedMotion() {
        if (prefersReducedMotion.matches) {
            document.body.classList.add('reduced-motion');
        } else {
            document.body.classList.remove('reduced-motion');
        }
    }
    
    // Verificar inicialmente
    handleReducedMotion();
    
    // Ouvir mudanças na preferência
    prefersReducedMotion.addEventListener('change', handleReducedMotion);
}

// Função para alterar o idioma
function setLanguage(lang) {
    document.querySelectorAll("[data-key]").forEach((element) => {
        const key = element.getAttribute("data-key");
        if (translations[lang][key]) {
            element.innerHTML = translations[lang][key];
        }
    });
    
    // Atualizar estado dos botões de idioma
    document.getElementById("pt-br").setAttribute("aria-pressed", lang === "pt-br");
    document.getElementById("en-us").setAttribute("aria-pressed", lang === "en-us");
    
    // Atualizar texto do indicador de scroll
    const scrollText = document.querySelector('.scroll-indicator p');
    if (scrollText) {
        scrollText.textContent = translations[lang].scrollText;
    }
    
    // Armazenar preferência do usuário
    localStorage.setItem("preferredLanguage", lang);
    
    // Anunciar mudança de idioma para leitores de tela
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('class', 'sr-only');
    announcement.textContent = lang === 'pt-br' ? 'Idioma alterado para Português' : 'Language changed to English';
    document.body.appendChild(announcement);
    
    // Remover o anúncio após ser lido
    setTimeout(() => {
        document.body.removeChild(announcement);
    }, 3000);
}

// Inicialização quando o DOM estiver carregado
document.addEventListener("DOMContentLoaded", () => {
    // Configurar funcionalidades básicas
    ajustarEspacamentoHeader();
    setupHeaderScroll();
    setupMobileMenu();
    setupSmoothScroll();
    
    // Configurar animações e efeitos
    setupScrollAnimations();
    setupParallaxEffect();
    setupProjectHoverEffects();
    setupTypingAnimation();
    
    // Configurar acessibilidade
    setupKeyboardAccessibility();
    setupReducedMotion();
    setupDarkMode();
    
    // Configurar idioma
    const savedLanguage = localStorage.getItem("preferredLanguage") || "pt-br";
    setLanguage(savedLanguage);
    
    // Adicionar eventos de clique nas bandeiras
    document.getElementById("pt-br").addEventListener("click", () => setLanguage("pt-br"));
    document.getElementById("en-us").addEventListener("click", () => setLanguage("en-us"));
    
    // Atualizar navegação ativa durante o scroll
    window.addEventListener('scroll', updateActiveNavigation);
    updateActiveNavigation(); // Executar uma vez no carregamento
    
    // Adicionar evento de redimensionamento
    window.addEventListener("resize", () => {
        ajustarEspacamentoHeader();
    });
});

// Adicionar classe para animações quando a página estiver totalmente carregada
window.addEventListener('load', () => {
    document.body.classList.add('page-loaded');
});

document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.see-more-link').forEach(function(link) {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const desc = link.closest('.project-desc');
            const full = desc.querySelector('.project-desc-full');
            const short = desc.querySelector('[data-key="project1Description"]');
            if (full.style.display === 'none' || !full.style.display) {
                full.style.display = 'inline';
                link.textContent = link.dataset.less || 'Ver menos';
                short.insertAdjacentText('beforeend', ' ');
            } else {
                full.style.display = 'none';
                link.textContent = link.dataset.more || 'Ver mais';
            }
        });
    });
});
