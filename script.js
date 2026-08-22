/**
 * MIUY STUDIO - MASTER PRESENTATION CONTROLLER
 * Orquestador principal que carga las diapositivas de cada persona mediante iframe.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Modules metadata
  const modules = [
    {
      id: 'persona1',
      author: 'Persona 1',
      title: 'Visión General & Web',
      file: 'persona1.html',
      startSlide: 1,
      endSlide: 6,
      slidesCount: 6
    },
    {
      id: 'marcel',
      author: 'Marcel',
      title: 'Seguridad & Roles',
      file: 'marcel.html',
      startSlide: 7,
      endSlide: 9,
      slidesCount: 3
    },
    {
      id: 'persona3',
      author: 'Persona 3',
      title: 'Inventario de Hardware',
      file: 'persona3.html',
      startSlide: 10,
      endSlide: 13,
      slidesCount: 4
    },
    {
      id: 'alan',
      author: 'Alan',
      title: 'Mesa de Ayuda',
      file: 'alan.html',
      startSlide: 14,
      endSlide: 16,
      slidesCount: 3
    },
    {
      id: 'emiliano',
      author: 'Emiliano',
      title: 'Asignaciones & Métricas',
      file: 'emiliano.html',
      startSlide: 17,
      endSlide: 19,
      slidesCount: 3
    },
    {
      id: 'samuel',
      author: 'Samuel',
      title: 'Arquitectura & Cierre',
      file: 'samuel.html',
      startSlide: 20,
      endSlide: 24,
      slidesCount: 5
    }
  ];

  const totalGlobalSlides = 24;
  let currentModuleIndex = 0;
  let currentLocalIndex = 0;
  let currentGlobalSlide = 1;

  // Slide Titles Directory
  const slideTitles = {
    1: '01. Portada: Portal de Gestión de UTU',
    2: '02. Arquitectura Integral & Módulos del Sistema',
    3: '03. El Problema Real & Diagnóstico en UTU',
    4: '04. La Propuesta: Portal Centralizado',
    5: '05. Sitio Web Corporativo MIUY Studio',
    6: '06. Recorrido Visual Inicial & Navegación Fluida',
    7: '07. Acceso & Validación de Identidad por Cédula',
    8: '08. Gobernanza de Accesos & 3 Roles de Usuario',
    9: '09. Panel de Control: Gestión de Usuarios',
    10: '10. Organización & Jerarquía de Hardware',
    11: '11. Ciclo de Vida & 4 Estados del Hardware',
    12: '12. Búsqueda Rápida & Filtros Dinámicos',
    13: '13. Ficha Técnica & Historial del Equipo',
    14: '14. Mesa de Ayuda: El Lado del Docente',
    15: '15. Bandeja Técnica & Gestión de Incidencias',
    16: '16. Flujo de Vida del Ticket: De Apertura a Cierre',
    17: '17. Módulo de Asignaciones & Préstamos de Equipos',
    18: '18. Dashboard de Métricas & Analítica Gerencial',
    19: '19. Toma de Decisiones: ¿Qué Hardware Renovar?',
    20: '20. Base de Conocimiento: Diagnósticos & Soluciones',
    21: '21. Stack Tecnológico & Modelo MER Relacional',
    22: '22. Desafíos Técnicos Superados en el Desarrollo',
    23: '23. Resultados Obtenidos & Comparativa de Impacto',
    24: '24. Cierre Oficial & Espacio de Preguntas'
  };

  // DOM Elements
  const slideFrame = document.getElementById('slide-frame');
  const frameContainer = document.getElementById('slide-frame-container');
  const hudSlideIndicator = document.getElementById('hud-slide-indicator');
  const hudSpeakerLabel = document.getElementById('hud-speaker-label');
  const overviewModal = document.getElementById('overview-modal');
  const overviewGrid = document.getElementById('overview-grid');
  const filesModal = document.getElementById('files-modal');

  // Dynamic 16:9 Viewport Scaling
  function resizeMasterViewport() {
    const stageWidth = window.innerWidth;
    const stageHeight = window.innerHeight;
    const isPortraitMobile = (stageWidth <= 820 && stageHeight >= stageWidth) || stageWidth < 600;

    if (!frameContainer) return;

    if (isPortraitMobile) {
      document.body.classList.add('is-mobile-portrait');
      frameContainer.style.transform = 'none';
    } else {
      document.body.classList.remove('is-mobile-portrait');
      const targetWidth = 1280;
      const targetHeight = 720;
      const marginX = stageWidth < 900 ? 10 : 30;
      const marginY = stageHeight < 700 ? 30 : 60;

      const scaleX = (stageWidth - marginX) / targetWidth;
      const scaleY = (stageHeight - marginY) / targetHeight;
      const scale = Math.min(scaleX, scaleY);

      frameContainer.style.transform = `scale(${scale})`;
      frameContainer.style.transformOrigin = 'center center';
    }
  }

  window.addEventListener('resize', resizeMasterViewport);
  window.addEventListener('orientationchange', () => setTimeout(resizeMasterViewport, 100));
  resizeMasterViewport();

  // Helper: Find module by global slide number (1..24)
  function getModuleForGlobalSlide(globalNum) {
    for (let i = 0; i < modules.length; i++) {
      if (globalNum >= modules[i].startSlide && globalNum <= modules[i].endSlide) {
        return {
          moduleIndex: i,
          module: modules[i],
          localIndex: globalNum - modules[i].startSlide
        };
      }
    }
    return { moduleIndex: 0, module: modules[0], localIndex: 0 };
  }

  // Load a module file
  function loadModule(modIdx, targetLocalIndex = 0) {
    if (modIdx < 0 || modIdx >= modules.length) return;

    const mod = modules[modIdx];
    currentModuleIndex = modIdx;
    currentLocalIndex = targetLocalIndex;
    currentGlobalSlide = mod.startSlide + targetLocalIndex;

    updateUI();

    const targetSrc = `${mod.file}#slide-${targetLocalIndex + 1}`;
    const currentSrc = slideFrame.getAttribute('src');

    if (!currentSrc || !currentSrc.startsWith(mod.file)) {
      slideFrame.src = targetSrc;
    } else {
      if (slideFrame.contentWindow) {
        slideFrame.contentWindow.postMessage({
          type: 'GO_TO_LOCAL_SLIDE',
          slideIndex: targetLocalIndex
        }, '*');
      }
    }
  }

  // Global Navigation
  function goToGlobalSlide(globalNum) {
    if (globalNum < 1) globalNum = 1;
    if (globalNum > totalGlobalSlides) globalNum = totalGlobalSlides;

    const info = getModuleForGlobalSlide(globalNum);
    loadModule(info.moduleIndex, info.localIndex);
  }

  function nextGlobalSlide() {
    if (currentGlobalSlide < totalGlobalSlides) {
      goToGlobalSlide(currentGlobalSlide + 1);
    }
  }

  function prevGlobalSlide() {
    if (currentGlobalSlide > 1) {
      goToGlobalSlide(currentGlobalSlide - 1);
    }
  }

  // Update UI Elements
  function updateUI() {
    const mod = modules[currentModuleIndex];

    if (hudSlideIndicator) {
      hudSlideIndicator.textContent = `${String(currentGlobalSlide).padStart(2, '0')} / ${String(totalGlobalSlides).padStart(2, '0')}`;
    }

    if (hudSpeakerLabel) {
      hudSpeakerLabel.innerHTML = `<strong>MIUY Studio</strong> • ${mod.title}`;
    }

    const thumbs = document.querySelectorAll('.overview-thumb');
    thumbs.forEach((t, i) => {
      t.classList.toggle('current', (i + 1) === currentGlobalSlide);
    });
  }

  // Listen to postMessage from embedded slide deck
  window.addEventListener('message', (e) => {
    if (!e.data || typeof e.data !== 'object') return;

    if (e.data.type === 'SLIDE_CHANGED') {
      currentLocalIndex = e.data.localIndex;
      currentGlobalSlide = modules[currentModuleIndex].startSlide + currentLocalIndex;
      updateUI();
    } else if (e.data.type === 'REQUEST_NEXT_SPEAKER') {
      if (currentModuleIndex < modules.length - 1) {
        loadModule(currentModuleIndex + 1, 0);
      }
    } else if (e.data.type === 'REQUEST_PREV_SPEAKER') {
      if (currentModuleIndex > 0) {
        const prevMod = modules[currentModuleIndex - 1];
        loadModule(currentModuleIndex - 1, prevMod.slidesCount - 1);
      }
    }
  });

  // Build Overview Grid
  function buildOverviewGrid() {
    overviewGrid.innerHTML = '';

    for (let sNum = 1; sNum <= totalGlobalSlides; sNum++) {
      const info = getModuleForGlobalSlide(sNum);
      const titleText = slideTitles[sNum] || `Diapositiva ${sNum}`;

      const thumb = document.createElement('div');
      thumb.className = `overview-thumb ${sNum === currentGlobalSlide ? 'current' : ''}`;
      thumb.innerHTML = `
        <div class="thumb-num">${String(sNum).padStart(2, '0')}</div>
        <div class="thumb-title">${titleText}</div>
        <div class="thumb-speaker">${info.module.title}</div>
      `;

      thumb.addEventListener('click', () => {
        goToGlobalSlide(sNum);
        overviewModal.classList.remove('open');
      });

      overviewGrid.appendChild(thumb);
    }
  }

  function toggleOverviewModal() {
    buildOverviewGrid();
    overviewModal.classList.toggle('open');
  }

  function toggleFilesModal() {
    if (filesModal) {
      filesModal.classList.toggle('open');
    }
  }

  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => console.warn(err));
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (overviewModal && overviewModal.classList.contains('open')) {
      if (e.key === 'Escape' || e.key === 'o' || e.key === 'O') {
        overviewModal.classList.remove('open');
        e.preventDefault();
      }
      return;
    }

    if (filesModal && filesModal.classList.contains('open')) {
      if (e.key === 'Escape' || e.key === 'e' || e.key === 'E') {
        filesModal.classList.remove('open');
        e.preventDefault();
      }
      return;
    }

    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowDown':
      case ' ':
      case 'PageDown':
        e.preventDefault();
        nextGlobalSlide();
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
      case 'PageUp':
        e.preventDefault();
        prevGlobalSlide();
        break;
      case 'Home':
        e.preventDefault();
        goToGlobalSlide(1);
        break;
      case 'End':
        e.preventDefault();
        goToGlobalSlide(totalGlobalSlides);
        break;
      case 'o':
      case 'O':
        e.preventDefault();
        toggleOverviewModal();
        break;
      case 'e':
      case 'E':
        e.preventDefault();
        toggleFilesModal();
        break;
      case 'f':
      case 'F':
        e.preventDefault();
        toggleFullscreen();
        break;
    }
  });

  // Master HUD Buttons
  const btnPrev = document.getElementById('btn-prev');
  const btnNext = document.getElementById('btn-next');
  const btnOverview = document.getElementById('btn-overview-toggle');
  const btnFullscreen = document.getElementById('btn-fullscreen');
  const btnFiles = document.getElementById('btn-files-toggle');
  const btnCloseOverview = document.getElementById('close-overview-btn');
  const btnCloseFiles = document.getElementById('close-files-btn');

  if (btnPrev) btnPrev.addEventListener('click', prevGlobalSlide);
  if (btnNext) btnNext.addEventListener('click', nextGlobalSlide);
  if (btnOverview) btnOverview.addEventListener('click', toggleOverviewModal);
  if (btnFullscreen) btnFullscreen.addEventListener('click', toggleFullscreen);
  if (btnFiles) btnFiles.addEventListener('click', toggleFilesModal);

  if (btnCloseOverview) btnCloseOverview.addEventListener('click', () => {
    overviewModal.classList.remove('open');
  });

  if (btnCloseFiles) btnCloseFiles.addEventListener('click', () => {
    filesModal.classList.remove('open');
  });

  // Initialize: load first module
  loadModule(0, 0);
});
