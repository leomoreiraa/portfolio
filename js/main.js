// ========== MAIN - Initialization ==========

document.addEventListener('DOMContentLoaded', function() {
    // Initialize carousels
    loadCarousels();
    setupCarouselButtons();
    
    // Initialize language switcher
    setupLanguageSwitcher();
    
    // Load projects grid
    loadProjectsGrid();
    
    // Auto-rotate carousels
    setInterval(() => rotateCarousel('programming'), 4000);
    setInterval(() => rotateCarousel('science'), 5000);
    setInterval(() => rotateCarousel('references'), 6000);
    setInterval(() => rotateCarousel('all'), 4500);
    
    // Setup smooth scroll
    setupSmoothScroll();
    
    // Setup menu scroll effect
    setupMenuScrollEffect();
});

// ========== PROJECTS GRID ==========
function loadProjectsGrid() {
    const grid = document.getElementById('projects-grid');
    if (!grid) return;
    
    // Combine all projects from programming category
    const allProjects = projects.programming || [];
    
    if (allProjects.length === 0) {
        grid.innerHTML = '<p class="no-projects">No projects available yet.</p>';
        return;
    }
    
    grid.innerHTML = allProjects.map(project => `
        <a href="${project.link}" class="project-item" ${project.link.startsWith('http') ? 'target="_blank" rel="noopener noreferrer"' : ''}>
            <div class="project-image">
                <div class="project-overlay">
                    <span>View Project</span>
                </div>
            </div>
            <div class="project-info">
                <h3>${project.title}</h3>
                <p>${project.description}</p>
                <div class="project-tags">
                    ${project.tags.map(tag => `<span class="project-tag">${tag}</span>`).join('')}
                </div>
            </div>
        </a>
    `).join('');
}

// ========== SMOOTH SCROLL ==========
function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ========== MENU SCROLL EFFECT ==========
function setupMenuScrollEffect() {
    window.addEventListener('scroll', () => {
        const menu = document.getElementById('menu');
        if (window.pageYOffset > 100) {
            menu.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            menu.style.boxShadow = 'none';
        }
    });
}
