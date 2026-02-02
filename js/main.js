// Main JavaScript
document.addEventListener('DOMContentLoaded', () => {
  // Smooth scrolling
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // Sticky menu
  const menu = document.getElementById('menu');
  if (menu) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 100) {
        menu.classList.add('sticky');
      } else {
        menu.classList.remove('sticky');
      }
    });
  }
});
