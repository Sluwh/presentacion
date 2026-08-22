# Guión Oficial de Defensa: Portal de Gestión de UTU
**MIUY Studio • 3° Año B.T. Tecnologías de la Información 2026**
**Escuela Técnica de Florida "Prof. Hermenegildo Sabat"**
**Tribunal Evaluador:** Prof. Luis Aguiar • Prof. Alejandro Silva

---

## ⏱️ Resumen de Tiempos y Roles

| Expositor | Módulo / Tema Principal | Diapositivas | Tiempo Estimado |
| :--- | :--- | :---: | :---: |
| **Persona 1** | Contexto, Problemática y Visión General | Slides 01 – 06 | **~4 min** |
| **Marcel** | Autenticación, Seguridad y Gestión de Usuarios | Slides 07 – 09 | **~4 min** |
| **Persona 3** | Módulo de Inventario y Ficha de Equipos | Slides 10 – 13 | **~4 min** |
| **Alan** | Mesa de Ayuda y Ciclo del Ticket | Slides 14 – 16 | **~4 min** |
| **Emiliano** | Asignaciones y Dashboard de Métricas | Slides 17 – 19 | **~4 min** |
| **Samuel** | Base de Soluciones, Aspectos Técnicos y Cierre | Slides 20 – 24 | **~4 min** |

**Tiempo Total de Exposición:** ~24 minutos (+ sesión de preguntas del tribunal).

---

## 🗣️ Detalle del Guión por Expositor

### 1. Persona 1: Contexto, Problemática y Visión General (~4 min)
- **Slides:** 01 a 06.
- **Puntos clave:**
  1. **El problema real (Slides 01 – 03):** Explicar cómo se manejaba antes el equipamiento en UTU: anotaciones en papel y cuadernos propensas a extravíos, planillas Excel dispersas y desincronizadas, falta de control en préstamos y avisos verbales sin seguimiento ante roturas.
  2. **La propuesta (Slide 04):** Qué es el Portal de Gestión de UTU y cómo centraliza el hardware, el soporte técnico (Helpdesk), las asignaciones de activos y los reportes analíticos en una sola plataforma.
  3. **Presencia Comercial & Recorrido Visual (Slides 05 – 06):** Mostrar la web corporativa de MIUY Studio en móvil (captura real del Escritorio, 100% responsiva con selector bilingüe) y el diseño general del portal con su barra lateral de navegación y carga asíncrona fluida de módulos.
- **Pase:** *"A continuación, Marcel detallará la capa de autenticación, seguridad y el panel de administración de usuarios."*

---

### 2. Marcel: Autenticación, Seguridad y Gestión de Usuarios (~4 min)
- **Slides:** 07 a 09.
- **Puntos clave:**
  1. **Acceso y validación (Slide 07):** Inicio de sesión por Cédula de Identidad (CI) sin puntos ni guiones con validación numérica estricta, contraseña cifrada en base de datos y persistencia segura en `$_SESSION`.
  2. **Sistema de 3 Roles (Slide 08):**
     - **Administrador (Rol 1):** Control total del sistema, panel admin, gestión de usuarios, inventario y métricas.
     - **Técnico (Rol 2):** Gestión técnica operativa, inventario, atención de tickets y registro de diagnósticos.
     - **Usuario / Docente (Rol 3):** Acceso exclusivo a Mesa de Ayuda para reportar fallas y consultar sus solicitudes.
  3. **Panel Admin en vivo (Slide 09):** Demostrar con la captura real cómo se da de alta un usuario institucional, cómo se modifica el rol dinámicamente y cómo se activa o desactiva una cuenta preservando la integridad del historial.
- **Pase:** *"Ahora le cedo la palabra a Persona 3, quien expondrá la catalogación del inventario y la ficha técnica de equipos."*

---

### 3. Persona 3: Módulo de Inventario y Ficha de Equipos (~4 min)
- **Slides:** 10 a 13.
- **Puntos clave:**
  1. **Organización del hardware (Slide 10):** Jerarquía de categorías (PCs de escritorio, notebooks, impresoras, monitores, equipamiento de red) con vinculación en cascada de marcas y modelos mediante JavaScript.
  2. **Ciclo de vida y estados (Slide 11):** Control estricto de los 4 estados físicos en base de datos: *Disponible*, *En Uso / Asignado*, *En Mantenimiento* y *De Baja*.
  3. **Búsqueda y filtros (Slide 12):** Demostrar cómo encontrar una máquina rápidamente por número de serie alfanumérico o filtro combinado por categoría y estado físico.
  4. **Ficha técnica (Slide 13):** Detalle individual de hardware, especificaciones y registro histórico de intervenciones y mantenimientos pasados.
- **Pase:** *"Doy paso a Alan para profundizar en el funcionamiento de la Mesa de Ayuda y el ciclo del ticket."*

---

### 4. Alan: Mesa de Ayuda y Ciclo del Ticket (~4 min)
- **Slides:** 14 a 16.
- **Puntos clave:**
  1. **El lado del docente/usuario (Slide 14):** Mostrar cómo se carga un ticket (selección del equipo o falla general, categoría: hardware, software, red, acceso, y nivel de urgencia: baja, media o alta) y cómo el solicitante sigue el estado en vivo.
  2. **El lado del técnico (Slide 15):** Mostrar la bandeja de entrada con vistas especializadas: *Mis Tickets*, *Todos los tickets* y *Equipos con atención*.
  3. **Flujo de resolución en vivo (Slide 16):** Demostrar el simulador interactivo del ciclo del ticket (*Pendiente → En Proceso → Resuelto*), agregando comentarios de seguimiento y guardando la solución técnica aplicada.
- **Pase:** *"A continuación, Emiliano expondrá el módulo de Asignaciones y el Dashboard de Métricas para la dirección."*

---

### 5. Emiliano: Asignaciones y Dashboard de Métricas (~4 min)
- **Slides:** 17 a 19.
- **Puntos clave:**
  1. **Préstamos de equipos (Slide 17):** Mostrar cómo se asigna una máquina disponible a un docente o funcionario con registro nominal y fecha de entrega y devolución, garantizando 100% de trazabilidad.
  2. **Métricas para la dirección (Slide 18):** Mostrar el panel de analíticas y estadísticas en tiempo real:
     - Ranking de equipos que más fallas acumulan (Top 5).
     - Tiempo promedio de resolución (casos generales vs casos críticos).
     - Efectividad del equipo técnico.
  3. **Toma de decisiones basada en datos (Slide 19):** Explicar cómo estos datos ayudan a la dirección a fundamentar compras, tramitar garantías con fabricantes y programar mantenimientos preventivos.
- **Pase:** *"Para concluir, Samuel presentará la Base de Soluciones, la arquitectura técnica y los resultados del proyecto."*

---

### 6. Samuel: Base de Soluciones, Aspectos Técnicos y Cierre (~4 min)
- **Slides:** 20 a 24.
- **Puntos clave:**
  1. **Base de conocimiento (Slide 20):** Registro de diagnósticos y catálogo de soluciones frecuentes para no repetir trabajo ante fallas comunes y acelerar la resolución.
  2. **Stack tecnológico y arquitectura MER (Slide 21):** Explicar la arquitectura backend en PHP nativo, sesiones seguras, base de datos relacional MySQL/MariaDB con modelo MER normalizado de 6 entidades y claves foráneas estrictas.
  3. **Desafíos superados & Soporte Bilingüe (Slide 22):** Lógica de sincronización de estados, permisos por rol en cada vista, filtros en cascada y motor de internacionalización (Español / English) interactivo.
  4. **Resultados y Cierre (Slides 23 – 24):** Comparativa Antes vs Después, cumplimiento del 100% de los requerimientos, agradecimiento a los profesores Luis Aguiar y Alejandro Silva, y apertura formal del espacio de preguntas.

---

## 🎯 Consejos para la Defensa
- Mantener un ritmo sereno y seguro (~1 minuto por diapositiva).
- Utilizar los elementos interactivos en vivo (MER, Simulador de Ticket, Toggle Bilingüe).
- Remitirse a las capturas reales de la aplicación y de la web móvil para demostrar que el sistema está 100% implementado y probado.
