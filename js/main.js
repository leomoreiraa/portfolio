function initPortfolio() {
  if (!window.themeUtils || !window.i18n || !window.animationUtils) {
    setTimeout(initPortfolio, 100);
    return;
  }
  checkAndLoadFlags();
  document.addEventListener('themeChanged', handleThemeChange);
  document.addEventListener('languageChanged', handleLanguageChange);
}

function checkAndLoadFlags() {
  const flagsNeeded = [
    { lang: 'pt', src: 'assets/images/brazil-flag.png' },
    { lang: 'en', src: 'assets/images/usa-flag.png' },
    { lang: 'zh', src: 'assets/images/china-flag.png' }
  ];
  flagsNeeded.forEach(flag => {
    const img = new Image();
    img.src = flag.src;
    img.onerror = () => {
      console.warn(`Bandeira para ${flag.lang} não encontrada.`);
    };
  });
}

function handleThemeChange(e) {
  const theme = e.detail.theme;
  const metaThemeColor = document.querySelector('meta[name="theme-color"]');
  if (metaThemeColor) {
    metaThemeColor.setAttribute('content', theme === 'dark' ? '#252525' : '#f8f5e8');
  }
}

function handleLanguageChange(e) {
  const language = e.detail.language;
  document.documentElement.lang = language;
  document.title = window.i18n.getTranslation('title') + ' | ' + window.i18n.getTranslation('nav.home');
}

document.addEventListener('DOMContentLoaded', () => {
  initPortfolio();
  const homeLinks = document.querySelectorAll('a[href="#home"], .logo');
  homeLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      history.replaceState(null, '', '#home');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });
});

window.addEventListener('load', () => {
  if (window.location.hash) {
    const targetId = window.location.hash;
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      setTimeout(() => {
        const headerHeight = document.querySelector('header').offsetHeight;
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }, 300);
    }
  }
});
