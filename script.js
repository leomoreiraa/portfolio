// Menu toggle para mobile
const menuToggle = document.getElementById("menu-toggle");
const navLinks = document.getElementById("nav-links");

// Scroll da seção home para mudar cor do header
const header = document.querySelector("header");
const home = document.querySelector("#home");

// Função para verificar se estamos em modo mobile
function isMobile() {
    return window.innerWidth <= 768;
}

// Define padding-top baseado na altura da navbar
function ajustarEspacamentoHeader() {
    const headerHeight = header.offsetHeight;
    home.style.paddingTop = `${headerHeight}px`;
}

// Ajusta o padding quando a página carrega e quando redimensiona
window.addEventListener("DOMContentLoaded", () => {
    ajustarEspacamentoHeader();
    updateLineDirection(); // adiciona aqui também!
});
window.addEventListener("resize", () => {
    ajustarEspacamentoHeader();
    updateLineDirection(); // adiciona aqui também!
});

// Observer para alterar a cor do header com scroll (apenas em desktop)
const observer = new IntersectionObserver(
    ([entry]) => {
        if (!isMobile()) {
            if (entry.isIntersecting) {
                header.classList.remove("scrolled");
            } else {
                header.classList.add("scrolled");
            }
        } else {
            header.classList.add("scrolled"); // força cor escura no mobile
        }
    },
    {
        root: null,
        threshold: 0,
    }
);

observer.observe(home);

// 👉 Atualiza a linha: vertical no desktop, horizontal no mobile
function updateLineDirection() {
    const divider = document.getElementById("divider");
    if (!divider) return; // evita erro se o elemento não existir

    if (isMobile()) {
        divider.classList.remove("vertical");
        divider.classList.add("horizontal");
    } else {
        divider.classList.remove("horizontal");
        divider.classList.add("vertical");
    }
}

document.addEventListener("DOMContentLoaded", () => {
  const observers = document.querySelectorAll('.fade-in');

  const fadeInOnScroll = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
          if (entry.isIntersecting) {
              entry.target.classList.add('visible');
              observer.unobserve(entry.target);
          }
      });
  }, {
      threshold: 0.1
  });

  observers.forEach(section => {
      fadeInOnScroll.observe(section);
  });

  // Menu mobile toggle (caso você ainda não tenha isso)
  const toggle = document.getElementById("menu-toggle");
  const navLinks = document.getElementById("nav-links");
  toggle.addEventListener("click", () => {
      navLinks.classList.toggle("active");
  });

  // Header scroll background
  const header = document.getElementById("header");
  window.addEventListener("scroll", () => {
      header.classList.toggle("scrolled", window.scrollY > 50);
  });
});

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
        aboutText: "Olá! Sou o Leo, tenho 22 anos e sou estudante de Física e Engenharia da Computação. Atuo como professor de Robótica e Programação, trabalhando com públicos diversos — desde crianças que estão dando os primeiros passos na tecnologia até adultos que buscam se aprofundar em análise de dados e deep learning. Minhas principais linguagens de atuação são Java e C#, mas também leciono C++, GML, GDScript, JavaScript e Python, além de trabalhar com bibliotecas e frameworks como Pandas e React.js. Sou apaixonado por Física e Programação, e meu grande objetivo é unir essas duas áreas para desenvolver soluções inovadoras no futuro. Gosto de tornar o conhecimento acessível, despertando a curiosidade e a criatividade em cada projeto e aula que realizo.",
        careerTitle: "Carreira",
        career1Title: "Estagiário de Front-End",
        career1Company: "T&T Soluções — Estágio não remunerado<br>Duração: 2 meses",
        career1Description: "Atuei no desenvolvimento front-end de uma plataforma de recrutamento de estagiários, utilizando Angular 5 e Ionic. Trabalhei com prototipagem de interfaces no Figma, contribuindo para a criação de uma experiência intuitiva e responsiva para os usuários. Durante esse período, pude aprimorar minhas habilidades em desenvolvimento web e colaborar em um ambiente de trabalho voltado para soluções educacionais e corporativas.",
        career2Title: "Auxiliar Geral",
        career2Company: "Seu Lugar Telecom<br>2023 – 2024",
        career2Description: "Durante meu tempo na empresa, atuei em diversas frentes, desde o atendimento ao cliente até a infraestrutura técnica. Como a empresa estava em fase inicial, fui responsável por configurar e integrar os servidores, além de desenvolver aplicações para os clientes e realizar integrações de APIs com a plataforma. Todo o desenvolvimento foi feito com foco em eficiência e estabilidade, utilizando Java como linguagem principal. Essa experiência me proporcionou uma visão ampla de operação e desenvolvimento em startups de tecnologia.",
        career3Title: "Instrutor de Robótica e Programação",
        career3Company: "Ctrl+Play Limeira<br>2024 – Atual",
        career3Description: "Atuo como professor de Robótica e Programação, lecionando para alunos de diferentes idades, desde crianças até adultos. As aulas são adaptadas conforme o nível e faixa etária, abrangendo desde introdução à lógica e programação para os mais novos, até desenvolvimento de jogos com GameMaker, Godot e Unity para pré-adolescentes. Com os adolescentes, o foco é o desenvolvimento web com React.js e programação em Python, enquanto os alunos adultos aprendem análise de dados e conceitos iniciais de inteligência artificial, utilizando ferramentas como Pandas e PyTorch. A experiência tem me permitido explorar diferentes abordagens de ensino e acompanhar de perto a evolução técnica dos alunos.",
        projectsTitle: "Projetos",
        project1Title: "Projeto 1",
        project1Description: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
        project1Link: "Ver mais",
        project2Title: "Projeto 2",
        project2Description: "Lorem ipsum, dolor sit amet consectetur adipisicing elit.",
        project2Link: "Ver mais",
        contactTitle: "Contato",
        contactText: 'Entre em contato pelo e-mail: <a href="mailto:leonardo.moreira6854@gmail.com">leonardo.moreira6854@gmail.com</a>',
        footerText: "&copy; 2025 Dev.Leo. Todos os direitos reservados."
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
        aboutText: "Hello! I am Leo, 22 years old, and a student of Physics and Computer Engineering. I work as a Robotics and Programming teacher, working with diverse audiences — from children taking their first steps in technology to adults seeking to deepen their knowledge in data analysis and deep learning. My main programming languages are Java and C#, but I also teach C++, GML, GDScript, JavaScript, and Python, as well as work with libraries and frameworks like Pandas and React.js. I am passionate about Physics and Programming, and my ultimate goal is to unite these two fields to develop innovative solutions in the future. I enjoy making knowledge accessible, sparking curiosity and creativity in every project and class I undertake.",
        careerTitle: "Career",
        career1Title: "Front-End Intern",
        career1Company: "T&T Solutions — Unpaid Internship<br>Duration: 2 months",
        career1Description: "I worked on front-end development for a recruitment platform for interns, using Angular 5 and Ionic. I worked with interface prototyping in Figma, contributing to the creation of an intuitive and responsive user experience. During this period, I was able to improve my web development skills and collaborate in a work environment focused on educational and corporate solutions.",
        career2Title: "General Assistant",
        career2Company: "Seu Lugar Telecom<br>2023 – 2024",
        career2Description: "During my time at the company, I worked in various areas, from customer service to technical infrastructure. As the company was in its early stages, I was responsible for configuring and integrating servers, as well as developing applications for clients and performing API integrations with the platform. All development was done with a focus on efficiency and stability, using Java as the main language. This experience gave me a broad view of operations and development in technology startups.",
        career3Title: "Robotics and Programming Instructor",
        career3Company: "Ctrl+Play Limeira<br>2024 – Present",
        career3Description: "I work as a Robotics and Programming teacher, teaching students of different ages, from children to adults. The classes are adapted according to the level and age group, ranging from an introduction to logic and programming for younger students to game development with GameMaker, Godot, and Unity for pre-teens. With teenagers, the focus is on web development with React.js and programming in Python, while adult students learn data analysis and introductory artificial intelligence concepts using tools like Pandas and PyTorch. This experience has allowed me to explore different teaching approaches and closely follow the technical evolution of my students.",
        projectsTitle: "Projects",
        project1Title: "Project 1",
        project1Description: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
        project1Link: "Learn more",
        project2Title: "Project 2",
        project2Description: "Lorem ipsum, dolor sit amet consectetur adipisicing elit.",
        project2Link: "Learn more",
        contactTitle: "Contact",
        contactText: 'Contact-me via email: <a href="mailto:leonardo.moreira6854@gmail.com">leonardo.moreira6854@gmail.com</a>',
        footerText: "&copy; 2025 Dev.Leo. All rights reserved."
    }
};

function setLanguage(lang) {
    document.querySelectorAll("[data-key]").forEach((element) => {
        const key = element.getAttribute("data-key");
        if (translations[lang][key]) {
            element.innerHTML = translations[lang][key];
        } else {
            console.warn(`Chave "${key}" não encontrada para o idioma "${lang}"`);
        }
    });

    // Atualiza textos fora da navbar
    document.querySelector(".text-wrapper h2").innerHTML = translations[lang].greeting;
    document.querySelector(".text-wrapper p").innerHTML = translations[lang].description;
    document.querySelector(".btn").innerHTML = translations[lang].viewProjects;
    document.querySelector("#about h2").innerHTML = translations[lang].aboutMe;
    document.querySelector("#contact p").innerHTML = translations[lang].contactText;
}

// Adiciona eventos de clique nas bandeiras
document.getElementById("pt-br").addEventListener("click", () => setLanguage("pt-br"));
document.getElementById("en-us").addEventListener("click", () => setLanguage("en-us"));

// Define o idioma padrão
document.addEventListener("DOMContentLoaded", () => setLanguage("pt-br"));
