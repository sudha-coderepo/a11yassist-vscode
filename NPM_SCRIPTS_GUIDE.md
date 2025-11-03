# A11YAssist - NPM Scripts Guide

**Authors:** Sudha Rajendran and Rohitha Janga
**Institution:** Ontario Tech University
**GitHub:** https://github.com/sudha-coderepo/a11yassist-vscode

## Available NPM Scripts

### Development Scripts

#### `npm run compile`
Compiles TypeScript files to JavaScript in the `out/` directory.

**Usage:**
```powershell
npm run compile
```

**When to use:**
- After making changes to TypeScript files
- Before testing the extension
- Before packaging

---

#### `npm run watch`
Compiles TypeScript and watches for file changes. Auto-recompiles on save.

**Usage:**
```powershell
npm run watch
```

**When to use:**
- During active development
- When making multiple changes
- Keep this running in a separate terminal

**Tip:** Leave this running and press `Ctrl+R` in Extension Development Host to reload changes.

---

#### `npm run lint`
Checks code quality and style issues using ESLint.

**Usage:**
```powershell
npm run lint
```

**Output:** Lists all code quality issues found.

---

#### `npm run lint:fix`
Automatically fixes code quality issues that can be auto-fixed.

**Usage:**
```powershell
npm run lint:fix
```

**What it fixes:**
- Missing semicolons
- Indentation issues
- Spacing problems
- Import ordering

---

#### `npm run clean`
Removes the compiled `out/` directory.

**Usage:**
```powershell
npm run clean
```

**When to use:**
- Before a fresh build
- When compilation seems stuck
- To save disk space

**Note:** Requires `rimraf` package (will be installed with npm install).

---

#### `npm run rebuild`
Cleans and recompiles everything from scratch.

**Usage:**
```powershell
npm run rebuild
```

**Equivalent to:**
```powershell
npm run clean && npm run compile
```

---

### Packaging Scripts

#### `npm run package`
Creates a `.vsix` package file for distribution.

**Usage:**
```powershell
npm run package
```

**Output:** `a11yassist-1.0.0.vsix`

**Alternative:**
```powershell
npx vsce package
```

**When to use:**
- Creating a distributable extension
- Installing in regular VS Code
- Sharing with others

---

#### `npm run publish`
Publishes the extension to the VS Code Marketplace.

**Usage:**
```powershell
npm run publish
```

**Prerequisites:**
- Personal Access Token from Azure DevOps
- Publisher account on VS Code Marketplace
- Extension must be packaged first

**Setup:**
```powershell
vsce login ontario-tech-university
```

---

### Testing Scripts

#### `npm run pretest`
Runs before tests. Compiles code and runs linter.

**Usage:**
Automatically runs before `npm test`

---

#### `npm test`
Runs extension tests (when test files are added).

**Usage:**
```powershell
npm test
```

**Note:** Test framework needs to be set up first.

---

## Quick Command Reference

| Task | Command |
|------|---------|
| **First time setup** | `npm install` |
| **Compile once** | `npm run compile` |
| **Compile and watch** | `npm run watch` |
| **Check code quality** | `npm run lint` |
| **Fix code issues** | `npm run lint:fix` |
| **Clean build files** | `npm run clean` |
| **Fresh rebuild** | `npm run rebuild` |
| **Create .vsix file** | `npm run package` |
| **Install extension** | `code --install-extension a11yassist-1.0.0.vsix` |

---

## Common Workflows

### Development Workflow

```powershell
# Terminal 1: Watch for changes
npm run watch

# Terminal 2: Run extension
# In VS Code, press F5

# Make changes to TypeScript files
# In Extension Development Host, press Ctrl+R to reload
```

---

### Package and Install Workflow

```powershell
# 1. Compile
npm run compile

# 2. Check for issues
npm run lint

# 3. Package
npm run package

# 4. Install
code --install-extension a11yassist-1.0.0.vsix

# 5. Restart VS Code
```

---

### Clean Build Workflow

```powershell
# Clean everything and rebuild
npm run clean
npm install
npm run compile

# Or use the rebuild script
npm run rebuild
```

---

### Code Quality Workflow

```powershell
# Check for issues
npm run lint

# Auto-fix issues
npm run lint:fix

# Compile
npm run compile
```

---

## Installation Scripts

### Fresh Install

```powershell
# 1. Clone repository
git clone https://github.com/sudha-coderepo/a11yassist-vscode
cd a11yassist-vscode

# 2. Install dependencies
npm install

# 3. Compile
npm run compile

# 4. Test in VS Code
code .
# Press F5
```

---

### Update Dependencies

```powershell
# Update all dependencies
npm update

# Rebuild after update
npm run rebuild
```

---

## Troubleshooting

### Compilation Errors

```powershell
# Clean and rebuild
npm run clean
npm run compile

# If still failing, reinstall
rm -rf node_modules package-lock.json
npm install
npm run compile
```

---

### Watch Not Working

```powershell
# Stop the watch process (Ctrl+C)
# Clear the terminal
# Restart watch
npm run watch
```

---

### Package Creation Fails

```powershell
# Make sure code compiles first
npm run compile

# Check for errors
npm run lint

# Try packaging with npx
npx vsce package
```

---

## VS Code Tasks

You can also run these scripts from VS Code:

1. **Press `Ctrl+Shift+B`** (Run Build Task)
2. Select from the list:
   - npm: compile
   - npm: watch
   - npm: lint
   - npm: package

---

## GitHub Repository

**Repository:** https://github.com/sudha-coderepo/a11yassist-vscode

**Clone:**
```bash
git clone https://github.com/sudha-coderepo/a11yassist-vscode.git
```

**Issues:** https://github.com/sudha-coderepo/a11yassist-vscode/issues

---

## Additional Resources

- **VS Code Extension API:** https://code.visualstudio.com/api
- **TypeScript Handbook:** https://www.typescriptlang.org/docs/
- **ESLint Rules:** https://eslint.org/docs/rules/
- **Publishing Extensions:** https://code.visualstudio.com/api/working-with-extensions/publishing-extension

---

**A11YAssist - Making VS Code Accessible for Everyone!** ♿

**Authors:** Sudha Rajendran and Rohitha Janga
**Institution:** Ontario Tech University
**License:** MIT
