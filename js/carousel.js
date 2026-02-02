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
    
    const tagsHTML = project.tags.map(tag => 
        `<span class="tech-tag">${tag}</span>`
    ).join('');
    
    card.innerHTML = `
        <h4>${project.title}</h4>
        <p>${project.description}</p>
        <div class="project-tags">${tagsHTML}</div>
    `;
    
    slide.appendChild(card);
    return slide;
  }
  
  // Populate programming carousel
  const programmingTrack = document.querySelector('#carousel-programming .carousel-track');
  if (programmingTrack && projects.programming.length > 0) {
      projects.programming.forEach(project => {
          programmingTrack.appendChild(createProjectCard(project));
      });
  }
  
  // Populate science carousel
  const scienceTrack = document.querySelector('#carousel-science .carousel-track');
  if (scienceTrack && projects.science.length > 0) {
      projects.science.forEach(project => {
          scienceTrack.appendChild(createProjectCard(project));
      });
  }
  
  // Populate references carousel
  const referencesTrack = document.querySelector('#carousel-references .carousel-track');
  if (referencesTrack && projects.references.length > 0) {
      projects.references.forEach(project => {
          referencesTrack.appendChild(createProjectCard(project));
      });
  }
  
  // Populate "all" carousel (mobile) with all projects
  const allTrack = document.querySelector('#carousel-all .carousel-track');
  if (allTrack) {
      const allProjects = [
          ...projects.programming,
          ...projects.science,
          ...projects.references
      ];
      
      allProjects.forEach(project => {
          allTrack.appendChild(createProjectCard(project));
      });
  }
  
  // Setup carousel navigation
  const carousels = ['programming', 'science', 'references', 'all'];
  
  carousels.forEach(carouselId => {
    const carousel = document.getElementById(`carousel-${carouselId}`);
    if (!carousel) return;
    
    const track = carousel.querySelector('.carousel-track');
    const prevBtn = carousel.parentElement.querySelector(`.carousel-btn.prev[data-carousel="${carouselId}"]`);
    const nextBtn = carousel.parentElement.querySelector(`.carousel-btn.next[data-carousel="${carouselId}"]`);
    
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        track.scrollBy({ left: -300, behavior: 'smooth' });
      });
    }
    
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        track.scrollBy({ left: 300, behavior: 'smooth' });
      });
    }
  });
});
