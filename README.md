# Tata Card — vale semanal

Aplicación web para **planificar y seguir el gasto semanal** (Tata Card / vale semanal). Definís un **monto tope** por semana, cargás **ítems con cantidad y precio unitario**, y la app **suma lo consumido** y muestra cuánto **queda disponible** (o si superaste el límite). Moneda: **pesos argentinos** (`es-AR`).

## ¿Para qué sirve?

- Fijar el **monto total semanal** (cupo o lo que querés gastar en la semana).
- Registrar conceptos en una **tabla**: descripción, cantidad, precio por unidad.
- Ver en tiempo real **consumido**, **disponible** y un aviso si te pasás del tope.

## Datos: dónde viven

| Aspecto | Detalle |
| -------- | ------- |
| **Servidor** | No hay backend: todo corre en el navegador. |
| **Persistencia** | El estado se guarda en **`localStorage`** (clave `tata-card:vale-semanal:v1`). Al recargar o volver otro día **en el mismo dispositivo y origen** (misma URL), se restaura lo último guardado. |
| **Límites** | Modo privado / sin espacio / políticas del navegador pueden impedir guardar. No se sincroniza entre dispositivos ni navegadores. |

### Aviso al salir o recargar (escritorio)

En navegadores de **escritorio** habituales, si hay cambios respecto al estado “vacío” inicial, puede mostrarse el diálogo nativo del navegador al **cerrar la pestaña** o **recargar**. El texto del cuadro es **genérico** (no se puede personalizar).

En **Safari de iPhone**, por limitación de Apple/WebKit, ese aviso **no es fiable**; ahí el respaldo útil es el guardado en `localStorage` anterior.

## Stack técnico

| Aspecto | Detalle |
| ------- | ------- |
| Framework | Angular **19**, componentes **standalone** |
| Estilos | SCSS |
| Formato | Prettier (`npm run format`) |
| Rutas | Raíz redirige a `/home-page` |

## Requisitos

- [Node.js](https://nodejs.org/) — recomendado **LTS 20 o 22** (versiones impares como la 23 pueden dar avisos de compatibilidad con Angular).

## Comandos

```bash
npm install           # dependencias
npm start             # desarrollo → http://localhost:4200/
npm run build         # producción (salida en dist/)
npm test              # tests unitarios (Karma)
npm run format        # aplicar Prettier
npm run format:check  # comprobar formato sin escribir archivos
```

## Estructura relevante

- `src/app/app.routes.ts` — rutas y redirección inicial.
- `src/app/home-page/` — pantalla principal: presupuesto, tabla, cálculos, persistencia y `beforeunload`.

## Documentación Angular

[Angular](https://angular.dev/) · [Angular CLI](https://angular.dev/tools/cli).
