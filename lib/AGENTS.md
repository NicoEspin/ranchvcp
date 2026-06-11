# Lib Instructions

This folder contains shared utilities, schemas, config, helpers, and non-UI logic.

## Rules

- Keep utilities small and pure when possible.
- Avoid React code in this folder unless the file is clearly a hook and belongs in `hooks/`.
- Avoid hidden side effects.
- Prefer named exports.
- Keep function names descriptive.

## Validation

Use Zod for schemas that validate external input, forms, API responses, or environment-like values.

## Utilities

- Use `clsx` and `tailwind-merge` through the project's `cn()` helper.
- Do not duplicate helpers.
- Search existing utilities before creating a new one.

## Dates

Use `date-fns` for formatting or date manipulation.

## Errors

Handle errors explicitly.
Do not silently swallow exceptions unless there is a documented reason.