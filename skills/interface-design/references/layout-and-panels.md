# Layout, editors, and panels

Reference for `interface-design`. Patterns for app shells and editor-style screens (canvas editors, code editors, timelines).

## App shell

- **One header component across every page**, including docs and the dashboard. Pages must not each get their own header.
- The logo always links to the landing page, even when logged in. Don't redirect a logged-in visitor away from the homepage.
- Navigation items live in the header (a "Dashboard" link next to the avatar when signed in). Breadcrumbs are dropped in favor of that.
- Dashboard-only links and controls go into a **sidebar below the header**, shown only in the dashboard.
- Page title and page-level actions go in a **second bar below the header** (project settings, Download). The primary action is a real button and is the rightmost element.
- Editor tools (language select, settings, export) are a toolbar below the header. Undo, redo, and a View menu (and a File menu) belong in a bar of their own.

## Editor screens

Three-area layout on large screens:

1. The thing being edited, rendered as WYSIWYG (the same size, window chrome, gradient, and theme the output will have).
2. A live preview.
3. Settings, always visible on the side at large widths.

The editor is centered in its panel on the same background the sibling project uses. If it's wider than the viewport, anchor it top-left so content is immediately visible rather than centered with the left side offscreen.

Canvas sizing rule: the minimum dimension applies only when no frame has content. Once content exists, every frame uses the largest dimensions required across all frames.

## Panels

- Panels **fill the available height** and scroll internally when taller. Footers inside a panel (an "Add" section) stay sticky at the bottom while the list scrolls.
- Panels are **resizable** by dragging their edge. Current width is the minimum. The edge shows a resize cursor and a handle that is pronounced (12px). A panel on the right side grows leftward when pulled left.
- Panels collapse individually with a chevron icon plus label, and can be reopened from the View menu.
- A panel with nothing to show (no selection) is removed from the layout rather than shown empty. A "click a node to edit" instruction panel is unneeded once clicking opens the editor.
- When two kinds of content share a panel, add explicit navigation to each; floating collapse buttons stop making sense.

## Small screens

- The settings panel opens **below the toolbar and pushes the page down**; nothing floats over the editor.
- A preview can collapse into a slim column at the right and expand to fill the viewport, VS Code sidebar style, with the close action where the open action was so toggling is quick.
- Panels that are open on desktop become individually hideable.
- Viewport or option controls over a preview should be visible the moment their toggle is pressed, without scrolling.
- Keep controls that influence a preview close to it. The play/pause, progress bar, and time stamps sit under the preview in a light bar and don't jump when state changes.

## Timelines and sequences

- Elements in a sequence (keyframes, steps) show an always-visible context trigger titled "Keyframe N".
- Insert actions span the gap between two items and grow when their form opens, with connector lines from item to action to item. Forms use the same border radius as the cards.
- Markers on a timeline are small and numbered (amber squares with the darkest zinc text) with a tooltip ("Keyframe 3"), and clicking one jumps and selects.
- Items that take no time (decisions) appear as markers, not as blocks occupying time.
- Keep a real horizontal scrollbar visible for horizontal lists on mobile.

## Nodes and graphs

- Flows read left to right as time passes. Decisions are diamonds with top and bottom anchors, and other nodes only have left/right anchors.
- Parallel branches are offset slightly above and below the centerline.
- On touch devices, use tap-to-add placeholders instead of dragging. Keep drag where it is natural (desktop).
