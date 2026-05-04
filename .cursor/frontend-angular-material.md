All UI components must be built using Angular Material or Angular CDK.

Do NOT introduce third-party UI libraries
(e.g. PrimeNG, Bootstrap, Tailwind UI, etc.).

Prefer Angular Material components over custom HTML
unless the element is trivial and has no interactive behavior.

Do NOT create custom buttons, inputs, dialogs, or form controls
outside Angular Material.

When a component is reused across applications,
it must be implemented inside the shared-ui library
as a wrapper around Angular Material components.

Do NOT deeply override Angular Material styles.
Use theming, SCSS variables, and composition instead.

Angular Material configuration must be centralized
and shared across applications when possible.
