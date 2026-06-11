# Components Instructions

This folder contains reusable UI components.

## Component architecture

- Prefer composition over large prop APIs.
- Avoid boolean prop explosion.
- Keep components focused and reusable.
- Split complex components into smaller internal parts.
- Do not create abstractions before there are at least two real use cases.

## Radix / shadcn-style rules

- Use Radix primitives for accessible interactive behavior.
- Preserve accessibility requirements: labels, titles, keyboard support, focus states.
- Dialogs, sheets, drawers, popovers, dropdowns, selects, tooltips, and menus must remain accessible.
- Do not remove required Radix structure just to simplify markup.

## Styling

- Use Tailwind CSS utilities.
- Use `cn()` for class merging.
- Use `cva()` for components with variants.
- Prefer variants over repeated className conditionals.
- Keep components theme-compatible with `next-themes`.

## Icons

- Use `lucide-react`.
- Keep icon usage consistent.
- Icons should usually be decorative unless they communicate essential meaning.
- Add accessible labels when icon-only buttons are used.

## Responsive behavior

Every reusable component should work on mobile first.

Check:

- small screens
- touch targets
- overflow
- long text
- keyboard navigation
- dark mode if enabled

## Do not

- Do not create custom dropdowns, modals, selects, accordions, tabs, or tooltips if Radix/shadcn-style primitives already exist.
- Do not add new component libraries.
- Do not hardcode one-off visual decisions into reusable primitives.