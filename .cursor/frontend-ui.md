Order of use: (1) Angular Material, (2) HTML5 semantic, (3) never div.

- Prefer Angular Material components for UI (buttons, inputs, cards, tables, etc.).
- Where Material does not apply, use semantic HTML5: header, nav, main, section, article, footer, aside, ul/ol/li, button, form, fieldset, label.
- Do not use div; use Material or a semantic element instead.

Apply basic accessibility:

- Landmarks: header, nav, main, footer.
- Buttons: button or Material button, never clickable divs.
- Navigation in nav; interactive elements keyboard accessible.

Always use shared-ui style variables:

- Spacing: $spacing-_ (rem). Typography: $font-size-_, $font-family-_, $font-weight-_, $line-height-\*.
- Colors: $color-_ (text, bg, border, primary, secondary). Radius: $radius-_. Shadows: $shadow-\*.
- Sizing: $size-_ or $container-max-width-_ where applicable. No raw px/rem; use the variables.
