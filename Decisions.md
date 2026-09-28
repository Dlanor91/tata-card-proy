# Decisions

Decisiones técnicas y arquitectónicas relevantes. Historial de solo-append.
No registrar elecciones triviales.

## DEC-001 — App solo-cliente con persistencia en localStorage

- Fecha: Requiere confirmación (presente en docs de producto y código en 2026)
- Estado: Aceptada

### Contexto

El producto es un control personal de gasto semanal (“vale semanal”) usado desde el navegador.

### Problema

Hace falta estado durable entre recargas sin operar un backend.

### Opciones consideradas

1. API backend + base de datos
2. Solo `localStorage` del navegador
3. Sin persistencia (solo sesión)

### Decisión

Correr como SPA pura. Persistir `{ weeklyBudget, lines }` en `localStorage` bajo `tata-card:vale-semanal:v1`.

### Justificación

Documentado en [README.md](README.md): sin servidor, restauración en el mismo dispositivo/origen, se acepta no sincronizar entre dispositivos.

### Consecuencias

- Cero ops de API/DB.
- Datos por navegador; modo privado / cuota pueden bloquear el guardado.
- Cambios de esquema requieren versionar la clave / migrar.

### Alternativas descartadas

- Sync con backend — no está presente y queda fuera de alcance en la docs de producto.

---

## DEC-002 — Hosting en Azure Static Web Apps

- Fecha: Requiere confirmación (workflow presente desde el inicio del proyecto)
- Estado: Aceptada

### Contexto

La app emite un bundle estático de navegador.

### Problema

Hace falta CI de build y hosting para la SPA, incluido el routing client-side.

### Opciones consideradas

1. Azure Static Web Apps + GitHub Actions
2. Otros hosts estáticos (sin evidencia en el repo)

### Decisión

Desplegar con el workflow `Azure Static Web Apps CI/CD`: Node 22, `npm ci`, `npm run build`, subir `dist/tata-card/browser` con `skip_app_build: true`. Fallback SPA vía `public/staticwebapp.config.json`.

### Justificación

Encaja con la salida estática de Angular y aporta hooks de preview/cierre de PR en el workflow.

### Consecuencias

- El deploy depende del secreto `AZURE_STATIC_WEB_APPS_API_TOKEN_*`.
- Cambiar el path de salida exige actualizar el workflow.
- URL de producción confirmada: [https://delightful-river-06fbd671e.7.azurestaticapps.net/home-page](https://delightful-river-06fbd671e.7.azurestaticapps.net/home-page).

### Alternativas descartadas

- No documentadas en el repo.

---

## DEC-003 — HTML semántico y diálogos nativos frente a divs genéricos / Material

- Fecha: 2026-08-22 (regla de UI del proyecto + trabajo de feature)
- Estado: Aceptada

### Contexto

La UI necesita confirmaciones y estructura accesible; la skill `frontend-conventions-es` exige HTML semántico.

### Problema

Evitar wrappers no semánticos y mantener confirmaciones accesibles sin añadir `@angular/material` (no es dependencia).

### Opciones consideradas

1. `div` genérico + roles ARIA
2. Diálogos de Angular Material
3. `<dialog>` nativo + regiones semánticas (`section`, `table`, `footer`, `output`)

### Decisión

Usar HTML5 semántico; confirmaciones vía `<dialog showModal()>`. Material solo si se introduce como dependencia real más adelante; hoy CDK DragDrop cubre el reorder.

### Justificación

Skill `frontend-conventions-es` e implementación del producto; landmarks de accesibilidad y evita dependencia Material no usada.

### Consecuencias

- Los agentes no deben introducir layouts basados en `div` sin justificación.
- Abrir/cerrar el diálogo debe coordinarse con signals / `viewChild` de Angular.

### Alternativas descartadas

- `div`s clickeables y backdrops falsos sin `<dialog>`.

---

## DEC-004 — Commits en español (tipo Conventional Commits en inglés)

- Fecha: Requiere confirmación (skill `frontend-conventions-es`)
- Estado: Aceptada

### Contexto

Convención de equipo para legibilidad del historial git.

### Problema

Mensajes de commit en idiomas mezclados reducen consistencia.

### Decisión

Asunto/cuerpo en español; el **tipo** Conventional Commits sigue en inglés (`feat`, `fix`, …). Un cambio cohesivo por commit.

### Justificación

Skill `frontend-conventions-es` (sección de commits) y práctica del equipo.

### Consecuencias

- Al proponer commits, los agentes deben seguir este formato cuando el usuario lo pida.

### Alternativas descartadas

- Asuntos solo en inglés como estilo por defecto del equipo.
