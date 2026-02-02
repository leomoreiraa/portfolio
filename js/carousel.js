// Carousel functionality
document.addEventListener('DOMContentLoaded', () => {
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
