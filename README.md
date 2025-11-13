# A11YAssist - Accessibility Assistant for VS Code

**Authors:** Sudha Rajendran
**Institution:** Ontario Tech University
**Version:** 1.0.0

![A11YAssist Logo](https://img.shields.io/badge/A11YAssist-Accessibility-blue) ![Windows](https://img.shields.io/badge/Platform-Windows-0078D6) ![VS Code](https://img.shields.io/badge/VS%20Code-1.75+-007ACC)

## Overview

**A11YAssist** is a comprehensive accessibility assistant extension for Visual Studio Code designed to make software development accessible for developers with disabilities. It provides enhanced support for:

- **Visual impairments** - Screen reader enhancements and announcements
- **Motor limitations** - Complete keyboard-only navigation
- **Cognitive challenges** - Simplified workflows and contextual guidance

## Key Features

### Screen Reader Enhancements
- Context-aware announcements for current editor state
- Adjustable verbosity (minimal, normal, verbose)
- Real-time selection and change notifications
- Diagnostic announcements for errors/warnings
- **Shortcuts:** `Ctrl+Shift+C` (announce context), `Ctrl+Shift+D` (describe element)

### Keyboard Navigation
- Complete keyboard-only workflow support
- Interactive keyboard shortcut guide
- Quick navigation menus for panels and views
- Symbol jumping (navigate to functions/classes)
- Focus management between editor and panels
- **Shortcut:** `Ctrl+Shift+K` (show keyboard guide)

### Accessibility Auditing
Automatically scan your code for accessibility issues:
- **WCAG 2.1 compliance** checking (Level A, AA, AAA)
- **ARIA validation** (WAI-ARIA 1.2 specification)
- **Color contrast analysis** (4.5:1 and 7:1 ratios)
- **Semantic HTML** validation
- **Keyboard accessibility** detection
- **Real-time diagnostics** in Problems panel

**Supported files:** HTML, JSX/TSX, CSS/SCSS/Less
**Shortcut:** `Ctrl+Shift+A` (run audit)

### Contextual Guidance
Real-time accessibility tips as you code:
- Context-aware suggestions based on current element
- Best practices and code examples
- WCAG 2.1 guideline references
- Links to tutorials and documentation

**Topics covered:** Images, forms, buttons, links, ARIA, headings, color contrast, tables

### Usage Analytics
Optional, privacy-focused analytics (local storage only):
- Track audits run and issues found/fixed
- Monitor feature usage patterns
- Calculate fix rates over time
- Export data for research purposes
- **All data stays on your machine**

### A11YAssist Panel
Dedicated sidebar panel with three views:
1. **Accessibility Issues** - Grouped by severity with click-to-navigate
2. **Contextual Guidance** - Tips, best practices, and resources
3. **Usage Statistics** - Your accessibility metrics

## Quick Start (Windows)

### Installation

1. **Install prerequisites:**
   - VS Code 1.75.0+ ([download](https://code.visualstudio.com/))
   - Node.js 16+ ([download](https://nodejs.org/))

2. **Install dependencies:**
   ```powershell
   cd C:\Users\heman\vscode-accessibility-extension
   npm install
   ```

3. **Compile extension:**
   ```powershell
   npm run compile
   ```

4. **Run in VS Code:**
   - Open folder in VS Code: `code .`
   - Press `F5` to launch Extension Development Host
   - A11YAssist is now active in the new window!

### Install in Your VS Code

**Package and install:**
```powershell
npm install -g @vscode/vsce
vsce package
code --install-extension a11yassist-1.0.0.vsix
```

**See [WINDOWS_INSTALL.md](WINDOWS_INSTALL.md) for detailed instructions.**

## Usage

### First Time Setup

1. **Open Settings** (`Ctrl+,`)
2. **Search** for "A11YAssist"
3. **Configure** your preferences:
   - Enable/disable screen reader enhancements
   - Set verbosity level
   - Enable contextual guidance
   - Configure keyboard navigation

### Run Your First Audit

1. Open an HTML or JSX file
2. Press `Ctrl+Shift+A`
3. View issues in:
   - Problems panel (`Ctrl+Shift+M`)
   - A11YAssist sidebar panel
   - Inline diagnostics

### Use Screen Reader Features

1. Press `Ctrl+Shift+C` to hear current context
2. Press `Ctrl+Shift+D` for element details
3. Check Output panel → "A11YAssist Announcements"

### View Keyboard Shortcuts

Press `Ctrl+Shift+K` to open the interactive keyboard guide.

## Keyboard Shortcuts

| Shortcut | Command |
|----------|---------|
| `Ctrl+Shift+A` | Run accessibility audit |
| `Ctrl+Shift+K` | Show keyboard guide |
| `Ctrl+Shift+C` | Announce current context |
| `Ctrl+Shift+D` | Describe current element |
| `F8` | Next error/warning |
| `Shift+F8` | Previous error/warning |
| `Ctrl+M` | Toggle Tab key mode |

## Configuration

```json
{
  "a11yassist.enableScreenReaderEnhancements": true,
  "a11yassist.enableContextualGuidance": true,
  "a11yassist.enableAnalytics": false,
  "a11yassist.verbosityLevel": "normal",
  "a11yassist.enableKeyboardNavigation": true,
  "a11yassist.announceEditorChanges": true,
  "a11yassist.cognitiveLoadReduction": false
}
```

## Project Structure

```
vscode-accessibility-extension/
├── src/
│   ├── extension.ts                    # Main entry point
│   ├── features/                       # Core features
│   │   ├── screenReaderManager.ts      # Screen reader support
│   │   ├── keyboardNavigationManager.ts # Keyboard navigation
│   │   ├── accessibilityAuditor.ts     # Audit engine
│   │   ├── contextualGuidanceProvider.ts # Guidance system
│   │   └── analyticsManager.ts         # Usage analytics
│   ├── providers/                      # Tree view providers
│   │   ├── accessibilityIssuesProvider.ts
│   │   ├── accessibilityGuideProvider.ts
│   │   └── accessibilityStatsProvider.ts
│   ├── utils/                          # Utilities
│   │   ├── colorContrastAnalyzer.ts    # WCAG contrast
│   │   └── ariaValidator.ts            # WAI-ARIA validation
│   └── types/                          # TypeScript definitions
│       └── index.ts
├── package.json                        # Extension manifest
├── tsconfig.json                       # TypeScript config
├── README.md                           # This file
├── WINDOWS_INSTALL.md                  # Windows installation guide
├── SETUP_GUIDE.md                      # Development setup
└── QUICK_START.md                      # Quick start guide
```

## Accessibility Standards

A11YAssist helps you comply with:

- **WCAG 2.1** (Level A, AA, AAA)
- **WAI-ARIA 1.2** Specification
- **Section 508** U.S. Standards
- **ADA** Digital Accessibility

## Detected Issues

A11YAssist detects **14 types of accessibility issues**:

- Missing alt text on images
- Missing ARIA labels
- Invalid ARIA attributes/roles
- Low color contrast (< 4.5:1)
- Missing form labels
- Improper heading structure
- Missing lang attribute
- Keyboard traps
- Missing focus indicators
- Improper tabindex usage
- Empty links/buttons
- And more...

## Research & Privacy

This extension was developed as part of accessibility research at Ontario Tech University.

**Privacy Commitment:**
- All analytics stored **locally** on your machine
- **No data** sent to external servers
- Analytics can be **completely disabled**
- You control your data
- Export feature for **voluntary** research participation

## Testing with Screen Readers (Windows)

### Windows Narrator (Built-in)
- Start: `Win+Ctrl+Enter`
- Stop: `Win+Ctrl+Enter`

### NVDA (Free, Recommended)
- Download: https://www.nvaccess.org/
- Stop: `Insert+Q`

### JAWS (Commercial)
- Download: https://www.freedomscientific.com/products/software/jaws/

## Development

### Watch Mode
```powershell
npm run watch
```

### Debug
1. Press `F5` in VS Code
2. Set breakpoints
3. Test in Extension Development Host

### Package
```powershell
vsce package
```


## Troubleshooting

### Extension won't start
- Check Output → Extension Host for errors
- Verify VS Code version ≥ 1.75.0
- Run `npm run compile` to check for errors

### Screen reader not announcing
- Verify screen reader is running
- Check Output → "A11YAssist Announcements"
- Enable in settings: `a11yassist.enableScreenReaderEnhancements`

### Compilation errors
```powershell
Remove-Item -Recurse node_modules
Remove-Item package-lock.json
npm install
npm run compile
```

##  Contributing

We welcome contributions! Areas for improvement:
- Additional file type support
- Enhanced ARIA validation
- More accessibility checks
- Screen reader compatibility improvements
- Internationalization

## Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [WAI-ARIA 1.2 Spec](https://www.w3.org/TR/wai-aria-1.2/)
- [VS Code Accessibility](https://code.visualstudio.com/docs/editor/accessibility)
- [WebAIM Resources](https://webaim.org/)

## License

MIT License - Copyright (c) 2025 Sudha Rajendran, Ontario Tech University

See [LICENSE](LICENSE) file for details.

## Authors

**Sudha Rajendran**
Ontario Tech University
Email: sudha.rajendran@ontariotechu.net

## Support

- Use the "Provide Accessibility Feedback" command in VS Code
- Email: sudha.rajendran@ontariotechu.net
- Check documentation files for detailed guides

## Acknowledgments

This project addresses accessibility gaps in modern IDEs and supports inclusive software development practices. We thank the accessibility community whose work informed this extension's design.

---
