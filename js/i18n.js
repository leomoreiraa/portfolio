let currentLanguage = "en";

document.addEventListener("DOMContentLoaded", () => {
  let savedLanguage;
  try {
    savedLanguage = localStorage.getItem("language");
  } catch {
    // Language switching also works when browser storage is unavailable.
  }

  const browserLanguages = navigator.languages || [navigator.language];
  const preferredLanguage = browserLanguages
    .map((language) => language.toLowerCase().split("-")[0])
    .find((language) => Object.hasOwn(translations, language));

  setLanguage(
    Object.hasOwn(translations, savedLanguage)
      ? savedLanguage
      : preferredLanguage || "en",
  );

  document.querySelectorAll(".lang-btn").forEach((button) => {
    button.addEventListener("click", () => setLanguage(button.dataset.lang));
  });
});

function setLanguage(language) {
  if (!Object.hasOwn(translations, language)) return;

  currentLanguage = language;
  document.documentElement.lang = language;
  try {
    localStorage.setItem("language", language);
  } catch {
    // Keep the selected language for this page even if it cannot be saved.
  }

  document.querySelectorAll(".lang-btn").forEach((button) => {
    const active = button.dataset.lang === language;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  });

  updateTranslations();
}

function updateTranslations() {
  const translation = getTranslation(currentLanguage);
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const value = getNestedValue(translation, element.dataset.i18n);
    if (typeof value === "string") element.textContent = value;
  });
  document.querySelectorAll("[data-i18n-aria-label]").forEach((element) => {
    const value = getNestedValue(translation, element.dataset.i18nAriaLabel);
    if (typeof value === "string") element.setAttribute("aria-label", value);
  });
}

function getNestedValue(object, path) {
  return path.split(".").reduce((value, key) => value?.[key], object);
}
