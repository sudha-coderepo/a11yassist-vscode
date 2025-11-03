# Accessibility Enhancer for VS Code

**Authors:** Sudha Rajendran and Rohitha Janga
**Institution:** Ontario Tech University
**Version:** 1.0.0

## Overview

Accessibility Enhancer is a comprehensive Visual Studio Code extension designed to enhance accessibility and inclusion for developers with disabilities. This extension addresses critical accessibility gaps in software development environments, particularly for users with:

- **Visual impairments** - Enhanced screen reader support and contextual announcements
- **Motor limitations** - Advanced keyboard navigation and reduced mouse dependency
- **Cognitive challenges** - Simplified workflows and contextual guidance

## Key Features

### 🔊 Screen Reader Enhancements

- **Context-aware announcements** - Real-time information about your current editing context
- **Verbosity control** - Adjustable announcement levels (minimal, normal, verbose)
- **Selection announcements** - Automatic notification of text selection changes
- **Diagnostic announcements** - Spoken alerts for errors and warnings
- **Keyboard shortcuts** - `Ctrl+Shift+C` to announce current context, `Ctrl+Shift+D` to describe element

### ⌨️ Keyboard Navigation

- **Comprehensive keyboard shortcuts** - Complete keyboard-only workflow support
- **Quick navigation menu** - Fast access to common panels and views
- **Symbol jumping** - Navigate to functions, classes, and other symbols without a mouse
- **Focus management** - Easy switching between editor, sidebar, and panels
- **Keyboard guide** - Interactive guide showing all available shortcuts (`Ctrl+Shift+K`)

### 🔍 Accessibility Auditing

Automatically scan your code for accessibility issues:

- **WCAG 2.1 compliance** - Checks for Level A, AA, and AAA standards
- **ARIA validation** - Ensures correct usage of ARIA attributes and roles
- **Color contrast analysis** - Validates color combinations meet accessibility standards
- **Semantic HTML checks** - Identifies improper HTML structure
- **Keyboard accessibility** - Detects elements that aren't keyboard accessible
- **Real-time diagnostics** - Issues appear inline in your code

**Supported File Types:**
- HTML, Handlebars, PHP
- React/JSX (JavaScript, TypeScript)
- CSS, SCSS, Less

**Run Audit:** Press `Ctrl+Shift+A` or use Command Palette → "Run Accessibility Audit"

### 💡 Contextual Guidance

Get real-time accessibility tips as you code:

- **Context-aware suggestions** - Guidance based on the element you're working on
- **Best practices** - Learn proper accessibility implementation techniques
- **Code examples** - See how to fix common accessibility issues
- **WCAG references** - Direct links to relevant guidelines
- **Educational resources** - Curated tutorials and documentation

**Guidance Topics:**
- Image alt text
- Form labels and inputs
- Button accessibility
- Link text
- ARIA attributes
- Heading structure
- Color contrast
- Table accessibility

### 📊 Usage Analytics

Track your accessibility improvements (optional, privacy-focused):

- **Local-only storage** - All data stays on your machine
- **Audit statistics** - Track audits run and issues found/fixed
- **Feature usage** - See which features help you most
- **Fix rate tracking** - Monitor your accessibility improvements over time
- **Export capability** - Export analytics for research purposes

### 🎨 Accessibility Panel

A dedicated sidebar panel with three views:

1. **Accessibility Issues** - Lists all found issues grouped by severity
2. **Contextual Guidance** - Shows relevant tips and resources
3. **Usage Statistics** - Displays your accessibility metrics

**Open Panel:** Click the accessibility icon in the activity bar or use Command Palette → "Show Accessibility Panel"

## Installation

### Method 1: From Source (Recommended for Development)

1. Clone or download this repository
2. Open the folder in VS Code
3. Press `F5` to launch Extension Development Host
4. The extension will be loaded in a new VS Code window

### Method 2: Package and Install

1. Install vsce: `npm install -g @vscode/vsce`
2. Package the extension: `vsce package`
3. Install the .vsix file: `code --install-extension accessibility-enhancer-1.0.0.vsix`

For detailed Windows setup instructions, see [SETUP_GUIDE.md](./SETUP_GUIDE.md)

## Getting Started

### Initial Setup

1. **Install the extension** using one of the methods above
2. **Configure settings** (optional):
   - Open Settings (`Ctrl+,`)
   - Search for "Accessibility Enhancer"
   - Adjust verbosity, keyboard navigation, and other preferences
3. **Learn keyboard shortcuts:**
   - Press `Ctrl+Shift+K` to view the keyboard guide

### First Audit

1. Open an HTML, JSX, or CSS file
2. Press `Ctrl+Shift+A` to run an accessibility audit
3. View issues in:
   - The Problems panel (`Ctrl+Shift+M`)
   - The Accessibility Issues tree view
   - Inline diagnostics in your code
4. Click on any issue to jump to its location
5. Read the suggested fix and apply changes

### Using Screen Reader Features

1. Enable screen reader mode in Settings if not auto-detected
2. Press `Ctrl+Shift+C` to hear your current context
3. Press `Ctrl+Shift+D` to get details about the current element
4. Navigate normally - the extension will announce relevant changes

## Keyboard Shortcuts

| Shortcut | Command | Description |
|----------|---------|-------------|
| `Ctrl+Shift+A` | Run Accessibility Audit | Scan current file for issues |
| `Ctrl+Shift+K` | Show Keyboard Guide | Display all keyboard shortcuts |
| `Ctrl+Shift+C` | Announce Context | Screen reader announces current context |
| `Ctrl+Shift+D` | Describe Element | Detailed description of current element |
| `F8` | Next Error | Navigate to next error/warning |
| `Shift+F8` | Previous Error | Navigate to previous error/warning |
| `Ctrl+M` | Toggle Tab Mode | Switch Tab key between insert and navigate |

See the full keyboard guide by pressing `Ctrl+Shift+K`

## Configuration

All settings are available under **Accessibility Enhancer** in VS Code Settings:

```json
{
  // Enable enhanced screen reader support
  "accessibilityEnhancer.enableScreenReaderEnhancements": true,

  // Show contextual accessibility guidance
  "accessibilityEnhancer.enableContextualGuidance": true,

  // Enable anonymous usage analytics (local only)
  "accessibilityEnhancer.enableAnalytics": false,

  // Enable high contrast mode
  "accessibilityEnhancer.highContrastMode": false,

  // Screen reader verbosity level
  "accessibilityEnhancer.verbosityLevel": "normal",

  // Enable enhanced keyboard navigation
  "accessibilityEnhancer.enableKeyboardNavigation": true,

  // Announce editor changes to screen readers
  "accessibilityEnhancer.announceEditorChanges": true,

  // Enable cognitive load reduction features
  "accessibilityEnhancer.cognitiveLoadReduction": false
}
```

## Architecture

### Project Structure

```
vscode-accessibility-extension/
├── src/
│   ├── extension.ts                     # Main entry point
│   ├── features/                        # Core feature modules
│   │   ├── screenReaderManager.ts       # Screen reader support
│   │   ├── keyboardNavigationManager.ts # Keyboard navigation
│   │   ├── accessibilityAuditor.ts      # Audit engine
│   │   ├── contextualGuidanceProvider.ts # Contextual tips
│   │   └── analyticsManager.ts          # Usage analytics
│   ├── providers/                       # Tree view providers
│   │   ├── accessibilityIssuesProvider.ts
│   │   ├── accessibilityGuideProvider.ts
│   │   └── accessibilityStatsProvider.ts
│   ├── utils/                           # Utility modules
│   │   ├── colorContrastAnalyzer.ts     # Color contrast calculations
│   │   └── ariaValidator.ts             # ARIA validation
│   └── types/                           # TypeScript type definitions
│       └── index.ts
├── package.json                         # Extension manifest
├── tsconfig.json                        # TypeScript configuration
├── README.md                            # This file
└── SETUP_GUIDE.md                       # Windows setup guide
```

### Key Components

#### Screen Reader Manager
Provides enhanced screen reader compatibility with context-aware announcements and verbosity control.

#### Keyboard Navigation Manager
Enables complete keyboard-only workflows with custom shortcuts and navigation aids.

#### Accessibility Auditor
Scans code for WCAG 2.1 compliance issues using pattern matching and validation rules.

#### Contextual Guidance Provider
Offers real-time accessibility tips based on the code element being edited.

#### Analytics Manager
Tracks usage statistics locally to help improve the extension through empirical feedback.

#### Color Contrast Analyzer
Calculates color contrast ratios according to WCAG 2.1 guidelines.

#### ARIA Validator
Validates ARIA roles, states, and properties against the WAI-ARIA 1.2 specification.

## Accessibility Standards

This extension helps you comply with:

- **WCAG 2.1** (Web Content Accessibility Guidelines) - Levels A, AA, and AAA
- **WAI-ARIA 1.2** (Accessible Rich Internet Applications)
- **Section 508** (U.S. Rehabilitation Act)
- **ADA** (Americans with Disabilities Act) digital accessibility requirements

## Research and Development

This extension was developed as part of research into accessibility in software development environments. The analytics features (optional and local-only) support empirical studies on:

- Accessibility tool usage patterns
- Developer learning curves for accessibility
- Effectiveness of contextual guidance
- Impact of enhanced IDE accessibility features

### Privacy Commitment

- **No data is sent to external servers**
- All analytics are stored locally in VS Code's global state
- Analytics can be completely disabled in settings
- Users have full control over their data
- Export functionality for research participation is voluntary

## Known Issues

- Color contrast analysis is limited to CSS files and may not detect all color combinations
- ARIA validation covers WAI-ARIA 1.2 but may not include all edge cases
- Screen reader announcements rely on VS Code APIs and may vary by screen reader software

## Troubleshooting

### Screen Reader Not Announcing

1. Check that "Enable Screen Reader Enhancements" is enabled in settings
2. Verify your screen reader is running and focused on VS Code
3. Try toggling enhanced mode with the status bar item
4. Check the "Accessibility Announcements" output channel for messages

### Keyboard Shortcuts Not Working

1. Check for conflicting keybindings in VS Code
2. View all keybindings: `File` → `Preferences` → `Keyboard Shortcuts`
3. Search for "accessibility-enhancer" to see extension shortcuts
4. Customize shortcuts if needed

### Audit Not Finding Issues

1. Ensure the file type is supported (HTML, JSX, CSS)
2. Check the Problems panel (`Ctrl+Shift+M`) for diagnostics
3. Review the Accessibility Issues tree view in the sidebar
4. Some issues may only be detectable with manual testing

## Contributing

We welcome contributions! Areas for improvement:

- Support for additional file types
- Enhanced ARIA validation rules
- More comprehensive color contrast detection
- Additional accessibility checks
- Improved screen reader compatibility
- Translations and internationalization

## Resources

### WCAG 2.1 Guidelines
- [WCAG 2.1 Quick Reference](https://www.w3.org/WAI/WCAG21/quickref/)
- [Understanding WCAG 2.1](https://www.w3.org/WAI/WCAG21/Understanding/)

### WAI-ARIA
- [WAI-ARIA 1.2 Specification](https://www.w3.org/TR/wai-aria-1.2/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)

### Tools and Testing
- [WebAIM Resources](https://webaim.org/resources/)
- [NVDA Screen Reader](https://www.nvaccess.org/)
- [JAWS Screen Reader](https://www.freedomscientific.com/products/software/jaws/)

### VS Code Accessibility
- [VS Code Accessibility Documentation](https://code.visualstudio.com/docs/editor/accessibility)
- [VS Code Keyboard Shortcuts](https://code.visualstudio.com/docs/getstarted/keybindings)

## License

MIT License - See LICENSE file for details

## Authors

**Sudha Rajendran**
Ontario Tech University
Email: sudha.rajendran@ontariotechu.ca

**Rohitha Janga**
Ontario Tech University

## Acknowledgments

This project was developed to address accessibility gaps in modern IDEs and support inclusive software development practices. We thank the accessibility community and researchers whose work informed this extension's design.

## Support

For issues, questions, or feedback:

- Open an issue on the project repository
- Use the "Provide Accessibility Feedback" command in VS Code
- Contact the authors directly

---

**Making software development accessible to everyone.** ♿
