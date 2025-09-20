 
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
      } else {
        console.error(`Falha ao carregar o arquivo de tradução para ${lang}`);
      }
    }
  } catch (error) {
    console.error('Erro ao carregar traduções:', error);
  }
}

function setupLanguageButtons() {
  const buttons = document.querySelectorAll('.language-selector button');
  
  buttons.forEach(button => {
    const lang = button.getAttribute('data-lang');
    if (lang === currentLanguage) {
      button.setAttribute('aria-current', 'true');
    }
    button.addEventListener('click', () => {
      setLanguage(lang);
    });
  });
}

function setLanguage(lang) {
  if (!supportedLanguages.includes(lang) || !translations[lang]) {
    console.error(`Idioma não suportado: ${lang}`);
    return;
  }
  currentLanguage = lang;
  localStorage.setItem('language', lang);
  document.documentElement.lang = lang;
  updateLanguageButtons();
  translateElements();
  const event = new CustomEvent('languageChanged', { 
    detail: { language: lang } 
  });
  document.dispatchEvent(event);
}

function updateLanguageButtons() {
  const buttons = document.querySelectorAll('.language-selector button');
  
  buttons.forEach(button => {
    const lang = button.getAttribute('data-lang');
    if (lang === currentLanguage) {
      button.setAttribute('aria-current', 'true');
    } else {
      button.setAttribute('aria-current', 'false');
    }
  });
}

function translateElements() {
  const langData = translations[currentLanguage];
  if (!langData) return;
  document.querySelectorAll('[data-key]').forEach(element => {
    const key = element.getAttribute('data-key');
    const path = key.split('.');
    let value = langData;
    for (const segment of path) {
      if (value[segment] === undefined) {
        console.warn(`Chave de tradução não encontrada: ${key}`);
        return;
      }
      value = value[segment];
    }
    if (typeof value === 'string') {
      element.innerHTML = value;
    }
  });
  document.querySelectorAll('[data-i18n]').forEach(element => {
    const key = element.getAttribute('data-i18n');
    const path = key.split('.');
    let value = langData;
    for (const segment of path) {
      if (value[segment] === undefined) {
        console.warn(`Chave de tradução não encontrada: ${key}`);
        return;
      }
      value = value[segment];
    }
    if (typeof value === 'string') {
      element.innerHTML = value;
    }
  });
  document.querySelectorAll('[data-i18n-attr]').forEach(element => {
    try {
      const attrConfig = JSON.parse(element.getAttribute('data-i18n-attr'));
      for (const [attr, key] of Object.entries(attrConfig)) {
        const path = key.split('.');
        let value = langData;
        for (const segment of path) {
          if (value[segment] === undefined) {
            console.warn(`Chave de tradução não encontrada para atributo: ${key}`);
            return;
          }
          value = value[segment];
        }
        if (typeof value === 'string') {
          element.setAttribute(attr, value);
        }
      }
    } catch (error) {
      console.error('Erro ao processar data-i18n-attr:', error);
    }
  });
}

window.i18n = {
  setLanguage,
  getCurrentLanguage: () => currentLanguage,
  getTranslation: (key) => {
    const path = key.split('.');
    let value = translations[currentLanguage];
    
    for (const segment of path) {
      if (!value || value[segment] === undefined) {
        return key; // Retornar a chave se a tradução não for encontrada
      }
      value = value[segment];
    }
    
    return value;
  }
};
