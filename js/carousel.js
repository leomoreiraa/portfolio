// ========== CAROUSEL ==========

const carouselStates = {
    programming: { current: 0, total: 0 },
    science: { current: 0, total: 0 },
    references: { current: 0, total: 0 },
    all: { current: 0, total: 0 }
};

function loadCarousels() {
    loadCarousel('programming', projects.programming);
    loadCarousel('science', projects.science);
    loadCarousel('references', projects.references);
    
    // Load unified mobile carousel with all projects
    const allProjects = [
        ...projects.programming,
        ...projects.science,
        ...projects.references
    ];
    loadCarousel('all', allProjects);
}

function loadCarousel(name, items) {
    const track = document.querySelector(`#carousel-${name} .carousel-track`);
    const dotsContainer = document.getElementById(`dots-${name}`);
    
    if (!track || !dotsContainer) return;
    
    // Clear existing content
    track.innerHTML = '';
    dotsContainer.innerHTML = '';
    
    // If no projects, show placeholder
    if (items.length === 0) {
        const t = translations[currentLang].carousel;
        track.innerHTML = `
            <div class="carousel-slide">
                <div class="project-card empty-card">
                    <h4>${t.comingSoon}</h4>
                    <p>${t.addProjects.replace('{name}', name)}</p>
                </div>
            </div>
        `;
        carouselStates[name].total = 1;
        createDot(dotsContainer, name, 0, true);
        return;
    }
    
    // Add project slides
    items.forEach((item, index) => {
        const isReference = name === 'references';
        const slide = document.createElement('div');
        slide.className = 'carousel-slide';
        const hasLink = item.link && item.link !== '#';
        const isExternal = hasLink && item.link.startsWith('http');
        slide.innerHTML = `
            <${hasLink ? `a href="${item.link}"${isExternal ? ' target="_blank" rel="noopener noreferrer"' : ''}` : 'div'} class="project-card ${isReference ? 'reference-card' : ''} ${hasLink ? 'clickable' : ''}">
                <h4>${item.title}</h4>
                <p>${item.description}</p>
                <div class="tags">
                    ${item.tags.map(tag => `<span class="tech-tag">${tag}</span>`).join('')}
                </div>
            </${hasLink ? 'a' : 'div'}>
        `;
        track.appendChild(slide);
        createDot(dotsContainer, name, index, index === 0);
    });
    
    carouselStates[name].total = items.length;
    carouselStates[name].current = 0;
}

function createDot(container, carouselName, index, isActive) {
    const dot = document.createElement('div');
    dot.className = `carousel-dot ${isActive ? 'active' : ''}`;
    dot.addEventListener('click', () => goToSlide(carouselName, index));
    container.appendChild(dot);
}

function setupCarouselButtons() {
    document.querySelectorAll('.carousel-btn.prev').forEach(btn => {
        btn.addEventListener('click', () => prevSlide(btn.dataset.carousel));
    });
    
    document.querySelectorAll('.carousel-btn.next').forEach(btn => {
        btn.addEventListener('click', () => nextSlide(btn.dataset.carousel));
    });
}

function updateCarousel(name) {
    const track = document.querySelector(`#carousel-${name} .carousel-track`);
    const dots = document.querySelectorAll(`#dots-${name} .carousel-dot`);
    const state = carouselStates[name];
    
    if (track) {
        track.style.transform = `translateX(-${state.current * 100}%)`;
    }
    
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === state.current);
    });
}

function nextSlide(name) {
    const state = carouselStates[name];
    if (state.total <= 1) return;
    state.current = (state.current + 1) % state.total;
    updateCarousel(name);
}

function prevSlide(name) {
    const state = carouselStates[name];
    if (state.total <= 1) return;
    state.current = (state.current - 1 + state.total) % state.total;
    updateCarousel(name);
}

function goToSlide(name, index) {
    carouselStates[name].current = index;
    updateCarousel(name);
}

function rotateCarousel(name) {
    const state = carouselStates[name];
    if (state.total > 1) {
        nextSlide(name);
    }
}
