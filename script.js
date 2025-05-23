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

// Traduções
const translations = {
    "pt-br": {
        title: "Dev.Leo",
        menuToggle: "☰",
        home: "Início",
        about: "Sobre",
        career: "Carreira",
        projects: "Projetos",
        contact: "Contato",
        greeting: "Olá, eu sou o <span>Leo</span>",
        description: "Desenvolvedor Full Stack | C# & Java | Professor de robótica e programação",
        viewProjects: "Ver Projetos",
        aboutMe: "Sobre Mim",
        aboutText: "Olá! Sou o Leo, tenho 22 anos e sou estudante de Física e Engenharia da Computação. Atuo como professor de Robótica e Programação, trabalhando com públicos diversos — desde crianças que estão dando os primeiros passos na tecnologia até adultos que buscam se aprofundar em análise de dados e deep learning.",
        careerTitle: "Minha Trajetória Profissional",
        career1Title: "Estagiário de Front-End",
        career1Company: "T&T Soluções — Estágio não remunerado<br>Duração: 2 meses",
        career1Description: "Atuei no desenvolvimento front-end de uma plataforma de recrutamento de estagiários, utilizando Angular 5 e Ionic. Trabalhei com prototipagem de interfaces no Figma, contribuindo para a criação de uma experiência intuitiva e responsiva para os usuários. Durante esse período, pude aprimorar minhas habilidades em desenvolvimento web e colaborar em um ambiente de trabalho voltado para soluções educacionais e corporativas.",
        career2Title: "Auxiliar Geral",
        career2Company: "Seu Lugar Telecom<br>2023 – 2024",
        career2Description: "Durante meu tempo na empresa, atuei em diversas frentes, desde o atendimento ao cliente até a infraestrutura técnica. Como a empresa estava em fase inicial, fui responsável por configurar e integrar os servidores, além de desenvolver aplicações para os clientes e realizar integrações de APIs com a plataforma. Todo o desenvolvimento foi feito com foco em eficiência e estabilidade, utilizando Java como linguagem principal. Essa experiência me proporcionou uma visão ampla de operação e desenvolvimento em startups de tecnologia.",
        career3Title: "Instrutor de Robótica e Programação",
        career3Company: "Ctrl+Play Limeira<br>2024 – Atual",
        career3Description: "Atuo como professor de Robótica e Programação, lecionando para alunos de diferentes idades, desde crianças até adultos. As aulas são adaptadas conforme o nível e faixa etária, abrangendo desde introdução à lógica e programação para os mais novos, até desenvolvimento de jogos com GameMaker, Godot e Unity para pré-adolescentes. Com os adolescentes, o foco é o desenvolvimento web com React.js e programação em Python, enquanto os alunos adultos aprendem análise de dados e conceitos iniciais de inteligência artificial, utilizando ferramentas como Pandas e PyTorch. A experiência tem me permitido explorar diferentes abordagens de ensino e acompanhar de perto a evolução técnica dos alunos.",
        projectsTitle: "Projetos em Destaque",
        project1Title: "Sistema de Gestão Educacional",
        project1Description: "Plataforma completa para gerenciamento de cursos, alunos e professores, com dashboard interativo e relatórios personalizados.",
        project1Link: "Ver detalhes",
        project2Title: "App de Monitoramento Ambiental",
        project2Description: "Aplicativo móvel que integra sensores IoT para monitoramento de qualidade do ar e água em tempo real.",
        project2Link: "Ver detalhes",
        contactTitle: "Vamos Conversar",
        contactText: 'Entre em contato pelo e-mail: <a href="mailto:leonardo.moreira6854@gmail.com">leonardo.moreira6854@gmail.com</a>',
        footerText: "&copy; 2025 Dev.Leo. Todos os direitos reservados.",
        scrollText: "Role para baixo"
    },
    "en-us": {
        title: "Dev.Leo",
        menuToggle: "☰",
        home: "Home",
        about: "About",
        career: "Career",
        projects: "Projects",
        contact: "Contact",
        greeting: "Hello, I am <span>Leo</span>",
        description: "Full Stack Developer | C# & Java | Robotics and Programming Teacher",
        viewProjects: "View Projects",
        aboutMe: "About Me",
        aboutText: "Hello! I am Leo, 22 years old, and a student of Physics and Computer Engineering. I work as a Robotics and Programming teacher, working with diverse audiences — from children taking their first steps in technology to adults seeking to deepen their knowledge in data analysis and deep learning.",
        careerTitle: "My Professional Journey",
        career1Title: "Front-End Intern",
        career1Company: "T&T Solutions — Unpaid Internship<br>Duration: 2 months",
        career1Description: "I worked on front-end development for a recruitment platform for interns, using Angular 5 and Ionic. I worked with interface prototyping in Figma, contributing to the creation of an intuitive and responsive user experience. During this period, I was able to improve my web development skills and collaborate in a work environment focused on educational and corporate solutions.",
        career2Title: "General Assistant",
        career2Company: "Seu Lugar Telecom<br>2023 – 2024",
        career2Description: "During my time at the company, I worked in various areas, from customer service to technical infrastructure. As the company was in its early stages, I was responsible for configuring and integrating servers, as well as developing applications for clients and performing API integrations with the platform. All development was done with a focus on efficiency and stability, using Java as the main language. This experience gave me a broad view of operations and development in technology startups.",
        career3Title: "Robotics and Programming Instructor",
        career3Company: "Ctrl+Play Limeira<br>2024 – Present",
        career3Description: "I work as a Robotics and Programming teacher, teaching students of different ages, from children to adults. The classes are adapted according to the level and age group, ranging from an introduction to logic and programming for younger students to game development with GameMaker, Godot, and Unity for pre-teens. With teenagers, the focus is on web development with React.js and programming in Python, while adult students learn data analysis and introductory artificial intelligence concepts using tools like Pandas and PyTorch. This experience has allowed me to explore different teaching approaches and closely follow the technical evolution of my students.",
        projectsTitle: "Featured Projects",
        project1Title: "Educational Management System",
        project1Description: "Complete platform for managing courses, students, and teachers, with interactive dashboard and customized reports.",
        project1Link: "View details",
        project2Title: "Environmental Monitoring App",
        project2Description: "Mobile application that integrates IoT sensors for real-time air and water quality monitoring.",
        project2Link: "View details",
        contactTitle: "Let's Talk",
        contactText: 'Contact me via email: <a href="mailto:leonardo.moreira6854@gmail.com">leonardo.moreira6854@gmail.com</a>',
        footerText: "&copy; 2025 Dev.Leo. All rights reserved.",
        scrollText: "Scroll down"
    }
};

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
