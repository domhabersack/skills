# Component patterns

Reference for `interface-design`. Class strings are taken from past projects; swap the color for the project's main color.

## Shared components

Keep one component per element and use it everywhere. Typical set: `Button`, `LinkButton`, `Link` (variants: nav, footer, inline), `Input`, `Label`, `Select`, `Badge`, `CopyButton`, `H1`–`H6`. Never write button, link, input, label or select classes inline when one exists.

## Button

Primary button, in the project's color (sky, not indigo):

```
rounded-md bg-sky-600 px-2.5 py-1.5 text-sm font-semibold text-white
hover:bg-sky-500
focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600
```

(The original snippet includes `shadow-xs`; see the no-resting-shadows rule in `SKILL.md`. Drop it in projects that ban shadows.)

## Badge

```
inline-flex items-center rounded-md bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700   (active)
inline-flex items-center rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600   (neutral, e.g. tags)
```

- Use the project's neutral (zinc or gray) for neutral badges.
- Status badges sit under the value they qualify (e.g. under the key), not in a separate "Status" column.
- In cards, tags and status go on their own line below the title and meta.
- A role badge like "Admin" may sit on the avatar, centered horizontally and overlapping its bottom edge. It reuses the same `Badge` component.

## Select (Headless UI Listbox)

- Never use a native `<select>`.
- The options list is exactly as wide as the select box.
- Each option can render a `preview` (a swatch, "Aa" in the font, an aspect-ratio demo) **before** the label. The preview sits in a `size-5` container, centered, so labels all align on one axis. Skip the preview for "Auto" or leave it out for the theme select when it adds nothing, and don't use monospace for the selected font name.
- Aspect-ratio demos: a dark zinc fill with a 2px darker zinc border, not pure black bars.
- Option height and select box height match the sibling project.
- Small visual pickers (colors, gradients) can be a wrapping grid of small rounded buttons showing a swatch, with the name as `title`. Swatches stay square and don't shrink (`shrink-0`).

## Switch

Headless UI `Switch`, left of its label, one shade of green throughout. A muted description line goes below when the effect isn't obvious.

## Copy button

One generic component for every copy-to-clipboard. Heroicons `square-2-stack`, swaps to a green check on success, back after a few seconds. Looks like a button (GitHub-style). No text label. In a dark code box, it sits in the top-right corner in a light color and is plainly clickable.

## Tables

- Grouped-row tables (rows grouped under a header row per owner) when rows belong to an owner: the group header carries the owner, and the owner column disappears.
- Don't use a separate column where a secondary line in the primary cell is enough (status under key, "Key" rather than "Key prefix").
- Put the copy action next to the value it copies, not in an "Actions" column.

## Cards

- Content order, top to bottom: title, description, body/children, optional link.
- Overview cards have no background, border, padding, or shadow. They are a thumbnail, a gap, then details. The whole card is clickable.
- Thumbnails show the real result (gradient, window, line numbers, controls), anchored to the top and cropped at the bottom.
- A footer that competes with the thumbnail is removed; let the thumbnail grow to push any footer down, and avoid `mt-auto` floating tricks.
- Titles on cards and all headlines share one weight.
- Detail lists (definition lists) get generous spacing between labels and values and between pairs.

## Docs pages

- Code blocks: a border, a header bar colored like GitHub's, in both light and dark mode, using the closest Tailwind colors.
- Blocks that show a label such as "Getting an API key": same top and bottom padding; use zinc for the box and ring, not the main color.
- Interactive playground next to the parameter reference, with a live cURL preview.
- Long content lives in one MDX file with components for code blocks and interactive elements, rather than many split files.
- Docs navigation must be reachable on small screens.

## Icons

`@heroicons/react`, imported from the right size and variant directory. Examples already in use: `square-2-stack` (copy), `check` (copied), `chevron-left` / `chevron-right` (collapse a panel, next to its label), `trash` (delete, with `title="Delete"`). Without an equivalent Heroicon, add an icon component in `~/icons/` that accepts `className`. Never paste `<svg>` into a component.
