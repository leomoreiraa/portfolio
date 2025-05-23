/**
 * Animação 3D do Buraco Negro/Branco
 * Baseado na referência do Spline compartilhada pelo usuário
 * Implementa um buraco negro com disco de acreção e efeito de luz
 * Adapta-se ao tema claro/escuro do site
 */

// Verificar se o dispositivo é mobile
const isMobile = window.innerWidth < 768;

// Se for mobile, não inicializar a animação
if (isMobile) {
  console.log('Dispositivo mobile detectado, animação 3D desativada');
  document.getElementById('blackhole-container').style.display = 'none';
} else {
  // Inicializar a animação apenas em dispositivos desktop
  document.addEventListener('DOMContentLoaded', initBlackHoleAnimation);
}

function initBlackHoleAnimation() {
  // Verificar se o usuário prefere redução de movimento
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    console.log('Preferência por redução de movimento detectada, animação 3D desativada');
    document.getElementById('blackhole-container').style.display = 'none';
    return;
  }

  // Obter o container da animação
  const container = document.getElementById('blackhole-container');
  if (!container) return;

  // Configurações da cena
  let scene, camera, renderer, blackHole, accretionDisk, lightBeam;
  let animationId;
  let isDarkTheme = document.documentElement.getAttribute('data-theme') === 'dark';

  // Inicializar a cena Three.js
  function init() {
    // Criar cena
    scene = new THREE.Scene();

    // Criar câmera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    // Criar renderer com transparência
    renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true 
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // Criar o buraco negro
    createBlackHole();

    // Adicionar eventos de redimensionamento
    window.addEventListener('resize', onWindowResize);

    // Iniciar animação
    animate();

    // Adicionar evento para mudança de tema
    document.addEventListener('themeChanged', handleThemeChange);
  }

  // Criar o buraco negro e seus componentes
  function createBlackHole() {
    // Cores baseadas no tema
    const colors = getThemeColors();

    // Criar o buraco negro (esfera central)
    const blackHoleGeometry = new THREE.SphereGeometry(1, 32, 32);
    const blackHoleMaterial = new THREE.MeshBasicMaterial({ 
      color: colors.core,
      transparent: true,
      opacity: 0.9
    });
    blackHole = new THREE.Mesh(blackHoleGeometry, blackHoleMaterial);
    scene.add(blackHole);

    // Criar o disco de acreção
    const diskGeometry = new THREE.RingGeometry(1.2, 2.5, 64);
    const diskMaterial = new THREE.MeshBasicMaterial({ 
      color: colors.disk,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.8
    });
    accretionDisk = new THREE.Mesh(diskGeometry, diskMaterial);
    accretionDisk.rotation.x = Math.PI / 2.5;
    scene.add(accretionDisk);

    // Criar o raio de luz
    const beamGeometry = new THREE.CylinderGeometry(0.05, 0.05, 10, 32);
    const beamMaterial = new THREE.MeshBasicMaterial({ 
      color: colors.beam,
      transparent: true,
      opacity: 0.7
    });
    lightBeam = new THREE.Mesh(beamGeometry, beamMaterial);
    lightBeam.rotation.z = Math.PI / 2;
    lightBeam.position.x = 2;
    scene.add(lightBeam);

    // Adicionar brilho ao redor do buraco negro
    addGlow(colors.glow);
  }

  // Adicionar efeito de brilho ao redor do buraco negro
  function addGlow(color) {
    const glowGeometry = new THREE.SphereGeometry(1.1, 32, 32);
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: color,
      transparent: true,
      opacity: 0.3,
      side: THREE.BackSide
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    glow.scale.multiplyScalar(1.2);
    scene.add(glow);

    // Adicionar um segundo brilho mais sutil e maior
    const outerGlowGeometry = new THREE.SphereGeometry(1.1, 32, 32);
    const outerGlowMaterial = new THREE.MeshBasicMaterial({
      color: color,
      transparent: true,
      opacity: 0.1,
      side: THREE.BackSide
    });
    const outerGlow = new THREE.Mesh(outerGlowGeometry, outerGlowMaterial);
    outerGlow.scale.multiplyScalar(1.5);
    scene.add(outerGlow);
  }

  // Obter cores baseadas no tema atual
  function getThemeColors() {
    if (isDarkTheme) {
      // Cores para o buraco negro (tema escuro)
      return {
        core: 0x000000,
        disk: 0xffffff,
        beam: 0xf5deb3, // Cor amarelada para o raio
        glow: 0xffffff
      };
    } else {
      // Cores para o buraco branco (tema claro)
      return {
        core: 0xffffff,
        disk: 0x252525,
        beam: 0xf5deb3, // Cor amarelada para o raio
        glow: 0x9b59b6
      };
    }
  }

  // Atualizar a animação
  function animate() {
    animationId = requestAnimationFrame(animate);

    // Rotacionar o disco de acreção lentamente
    if (accretionDisk) {
      accretionDisk.rotation.z += 0.002;
    }

    // Fazer o buraco negro pulsar sutilmente
    if (blackHole) {
      const pulseFactor = Math.sin(Date.now() * 0.001) * 0.03 + 1;
      blackHole.scale.set(pulseFactor, pulseFactor, pulseFactor);
    }

    // Renderizar a cena
    renderer.render(scene, camera);
  }

  // Ajustar a cena quando a janela for redimensionada
  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  // Lidar com mudanças de tema
  function handleThemeChange(e) {
    isDarkTheme = e.detail.theme === 'dark';
    
    // Limpar a cena atual
    while(scene.children.length > 0) { 
      scene.remove(scene.children[0]); 
    }
    
    // Recriar o buraco negro com as novas cores
    createBlackHole();
  }

  // Inicializar a cena
  init();

  // Exportar funções para uso externo
  window.blackHoleAnimation = {
    stop: function() {
      if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
      }
    },
    resume: function() {
      if (!animationId) {
        animate();
      }
    },
    updateTheme: function(isDark) {
      isDarkTheme = isDark;
      
      // Limpar a cena atual
      while(scene.children.length > 0) { 
        scene.remove(scene.children[0]); 
      }
      
      // Recriar o buraco negro com as novas cores
      createBlackHole();
    }
  };
}
