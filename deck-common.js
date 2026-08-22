/**
 * MIUY STUDIO - SLIDE DECK COMMON CONTROLLER
 * Controlador compartido para las presentaciones individuales de cada persona.
 * Funciona de forma autónoma (abriendo el archivo directamente) o integrado en index.html (mediante iframe).
 */

document.addEventListener('DOMContentLoaded', () => {
  const slides = document.querySelectorAll('.slide');
  const totalSlides = slides.length;
  let currentSlide = 0;

  const viewport = document.getElementById('slide-viewport');
  const hudSlideIndicator = document.getElementById('hud-slide-indicator');
  const isEmbedded = window.parent !== window;

  // Si está embebido en el iframe del index, añadimos clase identificadora
  if (isEmbedded) {
    document.body.classList.add('is-embedded-iframe');
  }

  // Auto-escala 16:9 (1280x720) cuando se abre de manera individual
  function resizeViewport() {
    if (isEmbedded) {
      // En iframe, el contenedor padre ya maneja la escala global
      if (viewport) {
        viewport.style.transform = 'none';
      }
      return;
    }

    const stageWidth = window.innerWidth;
    const stageHeight = window.innerHeight;
    const isPortraitMobile = (stageWidth <= 820 && stageHeight >= stageWidth) || stageWidth < 600;

    if (!viewport) return;

    if (isPortraitMobile) {
      document.body.classList.add('is-mobile-portrait');
      viewport.style.transform = 'none';
    } else {
      document.body.classList.remove('is-mobile-portrait');
      const targetWidth = 1280;
      const targetHeight = 720;
      const marginX = stageWidth < 900 ? 10 : 20;
      const marginY = stageHeight < 600 ? 10 : 20;

      const scaleX = (stageWidth - marginX) / targetWidth;
      const scaleY = (stageHeight - marginY) / targetHeight;
      const scale = Math.min(scaleX, scaleY);

      viewport.style.transform = `scale(${scale})`;
      viewport.style.transformOrigin = 'center center';
    }
  }

  window.addEventListener('resize', resizeViewport);
  resizeViewport();

  // Función para ir a una diapositiva local
  function goToSlide(index, notifyParent = true) {
    if (index < 0 || index >= totalSlides) return;

    slides.forEach((s, idx) => {
      s.classList.remove('active', 'exit-left');
      if (idx < index) {
        s.classList.add('exit-left');
      }
    });

    currentSlide = index;
    if (slides[currentSlide]) {
      slides[currentSlide].classList.add('active');
    }

    // Actualizar indicador HUD local
    if (hudSlideIndicator) {
      const globalNum = slides[currentSlide]?.getAttribute('data-slide') || (currentSlide + 1);
      hudSlideIndicator.textContent = `${String(currentSlide + 1).padStart(2, '0')} / ${String(totalSlides).padStart(2, '0')}`;
    }

    // Notificar al master (index.html) si estamos en iframe
    if (isEmbedded && notifyParent) {
      const globalSlide = parseInt(slides[currentSlide]?.getAttribute('data-slide')) || (currentSlide + 1);
      const speakerTag = slides[currentSlide]?.querySelector('.speaker-desc-tag')?.textContent || '';
      window.parent.postMessage({
        type: 'SLIDE_CHANGED',
        localIndex: currentSlide,
        totalLocal: totalSlides,
        globalSlide: globalSlide,
        speakerTag: speakerTag
      }, '*');
    }
  }

  function nextSlide() {
    if (currentSlide < totalSlides - 1) {
      goToSlide(currentSlide + 1);
    } else if (isEmbedded) {
      // Pedir al contenedor maestro avanzar al siguiente orador
      window.parent.postMessage({ type: 'REQUEST_NEXT_SPEAKER' }, '*');
    }
  }

  function prevSlide() {
    if (currentSlide > 0) {
      goToSlide(currentSlide - 1);
    } else if (isEmbedded) {
      // Pedir al contenedor maestro retroceder al anterior orador
      window.parent.postMessage({ type: 'REQUEST_PREV_SPEAKER' }, '*');
    }
  }

  // Escuchar mensajes del index.html
  window.addEventListener('message', (e) => {
    if (!e.data || typeof e.data !== 'object') return;

    if (e.data.type === 'GO_TO_LOCAL_SLIDE') {
      goToSlide(e.data.slideIndex, false);
    } else if (e.data.type === 'NEXT_SLIDE') {
      nextSlide();
    } else if (e.data.type === 'PREV_SLIDE') {
      prevSlide();
    }
  });

  // Atajos de teclado para navegación directa
  document.addEventListener('keydown', (e) => {
    // Si el modal está abierto, no navegar
    const overviewModal = document.getElementById('overview-modal');
    if (overviewModal && overviewModal.classList.contains('open')) return;

    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowDown':
      case ' ':
      case 'PageDown':
        e.preventDefault();
        nextSlide();
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
      case 'PageUp':
        e.preventDefault();
        prevSlide();
        break;
      case 'Home':
        e.preventDefault();
        goToSlide(0);
        break;
      case 'End':
        e.preventDefault();
        goToSlide(totalSlides - 1);
        break;
      case 'f':
      case 'F':
        if (!isEmbedded) {
          e.preventDefault();
          toggleFullscreen();
        }
        break;
    }
  });

  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => console.warn(err));
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }

  // Controles HUD locales
  const btnPrev = document.getElementById('btn-prev');
  const btnNext = document.getElementById('btn-next');
  const btnFullscreen = document.getElementById('btn-fullscreen');

  if (btnPrev) btnPrev.addEventListener('click', prevSlide);
  if (btnNext) btnNext.addEventListener('click', nextSlide);
  if (btnFullscreen) btnFullscreen.addEventListener('click', toggleFullscreen);

  // Soporte táctil Swipe
  let touchStartX = 0;
  let touchStartY = 0;

  window.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    }
  }, { passive: true });

  window.addEventListener('touchend', (e) => {
    if (e.changedTouches.length === 1) {
      const deltaX = e.changedTouches[0].clientX - touchStartX;
      const deltaY = e.changedTouches[0].clientY - touchStartY;
      if (Math.abs(deltaX) > 45 && Math.abs(deltaX) > Math.abs(deltaY) * 1.3) {
        if (deltaX < 0) nextSlide();
        else prevSlide();
      }
    }
  }, { passive: true });

  // Inicializar en primera diapositiva (o según hash de URL ej. #slide-2)
  const hash = window.location.hash;
  let initialIndex = 0;
  if (hash && hash.startsWith('#slide-')) {
    const parsed = parseInt(hash.replace('#slide-', '')) - 1;
    if (!isNaN(parsed) && parsed >= 0 && parsed < totalSlides) {
      initialIndex = parsed;
    }
  }
  goToSlide(initialIndex);
});

// -------------------------------------------------------------
// FUNCIONES INTERACTIVAS (Para diapositivas con demos en vivo)
// -------------------------------------------------------------

// 1. MER Diagram Inspector (Samuel - Slide 21)
window.inspectMerEntity = function(entityName) {
  const detailsBox = document.getElementById('mer-entity-details');
  const entities = document.querySelectorAll('.mer-table-entity');
  entities.forEach(el => el.classList.remove('highlighted'));

  const clickedEl = document.querySelector(`[data-entity="${entityName}"]`);
  if (clickedEl) clickedEl.classList.add('highlighted');

  const entityData = {
    'usuario': {
      name: 'usuario (Entidad Centralizada)',
      desc: 'Unifica perfiles de Administrador, Técnico y Solicitante en una sola estructura. Centraliza la autenticación mediante hash seguro y minimiza duplicidad.',
      fks: 'Clave Primaria: cedula (INT 11) | Rol ENUM (1: Admin, 2: Técnico, 3: Solicitante).'
    },
    'equipo': {
      name: 'equipo (Inventario de Activos)',
      desc: 'Registra el hardware corporativo con número de serie alfanumérico VARCHAR(100), tipo, marca, modelo y estado físico controlado por motor relacional.',
      fks: 'Clave Primaria: numero_serie | Estados: disponible, en_uso, en_mantenimiento, de_baja.'
    },
    'asignacion': {
      name: 'asignacion (Historial de Custodia)',
      desc: 'Permite auditoría patrimonial: vincula cada máquina al funcionario receptor con fecha_inicio y fecha_fin (NULL = custodia activa).',
      fks: 'Claves Foráneas: numserie_equipo → equipo.numero_serie | cedula_usuario → usuario.cedula'
    },
    'ticket': {
      name: 'ticket (Mesa de Ayuda)',
      desc: 'Gestiona el ciclo de vida de incidentes de soporte técnico. Permite técnico nullable (0..1) al ingreso y asociación opcional a un activo físico.',
      fks: 'Claves Foráneas: cedula_solicitante (NOT NULL) | cedula_tecnico (NULLABLE) | numserie_equipo (NULLABLE)'
    },
    'actuacion': {
      name: 'actuacion (Base de Conocimiento)',
      desc: 'Almacena intervenciones técnicas, diagnósticos detallados y notas de resolución por incidencia con estampas de tiempo.',
      fks: 'Claves Foráneas: id_ticket → ticket.id | cedula_tecnico → usuario.cedula'
    },
    'movimiento_equipo': {
      name: 'movimiento_equipo (Auditoría de Activos)',
      desc: 'Bitácora exhaustiva de cambios de estado (alta, baja, asignación, retiro, mantenimiento) para prevenir extravíos.',
      fks: 'Claves Foráneas: numserie_equipo → equipo.numero_serie | cedula_tecnico → usuario.cedula'
    }
  };

  const data = entityData[entityName];
  if (data && detailsBox) {
    detailsBox.innerHTML = `
      <div style="background:#eff6ff; border:1px solid #bfdbfe; border-radius:8px; padding:10px 14px;">
        <div style="color:var(--primary); font-size:13px; font-weight:800; margin-bottom:3px; font-family:var(--font-display);"><i class="fa-solid fa-table"></i> ${data.name}</div>
        <p style="font-size:12px; color:#334155; margin-bottom:4px; line-height:1.4;">${data.desc}</p>
        <div style="font-size:10.5px; font-family:var(--font-mono); color:#0284c7; font-weight:600;">${data.fks}</div>
      </div>
    `;
  }
};

// 2. Ticket Workflow Simulator (Alan - Slide 16)
let simCurrentStep = 1;
window.nextWorkflowStep = function() {
  simCurrentStep = (simCurrentStep % 3) + 1;
  updateWorkflowDisplay();
};

function updateWorkflowDisplay() {
  const steps = document.querySelectorAll('.workflow-step-item');
  const simBox = document.getElementById('ticket-sim-preview');
  if (!steps.length || !simBox) return;

  steps.forEach((st, idx) => {
    st.classList.toggle('active-step', (idx + 1) === simCurrentStep);
  });

  if (simCurrentStep === 1) {
    simBox.innerHTML = `
      <div style="background:#fef2f2; border:1px solid #fecaca; border-radius:10px; padding:12px;">
        <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
          <span style="font-weight:800; color:#b91c1c; font-size:11.5px;"><i class="fa-solid fa-circle-dot"></i> TICKET #104 - PENDIENTE</span>
          <span style="font-size:10.5px; color:#64748b;">Solicitante: Juan Pérez (C.I. 4.892.110)</span>
        </div>
        <p style="font-size:12.5px; font-weight:600; color:#1e293b;">"Impresora de Dirección no responde en red"</p>
        <p style="font-size:11px; color:#64748b; margin-top:3px;">Asignado a: <em>Sin técnico asignado</em> | Equipo: IMP-KYOCERA-09</p>
      </div>
    `;
  } else if (simCurrentStep === 2) {
    simBox.innerHTML = `
      <div style="background:#eff6ff; border:1px solid #bfdbfe; border-radius:10px; padding:12px;">
        <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
          <span style="font-weight:800; color:#0284c7; font-size:11.5px;"><i class="fa-solid fa-spinner"></i> TICKET #104 - EN PROCESO</span>
          <span style="font-size:10.5px; color:#64748b;">Técnico asignado: Soporte TI Sabat</span>
        </div>
        <p style="font-size:12.5px; font-weight:600; color:#1e293b;">Diagnóstico: Conflicto de IP estática tras reinicio de switch.</p>
        <p style="font-size:11px; color:#2563eb; margin-top:3px;">Actuación técnica registrada: "Se renueva concesión DHCP y prueba de ping exitosa."</p>
      </div>
    `;
  } else if (simCurrentStep === 3) {
    simBox.innerHTML = `
      <div style="background:#f0fdf4; border:1px solid #bbf7d0; border-radius:10px; padding:12px;">
        <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
          <span style="font-weight:800; color:#166534; font-size:11.5px;"><i class="fa-solid fa-circle-check"></i> TICKET #104 - RESUELTO</span>
          <span style="font-size:10.5px; color:#166534; font-weight:700;">Tiempo Total: 32 min</span>
        </div>
        <p style="font-size:12.5px; font-weight:600; color:#14532d;">Solución ingresada a Base de Conocimiento y equipo operativo.</p>
        <p style="font-size:11px; color:#15803d; margin-top:3px;">Notificación enviada al solicitante | Movimiento registrado en auditoría.</p>
      </div>
    `;
  }
}

// 3. Bilingual Demo Toggle (Samuel - Slide 22)
let currentDemoLang = 'es';
window.toggleDemoLang = function() {
  currentDemoLang = (currentDemoLang === 'es') ? 'en' : 'es';
  const langBtnText = document.getElementById('btn-lang-text');
  const tTitle = document.getElementById('demo-text-title');
  const tSub = document.getElementById('demo-text-sub');
  const tNav1 = document.getElementById('demo-text-nav1');
  const tNav2 = document.getElementById('demo-text-nav2');
  const tNav3 = document.getElementById('demo-text-nav3');

  if (currentDemoLang === 'es') {
    if (langBtnText) langBtnText.textContent = 'Idioma: Español (Clic para Inglés)';
    if (tTitle) tTitle.textContent = 'Portal de Gestión de Recursos y TI';
    if (tSub) tSub.textContent = 'Bienvenido a la plataforma institucional centralizada';
    if (tNav1) tNav1.textContent = 'Inventario';
    if (tNav2) tNav2.textContent = 'Mesa de Ayuda';
    if (tNav3) tNav3.textContent = 'Métricas';
  } else {
    if (langBtnText) langBtnText.textContent = 'Language: English (Click for Spanish)';
    if (tTitle) tTitle.textContent = 'IT Resource & Support Management Portal';
    if (tSub) tSub.textContent = 'Welcome to the centralized institutional platform';
    if (tNav1) tNav1.textContent = 'Inventory';
    if (tNav2) tNav2.textContent = 'Helpdesk';
    if (tNav3) tNav3.textContent = 'Analytics';
  }
};
