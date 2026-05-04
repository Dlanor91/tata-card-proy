All user-facing text must be internationalized.

Rules:

1. No hardcoded text in templates, components, or styles.
2. Every key must exist in BOTH en.json and es.json.
3. Keys must be UPPER*SNAKE_CASE, grouped by feature (HEADER*, FOOTER*, HOME*, COMMON\_).
4. Use {{ 'KEY_NAME' | translate }} in templates.
5. Use TranslateService in components when needed.
6. Missing translations are NOT allowed.
7. Apply retroactively to existing code when touched.

Enforce strictly. Any violation must be fixed immediately.
