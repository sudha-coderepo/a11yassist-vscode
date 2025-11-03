# A11YAssist - Windows Installation Guide

**Authors:** Sudha Rajendran and Rohitha Janga
**Institution:** Ontario Tech University
**Extension Name:** A11YAssist
**Version:** 1.0.0

## Quick Installation (5 Minutes)

### Step 1: Prerequisites

Ensure you have the following installed on your Windows machine:

1. **Visual Studio Code** (version 1.75.0 or higher)
   - Download: https://code.visualstudio.com/
   - Verify: Open PowerShell and type `code --version`

2. **Node.js** (version 16 or higher)
   - Download: https://nodejs.org/ (LTS version)
   - Verify: Open PowerShell and type `node --version` and `npm --version`

### Step 2: Install Dependencies

Open PowerShell or Command Prompt in the extension directory:

```powershell
cd C:\Users\heman\vscode-accessibility-extension
npm install
```

**Wait for:** "added 150+ packages" message

### Step 3: Compile the Extension

```powershell
npm run compile
```

**Expected:** No errors, `out/` folder is created with compiled JavaScript files

### Step 4: Run A11YAssist in Development Mode

#### Option A: Using VS Code UI
1. Open the extension folder in VS Code:
   ```powershell
   code C:\Users\heman\vscode-accessibility-extension
   ```
2. Press **F5** to launch Extension Development Host
3. A new VS Code window opens with A11YAssist loaded

#### Option B: Using Command Line
```powershell
code --extensionDevelopmentPath=C:\Users\heman\vscode-accessibility-extension
```

### Step 5: Verify Installation

In the new VS Code window (Extension Development Host):

1. **Check the status bar** - You should see "SR Enhanced" (Screen Reader Enhanced)
2. **Check the sidebar** - Click the accessibility icon to open A11YAssist panel
3. **Test a command** - Press `Ctrl+Shift+K` to open the keyboard guide
4. **Run an audit** - Open an HTML file and press `Ctrl+Shift+A`

## Installing A11YAssist in Your Regular VS Code

To use A11YAssist in your regular VS Code (not just development mode):

### Method 1: Package and Install (Recommended)

1. **Install VSCE** (VS Code Extension Packager):
   ```powershell
   npm install -g @vscode/vsce
   ```

2. **Package the extension**:
   ```powershell
   cd C:\Users\heman\vscode-accessibility-extension
   vsce package
   ```

   **Output:** `a11yassist-1.0.0.vsix` file is created

3. **Install in VS Code**:

   **Option A - Command Line:**
   ```powershell
   code --install-extension a11yassist-1.0.0.vsix
   ```

   **Option B - VS Code UI:**
   - Open VS Code
   - Press `Ctrl+Shift+X` (Extensions view)
   - Click the "..." menu (Views and More Actions)
   - Select "Install from VSIX..."
   - Navigate to `C:\Users\heman\vscode-accessibility-extension\`
   - Select `a11yassist-1.0.0.vsix`
   - Click "Install"

4. **Restart VS Code**

5. **Verify Installation:**
   - Check that the A11YAssist icon appears in the sidebar
   - Press `Ctrl+Shift+P` and type "A11YAssist" to see all commands

### Method 2: Copy to Extensions Folder

1. **Compile the extension:**
   ```powershell
   npm run compile
   ```

2. **Copy to VS Code extensions folder:**
   ```powershell
   $extensionsPath = "$env:USERPROFILE\.vscode\extensions\a11yassist-1.0.0"
   New-Item -ItemType Directory -Force -Path $extensionsPath
   Copy-Item -Path "C:\Users\heman\vscode-accessibility-extension\*" -Destination $extensionsPath -Recurse -Exclude "node_modules","src","*.md"
   ```

3. **Restart VS Code**

## Using A11YAssist on Windows

### Screen Reader Support (Windows)

A11YAssist works with these Windows screen readers:

#### 1. Windows Narrator (Built-in, Free)
- **Start:** Press `Win+Ctrl+Enter`
- **Stop:** Press `Win+Ctrl+Enter` again
- **Usage with A11YAssist:**
  - Navigate normally with keyboard
  - A11YAssist announcements appear in the Output panel
  - Use `Ctrl+Shift+C` to hear current context

#### 2. NVDA (Free, Recommended)
- **Download:** https://www.nvaccess.org/
- **Install:** Run installer, follow prompts
- **Start:** Automatically starts after installation
- **Stop:** Press `Insert+Q` or `CapsLock+Q`
- **Usage with A11YAssist:**
  - All features work seamlessly with NVDA
  - A11YAssist enhances VS Code's accessibility
  - NVDA reads all announcements and context information

#### 3. JAWS (Commercial)
- **Download:** https://www.freedomscientific.com/products/software/jaws/
- **Note:** Commercial license required
- **Fully compatible with A11YAssist**

### Keyboard Shortcuts (Windows)

All A11YAssist features are keyboard-accessible:

| Shortcut | Function |
|----------|----------|
| `Ctrl+Shift+A` | Run accessibility audit on current file |
| `Ctrl+Shift+K` | Show keyboard navigation guide |
| `Ctrl+Shift+C` | Announce current editor context |
| `Ctrl+Shift+D` | Describe element under cursor |
| `F8` | Go to next error/warning |
| `Shift+F8` | Go to previous error/warning |
| `Ctrl+M` | Toggle Tab key mode (insert vs navigate) |

**View all shortcuts:** Press `Ctrl+Shift+K`

### Configuration (Windows)

1. **Open Settings:**
   - Press `Ctrl+,`
   - Or: File → Preferences → Settings

2. **Search for "A11YAssist"**

3. **Configure options:**
   ```json
   {
     "a11yassist.enableScreenReaderEnhancements": true,
     "a11yassist.enableContextualGuidance": true,
     "a11yassist.verbosityLevel": "normal",
     "a11yassist.enableKeyboardNavigation": true
   }
   ```

### A11YAssist Panel

Access the A11YAssist sidebar panel:

1. **Click** the accessibility icon in the Activity Bar (left sidebar)
2. **Or press** `Ctrl+Shift+P` and type "Show A11YAssist Panel"

The panel has three views:
- **Accessibility Issues** - Lists all found accessibility issues
- **Contextual Guidance** - Shows tips and best practices
- **Usage Statistics** - Displays your accessibility metrics

## Testing A11YAssist (Windows)

### Quick Test

1. **Create a test HTML file:**
   - Press `Ctrl+N` (new file)
   - Copy and paste:
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
   - Press `Ctrl+S` and save as `test.html`

2. **Run accessibility audit:**
   - Press `Ctrl+Shift+A`
   - Check the Problems panel (`Ctrl+Shift+M`)
   - See issues in the A11YAssist sidebar panel

3. **Expected results:**
   - Missing alt text on image
   - Empty button element
   - Missing label on input

### Test with Screen Reader

1. **Start Narrator:** `Win+Ctrl+Enter`
2. **Open VS Code with A11YAssist installed**
3. **Press `Ctrl+Shift+C`** - Hear current context
4. **Navigate** - Listen to announcements
5. **Open Output panel** (`Ctrl+Shift+U`) and select "A11YAssist Announcements"

## Troubleshooting (Windows)

### Issue: npm not found

**Solution:**
1. Install Node.js from https://nodejs.org/
2. Restart PowerShell/Command Prompt
3. Verify with `npm --version`

### Issue: Extension doesn't activate

**Solution:**
1. Open Output panel: `Ctrl+Shift+U`
2. Select "Extension Host" from dropdown
3. Check for error messages
4. Ensure VS Code version is 1.75.0 or higher

### Issue: Compilation errors

**Solution:**
```powershell
# Remove node_modules and reinstall
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install
npm run compile
```

### Issue: VSIX installation fails

**Solution:**
```powershell
# Uninstall any existing version
code --uninstall-extension ontario-tech-university.a11yassist

# Reinstall
code --install-extension a11yassist-1.0.0.vsix

# Restart VS Code
```

### Issue: Screen reader not announcing

**Solution:**
1. Verify screen reader is running
2. Check Output → "A11YAssist Announcements"
3. Verify setting: `"a11yassist.enableScreenReaderEnhancements": true`
4. Try toggling enhanced mode (click status bar item)

### Issue: Port already in use (Development)

**Solution:**
```powershell
# Find and kill the process using port 5870
netstat -ano | findstr :5870
# Note the PID (last column)
taskkill /PID <PID> /F
```

### Issue: PowerShell script won't run

**Solution:**
```powershell
# Enable script execution (run as Administrator)
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Or run with bypass
powershell.exe -ExecutionPolicy Bypass -File .\script.ps1
```

## Uninstalling A11YAssist

### Uninstall from VS Code

```powershell
code --uninstall-extension ontario-tech-university.a11yassist
```

### Or use VS Code UI

1. Press `Ctrl+Shift+X` (Extensions)
2. Search for "A11YAssist"
3. Click the gear icon
4. Select "Uninstall"

## Development on Windows

### Keep Extension Running While Developing

1. **Start watch mode:**
   ```powershell
   npm run watch
   ```
   *Leave this terminal open - it auto-compiles changes*

2. **Launch Extension Development Host** (Press `F5`)

3. **Make changes** to TypeScript files in `src/`

4. **Reload extension:**
   - In Extension Development Host window: Press `Ctrl+R`
   - Or close and press `F5` again in main window

### Debug on Windows

1. **Set breakpoints** - Click left of line numbers
2. **Start debugging** - Press `F5`
3. **Trigger the feature** in Extension Development Host
4. **Debugger pauses** at breakpoint
5. **Use Debug toolbar:**
   - Continue: `F5`
   - Step Over: `F10`
   - Step Into: `F11`
   - Step Out: `Shift+F11`
   - Stop: `Shift+F5`

### View logs on Windows

- **Extension Host logs:** Output → Extension Host
- **A11YAssist announcements:** Output → A11YAssist Announcements
- **Debug Console:** View → Debug Console
- **Developer Tools:** Help → Toggle Developer Tools (`Ctrl+Shift+I`)

## System Requirements

### Minimum Requirements
- **OS:** Windows 10 (version 1809 or higher)
- **RAM:** 4 GB
- **Disk Space:** 500 MB free
- **VS Code:** Version 1.75.0 or higher
- **Node.js:** Version 16.x or higher

### Recommended Requirements
- **OS:** Windows 11
- **RAM:** 8 GB or more
- **Disk Space:** 1 GB free
- **VS Code:** Latest version
- **Node.js:** Latest LTS version
- **Screen Reader:** NVDA or JAWS

## Additional Resources

### Documentation
- **README.md** - Complete feature documentation
- **SETUP_GUIDE.md** - Detailed setup instructions
- **QUICK_START.md** - 5-minute quick start guide
- **ACCESSIBILITY_AUDIT_REPORT.md** - Compliance details

### Screen Readers for Windows
- **NVDA:** https://www.nvaccess.org/ (Free, open-source)
- **JAWS:** https://www.freedomscientific.com/products/software/jaws/ (Commercial)
- **Windows Narrator:** Built into Windows (Win+Ctrl+Enter)

### VS Code Accessibility
- **Accessibility Guide:** https://code.visualstudio.com/docs/editor/accessibility
- **Keyboard Shortcuts:** https://code.visualstudio.com/shortcuts/keyboard-shortcuts-windows.pdf

### WCAG Guidelines
- **WCAG 2.1:** https://www.w3.org/WAI/WCAG21/quickref/
- **WebAIM:** https://webaim.org/

## Support

For help with A11YAssist:
- **Email:** sudha.rajendran@ontariotechu.ca
- **Use** the "Provide Accessibility Feedback" command in VS Code
- **Check** documentation files in the extension folder

## License

MIT License - Copyright (c) 2025 Sudha Rajendran and Rohitha Janga, Ontario Tech University

---

**Making VS Code accessible for everyone!** ♿

**A11YAssist** - Accessibility Assistant for Visual Studio Code
