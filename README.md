# WEB502_BASE

This repository is a Vite + React + TypeScript starter used for the WEB502 course.

It includes a minimal React + TypeScript setup with Vite, ESLint configuration hints, and example pages under `src/pages`.

## Notes and tips

- Two official Vite React plugins are available:
  - `@vitejs/plugin-react` (Babel-based Fast Refresh)
  - `@vitejs/plugin-react-swc` (SWC-based Fast Refresh)

## Expanding the ESLint configuration

If you're developing a production application, consider enabling type-aware lint rules. Example `parserOptions` configuration:

```js
export default tseslint.config({
  languageOptions: {
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

- Replace `tseslint.configs.recommended` with `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked` for stricter checks.
- Optionally add `...tseslint.configs.stylisticTypeChecked`.
- To use React-specific lint rules, install `eslint-plugin-react` and add it to `eslint.config.js`.

## Folder layout

- `src/` - application source
- `public/` - static assets
- `db.json` - sample data (excluded from git in this repository's .gitignore)

Enjoy working with the project!
