// i18n functionality
let currentLanguage = 'en';

document.addEventListener('DOMContentLoaded', () => {
  // Get saved language or default
  const savedLang = localStorage.getItem('language');
  if (savedLang && translations[savedLang]) {
    currentLanguage = savedLang;
  } else {
    const browserLang = navigator.language.split('-')[0];
    if (translations[browserLang]) {
      currentLanguage = browserLang;
    }
  }
  
  setLanguage(currentLanguage);
  setupLanguageButtons();
});

function setupLanguageButtons() {
  const langButtons = document.querySelectorAll('.lang-btn');
  
  langButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const lang = btn.getAttribute('data-lang');
      setLanguage(lang);
    });
  });
}

function setLanguage(lang) {
  if (!translations[lang]) return;
  
  currentLanguage = lang;
  localStorage.setItem('language', lang);
  
  // Update active button
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
  });
  
  // Update all translatable elements
  updateTranslations();
}

function updateTranslations() {
  const trans = getTranslation(currentLanguage);
  
  document.querySelectorAll('[data-i18n]').forEach(element => {
    const key = element.getAttribute('data-i18n');
    const value = getNestedValue(trans, key);
    if (value) {
      element.textContent = value;
    }
  });
}

function getNestedValue(obj, path) {
  return path.split('.').reduce((current, key) => current?.[key], obj);
}
