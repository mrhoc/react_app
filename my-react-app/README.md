# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])

```

You can also install [eslint-plugin-react-x](https://npmx.dev/package/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://npmx.dev/package/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])

```
Lộ trình
Giai đoạn 1 — React fundamentals
1. JSX + Component
2. Props
3. useState
4. Event handling
5. Conditional rendering
6. List + key
7. Form + controlled component
8. useEffect
9. useRef
10. Component composition
Giai đoạn 2 — TypeScript với React
11. Type Props
12. Type Event
13. Type useState
14. Interface / type
15. Generic
16. Custom Hook
17. Context API
Giai đoạn 3 — State management
18. Zustand
19. Store / selector
20. Global state
21. Derived state
22. Persist state
Giai đoạn 4 — Server state
23. TanStack Query
24. Query / Mutation
25. Loading / Error
26. Cache
27. Invalidation
28. Pagination
29. Optimistic update
Giai đoạn 5 — React thực tế
30. React Router
31. Authentication
32. Protected Route
33. API
34. Form validation
35. Performance
36. memo, useMemo, useCallback
37. Code splitting
38. Error Boundary
Giai đoạn 6 — Advanced + interview
39. React rendering
40. Reconciliation
41. Virtual DOM
42. State architecture
43. Performance debugging
44. Testing
45. Project architecture
46. Frontend interview questions