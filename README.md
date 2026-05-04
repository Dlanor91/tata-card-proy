# Tata Card — control semanal

Aplicación web para **planificar y seguir el gasto semanal** asociado al uso de la tarjeta (Tata Card / vale semanal). Definís un **monto tope** por semana, cargás **ítems con cantidad y precio unitario**, y la app **suma lo usado** y muestra cuánto **queda disponible** (o si te pasaste del límite).

## ¿Para qué sirve?

- Fijar el **monto total semanal** (por ejemplo, el cupo o lo que querés gastar en la semana).
- Registrar compras o conceptos en una **tabla** (descripción, cantidad, precio por unidad).
- Ver en tiempo real el **total usado** y el **saldo disponible** en pesos argentinos, con aviso si superás el tope.

No persiste datos en servidor: todo es **en el navegador** (al recargar la página se pierde el estado salvo que en el futuro se añada almacenamiento).

## Stack técnico

| Aspecto        | Detalle                          |
| -------------- | -------------------------------- |
| Framework      | Angular **19**, componentes **standalone** |
| Estilos        | SCSS                             |
| Formato código | Prettier (`npm run format`)      |
| Rutas          | Ruta principal: `/home-page`   |

## Requisitos

- [Node.js](https://nodejs.org/) (recomendado: **LTS 20 o 22**; versiones impares como la 23 pueden dar avisos de compatibilidad con Angular).

## Comandos

```bash
npm install          # dependencias
npm start            # servidor de desarrollo → http://localhost:4200/
npm run build        # compilación de producción (salida en dist/)
npm test             # tests unitarios (Karma)
npm run format       # aplicar Prettier
npm run format:check # comprobar formato sin escribir archivos
```

## Estructura relevante del código

- `src/app/app.routes.ts` — redirección inicial y ruta `home-page`.
- `src/app/home-page/` — pantalla principal: presupuesto semanal, tabla y cálculos.

## Recursos de Angular

Documentación y CLI: [Angular](https://angular.dev/) · [Angular CLI](https://angular.dev/tools/cli).
