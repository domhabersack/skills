---
name: ui-microcopy
description: Rules for the words and typography inside a user interface, such as buttons, labels, headings, menus, badges, tooltips, placeholders, option names, and docs page copy. Use whenever writing, renaming, or reviewing any user-facing string in an app, including when building new UI, because casing, quotes, ellipses, and action wording are easy to get subtly wrong.
---

# UI microcopy

How user-facing strings are written. Apply these when adding UI and when reviewing a diff that touches strings. When renaming something, apply the new wording everywhere it appears (logo, `<title>`, nav, docs, badges, tests), not only in the file at hand.

## Casing

Use **sentence case** for every UI string: headings, page titles, buttons, form labels, menu items, table columns, badges, tooltips, and select options. Capitalize only the first word and proper nouns.

| Not                    | But                    |
| ---------------------- | ---------------------- |
| Interactive Playground | Interactive playground |
| API Key                | API key                |
| Send Request           | Send request           |
| View API Docs          | View API docs          |
| Usage Statistics       | Usage statistics       |

- Acronyms and brand names keep their own casing: API, URL, GitHub Light, GitHub Dark (capital `H`).
- Pick one casing for the product name and use it everywhere. It must match in the logo, the `<title>`, headings, and docs. Check this when a new page is added (`Codereels`, not `CodeReels` in one place).
- Never use `text-transform: uppercase` for group titles or labels.

## Typography

- Use a real ellipsis `…`, never three periods `...`. Applies to "Loading…", "Search…", truncated text, and placeholders.
- Use typographic quotes in prose: “ ” for double and ’ for apostrophes and closing single quotes (`didn’t`, `Dom’s`). Straight `"` and `'` are wrong in prose.
- Write the characters literally (source files are UTF-8). Do not mix `&ldquo;`, `“`, and literal characters in the same project. Follow what the project's CLAUDE.md says; if it says nothing, use the literal characters.
- Straight quotes stay straight in code, props, attribute values, and JSON. Only prose content gets typographic quotes.
- When asked to normalize quotes, only touch strings that are content. Do not "fix" quotes that are already curly, and do not turn curly quotes back into straight ones.
- Put the unit with the value, not in a separate label: show units as a read-only add-on on the input (`px`, `s`, `%`), and do not repeat the value above the field.

## Actions

- **Actions get text labels.** Icons may accompany text but never replace it, unless the user explicitly asked for an icon-only control.
- If an icon-only control is requested, give it an accessible name via `title` and `aria-label`, for example a trash icon with `title="Delete"`, or play/pause with the label in `title` so the layout doesn't shift when the state flips.
- Start with a verb that names the result: "Download" (not "Export" when it downloads a file), "Undo" (not "Revert this change"), "Upgrade to Pro", "Send request", "Add keyframe".
- Toggle-like actions name the next state: a control that shows or hides something reads "Show" or "Hide" and flips.
- Switches are labeled with what they turn on, as "Show line numbers" or "Show window controls". Put the switch to the left of its label. If the effect is not obvious, add a muted description line below it.
- Menu triggers are named for what is in them ("File", "View"), never just "Menu". Do not put icons in menu items when the words are enough.
- Do not mix a verb and a noun for the same kind of thing in one list.

## Labels, headings, and names

- Label the user's concept, not the implementation. A gradient picker that sets the backdrop is "Background". "Key" instead of "Key prefix". "Square" instead of "1:1".
- Name things with the product's own noun: the overview of reels is "Your reels", not "Your projects".
- Remove headings that only restate the obvious (a settings panel with sections "Frame", "Code", "Canvas" gets no headings). Prefer no group title over a decorative one.
- Merge a heading and its count into one title when they describe the same thing: "2 unpublished changes", not a heading plus "Changes (2)".
- Labels should fit on one line at the narrowest supported width. Shorten the wording before allowing a wrap ("Window controls", not a two-line label).
- Anything that appears in two places (a badge on a card and a select option in the editor) comes from one label map. Never retype the string.
- Number things for people: 1-indexed ("Keyframe 1", "Keyframe 2"), and use those same strings as tooltips and titles.
- Compact metadata: put secondary values in parentheses rather than joining with middle dots, e.g. `3 keyframes (4.9s)`.
- Lists of allowed values in docs: write "One of:" followed by monospaced values, the way the `format` option is documented. Do not use "options:" with a bullet list.

## Status words

Use short, consistent state words: Draft, Published, Unpublished changes, Locked, Active, Revoked. A new item shows "Draft". Saved state is "Last saved" plus a timestamp.

## Placeholders and examples

- Placeholder values look like placeholders: `YOUR_API_KEY`, not a fake string that resembles a real prefix (`csyour_api_key_here`).
- Demo and preview text that exists to show a difference (theme thumbnails, font previews) uses different colors and varied text so the differences are visible at a glance.

## Errors and empty states

- Say what happened and what the person can do next. Include the real cause when it is known, for example the validation message or a missing field, and not just "Something went wrong".
- Empty states say what goes here and offer the action that fills it.

## Checklist before finishing

1. Every new or changed string is in sentence case, with acronyms and brands intact.
2. No `...` and no straight quotes in prose.
3. Every action has a visible text label (or an explicit exception with `title` and `aria-label`).
4. Names match across the app: nav, headings, `<title>`, badges, selects, docs, tests.
5. Strings that repeat come from one source.
6. Search the codebase for the old wording if anything was renamed.
