 
const defaultTheme = 'auto';
let currentTheme = defaultTheme;

document.addEventListener('DOMContentLoaded', initThemeSwitcher);

function initThemeSwitcher() {
  const savedTheme = localStorage.getItem('theme');
  currentTheme = savedTheme || defaultTheme;
  applyTheme(currentTheme);
  const themeToggle = document.querySelector('.theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
  }
  const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
  prefersDarkScheme.addEventListener('change', handleSystemThemeChange);
}

function applyTheme(theme) {
  let isDarkTheme;
  if (theme === 'auto') {
    isDarkTheme = window.matchMedia('(prefers-color-scheme: dark)').matches;
  } else {
    isDarkTheme = theme === 'dark';
  }
  if (isDarkTheme) {
    document.documentElement.setAttribute('data-theme', 'dark');
    updateThemeToggleButton('dark');
  } else {
    document.documentElement.setAttribute('data-theme', 'light');
    updateThemeToggleButton('light');
  }
  if (window.blackHoleAnimation) {
    window.blackHoleAnimation.updateTheme(isDarkTheme);
  }
  const event = new CustomEvent('themeChanged', { 
    detail: { 
      theme: isDarkTheme ? 'dark' : 'light',
      source: theme === 'auto' ? 'system' : 'user'
    } 
  });
  document.dispatchEvent(event);
}

function toggleTheme() {
  const currentDataTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentDataTheme === 'dark' ? 'light' : 'dark';
  localStorage.setItem('theme', newTheme);
  currentTheme = newTheme;
  applyTheme(newTheme);
}

function handleSystemThemeChange(e) {
  if (currentTheme === 'auto') {
    applyTheme('auto');
  }
}

function updateThemeToggleButton(theme) {
  const themeToggle = document.querySelector('.theme-toggle');
  if (!themeToggle) return;
  if (theme === 'dark') {
    themeToggle.setAttribute('aria-label', 'Alternar para tema claro');
  } else {
    themeToggle.setAttribute('aria-label', 'Alternar para tema escuro');
  }
}

window.themeUtils = {
  getCurrentTheme: () => document.documentElement.getAttribute('data-theme'),
  setTheme: (theme) => {
    if (['auto', 'light', 'dark'].includes(theme)) {
      localStorage.setItem('theme', theme);
      currentTheme = theme;
      applyTheme(theme);
    }
  }
};
