/**
 * Theme Switcher
 * Detecta automaticamente a preferência do sistema
 * Permite alternar manualmente entre temas claro e escuro
 */

// Configurações iniciais
const defaultTheme = 'auto'; // 'auto', 'light' ou 'dark'
let currentTheme = defaultTheme;

// Inicializar o sistema de temas
document.addEventListener('DOMContentLoaded', initThemeSwitcher);

// Função principal de inicialização
function initThemeSwitcher() {
  // Verificar se há um tema salvo no localStorage
  const savedTheme = localStorage.getItem('theme');
  currentTheme = savedTheme || defaultTheme;
  
  // Aplicar o tema inicial
  applyTheme(currentTheme);
  
  // Adicionar evento ao botão de alternância de tema
  const themeToggle = document.querySelector('.theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
  }
  
  // Monitorar mudanças na preferência do sistema
  const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
  prefersDarkScheme.addEventListener('change', handleSystemThemeChange);
}

// Aplicar o tema
function applyTheme(theme) {
  // Determinar se deve usar o tema escuro
  let isDarkTheme;
  
  if (theme === 'auto') {
    // Usar a preferência do sistema
    isDarkTheme = window.matchMedia('(prefers-color-scheme: dark)').matches;
  } else {
    // Usar o tema explicitamente definido
    isDarkTheme = theme === 'dark';
  }
  
  // Aplicar o tema ao documento
  if (isDarkTheme) {
    document.documentElement.setAttribute('data-theme', 'dark');
    updateThemeToggleButton('dark');
  } else {
    document.documentElement.setAttribute('data-theme', 'light');
    updateThemeToggleButton('light');
  }
  
  // Atualizar a animação do buraco negro, se disponível
  if (window.blackHoleAnimation) {
    window.blackHoleAnimation.updateTheme(isDarkTheme);
  }
  
  // Disparar evento de mudança de tema
  const event = new CustomEvent('themeChanged', { 
    detail: { 
      theme: isDarkTheme ? 'dark' : 'light',
      source: theme === 'auto' ? 'system' : 'user'
    } 
  });
  document.dispatchEvent(event);
}

// Alternar entre temas
function toggleTheme() {
  // Obter o tema atual
  const currentDataTheme = document.documentElement.getAttribute('data-theme');
  
  // Alternar para o tema oposto
  const newTheme = currentDataTheme === 'dark' ? 'light' : 'dark';
  
  // Salvar a preferência no localStorage
  localStorage.setItem('theme', newTheme);
  currentTheme = newTheme;
  
  // Aplicar o novo tema
  applyTheme(newTheme);
}

// Lidar com mudanças na preferência do sistema
function handleSystemThemeChange(e) {
  // Só atualizar se o tema estiver definido como 'auto'
  if (currentTheme === 'auto') {
    applyTheme('auto');
  }
}

// Atualizar o botão de alternância de tema
function updateThemeToggleButton(theme) {
  const themeToggle = document.querySelector('.theme-toggle');
  if (!themeToggle) return;
  
  // Atualizar o aria-label
  if (theme === 'dark') {
    themeToggle.setAttribute('aria-label', 'Alternar para tema claro');
  } else {
    themeToggle.setAttribute('aria-label', 'Alternar para tema escuro');
  }
}

// Exportar funções para uso externo
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
