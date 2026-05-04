# Arquitectura de `core` (ERP y apps con core/)

Regla para mantener la estructura de `core` con barrels y rutas cortas. Aplicar siempre que se añadan modelos, servicios o se importe desde `core` en el ERP (o en cualquier app que use esta estructura).

## Estructura de carpetas

```
app/core/
  index.ts          → barrel: reexporta dialog, models, services
  models/
    index.ts        → barrel: reexporta todos los tipos (interfaces *Request, etc.)
    *.model.ts
  services/
    index.ts        → barrel: reexporta todos los servicios
    *.service.ts
  dialog/
    index.ts        → barrel del diálogo (componente, data, service)
    confirm-dialog.*
  i18n/             → sin barrel en core/index (se importa ./core/i18n donde haga falta)
```

## Barrels obligatorios

- **core/models/index.ts**: `export type { X, XRequest } from './x.model';` por cada modelo.
- **core/services/index.ts**: `export { XService } from './x.service';` por cada servicio.
- **core/index.ts**: `export * from './dialog';` `export * from './models';` `export * from './services';`

Al añadir un **nuevo modelo** o **nuevo servicio**, actualizar el barrel correspondiente.

## Imports desde features

- **Siempre** importar desde el barrel `core`, no de archivos concretos:
  - Correcto: `import { Usuario, UsuarioService } from '../../../core';`
  - Incorrecto: `import { Usuario } from '../../../core/models/usuario.model';`
- Dentro de **core** (p. ej. un servicio), importar modelos desde el barrel: `import { X } from '../models';`

## Diálogos y utilidades compartidas

- Componentes reutilizables (p. ej. confirmación) viven en `core/dialog/` con su `.data.ts`, servicio y componente; se exportan vía `core/dialog/index.ts` y por tanto vía `core/index.ts`.
- Cualquier feature importa: `import { ConfirmDialogService } from '../../../core';`

## Resumen

| Dónde estás                | De dónde importar modelos/servicios/dialog          |
| -------------------------- | --------------------------------------------------- |
| Feature (list/form/detail) | `from '../../../core'` (o la profundidad que toque) |
| Servicio en core/services  | `from '../models'` para tipos                       |
| app.config (i18n)          | `from './core/i18n'` (i18n no va en core/index)     |

Mantener esta convención para que las rutas queden cortas y consistentes en todo el proyecto.
