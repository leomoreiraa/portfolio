document.addEventListener("DOMContentLoaded", () => {
  const menu = document.getElementById("menu");
  if (!menu) return;

  // Native anchor navigation preserves the URL, history and keyboard behavior.
  function updateMenuHeight() {
    document.documentElement.style.setProperty(
      "--menu-height",
      `${menu.offsetHeight}px`,
    );
  }

  function updateStickyMenu() {
    menu.classList.toggle("sticky", window.scrollY > 100);
  }

  updateMenuHeight();
  updateStickyMenu();
  new ResizeObserver(updateMenuHeight).observe(menu);
  window.addEventListener("scroll", updateStickyMenu, { passive: true });
});
