/**
 * Controlador para o modelo Spline
 * Gerencia a exibição e inversão de cores do modelo 3D
 * baseado no tema atual (claro/escuro)
 */

// Verificar se o dispositivo é mobile
const isMobile = window.innerWidth < 768;

// Configurações iniciais
document.addEventListener('DOMContentLoaded', initSplineController);

// Função principal de inicialização
function initSplineController() {
  // Se for mobile, ocultar o container do Spline
  if (isMobile) {
    console.log('Dispositivo mobile detectado, animação 3D desativada');
    const splineContainer = document.getElementById('spline-container');
    if (splineContainer) {
      splineContainer.style.display = 'none';
    }
    return;
  }

  // Verificar se o usuário prefere redução de movimento
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    console.log('Preferência por redução de movimento detectada, animação 3D desativada');
    const splineContainer = document.getElementById('spline-container');
    if (splineContainer) {
      splineContainer.style.display = 'none';
    }
    return;
  }

  // Adicionar evento para mudança de tema
  document.addEventListener('themeChanged', handleThemeChange);
  
  // Aplicar tema inicial
  const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
  updateSplineTheme(currentTheme);
  
  // Verificar quando o Spline Viewer estiver carregado
  const splineViewer = document.getElementById('spline-viewer');
  if (splineViewer) {
    splineViewer.addEventListener('load', () => {
      console.log('Spline Viewer carregado');
      updateSplineTheme(currentTheme);
    });
  }
}

// Manipulador de mudança de tema
function handleThemeChange(e) {
  const theme = e.detail.theme;
  console.log(`Tema alterado para: ${theme}`);
  updateSplineTheme(theme);
}

// Atualizar o tema do modelo Spline
function updateSplineTheme(theme) {
  const splineViewer = document.getElementById('spline-viewer');
  if (!splineViewer) return;
  
  if (theme === 'dark') {
    // Tema escuro - modelo original (buraco negro)
    splineViewer.style.filter = 'none';
  } else {
    // Tema claro - inverter cores para buraco branco
    // Usamos filtros CSS para inverter as cores do modelo
    splineViewer.style.filter = 'invert(1) hue-rotate(180deg)';
  }
}

// Exportar funções para uso externo
window.splineController = {
  updateTheme: updateSplineTheme
};
