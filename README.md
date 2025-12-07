# EasyJS

**Modern DOM manipulation made simple.**

EasyJS is a lightweight library that brings powerful DOM diffing and patching capabilities directly to the native `HTMLElement` prototype. No complex frameworks—just simple, effective tools to manage your UI state.

Currently, it exposes a single, powerful method: `.replace()`.

## Features

- ⚡ **Granular Updates**: Updates only the attributes and text nodes that changed, leaving the rest untouched.
- 🧘 **State Preservation**: Keeps input focus, scroll position, and video playback context intact during updates.
- 🪶 **Zero Dependencies**: Pure Vanilla JS.
- 🚀 **Lightweight**: Minimal footprint, maximum performance.

## Installation

Simply include `EasyJS.js` in your project as a module.

```html
<script type="module" src="./EasyJS.js"></script>
```

## Usage

EasyJS adds a `.replace()` method to **every** HTML element. You can pass it a string of HTML or another DOM element, and it will intelligently patch the existing element to match the new content.

### Example

```javascript
// 1. Select your target element
const app = document.getElementById("app");

// 2. Define your new state (as a string or element)
const newState = `
  <div id="app" class="active">
    <h1>Hello World</h1>
    <p>Last updated: ${new Date().toLocaleTimeString()}</p>
    <input type="text" placeholder="Type here..." />
  </div>
`;

// 3. Patch the DOM
// EasyJS will update the class, timestamp, and h1 ONLY if they changed.
// It will preserve the input's focus and text if the user was typing.
app.replace(newState);
```

## API Reference

### `element.replace(newContent)`

Updates the element's content by smart-diffing it with the provided `newContent`.

#### Parameters

- **`newContent`** (_String_ | _HTMLElement_):
  The new HTML structure you want to conform to.
  - If a **String** is provided, it is parsed into DOM nodes.
  - If an **HTMLElement** is provided, it is compared directly.

#### Behavior

1. **Details Attributes**: Adds new attributes, updates changed ones, and removes those no longer present.
2. **Reconciles Children**: Recursively visualizes the DOM tree, matching children by position and tag.
3. **Preserves State**: Implicitly keeps DOM state (like `<input>` values or scroll positions) alive by mutating existing nodes rather than blowing them away with `innerHTML`.
4. **Smart Fallback**: If the tag names differ (e.g. replacing a `<div>` with a `<span>`), it performs a standard full replacement.

## Why use `.replace()`?

Standard methods like `innerHTML` destroy and recreate all DOM nodes, ensuring you lose:

- ❌ User Input focus
- ❌ Scroll positioning
- ❌ Event listeners attached to those nodes
- ❌ CSS transition states

**EasyJS `.replace()`** surgically updates only what is necessary, giving you the developer experience of a full SPA framework with the simplicity of Vanilla JS.

## License

MIT License. See [LICENSE](LICENSE) for details.
