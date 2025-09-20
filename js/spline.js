// Spline background loader (extracted from inline)
window.addEventListener('DOMContentLoaded',function(){
  const bgDiv = document.getElementById('spline-bg');
  const loader = document.getElementById('spline-bg-loader');
  if(!bgDiv || !loader) return;
  let viewer = null;
  let splineLoaded = false;
  const LIGHT_SCENE = 'https://prod.spline.design/zedCl-UcFAJatzXq/scene.splinecode';
  const DARK_SCENE = 'https://prod.spline.design/abIU3H47vgPpUceG/scene.splinecode';
  let currentScene = null;
  const MIN_VIEWPORT_WIDTH = 640;
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let importPromise = null;

  function desiredScene(){
    const theme = document.documentElement.getAttribute('data-theme');
    return theme === 'dark' ? DARK_SCENE : LIGHT_SCENE;
  }
  function loadSpline() {
    if (splineLoaded) return;
    if (prefersReduced || window.innerWidth < MIN_VIEWPORT_WIDTH) return;
    splineLoaded = true;
    if(!importPromise){
      importPromise = import('https://unpkg.com/@splinetool/viewer@1.10.64/build/spline-viewer.js');
    }
    importPromise.then(()=>{
      viewer = document.createElement('spline-viewer');
      currentScene = desiredScene();
      viewer.setAttribute('url', currentScene);
      viewer.setAttribute('loading-anim-type','spinner-small-dark');
      Object.assign(viewer.style,{
        position:'absolute',top:0,left:0,width:'100%',height:'100%',zIndex:'-1',pointerEvents:'none'
      });
      bgDiv.appendChild(viewer);
      loader.style.display = 'none';
    }).catch(()=>{
      loader.innerHTML = '<span style="color:white;font-size:1.2rem;">Falha ao carregar animação 3D.</span>';
      splineLoaded = false;
    });
  }
  function switchSceneForce(){
    const target = desiredScene();
    if(target === currentScene) return;
    if(!viewer){ loadSpline(); return; }
    const oldViewer = viewer;
    oldViewer.classList.add('fade-out-spline');
    if(!importPromise){
      importPromise = import('https://unpkg.com/@splinetool/viewer@1.10.64/build/spline-viewer.js');
    }
    importPromise.then(()=>{
      const newViewer = document.createElement('spline-viewer');
      newViewer.setAttribute('url', target);
      newViewer.setAttribute('loading-anim-type','spinner-small-dark');
      Object.assign(newViewer.style,{
        position:'absolute',top:0,left:0,width:'100%',height:'100%',zIndex:'-1',pointerEvents:'none',opacity:'0'
      });
      bgDiv.appendChild(newViewer);
      requestAnimationFrame(()=>{ newViewer.style.transition='opacity .8s ease'; newViewer.style.opacity='1'; });
      newViewer.addEventListener('load',()=>{
        setTimeout(()=>{ if(oldViewer && oldViewer.parentNode){ oldViewer.parentNode.removeChild(oldViewer); } },400);
      });
      viewer = newViewer; currentScene = target;
    });
  }
  function unloadSpline() {
    if (viewer && viewer.parentNode) {
      viewer.parentNode.removeChild(viewer);
      loader.style.display = '';
      splineLoaded = false;
      viewer = null;
      currentScene = null;
    }
  }
  const homeSection = document.getElementById('home');
  if (homeSection) {
    let lastAction = 0;
    const DEBOUNCE_MS = 250;
    const observer = new IntersectionObserver((entries)=>{
      const now = Date.now();
      if(now - lastAction < DEBOUNCE_MS) return;
      entries.forEach(entry=>{
        const ratio = entry.intersectionRatio;
        if(ratio >= 0.4){ loadSpline(); lastAction = now; }
        else if(ratio <= 0.25){ unloadSpline(); lastAction = now; }
      });
    },{threshold:[0,0.1,0.25,0.4,0.6,0.8,1]});
    observer.observe(homeSection);
  } else {
    loadSpline();
  }
  document.addEventListener('themeChanged',switchSceneForce);
  document.addEventListener('visibilitychange',()=>{ if(!document.hidden && !viewer){ loadSpline(); } });
  window.addEventListener('resize',()=>{ if(!viewer && !prefersReduced && window.innerWidth >= MIN_VIEWPORT_WIDTH){ loadSpline(); } });
});
