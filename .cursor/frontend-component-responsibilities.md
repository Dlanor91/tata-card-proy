# Separación de responsabilidades en componentes (frontend)

Reglas para crear y mantener componentes con responsabilidad única, como ingeniero frontend senior.

## Una responsabilidad por componente

- Cada componente hace **una cosa** y bien: listar, mostrar detalle, formulario, toolbar, etc.
- Si un componente hace “listar + filtrar + llamar API + formatear + mostrar modal”, dividir en componentes o delegar a servicios.

## Dónde va la lógica

- **Servicios:** llamadas HTTP, estado global o compartido, reglas de negocio, transformación de datos (map/filter que no sea puro presentación).
- **Componente contenedor (smart):** obtiene datos (vía servicio o resolver), pasa datos a hijos por `@Input`, reacciona a `@Output`, orquesta navegación y submit.
- **Componente presentacional (dumb):** recibe datos por `@Input`, emite eventos por `@Output`, no inyecta servicios de API ni conoce rutas; solo muestra y notifica.

## Template

- El HTML solo enlaza datos y eventos: `{{ }}`, `[prop]`, `(event)`, `@if`/`@for`.
- Sin lógica de negocio en el template (ni cálculos complejos ni llamadas).
- Formateo: usar **pipes** o métodos del componente que devuelvan string/número; no bloques de lógica en el template.

## Estado

- **Local (solo este componente):** `signal()` o propiedades en el componente.
- **Compartido o de pantalla:** servicio (o store si se usa más adelante).
- No duplicar estado: si dos componentes necesitan los mismos datos, subir a un padre común o a un servicio.

## Archivos del componente

- **`.ts`:** props (`@Input`/`@Output`), estado, llamadas a servicios y métodos que el template usa. Mantener el archivo enfocado; si crece mucho, extraer lógica a un servicio o a un hijo.
- **`.html`:** estructura y binding; semántica y accesibilidad (landmarks, labels).
- **`.scss`:** estilos del componente; usar variables de shared-ui (`$spacing-*`, `$color-*`, etc.), sin `px` en layout.

## Delegación y reutilización

- Los componentes **delegan** en servicios para API y reglas de negocio.
- Los componentes hijos no conocen la fuente de los datos; solo reciben `@Input` y emiten `@Output`.
- Código repetido entre componentes: extraer a servicio, pipe o componente compartido (en shared-ui si es reutilizable entre apps).

## Resumen rápido

| Responsabilidad         | Dónde va                                        |
| ----------------------- | ----------------------------------------------- |
| HTTP / API              | Servicio                                        |
| Reglas de negocio       | Servicio (o contenedor si es solo orquestación) |
| Estado de pantalla      | Contenedor o servicio                           |
| Presentación y eventos  | Componente presentacional                       |
| Formateo (fechas, etc.) | Pipe o método en el componente                  |
| Estilos                 | SCSS del componente + variables                 |

Si un componente mezcla “llamar API + formatear + decidir qué mostrar según permisos”, separar: servicio para API y reglas, componente para presentación y orquestación mínima.
