Order of use: (1) Angular Material, (2) HTML5 semantic, (3) never div.

- Prefer Angular Material components for UI (buttons, inputs, cards, tables, etc.).
- Where Material does not apply, use semantic HTML5. **Do not use `div`**; choose the element that describes the content or role.
- If no semantic element fits and Material does not apply, explain why before using a non-semantic wrapper.

## Semantic elements (use these instead of div)

| Purpose | Use |
| -------- | ----- |
| Page regions | `header`, `nav`, `main`, `section`, `article`, `aside`, `footer` |
| Lists | `ul`, `ol`, `li`, `dl`, `dt`, `dd` |
| Data tables | `table`, `thead`, `tbody`, `caption`, `th`, `td` |
| Forms | `form`, `fieldset`, `legend`, `label`, `input`, `button` |
| Modal / confirm | `dialog` (with `showModal()`), actions in `footer` inside the dialog |
| Text | `p`, `h1`–`h6`, `strong`, `em` |
| Inline non-text | `span` (only when no block semantic applies) |

## Examples

```html
<!-- ❌ Avoid -->
<div class="modal">...</div>
<div class="modal-actions">...</div>
<div (click)="action()">Click me</div>

<!-- ✅ Correct -->
<dialog>...</dialog>
<footer>...</footer>
<button type="button" (click)="action()">Click me</button>
```

## Accessibility

- Landmarks: `header`, `nav`, `main`, `footer`.
- Buttons: `button` or Material button; never clickable `div`s.
- Dialogs: native `dialog` with `aria-labelledby` / `aria-describedby`; close on Escape and backdrop when appropriate.
- Navigation in `nav`; interactive elements keyboard accessible.

## Styles

Always use shared-ui style variables:

- Spacing: `$spacing-_` (rem). Typography: `$font-size-_`, `$font-family-_`, `$font-weight-_`, `$line-height-*`.
- Colors: `$color-_` (text, bg, border, primary, secondary). Radius: `$radius-_`. Shadows: `$shadow-*`.
- Sizing: `$size-_` or `$container-max-width-_` where applicable. No raw px/rem; use the variables.
