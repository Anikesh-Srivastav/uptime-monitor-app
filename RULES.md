# Project Rules

This Expo app is intentionally JSX-first for app source files. Use `.jsx` for React components, screens, hooks, theme modules, and services unless the team explicitly decides otherwise later.

## Core Standards

1. Keep `App.jsx` minimal. It should only wire app-level providers, navigation, and the root screen.
2. Build UI with atomic design layers:
   - `atoms`: the smallest reusable parts like buttons, labels, badges, and inputs
   - `molecules`: small combinations of atoms like cards, rows, and form fields
   - `organisms`: larger sections composed from molecules and atoms
   - `templates`: layout shells that define structure without screen-specific content
   - `screens`: feature or route-level composition only
3. Screens should compose existing components. Avoid writing large inline JSX trees inside screens.
4. Keep business logic out of atoms. Atoms should be presentational and prop-driven.
5. One component per file. Name files after the exported component in PascalCase.
6. Prefer explicit props over hidden coupling. Components should be reusable without relying on unrelated module state.
7. Put shared design values in `src/theme`. Avoid repeating raw colors, spacing, and radius values across files.
8. Use `StyleSheet.create` in each component file. Do not place all styles in a global file.
9. Keep mock data, constants, and configuration outside UI files when they are shared or lengthy.
10. Use meaningful folder boundaries. If a component grows too large, split it instead of adding more conditional branches.

## Suggested Structure

```text
src/
  components/
    atoms/
    molecules/
    organisms/
    templates/
  screens/
  navigation/
  hooks/
  services/
  utils/
  theme/
  data/
```

## Production Mindset

1. Reuse before creating new components. If a screen needs a variation, extend the existing component API first.
2. Keep side effects close to features. Network calls belong in `services` or feature-level hooks, not inside presentational components.
3. Keep files focused. If a component handles layout, fetching, transformation, and rendering together, it is too broad.
4. Prefer composition over duplication. Build larger sections from smaller components instead of copying JSX.
5. Make naming obvious. A new teammate should understand a component's role from its name alone.
6. Add tests for business logic and critical user flows as features are introduced.
7. Treat accessibility as part of the default quality bar: readable text, clear touch targets, and descriptive labels.
8. Do not ship placeholder demo data into production paths. Keep sample data isolated.

## JavaScript Rule

Use JSX for app source files:
- Do use `App.jsx`, `HomeScreen.jsx`, `PrimaryButton.jsx`
- Do not add `.ts` or `.tsx` files
- Do not add TypeScript-only syntax, interfaces, or type annotations
