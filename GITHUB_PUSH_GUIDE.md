# A11YAssist - GitHub Push Guide

**Authors:** Sudha Rajendran and Rohitha Janga
**Institution:** Ontario Tech University
**GitHub Username:** jangarohitha94
**Repository:** https://github.com/jangarohitha94/a11yassist-vscode

---

## 📋 Prerequisites

Before you start, make sure you have:

1. ✅ **Git installed** on Windows
   - Check: `git --version`
   - Download: https://git-scm.com/download/win

2. ✅ **GitHub account** (jangarohitha94) ✓

3. ✅ **Repository created** on GitHub (optional - can create during push)

---

## 🚀 Step-by-Step Guide to Push to GitHub

### Step 1: Create GitHub Repository

**Option A: Using GitHub Website**

1. Go to https://github.com/jangarohitha94
2. Click **"New"** or **"+"** → **"New repository"**
3. Repository name: `a11yassist-vscode`
4. Description: `Comprehensive accessibility assistant for VSCode`
5. Choose **Public** or **Private**
6. **DO NOT** initialize with README (we already have files)
7. Click **"Create repository"**

**Option B: Using GitHub CLI** (if installed)

```powershell
gh repo create jangarohitha94/a11yassist-vscode --public --description "Comprehensive accessibility assistant for VSCode"
```

---

### Step 2: Initialize Git in Your Project

Open PowerShell in your extension folder:

```powershell
cd C:\Users\heman\vscode-accessibility-extension
```

Initialize Git repository:

```powershell
git init
```

**Expected output:**
```
Initialized empty Git repository in C:/Users/heman/vscode-accessibility-extension/.git/
```

---

### Step 3: Configure Git (First Time Only)

Set your Git identity:

```powershell
git config user.name "Rohitha Janga"
git config user.email "your-email@example.com"
```

**Verify:**
```powershell
git config user.name
git config user.email
```

---

### Step 4: Create .gitignore File

Create a `.gitignore` file to exclude unnecessary files:

```powershell
# This is done automatically by the script below
```

The .gitignore file should contain:
```
node_modules/
out/
*.vsix
.vscode-test/
*.log
.DS_Store
.env
```

---

### Step 5: Add All Files to Git

Add all files to staging:

```powershell
git add .
```

**Check what will be committed:**
```powershell
git status
```

---

### Step 6: Make Your First Commit

Commit all files:

```powershell
git commit -m "Initial commit: A11YAssist - Accessibility Assistant for VSCode

- Complete TypeScript implementation
- Screen reader support
- Keyboard navigation
- Accessibility auditing (WCAG 2.1, ARIA)
- Contextual guidance
- Usage analytics
- Comprehensive documentation
- Authors: Sudha Rajendran and Rohitha Janga
- Ontario Tech University"
```

---

### Step 7: Rename Branch to 'main'

GitHub uses 'main' as the default branch:

```powershell
git branch -M main
```

---

### Step 8: Add GitHub Remote

Link your local repository to GitHub:

```powershell
git remote add origin https://github.com/jangarohitha94/a11yassist-vscode.git
```

**Verify:**
```powershell
git remote -v
```

**Expected output:**
```
origin  https://github.com/jangarohitha94/a11yassist-vscode.git (fetch)
origin  https://github.com/jangarohitha94/a11yassist-vscode.git (push)
```

---

### Step 9: Push to GitHub

Push your code to GitHub:

```powershell
git push -u origin main
```

**You'll be prompted for:**
- GitHub username: `jangarohitha94`
- Password: Use a **Personal Access Token** (not your regular password)

---

## 🔑 Creating a GitHub Personal Access Token

GitHub requires Personal Access Tokens for HTTPS authentication:

1. **Go to GitHub Settings:**
   - https://github.com/settings/tokens

2. **Click "Generate new token"** → "Generate new token (classic)"

3. **Configure token:**
   - Note: `A11YAssist VSCode Extension`
   - Expiration: Choose duration (e.g., 90 days)
   - Select scopes:
     - ✅ `repo` (all)
     - ✅ `workflow`

4. **Click "Generate token"**

5. **IMPORTANT:** Copy the token immediately (you won't see it again!)
   - Format: `ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

6. **Use this token as your password** when Git asks for authentication

---

## 📝 Alternative: Use SSH Instead of HTTPS

### Setup SSH (Recommended for easier pushes)

**Step 1: Generate SSH Key**

```powershell
ssh-keygen -t ed25519 -C "your-email@example.com"
```

Press Enter for all prompts (default location is fine).

**Step 2: Copy SSH Public Key**

```powershell
cat ~/.ssh/id_ed25519.pub | clip
```

**Step 3: Add to GitHub**

1. Go to https://github.com/settings/keys
2. Click **"New SSH key"**
3. Title: `Windows PC - A11YAssist Dev`
4. Paste the key (Ctrl+V)
5. Click **"Add SSH key"**

**Step 4: Change Remote to SSH**

```powershell
git remote set-url origin git@github.com:jangarohitha94/a11yassist-vscode.git
```

**Step 5: Push**

```powershell
git push -u origin main
```

No password needed!

---

## 🤖 Automated Git Setup Script

I've created a script for you! Run this PowerShell script:

```powershell
.\setup-git-and-push.ps1
```

This will:
1. ✅ Initialize Git
2. ✅ Create .gitignore
3. ✅ Add all files
4. ✅ Make initial commit
5. ✅ Add GitHub remote
6. ✅ Push to GitHub

---

## 🔄 Making Changes Later

After the initial push, use this workflow:

```powershell
# 1. Make changes to your code

# 2. Check what changed
git status

# 3. Add changes
git add .

# 4. Commit with a message
git commit -m "Description of changes"

# 5. Push to GitHub
git push
```

---

## 📊 Common Git Commands

| Command | Purpose |
|---------|---------|
| `git status` | See what files changed |
| `git add .` | Stage all changes |
| `git add filename` | Stage specific file |
| `git commit -m "message"` | Commit changes |
| `git push` | Push to GitHub |
| `git pull` | Pull changes from GitHub |
| `git log` | View commit history |
| `git branch` | List branches |
| `git checkout -b feature` | Create new branch |

---

## 🐛 Troubleshooting

### Error: "fatal: not a git repository"

**Solution:**
```powershell
git init
```

---

### Error: "remote origin already exists"

**Solution:**
```powershell
git remote remove origin
git remote add origin https://github.com/jangarohitha94/a11yassist-vscode.git
```

---

### Error: "failed to push some refs"

**Solution:**
```powershell
# Pull first, then push
git pull origin main --allow-unrelated-histories
git push -u origin main
```

---

### Error: "Authentication failed"

**Solutions:**

1. **Use Personal Access Token** instead of password
2. **Or use SSH** (see SSH setup above)
3. **Or use GitHub Desktop** (GUI application)

---

### Error: "Large files"

If you accidentally committed large files:

```powershell
# Remove from Git but keep locally
git rm --cached filename

# Update .gitignore
echo "filename" >> .gitignore

# Commit the removal
git commit -m "Remove large file"
git push
```

---

## 📦 What Will Be Pushed

These files will be pushed to GitHub:

```
✅ src/                      - All TypeScript source code
✅ package.json              - Extension manifest
✅ tsconfig.json             - TypeScript config
✅ .eslintrc.json            - ESLint config
✅ LICENSE                   - MIT License
✅ README.md                 - Main documentation
✅ WINDOWS_INSTALL.md        - Windows guide
✅ All other .md files       - Documentation
✅ .gitignore               - Git ignore rules

❌ node_modules/            - Excluded (too large)
❌ out/                     - Excluded (compiled files)
❌ *.vsix                   - Excluded (package files)
```

---

## 🌐 After Pushing

Once pushed, your repository will be available at:

**https://github.com/jangarohitha94/a11yassist-vscode**

You can:
- ✅ Share the URL with others
- ✅ Add topics/tags
- ✅ Update the About section
- ✅ Add a description
- ✅ Enable GitHub Pages for documentation
- ✅ Create releases
- ✅ Accept contributions

---

## 📋 Recommended GitHub Settings

### 1. Add Topics

On your repository page, click "Add topics":
- `accessibility`
- `vscode-extension`
- `a11y`
- `screen-reader`
- `wcag`
- `aria`
- `keyboard-navigation`
- `typescript`

### 2. Update About Section

Click the gear icon next to "About":
- Description: `Comprehensive accessibility assistant for VSCode with screen reader support, keyboard navigation, and WCAG 2.1 auditing`
- Website: (optional)
- Topics: (add from above)
- Check: ✅ Releases, ✅ Packages

### 3. Create First Release

1. Go to "Releases" → "Create a new release"
2. Tag: `v1.0.0`
3. Title: `A11YAssist v1.0.0 - Initial Release`
4. Description: Describe features
5. Attach: `a11yassist-1.0.0.vsix` file
6. Click "Publish release"

---

## 🎯 Quick Command Summary

```powershell
# One-time setup
git init
git config user.name "Rohitha Janga"
git config user.email "your-email@example.com"
git remote add origin https://github.com/jangarohitha94/a11yassist-vscode.git

# Initial push
git add .
git commit -m "Initial commit: A11YAssist extension"
git branch -M main
git push -u origin main

# Future updates
git add .
git commit -m "Update: description of changes"
git push
```

---

**Ready to push your code to GitHub!** 🚀

Run the automated script or follow the steps above.

**Authors:** Sudha Rajendran and Rohitha Janga
**Institution:** Ontario Tech University
