# Accessibility Enhancer - Windows Setup Guide

**Authors:** Sudha Rajendran and Rohitha Janga
**Institution:** Ontario Tech University

This guide provides step-by-step instructions for setting up and developing the Accessibility Enhancer extension on Windows.

## Prerequisites

### Required Software

1. **Node.js** (v16 or higher)
   - Download from: https://nodejs.org/
   - Choose the LTS (Long Term Support) version
   - During installation, ensure "Add to PATH" is checked

2. **Visual Studio Code**
   - Download from: https://code.visualstudio.com/
   - Version 1.75.0 or higher required

3. **Git** (optional, for version control)
   - Download from: https://git-scm.com/download/win
   - Choose default options during installation

### Recommended Software

1. **Windows Terminal** (modern command-line interface)
   - Install from Microsoft Store
   - Or download from: https://github.com/microsoft/terminal

2. **Screen Reader** (for testing)
   - NVDA: https://www.nvaccess.org/ (free)
   - JAWS: https://www.freedomscientific.com/products/software/jaws/ (commercial)
   - Windows Narrator: Built into Windows (Win+Ctrl+Enter to toggle)

## Step 1: Verify Prerequisites

Open PowerShell or Command Prompt and verify installations:

```powershell
# Check Node.js version
node --version
# Should output v16.x.x or higher

# Check npm version
npm --version
# Should output 8.x.x or higher

# Check VS Code version
code --version
# Should output version number
```

If any command fails, revisit the prerequisites section.

## Step 2: Download or Clone the Extension

### Option A: Download ZIP
1. Download the extension folder as a ZIP file
2. Extract to a location like `C:\Users\YourName\Documents\vscode-accessibility-extension`
3. Rename the folder if needed

### Option B: Clone with Git
```powershell
cd C:\Users\YourName\Documents
git clone <repository-url> vscode-accessibility-extension
cd vscode-accessibility-extension
```

## Step 3: Install Dependencies

Open the extension folder in VS Code:

```powershell
cd C:\Users\heman\vscode-accessibility-extension
code .
```

In VS Code, open a new terminal (`Ctrl+` ` or Terminal → New Terminal) and run:

```powershell
npm install
```

This will install all required dependencies including:
- TypeScript
- VS Code extension API types
- ESLint for code quality
- axe-core for accessibility testing

**Expected Output:**
```
added 150 packages in 15s
```

## Step 4: Understand the Project Structure

```
vscode-accessibility-extension/
├── src/                          # Source code
│   ├── extension.ts              # Main entry point
│   ├── features/                 # Feature modules
│   │   ├── screenReaderManager.ts
│   │   ├── keyboardNavigationManager.ts
│   │   ├── accessibilityAuditor.ts
│   │   ├── contextualGuidanceProvider.ts
│   │   └── analyticsManager.ts
│   ├── providers/                # Tree view providers
│   ├── utils/                    # Utility functions
│   └── types/                    # TypeScript types
├── out/                          # Compiled JavaScript (created on build)
├── node_modules/                 # Dependencies (created by npm install)
├── package.json                  # Extension manifest
├── tsconfig.json                 # TypeScript configuration
├── README.md                     # Documentation
└── SETUP_GUIDE.md               # This file
```

## Step 5: Compile the Extension

### Method 1: Using npm script
```powershell
npm run compile
```

### Method 2: Using TypeScript directly
```powershell
npx tsc -p ./
```

**Expected Output:**
- No errors
- `out/` folder is created with compiled JavaScript files

**Common Issues:**
- **Error: Cannot find module 'vscode'** → Run `npm install` again
- **Syntax errors** → Check TypeScript version with `npx tsc --version`

## Step 6: Run the Extension in Development Mode

1. **Open the extension folder in VS Code**
2. **Press F5** or select `Run → Start Debugging`
3. **A new VS Code window opens** labeled "[Extension Development Host]"
4. **The extension is now active** in this window

**What happens:**
- VS Code compiles the TypeScript code
- Launches a new VS Code instance with the extension loaded
- You can test all features in this new window

## Step 7: Test the Extension

In the Extension Development Host window:

### Test Screen Reader Features
1. Open any file
2. Press `Ctrl+Shift+C` to announce current context
3. Press `Ctrl+Shift+D` to describe the current element
4. Check the Output panel → "Accessibility Announcements"

### Test Keyboard Navigation
1. Press `Ctrl+Shift+K` to open the keyboard guide
2. Review all available shortcuts
3. Test navigation commands

### Test Accessibility Audit
1. Create or open an HTML file with accessibility issues:
   ```html
   <!DOCTYPE html>
   <html>
   <body>
       <img src="test.jpg">
       <button></button>
       <input type="text">
   </body>
   </html>
   ```
2. Press `Ctrl+Shift+A` to run the audit
3. Check the Problems panel (`Ctrl+Shift+M`)
4. View issues in the Accessibility panel (sidebar)

### Test Accessibility Panel
1. Click the accessibility icon in the activity bar (left sidebar)
2. Explore the three views:
   - Accessibility Issues
   - Contextual Guidance
   - Usage Statistics

## Step 8: Make Changes and Debug

### Enable Auto-Compilation
Keep TypeScript compiler running in watch mode:

```powershell
npm run watch
```

Leave this terminal running. Any changes to `.ts` files will automatically recompile.

### Debug the Extension
1. Set breakpoints by clicking to the left of line numbers
2. Press `F5` to start debugging
3. When execution hits a breakpoint, the debugger pauses
4. Use the Debug toolbar:
   - Continue (`F5`)
   - Step Over (`F10`)
   - Step Into (`F11`)
   - Step Out (`Shift+F11`)

### View Debug Output
- **Debug Console** → Shows extension console.log() output
- **Terminal** → Shows compilation output
- **Problems** → Shows TypeScript errors

### Reload Extension After Changes
In the Extension Development Host window:
- Press `Ctrl+R` or use Command Palette → "Reload Window"
- Or close and press `F5` again in the main window

## Step 9: Test with Screen Readers (Windows)

### Using Windows Narrator
1. **Start Narrator:** Press `Win+Ctrl+Enter`
2. **Open Extension Development Host** with the extension
3. **Test announcements:**
   - Navigate with keyboard
   - Trigger commands with shortcuts
   - Listen to announcements
4. **Stop Narrator:** Press `Win+Ctrl+Enter` again

### Using NVDA (Recommended)
1. **Install NVDA** from https://www.nvaccess.org/
2. **Start NVDA** (usually starts automatically)
3. **Test extension features:**
   - Press `Ctrl+Shift+C` and listen to context announcement
   - Navigate code with arrow keys
   - Run accessibility audit and listen to results
4. **Stop NVDA:** `Insert+Q` (or `CapsLock+Q`)

**NVDA Tips:**
- `Insert` is usually the NVDA modifier key
- `Insert+Down Arrow` → Read current line
- `Insert+Up Arrow` → Read from cursor
- `Ctrl` → Stop speech

## Step 10: Package the Extension

When ready to distribute:

### Install VSCE (VS Code Extension packager)
```powershell
npm install -g @vscode/vsce
```

### Package the Extension
```powershell
vsce package
```

**Output:** `accessibility-enhancer-1.0.0.vsix`

### Install the Packaged Extension
```powershell
code --install-extension accessibility-enhancer-1.0.0.vsix
```

Or use VS Code UI:
1. Open Extensions view (`Ctrl+Shift+X`)
2. Click "..." (Views and More Actions)
3. Select "Install from VSIX..."
4. Choose the `.vsix` file

## Step 11: Run Tests (Optional)

If tests are added in the future:

```powershell
npm test
```

## Troubleshooting

### Issue: "Cannot find module 'vscode'"

**Solution:**
```powershell
rm -r node_modules
rm package-lock.json
npm install
```

### Issue: Extension doesn't activate

**Check:**
1. Look at Output panel → "Extension Host"
2. Check for activation errors
3. Verify `activationEvents` in package.json
4. Ensure `main` field points to correct file

### Issue: Compilation errors

**Solutions:**
```powershell
# Clear out folder
rm -r out

# Recompile
npm run compile

# Check TypeScript version
npx tsc --version
# Should be 5.x.x
```

### Issue: Changes not reflected

**Solutions:**
1. Ensure watch mode is running (`npm run watch`)
2. Reload Extension Development Host (`Ctrl+R`)
3. Check terminal for compilation errors
4. Close and restart debugging (`F5`)

### Issue: Screen reader not announcing

**Solutions:**
1. Verify screen reader is running
2. Check "Accessibility Announcements" in Output panel
3. Enable screen reader enhancements in settings
4. Test with Windows Narrator first

### Issue: Port already in use

**Solution:**
```powershell
# Find and kill the process
netstat -ano | findstr :5870
taskkill /PID <process_id> /F
```

## Development Workflow

### Recommended Daily Workflow

1. **Start watch mode:**
   ```powershell
   npm run watch
   ```

2. **Start debugging** (`F5`)

3. **Make changes** to TypeScript files

4. **Reload extension** (`Ctrl+R` in Extension Development Host)

5. **Test changes**

6. **Commit when satisfied:**
   ```powershell
   git add .
   git commit -m "Description of changes"
   ```

### Code Organization Best Practices

- **Features** → `src/features/` - Core functionality modules
- **Providers** → `src/providers/` - Tree view and UI providers
- **Utils** → `src/utils/` - Helper functions and validators
- **Types** → `src/types/` - TypeScript interfaces and types

### Coding Standards

- Use TypeScript strict mode (already enabled)
- Add JSDoc comments with author information
- Follow existing code style
- Test with screen readers regularly

## VS Code Extension Development Resources

### Official Documentation
- [Extension API](https://code.visualstudio.com/api)
- [Extension Samples](https://github.com/microsoft/vscode-extension-samples)
- [Publishing Extensions](https://code.visualstudio.com/api/working-with-extensions/publishing-extension)

### Useful VS Code Commands
- `Ctrl+Shift+P` → Command Palette
- `F5` → Start Debugging
- `Ctrl+R` → Reload Window (in Extension Development Host)
- `Ctrl+Shift+I` → Open Developer Tools
- `F12` → Go to Definition
- `Shift+F12` → Find All References

## Next Steps

1. **Explore the code** - Read through each module
2. **Add features** - Enhance existing functionality
3. **Write tests** - Add unit tests for components
4. **Improve accessibility** - Test with diverse users
5. **Gather feedback** - Use the analytics features
6. **Contribute** - Share improvements with the community

## Getting Help

### Resources
- **VS Code API Docs:** https://code.visualstudio.com/api
- **TypeScript Docs:** https://www.typescriptlang.org/docs/
- **WCAG Guidelines:** https://www.w3.org/WAI/WCAG21/quickref/
- **WAI-ARIA:** https://www.w3.org/TR/wai-aria-1.2/

### Support
- Check the README.md for general documentation
- Review code comments for implementation details
- Contact the authors for specific questions

## Conclusion

You now have a complete development environment for the Accessibility Enhancer extension on Windows. This guide covered:

✅ Prerequisites installation
✅ Project setup and dependencies
✅ Compilation and debugging
✅ Testing with screen readers
✅ Packaging and distribution
✅ Troubleshooting common issues

Happy coding! Remember to test accessibility features regularly with real assistive technologies.

---

**Authors:** Sudha Rajendran and Rohitha Janga
**Institution:** Ontario Tech University
**Last Updated:** 2025
