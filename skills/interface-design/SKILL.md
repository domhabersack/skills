---
name: interface-design
description: Use when creating, restyling, or reviewing frontend pages, components, or app layouts (React, Next.js, Tailwind CSS, Headless UI), including requests that only say "add a page" or "make it look better". Covers visual direction, color, typography, layout and hierarchy, components, editor and panel layouts, interaction patterns, responsiveness, and accessibility.
---

# Interface design

The default taste for new and existing UIs. It should follow the guidelines laid out by **Refactoring UI**: clean and hierarchical, and nothing like Material UI. For wording and typography inside the UI, also use the `ui-microcopy` skill. Component details live in `references/components.md` and panel and editor layouts in `references/layout-and-panels.md`; read the one that matches the task.

## Start from what exists

1. **Look at sibling projects first.** If another project of the user's has the same element (`../codeshots`, `../codereels`, `../graphite`), read its component and match font sizes, spacing, heights, colors, and behavior. The sibling "holds the truth". Never change the reference project to match the new one.
2. Check for a shared component (Button, Link, Input, Label, Select) before writing any Tailwind classes for that element. Extract the component when markup repeats, and when finishing a change, scan for more repetition.
3. When something works in project A and not in B, find out why it works in A and bring B in line, rather than inventing a second solution.

## Visual direction

- Clean information hierarchy. Pages show a clear order of importance through size, weight, and color.
- **Whitespace over borders and dividers.** Separate groups with space and background shifts. Borders are for places that need containment (code blocks, inputs, select boxes, tables) and not for decorating cards or sections.
- **No box shadows on resting surfaces.** Convey elevation with background lightness. Short-lived shadows are allowed for transient states, such as lifting a dragged layer.
- Secondary information must look secondary: smaller, muted (zinc-500 or zinc-600), placed after the primary content. Lead paragraphs use zinc-600.
- The interface should not mirror database columns. Present what people care about: group rows under their owner, merge status into the cell it qualifies, and drop columns that only expose an internal relation.
- Dark mode is optional but appreciated. When a project is light-only, keep it consistently light (including menus and popovers).
- Embrace empty space; do not fill a panel for the sake of using it. If a panel has nothing to show (nothing selected), remove it from the layout rather than rendering it empty.

## Color

- Each project has **one main color** taken from the default Tailwind palette (sky for codeshots and graphite). Avoid AI indigo, default violet, and other overused choices. If told "there is too much violet", look for leaks in toggles, focus rings, and badges.
- Neutrals are zinc. Use the main color for actions, links, and active navigation. Switches/toggles may use emerald, kept to one shade throughout.
- Focus rings use the main color. Check them when changing the palette.
- Buttons follow the button recipe in `references/components.md`, in the project's color.
- In previews, use the darkest shade of the theme color as the surrounding panel background, with a legible lighter shade for text on it. When panels differ in background, no border line between them is needed.
- Text cursors and highlights follow the active theme so they remain visible on dark and mid-tone backgrounds.

## Typography

- Inter is fine. A second typeface for headings is welcome.
- **Headings are heavy**, much heavier than default body weights (`font-black` or `font-extrabold`, as the project defines). All heading levels use shared heading components (`H1`, `H2`, …) so sizes change in one place and the same level looks the same on every page.
- Keep default letter-spacing on headings unless there is a reason.
- Form labels use one shared `Label`: `text-sm font-medium text-zinc-700`, dark enough to read.
- Self-host fonts rather than loading them from a font CDN.

## Actions and affordances

- **Actions must look like actions.** Buttons look like buttons. Links look like links.
- Navigation links in headers: no pill backgrounds or padding. Space them with `gap` and underline on hover.
- Use `<button>` for actions and `<a>`/`Link` for navigation.
- **Use context menus sparingly.** Hiding a lone action in a menu is wrong until showing it makes the surface heavy (a tall card footer competing with a thumbnail); then use a menu with a three-dot trigger that is _always visible_ (never hover-only, since touch has no hover) and titled for what it belongs to ("Keyframe 3").
- Prefer master-detail views over modals and stacked pages for related things.
- Text labels for actions, icons as an aid (see `ui-microcopy`).

## Interaction

- **Live feedback.** Hovering over a choice (a color, a theme) previews it right away; clicking persists it. Values show live during drag and resize, including the position that changes when the left edge moves. Do not tint the input that is currently changing.
- **Autosave** with a visible "Last saved" label, but in-progress work never goes live. Publishing is an explicit action, enabled only when there are unpublished changes. New items show a "Draft" marker.
- **Inline rename:** the title of a document is edited in place via an inline form, the same everywhere.
- **Drag and drop:** only the drag handle starts a drag; it shows a grab/pointer cursor, and an active drag lifts the item slightly (small shadow). Use an icon for handles, not a text glyph, because a text cursor on hover is a bug. Always provide a tap alternative on touch (tap to add alongside drag to add).
- Copy-to-clipboard is one shared control: square-2-stack icon, switches to a green check for a few seconds after success, and sits in its own line or in the top-right corner of a code block, never positioned over the content it copies.
- Undo and redo, plus a View menu for showing and hiding panels, belong in a bar below the main header in editors.

## Responsive and touch

- Design **mobile-first**. Every page must be usable at phone width, including docs navigation (the sidebar nav needs a small-screen equivalent).
- The page should not need horizontal scrolling. Code blocks and wide content scroll inside their own container.
- Touch targets are at least 48×48px and square when icon-only.
- Inputs on mobile must not trigger zoom-on-focus (use at least 16px text in inputs).
- If a horizontal scroller is needed (timeline of keyframes), show a real, easily grabbable scrollbar and make sure scrolling doesn't start a drag.
- Settings that are a panel on large screens appear on small screens _below_ the toolbar and push the page content down rather than floating above it.
- Ensure a safe area around canvases/previews. Use the same padding as the sibling project, and at least 32px on every side.

## Accessibility

- Follow WCAG 2.1. Semantic HTML first.
- Icon-only controls need `title` and `aria-label`.
- Keep the accessibility tests and lint rules green after UI changes.
- Contrast: labels, muted text, and text on colored panels must stay readable. Darken labels that are hard to see.

## Process

- Use **Headless UI** primitives (Dialog, Listbox, Switch, Menu) rather than hand-rolled equivalents. Icons come from `@heroicons/react`. Never inline SVG in a component.
- When a design decision is corrected, ask whether it should become a rule in the project's CLAUDE.md. If the same feedback comes twice, add it.
- Show the result at small and large widths and check both before calling a UI change done.
