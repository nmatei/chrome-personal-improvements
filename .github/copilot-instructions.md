# GitHub Copilot Instructions for Chrome Personal Improvements

## Project Overview

This is a Chrome extension (Manifest V3) that provides personalized enhancements and improved user experience for specific websites. The extension uses pure JavaScript and CSS without complex frameworks.

## Core Architecture

### Technology Stack

- **Pure JavaScript (ES6+)** - No frameworks (React, Vue, Angular, etc.)
- **Vanilla CSS** - No preprocessors or CSS-in-JS
- **Chrome Extension APIs** - Manifest V3
- **Content Scripts** - Injected into target websites
- **Service Worker** - Background operations

### Project Structure

```
views/
  ├── background.js           # Service worker
  ├── common/                 # Shared utilities and components
  │   ├── utilities.js        # Helper functions ($, $$, waitElement, etc.)
  │   ├── colors.css          # Shared color variables
  │   ├── simplePrompt/       # Custom prompt dialogs
  │   └── tooltip/            # Context menu system
  ├── [website-domain]/       # Website-specific enhancements
  │   ├── index.js           # Site-specific functionality
  │   └── overrides.css      # Site-specific styles
```

## Code Style & Patterns

### JavaScript Conventions

1. **DOM Selection**

   - Use `$(selector)` for single element selection (querySelector wrapper)
   - Use `$$(selector)` for multiple elements (querySelectorAll wrapper, returns array)
   - Use `waitElement(selector, timeout)` for async element waiting

2. **Function Style**

   - Prefer `async/await` over promise chains
   - Use arrow functions for callbacks
   - Function declarations for main functions

3. **Naming Conventions**

   - camelCase for variables and functions
   - Descriptive names that indicate purpose
   - Prefix async functions with async operations context

4. **Storage**
   - Use `localStorage` for persistent settings
   - Store objects as JSON strings with `JSON.stringify/parse`
   - Settings functions follow pattern: `get[Setting]()` and `set[Setting](value)`

### Common Utility Functions

Always use these existing utilities from `views/common/utilities.js`:

- `$(selector, parent)` - Query single element
- `$$(selector, parent)` - Query multiple elements (returns array)
- `sleep(ms)` - Promise-based delay
- `waitElement(selector, timeout)` - Wait for element to appear
- `debounce(fn, delay)` - Debounce function calls
- `copyToClipboard(text)` - Copy text to clipboard

### Context Menu Pattern

For right-click context menus, use this pattern:

```javascript
document.body.addEventListener("contextmenu", e => {
  const target = e.target.closest(".target-selector");
  if (target) {
    e.stopPropagation();
    e.preventDefault();

    const menu = getContextMenu([
      {
        text: "Menu Item",
        icon: "🔲",
        itemId: "uniqueId",
        handler: () => {
          // Action code
        }
      }
    ]);
    showByCursor(menu, e);
  }
});
```

### Custom Prompt Pattern

For user input dialogs, use:

```javascript
const answer = await simplePrompt("Enter value:", defaultValue, "placeholder");
const confirmed = await simpleConfirm("Confirm action?", {
  cancel: "Cancel",
  ok: "OK",
  focus: "no"
});
```

## Chrome Extension Integration

### Inter-Extension Communication

When communicating with other Chrome extensions:

```javascript
try {
  const response = await chrome.runtime.sendMessage(extensionId, {
    action: "actionName",
    payload: { data }
  });
} catch (error) {
  console.debug("Extension communication failed:", error.message);
  // Handle gracefully - extension may not be installed
}
```

### Content Script Structure

Each website enhancement follows this pattern:

1. Wait for page load (`document_end` in manifest)
2. Add event listeners for context menus
3. Use utility functions for DOM manipulation
4. Store preferences in localStorage
5. Apply stored preferences on load

### Manifest Configuration

- Use Manifest V3 syntax
- Content scripts are organized by website domain
- Common utilities loaded first, then site-specific scripts
- Permissions: minimal required set (activeTab, storage, clipboardWrite)

## Site-Specific Features

### Feature Implementation Pattern

When adding features for a website:

1. Create folder: `views/[domain-name]/`
2. Add `index.js` for functionality
3. Add `overrides.css` for styling
4. Update `manifest.json` content_scripts section
5. Use context menu for feature toggles

### Local Storage Settings

Pattern for managing settings:

```javascript
function getSettingName() {
  const saved = localStorage.getItem("settingKey");
  return saved ? JSON.parse(saved) : defaultValue;
}

function saveSettingName(value) {
  localStorage.setItem("settingKey", JSON.stringify(value));
}
```

## CSS Guidelines

1. **Scoping** - Use specific selectors to avoid conflicts with host site
2. **Variables** - Define common colors in `views/common/colors.css`
3. **Naming** - Use kebab-case for class names
4. **Layout** - Prefer flexbox/grid for layouts
5. **Overrides** - Be specific to override site styles without `!important` when possible

## Common Patterns to Follow

### Event Delegation

```javascript
document.body.addEventListener("contextmenu", e => {
  const target = e.target.closest(".selector");
  if (target) {
    // Handle event
  }
});
```

### Async Operations

```javascript
async function enhanceFeature() {
  const element = await waitElement(".target", 5000);
  if (element) {
    // Enhance feature
  }
}
```

### Toggle Features

```javascript
const toggle = className => {
  const isActive = document.body.classList.toggle(className);
  localStorage.setItem("featureState", isActive ? className : "");
};
```

## Testing & Debugging

- Use `console.info()` for feature actions
- Use `console.debug()` for detailed logs
- Test in Chrome with developer mode
- Verify localStorage changes in DevTools
- Check content script injection in DevTools > Sources

## Important Rules

1. **No Frameworks** - Keep the codebase vanilla JS/CSS
2. **Minimal Dependencies** - Avoid external libraries
3. **Performance** - Wait for elements rather than polling
4. **Graceful Degradation** - Features should fail silently if elements missing
5. **User Control** - Provide context menu toggles for features
6. **Clean Code** - Reuse common utilities, avoid duplication
7. **Chrome APIs** - Use modern Manifest V3 APIs
8. **Cross-Extension** - Handle inter-extension messaging failures gracefully

## When Adding New Website Support

1. Identify the website domain
2. Create `views/[domain]/` folder
3. Add index.js with site-specific enhancements
4. Add overrides.css for styling changes
5. Update manifest.json with new content_scripts entry
6. Use common utilities from `views/common/`
7. Follow existing context menu patterns
8. Document feature in README.md

## Code Review Checklist

- [ ] Uses existing utility functions
- [ ] Follows naming conventions
- [ ] No external dependencies added
- [ ] Uses async/await properly
- [ ] Handles errors gracefully
- [ ] localStorage used for persistence
- [ ] Context menu follows established pattern
- [ ] CSS is scoped appropriately
- [ ] manifest.json updated correctly
- [ ] Works with Chrome Manifest V3
