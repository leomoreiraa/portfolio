const translations = {
  en: en,
  pt: pt,
  zh: zh
};

function getTranslation(lang) {
  return translations[lang] || translations['en'];
}
