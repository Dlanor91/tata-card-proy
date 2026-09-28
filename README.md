# Tata Card — vale semanal

Aplicación web para **planificar y seguir el gasto semanal** (Tata Card / vale semanal). Definís un **monto tope** por semana, cargás **ítems con cantidad y precio unitario**, y la app **suma lo consumido** y muestra cuánto **queda disponible** (o si superaste el límite). Moneda: **pesos argentinos** (`es-AR`).

## Qué es

Control semanal de gastos pensado para usar en el momento de la compra, en el navegador, sin planilla ni servidor.

## Problema que resuelve

Llevar el cupo semanal (vale) sin depender de Excel ni de una app con cuenta/backend.

## Qué hace

- Fijar el **monto total semanal** (por defecto **$ 1.755**; editable).
- Registrar conceptos en una **tabla**: descripción, cantidad, precio por unidad.
- Ver en tiempo real **consumido**, **disponible** y un aviso si te pasás del tope.
- **Limpiar ítems** de una sola vez para empezar una compra nueva sin borrar fila por fila.
- **Confirmación** al **eliminar** una fila o al **limpiar** todos los ítems: diálogo con **Sí** / **No**.
- Al **ingresar un precio** (> 0), el ítem se considera comprado y **pasa al final** de la lista tras **unos 4 segundos** sin más cambios de precio (los de precio 0 quedan arriba).
- **Reordenar** filas con **arrastrar y soltar** desde el asa de cada fila.

## Datos: dónde viven

| Aspecto          | Detalle                                                                                                                                                                                        |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Servidor**     | No hay backend: todo corre en el navegador.                                                                                                                                                    |
| **Persistencia** | El estado se guarda en **`localStorage`** (clave `tata-card:vale-semanal:v1`). Al recargar o volver otro día **en el mismo dispositivo y origen** (misma URL), se restaura lo último guardado. |
| **Límites**      | Modo privado / sin espacio / políticas del navegador pueden impedir guardar. No se sincroniza entre dispositivos ni navegadores.                                                               |

### Aviso al salir o recargar (escritorio)

En navegadores de **escritorio** habituales, si hay cambios respecto al estado “vacío” inicial, puede mostrarse el diálogo nativo del navegador al **cerrar la pestaña** o **recargar**. El texto del cuadro es **genérico** (no se puede personalizar).

En **Safari de iPhone**, por limitación de Apple/WebKit, ese aviso **no es fiable**; ahí el respaldo útil es el guardado en `localStorage` anterior.

## Stack técnico

| Aspecto   | Detalle                                                                           |
| --------- | --------------------------------------------------------------------------------- |
| Framework | Angular **19**, componentes **standalone**                                        |
| Estilos   | SCSS                                                                              |
| Formato   | Prettier (`npm run format`)                                                       |
| Rutas     | Raíz redirige a `/home-page`                                                      |
| UI        | HTML semántico (`section`, `dialog`, `table`, etc.); skill `frontend-conventions-es` |
| Hosting   | Azure Static Web Apps (CI en GitHub Actions)                                      |

## Requisitos

- [Node.js](https://nodejs.org/) — recomendado **LTS 20 o 22** (CI usa **22**; versiones impares como la 23 pueden dar avisos de compatibilidad con Angular).

## Puesta en marcha

### Instalar

```bash
npm install
```

### Configurar

No hay variables de entorno de aplicación en el código. El deploy usa secretos de GitHub Actions para Azure SWA (solo CI).

### Variables de entorno

| Variable | Obligatoria | Propósito                                      | Valor por defecto |
| -------- | ----------- | ---------------------------------------------- | ----------------- |
| —        | —           | Runtime de la app: ninguna en el código fuente | —                 |

## Uso

### Ejecutar

```bash
npm start             # desarrollo → http://localhost:4200/
```

### Probar

```bash
npm test              # Karma/Jasmine (hoy no hay archivos *.spec.ts en el repo)
```

### Construir

```bash
npm run build         # producción → dist/tata-card
```

### Formato

```bash
npm run format        # aplicar Prettier
npm run format:check  # comprobar formato sin escribir archivos
```

### Producción

App desplegada en Azure Static Web Apps:

- [https://delightful-river-06fbd671e.7.azurestaticapps.net/home-page](https://delightful-river-06fbd671e.7.azurestaticapps.net/home-page)

La raíz del sitio redirige a `/home-page`.

## Estructura del proyecto

- `src/app/app.routes.ts` — rutas y redirección inicial.
- `src/app/home-page/` — pantalla principal: presupuesto, tabla, cálculos, persistencia, orden por precio, drag-and-drop, limpiar ítems, confirmaciones y `beforeunload`.
- `public/` — assets estáticos (incl. `staticwebapp.config.json`).
- `.github/workflows/` — build y deploy a Azure Static Web Apps.

## Documentación relacionada

- Guía para agentes: [Agent.md](Agent.md)
- Arquitectura: [Architecture.md](Architecture.md)
- Decisiones: [Decisions.md](Decisions.md)
- Semántica UI / commits: skill personal `frontend-conventions-es`

## Convenciones del proyecto

- Skill personal **`frontend-conventions-es`**: commits en español, HTML semántico, i18n solo si hace falta.
- App monolingüe (español): no introducir i18n salvo pedido explícito.

## Documentación Angular

[Angular](https://angular.dev/) · [Angular CLI](https://angular.dev/tools/cli).

## Desconocido / Requiere confirmación

- Dominio custom adicional al hostname de Azure SWA (`Desconocido`).
