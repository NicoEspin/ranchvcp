# Project Agent Instructions

This is a Next.js 16.2.4 + React 19 + TypeScript + Tailwind CSS 4 project.

## Source of truth

Before doing any Next.js-specific work, read the relevant documentation from:

`node_modules/next/dist/docs/`

Do not rely only on training data for Next.js APIs, App Router behavior, metadata, caching, routing, Server Components, or Client Components.

## Package manager

Use npm/npx unless a package manager is explicitly configured.

Common commands:

```bash
npm run dev
npm run build
npm run lint

Always run:

npm run lint
npm run build

after meaningful code changes.

Tech stack
Next.js 16 App Router
React 19
TypeScript 5.7
Tailwind CSS 4
Radix UI primitives
shadcn-style component architecture
class-variance-authority
clsx
tailwind-merge
lucide-react
react-hook-form
zod
sonner
next-themes
recharts when charts are needed
@vercel/analytics when analytics are needed
General rules
Prefer Server Components by default.
Use "use client" only when the file needs state, effects, browser APIs, event handlers, Radix interactive primitives, animations, or client-only hooks.
Keep components small, readable, and composable.
Do not add new dependencies unless strictly necessary.
Reuse existing utilities, components, tokens, and patterns before creating new ones.
Do not rewrite large areas of the app unless the task explicitly asks for it.
Preserve the existing design direction unless asked to redesign.
Avoid overengineering.
Styling rules
Use Tailwind CSS 4 utilities.
Prefer semantic design tokens and CSS variables when available.
Use cn() for conditional classes.
Use gap-* instead of space-x-* or space-y-*.
Use size-* when width and height are equal.
Keep responsive behavior mobile-first.
Avoid inline styles unless required for dynamic values.
Avoid hardcoded random colors when the project has tokens.
UI quality

The UI should feel modern, clean, premium, and commercial.

Prioritize:

Clear hierarchy
Good spacing
Strong mobile layout
Accessible contrast
Keyboard-friendly interactions
Semantic HTML
Smooth but restrained animations
Conversion-focused CTAs

Avoid:

Generic AI-looking layouts
Overloaded gradients
Too much text in cards
Repeated sections with the same visual rhythm
Decorative elements that hurt readability
TypeScript rules
Use explicit types for exported functions, props, and public utilities.
Avoid any.
Prefer unknown over any when needed.
Use Zod for runtime validation when handling external data.
Keep types close to the feature unless shared globally.
SEO rules

For public pages, consider:

metadata
semantic headings
descriptive titles
Open Graph data when relevant
accessible alt text
clean copy
crawlable content
Forms

Use:

react-hook-form
zod
@hookform/resolvers

Forms should include:

validation messages
accessible labels
disabled/loading states
clear success/error feedback with sonner when appropriate
Final response expectations

When finishing a task, summarize:

What changed
Files touched
Any commands run
Any remaining risks or follow-ups

---

## `/app/AGENTS.md` o `/src/app/AGENTS.md`

```md
# App Router Instructions

This folder uses the Next.js App Router.

## Routing

- Use file-system routing correctly.
- Keep route-specific components close to their route when they are not reused elsewhere.
- Use shared components from `components/` only when they are reusable.
- Avoid putting heavy business logic directly inside page files.

## Server and Client Components

- Pages and layouts should be Server Components by default.
- Add `"use client"` only when needed.
- Do not pass non-serializable props from Server Components to Client Components.
- Keep client islands as small as possible.

## Metadata

- Use Next.js metadata APIs for public pages.
- Each important page should have a clear title and description.
- Avoid duplicate generic metadata across pages.

## Loading and errors

Use framework conventions when relevant:

- `loading.tsx`
- `error.tsx`
- `not-found.tsx`

## Data and caching

Before implementing caching, dynamic rendering, revalidation, or Cache Components, read the relevant docs from:

`node_modules/next/dist/docs/`

Do not guess Next.js 16 caching behavior.