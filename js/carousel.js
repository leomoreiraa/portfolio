// ========== PROJECT DATA ==========
const projects = {
    programming: [
        { title: "Orbitir", description: "Orbitir is a kanban application", tags: ["Spring Boot", "Angular", "PostgreSQL"], link: "projects/orbitir.html" },
        { title: "Luna", description: "Luna is a economy tracker for your personal life", tags: ["React", "TypeScript", "Vite"], link: "projects/luna.html" }
    ],
    science: [],
    references: []
};

// Carousel functionality
document.addEventListener('DOMContentLoaded', () => {
  // Function to create a project card
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
    
    function updateCarousel() {
      const slideWidth = slides[0].offsetWidth;
      track.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
    }
    
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
          currentIndex--;
          updateCarousel();
        }
      });
    }
    
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        if (currentIndex < slides.length - 1) {
          currentIndex++;
          updateCarousel();
        }
      });
    }
  });
});
