Use Angular 19 with standalone components only.
Do not use app.module.ts or SSR.
Use lazy-loaded routes.
Apply domain-based architecture.

This is an Angular workspace with multiple applications and shared libraries.
Do not treat it as a single-application project.

Each application under /projects is independent.
Do not import code directly between applications.
Shared logic must live in shared libraries only.

Landing, tracking, and ERP have different responsibilities.
Do not mix features, routes, or UI components between these applications.

shared-ui and shared-i18n must be consumed as libraries.
Do not bypass library boundaries with relative imports.
