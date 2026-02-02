const defaultLanguage = 'pt';
const supportedLanguages = ['pt', 'en', 'zh'];
let currentLanguage = defaultLanguage;
let translations = {};

document.addEventListener('DOMContentLoaded', initI18n);

async function initI18n() {
  const browserLang = navigator.language.split('-')[0];
  const initialLang = supportedLanguages.includes(browserLang) ? browserLang : defaultLanguage;
  const savedLang = localStorage.getItem('language');
  currentLanguage = savedLang || initialLang;
  
  await loadTranslations();
  setLanguage(currentLanguage);
  setupLanguageButtons();
}

async function loadTranslations() {
  try {
    for (const lang of supportedLanguages) {
      const response = await fetch(`locales/${lang}.json`);
      if (response.ok) {
        translations[lang] = await response.json();
      }
    }
  } catch (error) {
    console.error('Erro ao carregar traduções:', error);
  }
}

function setupLanguageButtons() {
  const buttons = document.querySelectorAll('.language-selector button');
  
  buttons.forEach(button => {
    button.addEventListener('click', () => {
      const lang = button.getAttribute('data-lang');
      setLanguage(lang);
    });
  });
}

function setLanguage(lang) {
  if (!supportedLanguages.includes(lang) || !translations[lang]) return;
  
  currentLanguage = lang;
  localStorage.setItem('language', lang);
  document.documentElement.lang = lang;
  translateElements();
}

function translateElements() {
  const langData = translations[currentLanguage];
  if (!langData) return;
  
  document.querySelectorAll('[data-key]').forEach(element => {
    const key = element.getAttribute('data-key');
    const value = getNestedValue(langData, key);
    if (value) {
      element.innerHTML = value;
    }
  });
}

function getNestedValue(obj, path) {
  return path.split('.').reduce((current, key) => current?.[key], obj);
}

window.i18n = {
  setLanguage,
  getCurrentLanguage: () => currentLanguage,
  getTranslation: (key) => getNestedValue(translations[currentLanguage], key)
};
