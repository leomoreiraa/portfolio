/**
 * Sistema de Internacionalização
 * Suporte para Português, Inglês e Mandarim
 * Detecta automaticamente o idioma do navegador
 * Permite alternar manualmente entre idiomas
 */

// Configurações iniciais
const defaultLanguage = 'pt';
const supportedLanguages = ['pt', 'en', 'zh'];
let currentLanguage = defaultLanguage;
let translations = {};

// Inicializar o sistema de internacionalização
document.addEventListener('DOMContentLoaded', initI18n);

// Função principal de inicialização
async function initI18n() {
  // Detectar idioma do navegador
  const browserLang = navigator.language.split('-')[0];
  const initialLang = supportedLanguages.includes(browserLang) ? browserLang : defaultLanguage;
  
  // Verificar se há um idioma salvo no localStorage
  const savedLang = localStorage.getItem('language');
  currentLanguage = savedLang || initialLang;
  
  // Carregar as traduções
  await loadTranslations();
  
  // Aplicar o idioma inicial
  setLanguage(currentLanguage);
  
  // Adicionar eventos aos botões de idioma
  setupLanguageButtons();
}

// Carregar arquivos de tradução
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

// Configurar botões de idioma
function setupLanguageButtons() {
  const buttons = document.querySelectorAll('.language-selector button');
  
  buttons.forEach(button => {
    const lang = button.getAttribute('data-lang');
    
    // Marcar o botão do idioma atual
    if (lang === currentLanguage) {
      button.setAttribute('aria-current', 'true');
    }
    
    // Adicionar evento de clique
    button.addEventListener('click', () => {
      setLanguage(lang);
    });
  });
}

// Definir o idioma ativo
function setLanguage(lang) {
  if (!supportedLanguages.includes(lang) || !translations[lang]) {
    console.error(`Idioma não suportado: ${lang}`);
    return;
  }
  
  // Atualizar idioma atual
  currentLanguage = lang;
  
  // Salvar preferência no localStorage
  localStorage.setItem('language', lang);
  
  // Atualizar atributo lang do HTML
  document.documentElement.lang = lang;
  
  // Atualizar estado dos botões
  updateLanguageButtons();
  
  // Traduzir todos os elementos
  translateElements();
  
  // Disparar evento de mudança de idioma
  const event = new CustomEvent('languageChanged', { 
    detail: { language: lang } 
  });
  document.dispatchEvent(event);
}

// Atualizar estado visual dos botões de idioma
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

// Traduzir todos os elementos com atributos de tradução
function translateElements() {
  const langData = translations[currentLanguage];
  if (!langData) return;
  
  // Traduzir elementos com data-key
  document.querySelectorAll('[data-key]').forEach(element => {
    const key = element.getAttribute('data-key');
    const path = key.split('.');
    
    // Buscar valor aninhado no objeto de traduções
    let value = langData;
    for (const segment of path) {
      if (value[segment] === undefined) {
        console.warn(`Chave de tradução não encontrada: ${key}`);
        return;
      }
      value = value[segment];
    }
    
    // Aplicar tradução
    if (typeof value === 'string') {
      element.innerHTML = value;
    }
  });
  
  // Traduzir elementos com data-i18n
  document.querySelectorAll('[data-i18n]').forEach(element => {
    const key = element.getAttribute('data-i18n');
    const path = key.split('.');
    
    // Buscar valor aninhado no objeto de traduções
    let value = langData;
    for (const segment of path) {
      if (value[segment] === undefined) {
        console.warn(`Chave de tradução não encontrada: ${key}`);
        return;
      }
      value = value[segment];
    }
    
    // Aplicar tradução
    if (typeof value === 'string') {
      element.innerHTML = value;
    }
  });
  
  // Traduzir atributos com data-i18n-attr
  document.querySelectorAll('[data-i18n-attr]').forEach(element => {
    try {
      const attrConfig = JSON.parse(element.getAttribute('data-i18n-attr'));
      
      for (const [attr, key] of Object.entries(attrConfig)) {
        const path = key.split('.');
        
        // Buscar valor aninhado no objeto de traduções
        let value = langData;
        for (const segment of path) {
          if (value[segment] === undefined) {
            console.warn(`Chave de tradução não encontrada para atributo: ${key}`);
            return;
          }
          value = value[segment];
        }
        
        // Aplicar tradução ao atributo
        if (typeof value === 'string') {
          element.setAttribute(attr, value);
        }
      }
    } catch (error) {
      console.error('Erro ao processar data-i18n-attr:', error);
    }
  });
}

// Exportar funções para uso externo
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
