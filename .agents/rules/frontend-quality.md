---
trigger: always_on
glob: client/**/*.{ts,tsx}
description: Rule to enforce high-quality frontend development patterns for React and TypeScript
---

# Frontend Code Quality Rules

Follow these rules to ensure the codebase remains maintainable, testable, and robust.

## 🏗 Architecture Rules

1. **Feature-Based Folder Structure**: Use `src/features/[featureName]/` for business logic. Features should contain their own components, hooks, types, and API logic.
2. **Self-Contained Features**: Avoid cross-feature imports. If a component is needed by multiple features, move it to `src/components/`.
3. **API Logic Isolation**: Keep API calls in `api.ts` or `services/`. Never call APIs directly inside components.
4. **Types for API Responses**: Always define TypeScript interfaces for API responses to prevent runtime errors.

## 📦 Component Patterns

1. **Pure Components**: Components should receive data via props rather than fetching it themselves via hooks (unless it's a "Smart/Container" component at the feature level).
2. **UI Only**: Keep components focused on rendering. Move complex logic to custom hooks.
3. **Compound Components**: Use the `Modal.Header`, `Modal.Body` pattern for complex UI to keep props clean.

## 🪝 Hooks Patterns

1. **Feature-Specific Hooks**: Create hooks like `useTasks` inside feature folders to encapsulate data fetching and logic.
2. **React Query for Server State**: Use TanStack Query (React Query) for all API data. Use `useState` only for UI-only state (e.g., toggles).

## 🎨 Styling Rules

1. **Tailwind First**: Use Tailwind CSS for 90% of styling. Avoid inline styles.
2. **shadcn/ui**: Use pre-built components from `components/ui/` instead of building from scratch.

## 🧪 Testing Rules

1. **Test by Behavior**: Test components by passing props and checking rendered output. Avoid mocking internal logic unless necessary.
2. **TDD Flow**: Write a failing test first, then implement the feature, then refactor.

## 📋 Pre-Implementation Checklist

Before writing code:

- Define API response types.
- Agree on API contract with the backend.
- Plan the folder structure (`features/X/components`, `features/X/api.ts`).
- Define the component props interface.

## 🎯 Common Mistakes to Avoid

- Calling `axios` or `fetch` directly in a component's `useEffect`.
- Using `any` type for API data.
- Large, monolithic components (split them up!).
- Storing fetched data in `useState` instead of React Query.
