# Quick Start Guide - Accessibility Enhancer

**Authors:** Sudha Rajendran and Rohitha Janga
**Institution:** Ontario Tech University

## 🚀 Get Started in 5 Minutes

### Step 1: Install Dependencies (Windows)

Open PowerShell in the extension folder:

```powershell
cd C:\Users\heman\vscode-accessibility-extension
npm install
```

**Wait for:** "added 150+ packages"

### Step 2: Compile the Extension

```powershell
npm run compile
```

**Expected:** No errors, `out/` folder created

### Step 3: Run the Extension

1. Open the folder in VS Code:
   ```powershell
   code .
   ```

2. Press **F5**

3. A new VS Code window opens labeled "[Extension Development Host]"

4. **The extension is now running!**

### Step 4: Test It Out

In the Extension Development Host window:

#### Test 1: Keyboard Guide
- Press `Ctrl+Shift+K`
- View all keyboard shortcuts
- ✅ Success: Guide panel opens

#### Test 2: Accessibility Audit
1. Create a new HTML file (`Ctrl+N`)
2. Paste this code:
   ```html
   <img src="test.jpg">
   <button></button>
   <input type="text">
   ```
3. Press `Ctrl+Shift+A`
4. ✅ Success: Issues appear in Problems panel

#### Test 3: Screen Reader Mode
- Press `Ctrl+Shift+C`
- Check Output panel → "Accessibility Announcements"
- ✅ Success: Context is announced

#### Test 4: Accessibility Panel
- Click the accessibility icon in sidebar (left)
- ✅ Success: Panel shows three views

## 📝 Essential Commands

| Shortcut | What it does |
|----------|-------------|
| `Ctrl+Shift+A` | Run accessibility audit |
| `Ctrl+Shift+K` | Show keyboard shortcuts |
| `Ctrl+Shift+C` | Announce current context |
| `F5` (in main window) | Start/Restart extension |
| `Ctrl+R` (in dev host) | Reload extension |

## 🔧 Development Workflow

### Keep This Running
```powershell
npm run watch
```
*Auto-compiles when you save files*

### Make Changes
1. Edit any `.ts` file in `src/`
2. Save the file
3. In Extension Development Host: Press `Ctrl+R`
4. Test your changes

### Debug
1. Set breakpoint (click left of line number)
2. Press `F5`
3. Trigger the feature
4. Debugger pauses at breakpoint

## 📁 Key Files to Know

```
src/
├── extension.ts                    ← Start here (main entry)
├── features/
│   ├── screenReaderManager.ts      ← Screen reader support
│   ├── keyboardNavigationManager.ts ← Keyboard shortcuts
│   ├── accessibilityAuditor.ts     ← Audit engine
│   └── analyticsManager.ts         ← Usage tracking
└── utils/
    ├── colorContrastAnalyzer.ts    ← Color checking
    └── ariaValidator.ts            ← ARIA validation
```

## 🐛 Common Issues

### "Cannot find module 'vscode'"
```powershell
npm install
```

### Extension doesn't start
- Check Output → "Extension Host" for errors
- Ensure no compilation errors: `npm run compile`

### Changes not showing
- Press `Ctrl+R` in Extension Development Host
- Or close dev host and press `F5` again

### Port already in use
- Close other VS Code instances
- Or: Task Manager → End "Code - OSS" processes

## 📦 Package the Extension

```powershell
# Install packager
npm install -g @vscode/vsce

# Create .vsix file
vsce package

# Install it
code --install-extension accessibility-enhancer-1.0.0.vsix
```

## 🧪 Test with Screen Readers

### Windows Narrator (Built-in)
1. Press `Win+Ctrl+Enter` to start
2. Test the extension
3. Press `Win+Ctrl+Enter` to stop

### NVDA (Free)
1. Download: https://www.nvaccess.org/
2. Install and start NVDA
3. Test the extension
4. Press `Insert+Q` to quit

## 📚 Full Documentation

- **README.md** - Complete feature documentation
- **SETUP_GUIDE.md** - Detailed Windows setup
- **ACCESSIBILITY_AUDIT_REPORT.md** - Accessibility compliance details

## 🎯 Next Steps

1. ✅ Run the extension (you did this!)
2. 📖 Read README.md for features
3. 🔨 Make your first change
4. 🧪 Test with screen readers
5. 📊 Review analytics in sidebar
6. 🚀 Package and share!

## 💬 Need Help?

- Check **SETUP_GUIDE.md** for troubleshooting
- Review code comments for implementation details
- Contact: sudha.rajendran@ontariotechu.ca

---

**Ready to make VS Code more accessible!** ♿✨
