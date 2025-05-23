/**
 * Script principal do portfólio
 * Integra todos os componentes e inicializa funcionalidades
 */

// Função para inicializar o portfólio
function initPortfolio() {
  // Verificar se todos os scripts necessários foram carregados
  if (!window.themeUtils || !window.i18n || !window.animationUtils) {
    console.warn('Aguardando carregamento de todos os scripts...');
    setTimeout(initPortfolio, 100);
    return;
  }

  console.log('Inicializando portfólio...');

  // Verificar se há bandeiras de idioma faltando e baixá-las se necessário
  checkAndLoadFlags();
  
  // Adicionar listeners para eventos de mudança de tema e idioma
  document.addEventListener('themeChanged', handleThemeChange);
  document.addEventListener('languageChanged', handleLanguageChange);
}

// Verificar e carregar bandeiras de idioma se necessário
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
      console.warn(`Bandeira para ${flag.lang} não encontrada. Usando fallback.`);
      // Aqui poderia implementar um fallback se necessário
    };
  });
}

// Manipulador de mudança de tema
function handleThemeChange(e) {
  const theme = e.detail.theme;
  console.log(`Tema alterado para: ${theme}`);
  
  // Atualizar meta tags para tema
  const metaThemeColor = document.querySelector('meta[name="theme-color"]');
  if (metaThemeColor) {
    metaThemeColor.setAttribute('content', theme === 'dark' ? '#252525' : '#f8f5e8');
  }
}

// Manipulador de mudança de idioma
function handleLanguageChange(e) {
  const language = e.detail.language;
  console.log(`Idioma alterado para: ${language}`);
  
  // Atualizar atributo lang do HTML
  document.documentElement.lang = language;
  
  // Atualizar título da página
  document.title = window.i18n.getTranslation('title') + ' | ' + window.i18n.getTranslation('nav.home');
}

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
  initPortfolio();
});

// Verificar se a página foi carregada completamente
window.addEventListener('load', () => {
  console.log('Página carregada completamente');
  
  // Verificar se há hash na URL para rolagem
  if (window.location.hash) {
    const targetId = window.location.hash;
    const targetElement = document.querySelector(targetId);
    
    if (targetElement) {
      // Pequeno atraso para garantir que tudo esteja renderizado
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
