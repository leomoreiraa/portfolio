// ========== PROJECT DATA ==========
const projects = {
    programming: [
        { 
            title: "Orbitir", 
            description: "Orbitir is a kanban application", 
            fullDescription: "A comprehensive kanban board application built with Spring Boot and Angular. Features real-time collaboration, task management, and team coordination tools.",
            tags: ["Spring Boot", "Angular", "PostgreSQL", "WebSocket"], 
            link: "projects/orbitir.html",
            image: "assets/images/proj4.png"
        },
        { 
            title: "Luna", 
            description: "Luna is a economy tracker for your personal life", 
            fullDescription: "A privacy-focused personal finance tracker built with React and TypeScript. Helps you manage your budget, track expenses, and visualize your financial health.",
            tags: ["React", "TypeScript", "Vite", "Chart.js"], 
            link: "projects/luna.html",
            image: "assets/images/proj5.png"
        }
    ],
    science: [],
    references: []
};

// Carousel functionality
document.addEventListener('DOMContentLoaded', () => {
  // Function to create a project card for carousel
  function createProjectCard(project) {
    const slide = document.createElement('div');
    slide.className = 'carousel-slide';
    
    const card = document.createElement('a');
    card.href = project.link;
    card.className = 'project-card clickable';
    
    card.innerHTML = `
        <h4>${project.title}</h4>
        <p>${project.description}</p>
    `;
    
    slide.appendChild(card);
    return slide;
  }
  
  // Function to create a project card for grid
  function createGridProjectCard(project) {
    const article = document.createElement('article');
    article.className = 'project-item';
    
    const tagsHTML = project.tags.map(tag => 
        `<span class="project-tag">${tag}</span>`
    ).join('');
    
    article.innerHTML = `
        <div class="project-image" style="background: linear-gradient(135deg, rgba(85, 107, 47, 0.8), rgba(107, 130, 57, 0.8)), url('${project.image}') center/cover;">
            <div class="project-overlay">
                <span>Ver Projeto</span>
            </div>
        </div>
        <div class="project-info">
            <h3>${project.title}</h3>
            <p>${project.fullDescription || project.description}</p>
            <div class="project-tags">
                ${tagsHTML}
            </div>
        </div>
    `;
    
    article.addEventListener('click', () => {
        window.location.href = project.link;
    });
    
    article.style.cursor = 'pointer';
    
    return article;
  }
  
  // Populate carousels
  const carouselData = {
    'programming': projects.programming,
    'science': projects.science,
    'references': projects.references,
    'all': [...projects.programming, ...projects.science, ...projects.references]
  };
  
  Object.keys(carouselData).forEach(carouselId => {
    const track = document.querySelector(`#carousel-${carouselId} .carousel-track`);
    const carouselProjects = carouselData[carouselId];
    
    if (track && carouselProjects.length > 0) {
      carouselProjects.forEach(project => {
        track.appendChild(createProjectCard(project));
      });
    }
  });
  
  // Populate projects grid section
  const projectsGrid = document.getElementById('projects-grid');
  if (projectsGrid) {
    const allProjects = [...projects.programming, ...projects.science, ...projects.references];
    allProjects.forEach(project => {
      projectsGrid.appendChild(createGridProjectCard(project));
    });
  }
  
  // Setup carousel navigation
  const carousels = ['programming', 'science', 'references', 'all'];
  
  carousels.forEach(carouselId => {
    const carousel = document.getElementById(`carousel-${carouselId}`);
    if (!carousel) return;
    
    const track = carousel.querySelector('.carousel-track');
    const slides = track.querySelectorAll('.carousel-slide');
    const prevBtn = carousel.parentElement.querySelector(`.carousel-btn.prev[data-carousel="${carouselId}"]`);
    const nextBtn = carousel.parentElement.querySelector(`.carousel-btn.next[data-carousel="${carouselId}"]`);
    
    if (slides.length === 0) return;
    
    let currentIndex = 0;
    let autoplayInterval;
    
    function updateCarousel() {
      const slideWidth = slides[0].offsetWidth;
      track.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
    }
    
    function nextSlide() {
      if (currentIndex < slides.length - 1) {
        currentIndex++;
      } else {
        currentIndex = 0; // Loop back to start
      }
      updateCarousel();
    }
    
    function prevSlide() {
      if (currentIndex > 0) {
        currentIndex--;
      } else {
        currentIndex = slides.length - 1; // Loop to end
      }
      updateCarousel();
    }
    
    function startAutoplay() {
      autoplayInterval = setInterval(nextSlide, 5000); // Change slide every 5 seconds
    }
    
    function stopAutoplay() {
      clearInterval(autoplayInterval);
    }
    
    // Start autoplay
    if (slides.length > 1) {
      startAutoplay();
    }
    
    // Pause on hover
    carousel.addEventListener('mouseenter', stopAutoplay);
    carousel.addEventListener('mouseleave', () => {
      if (slides.length > 1) startAutoplay();
    });
    
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        stopAutoplay();
        prevSlide();
        if (slides.length > 1) startAutoplay();
      });
    }
    
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        stopAutoplay();
        nextSlide();
        if (slides.length > 1) startAutoplay();
      });
    }
  });
});
