# Agent

## Propósito

Instrucciones para agentes de IA que trabajan en este repositorio. No es la guía general del producto, ni el historial de arquitectura, ni el getting-started para humanos.

## Contexto del proyecto (relevante para el agente)

- Aplicación Angular **19** única (`tata-card`), componentes standalone, sin `AppModule`.
- Pantalla principal: `src/app/home-page/` (presupuesto semanal / “vale semanal”).
- Sin backend; el estado vive en `localStorage` con clave `tata-card:vale-semanal:v1`.
- Despliegue: **Azure Static Web Apps** vía `.github/workflows/azure-static-web-apps-*.yml` (artefacto `dist/tata-card/browser`).
- Producción: [https://delightful-river-06fbd671e.7.azurestaticapps.net/home-page](https://delightful-river-06fbd671e.7.azurestaticapps.net/home-page).
- Convenciones frontend reutilizables: skill personal **`frontend-conventions-es`** (commits ES, HTML semántico, i18n solo si hace falta).

## Reglas estrictas

- No inventar backend, API ni sincronización entre dispositivos.
- No cambiar `STORAGE_KEY` sin un plan de migración (formato versionado `v1`).
- Preferir **HTML semántico** frente a `div` genéricos. Modales con `<dialog>` nativo + `showModal()`.
- Commits en **español** con tipo Conventional Commits en inglés (`feat`, `fix`, …) al proponer mensajes.
- **No añadir i18n**: app monolingüe (español). Solo si el usuario lo pide.
- No hacer commit salvo que el usuario lo pida.
- No reescribir a la ligera la forma de `localStorage`; el restore/parse de `HomePageComponent` debe seguir compatible o migrar de forma explícita.
- `@angular/material` **no** es dependencia; la UI es SCSS propio + CDK DragDrop. No asumir componentes Material.

## Convenciones

### Nombres

- Prefijo de selectores Angular: `app` (`angular.json`).
- Estilos de componente: SCSS; clases estilo BEM `.home-page__*`.

### Organización

- Rutas: `src/app/app.routes.ts` — `''` → `home-page`, lazy `loadComponent`.
- La lógica del vale semanal va en `home-page`, no repartida en shells vacíos.

### Reglas al cambiar código

- Mantener `ChangeDetectionStrategy.OnPush` en `HomePageComponent` salvo motivo claro.
- Formato de moneda visible: `es-AR` / ARS vía `formatMoney`.
- Acciones destructivas (borrar fila / limpiar todo) con el flujo `<dialog>` existente; no borrar datos en silencio.
- Respetar el layout CSS grid de la tabla para que CDK DragDrop siga midiendo bien las filas.
- Seguir la skill `frontend-conventions-es` para commits, UI y componentes.

## Estructura a respetar

- `src/app/home-page/` — feature principal (HTML / TS / SCSS).
- `src/app/app.routes.ts`, `app.config.ts` — cableado de la app.
- `public/` — assets estáticos (incluye `staticwebapp.config.json`).
- `.github/workflows/` — pipeline de deploy; no romper `app_location: dist/tata-card/browser` sin actualizar el workflow.

## Zonas sensibles

- Persistencia: `persistToLocalStorage` / `restoreFromLocalStorage` y `STORAGE_KEY`.
- Reorden automático tras editar precio: `MOVE_TO_END_DELAY_MS` (4000) y el mapa de timers — fácil de regresar la UX.
- Secretos de deploy: el workflow usa `AZURE_STATIC_WEB_APPS_API_TOKEN_*` — nunca commitear tokens.
- Presupuesto de estilos: en producción avisa si un estilo de componente supera ~10 kB (`home-page.component.scss` ya está cerca/sobre el warning).

## Comandos importantes

| Intención | Comando | Notas |
| --- | --- | --- |
| Instalar | `npm install` / `npm ci` | CI usa `npm ci` |
| Ejecutar | `npm start` | `ng serve` → http://localhost:4200/ |
| Test | `npm test` | Karma/Jasmine; **hoy no hay `*.spec.ts`** |
| Build | `npm run build` | Salida en `dist/tata-card` |
| Formato | `npm run format` | Prettier write |
| Verificar formato | `npm run format:check` | Prettier check |

## Dependencias que requieren cuidado

- `@angular/cdk` DragDrop — la tabla usa `display: block` / CSS grid en filas para que CDK mida; cambiar el modelo de display puede romper el reorder.
- Polyfill `zone.js` — requerido por la config actual en `angular.json`.

## Antes de cambiar código

1. Leer juntos `home-page.component.ts` / `.html` / `.scss` en cambios de UI.
2. Preservar el contrato de `localStorage` o documentar bump de clave/versión.
3. Mantener HTML semántico en UI nueva (skill `frontend-conventions-es`).
4. Correr `npm run build` tras cambios sustantivos; mirar warnings de style budget.
5. Actualizar [README.md](README.md) / [Architecture.md](Architecture.md) si cambia comportamiento o estructura de forma relevante.

## Desconocido / Requiere confirmación

- Dominio custom adicional al hostname de Azure SWA (`Desconocido`).
