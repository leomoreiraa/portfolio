document.addEventListener("DOMContentLoaded", () => {
  const allProjects = Object.values(projects).flat().sort((a, b) =>
    b.published.localeCompare(a.published));

  function translatedElement(tag, key) {
    const element = document.createElement(tag);
    element.dataset.i18n = key;
    element.textContent = getNestedValue(getTranslation("en"), key) || "";
    return element;
  }

  function createProjectCard(project) {
    const slide = document.createElement("div");
    slide.className = "carousel-slide";
    slide.setAttribute("role", "group");
    slide.setAttribute("aria-label", project.title);

    const card = document.createElement("a");
    card.href = project.link;
    card.className = "project-card clickable";

    const title = document.createElement("h4");
    title.textContent = project.title;
    card.append(
      title,
      translatedElement("p", `projects.${project.id}.description`),
    );
    slide.append(card);
    return slide;
  }

  function createGridProjectCard(project) {
    const card = document.createElement("a");
    card.className = "project-item";
    card.href = project.link;

    const image = document.createElement("div");
    image.className = `project-image ${project.id}-theme`;
    const label = document.createElement("span");
    label.className = "project-image-title";
    label.textContent = project.title;
    label.setAttribute("aria-hidden", "true");
    const overlay = document.createElement("div");
    overlay.className = "project-overlay";
    overlay.append(translatedElement("span", "projects.view"));
    image.append(label, overlay);

    const info = document.createElement("div");
    info.className = "project-info";
    const title = document.createElement("h3");
    title.textContent = project.title;
    const tags = document.createElement("div");
    tags.className = "project-tags";
    project.tags.forEach((tag) => {
      const badge = document.createElement("span");
      badge.className = "project-tag";
      badge.textContent = tag;
      tags.append(badge);
    });
    info.append(
      title,
      translatedElement("p", `projects.${project.id}.fullDescription`),
      tags,
    );
    card.append(image, info);
    return card;
  }

  const projectsGrid = document.getElementById("projects-grid");
  if (projectsGrid) {
    if (allProjects.length) {
      projectsGrid.replaceChildren(...allProjects.map(createGridProjectCard));
    } else {
      const empty = translatedElement("p", "carousel.empty");
      empty.className = "no-projects";
      projectsGrid.replaceChildren(empty);
    }
  }

  const carouselData = { ...projects, all: allProjects };
  Object.entries(carouselData).forEach(([id, items]) => {
    const carousel = document.getElementById(`carousel-${id}`);
    if (!carousel) return;

    const track = carousel.querySelector(".carousel-track");
    const nav = carousel.querySelector(".carousel-nav");
    const dotsContainer = carousel.querySelector(".carousel-dots");
    const previous = carousel.querySelector(".prev");
    const next = carousel.querySelector(".next");
    if (!track || !nav || !dotsContainer || !previous || !next) return;

    track.id = `track-${id}`;
    track.setAttribute("aria-live", "polite");
    nav.hidden = items.length < 2;
    dotsContainer.replaceChildren();

    if (!items.length) {
      const empty = translatedElement("p", "carousel.empty");
      empty.className = "project-card empty-card";
      track.replaceChildren(empty);
      return;
    }

    const slides = items.map(createProjectCard);
    track.replaceChildren(...slides);
    let currentIndex = 0;
    const dots = items.map((project, index) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "carousel-dot";
      dot.setAttribute("aria-label", project.title);
      dot.setAttribute("aria-controls", track.id);
      dot.addEventListener("click", () => showSlide(index));
      dotsContainer.append(dot);
      return dot;
    });

    function showSlide(index) {
      currentIndex = (index + slides.length) % slides.length;
      // Percentages stay aligned when the viewport or visible carousel changes.
      track.style.transform = `translateX(-${currentIndex * 100}%)`;
      slides.forEach((slide, slideIndex) => {
        const active = slideIndex === currentIndex;
        slide.inert = !active;
        slide.setAttribute("aria-hidden", String(!active));
        dots[slideIndex].classList.toggle("active", active);
        dots[slideIndex].setAttribute("aria-current", String(active));
      });
    }

    [previous, next].forEach((button) => {
      button.type = "button";
      button.setAttribute("aria-controls", track.id);
    });
    previous.dataset.i18nAriaLabel = "carousel.previous";
    next.dataset.i18nAriaLabel = "carousel.next";
    previous.addEventListener("click", () => showSlide(currentIndex - 1));
    next.addEventListener("click", () => showSlide(currentIndex + 1));

    carousel.addEventListener("keydown", (event) => {
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
      event.preventDefault();
      const focusWasInSlide = track.contains(document.activeElement);
      showSlide(currentIndex + (event.key === "ArrowRight" ? 1 : -1));
      if (focusWasInSlide) slides[currentIndex].querySelector("a").focus();
    });

    showSlide(0);
  });
});
