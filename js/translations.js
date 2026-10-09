const translations = {
  en: en,
  pt: pt,
  zh: zh,
};

function getTranslation(lang) {
  return Object.hasOwn(translations, lang)
    ? translations[lang]
    : translations.en;
}
