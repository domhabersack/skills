---
name: ui-microcopy
description: Clean up writing in prose and user interfaces by replacing generic, generated-sounding phrasing with clear wording.
---

# UI microcopy

How user-facing strings are written. Apply these when adding UI and reviewing diffs that touch strings. When renaming something, apply the new wording everywhere it appears (e.g. in content, navigation, documentation, tests), not only in the file at hand.

## Casing

Use **sentence case** for all UI strings, including headings, page titles, buttons, form labels, navigation items, and select options. Capitalize only the first word and proper nouns.

| Not                    | But                    |
| ---------------------- | ---------------------- |
| Interactive Playground | Interactive playground |
| API Key                | API key                |
| Send Request           | Send request           |
| View API Docs          | View API docs          |
| Usage Statistics       | Usage statistics       |

- Acronyms and brand names keep their own casing: API, URL, GitHub (capital `H`).
- Pick one casing for the product name and use it consistently. It must match in the logo, `<title>`, headings, and docs. Check this when a new page is added.
- Never use `text-transform: uppercase` for group titles or labels.

## Typography

- Use a real ellipsis (`…`), never three periods (`...`). Applies to "Loading…", "Search…", truncated text, and placeholders.
- Use typographic quotes (`“` and `”` for double quotes, `’` for apostrophes and closing single quotes) in prose, e.g. `didn’t`, `team’s`. Straight quotes (`"`, `'`) are wrong in prose.
- Source files are UTF-8. Write characters literally. Do not mix `&ldquo;`, `“`, and literal characters. Follow what the project’s `CLAUDE.md` says; if it says nothing, use literal characters.
- Straight quotes stay straight in code, props, attribute values, and JSON. Only prose content gets typographic quotes.
- When asked to normalize quotes, only touch strings that are content. Do not “fix” quotes that are already curly, and do not turn curly quotes back into straight ones.

## Actions

- **Actions get text labels.** Icons may accompany text but never replace it, unless the user explicitly asked for an icon-only control.
- If an icon-only control is requested, give it an accessible name via `title` and `aria-label`, for example a trash icon with `title="Delete"`, or play/pause with the label in `title` so the layout doesn’t shift when the state flips.
- Start with a verb that names the result: “Download” (not “Export” when it downloads a file), “Undo” (not “Revert this change”), “Upgrade to Pro”, “Send request”, “Add keyframe”.
- Toggle-like actions name the next state: a control that shows or hides something reads “Show” or “Hide” and flips.
- Switches are labeled with what they turn on, not what they turn off: “Show line numbers” (not “Hide line numbers”).
- Menu triggers are named for what is in them: “File”, “View” (never just “Menu”).
- Do not mix a verb and a noun for the same kind of thing in one list.

## Labels, headings, and names

- Label the user’s concept, not the implementation: “Background” (not “Gradient” for a gradient picker that sets the backdrop), “Square” (not “1:1”).
- Name things with the product’s own noun: “Your reels” (not “Your projects”).
- Merge a string and its count into one unit when they describe the same thing: “2 unpublished changes” (not “Changes (2)”).
- Number things 1-indexed for people even if the underlying data is 0-indexed: “Keyframe 1” for the first keyframe (not “Keyframe 0”).
- Compact metadata by putting secondary values in parentheses rather than joining with middle dots: “3 keyframes (4.9s)” (not “3 keyframes ・ 4.9s”).

## Minimizers

- Do not use words like “only”, “just”, “simply”, “easily”, “merely”, or “quickly” to make tasks, claims, or requests sound smaller than they are. They do not add information. Write instructions plainly and clearly: “Click Save” (not “Simply click save”).
- Keep “only” when it actually restricts meaning: “Only admins can delete files” (not “I only wanted to ask…”).
- When unsure, delete the minimizer and see if the meaning changes. If it does not, it was an unnecessary filler word.

## Avoid generated-sounding copy

Readers recognize and skip patterns that are common in AI-generated interfaces. Avoid them.

- Do not use hype words. Say what the product does and for whom, plainly. Do not write “unlock”, “supercharge”, “seamless”, “elevate”, “effortless”, “next-level”, or “similar”: “Generate images from code snippets” (not “Supercharge your workflow”).
- Do not write staged reveals. Avoid “It’s not just X, it’s Y”, “Not X. Y.”, dramatic dash reveals, and rhetorical questions as headings. Make the point in one direct sentence: “Codeshots turns snippets into images you can post” (not “It’s not just a screenshot tool. It’s a whole new way to share code.”)
- Do not advertise made-up stats. Round numbers like 10x or 99.9% with no source look filled in. Remove those fake values or show real numbers with what they measure: “1,284 screenshots shared last week” (not “thousands of images shared”).
- Do not add labels above headings. Do not put small kicker or eyebrow labels (e.g. “PRICING”, “FEATURES”) above headings. A good heading says what follows on its own, and the labels turn into noise.
- Do not use emoji as decoration. They do not replace icons, bullets, or section markers. Do not start headings or list items with them. Use plain text, or an icon where it helps scanning.

## Placeholders and examples

- Placeholder values look like placeholders in `SCREAMING_SNAKE_CASE` instead of fake strings that resemble real values: `YOUR_API_KEY` (not `csyour_api_key_here`).

## Errors and empty states

- Say what happened and what the person can do next. Include the real cause when it is known, for example the validation message or a missing field, and not just “Something went wrong”.
- Empty states say what goes here and offer the action that fills it.

## Checklist before finishing

1. Every new or changed string is in sentence case, with acronyms and brands intact.
2. No `...` and no straight quotes in prose.
3. Every action has a visible text label (or an explicit exception with `title` and `aria-label`).
4. Names match across the app: nav, headings, `<title>`, selects, docs, tests.
5. No hype words, staged reveals, invented numbers, eyebrow labels, or decorative emoji.
6. Search the codebase for the old wording if anything was renamed.
