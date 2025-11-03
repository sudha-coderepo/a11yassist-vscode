/**
 * Keyboard Navigation Manager
 *
 * @author Sudha Rajendran and Rohitha Janga
 * @institution Ontario Tech University
 * @description Manages enhanced keyboard navigation for users with motor limitations
 *
 * Features:
 * - Custom keyboard shortcuts
 * - Navigation assistance
 * - Keyboard-only workflows
 * - Quick access commands
 * - Visual focus indicators
 */

import * as vscode from 'vscode';
import { KeyboardShortcut, ExtensionConfig } from '../types';

/**
 * KeyboardNavigationManager class
 * Provides enhanced keyboard navigation support
 */
export class KeyboardNavigationManager {
    private context: vscode.ExtensionContext;
    private config: ExtensionConfig;
    private shortcuts: KeyboardShortcut[];

    /**
     * Constructor
     * @param context - VSCode extension context
     */
    constructor(context: vscode.ExtensionContext) {
        this.context = context;
        this.config = this.loadConfiguration();
        this.shortcuts = this.initializeShortcuts();

        // Register custom keyboard shortcuts
        this.registerCustomShortcuts();
    }

    /**
     * Load configuration from workspace settings
     */
    private loadConfiguration(): ExtensionConfig {
        const config = vscode.workspace.getConfiguration('accessibilityEnhancer');

        return {
            enableScreenReaderEnhancements: config.get('enableScreenReaderEnhancements', true),
            enableContextualGuidance: config.get('enableContextualGuidance', true),
            enableAnalytics: config.get('enableAnalytics', false),
            highContrastMode: config.get('highContrastMode', false),
            verbosityLevel: config.get('verbosityLevel', 'normal') as any,
            enableKeyboardNavigation: config.get('enableKeyboardNavigation', true),
            announceEditorChanges: config.get('announceEditorChanges', true),
            cognitiveLoadReduction: config.get('cognitiveLoadReduction', false)
        };
    }

    /**
     * Update configuration when settings change
     */
    public updateConfiguration(): void {
        this.config = this.loadConfiguration();
    }

    /**
     * Initialize keyboard shortcuts
     */
    private initializeShortcuts(): KeyboardShortcut[] {
        return [
            // Accessibility Commands
            {
                key: 'Ctrl+Shift+A',
                command: 'a11yassist.runAudit',
                description: 'Run accessibility audit on current file',
                category: 'Accessibility'
            },
            {
                key: 'Ctrl+Shift+K',
                command: 'a11yassist.showKeyboardShortcuts',
                description: 'Show keyboard navigation guide',
                category: 'Accessibility'
            },
            {
                key: 'Ctrl+Shift+C',
                command: 'a11yassist.announceCurrentContext',
                description: 'Announce current context (for screen readers)',
                category: 'Accessibility'
            },
            {
                key: 'Ctrl+Shift+D',
                command: 'a11yassist.describeElement',
                description: 'Describe current element under cursor',
                category: 'Accessibility'
            },

            // Navigation Commands
            {
                key: 'Alt+Up',
                command: 'workbench.action.navigateUp',
                description: 'Navigate to editor above',
                category: 'Navigation'
            },
            {
                key: 'Alt+Down',
                command: 'workbench.action.navigateDown',
                description: 'Navigate to editor below',
                category: 'Navigation'
            },
            {
                key: 'Alt+Left',
                command: 'workbench.action.navigateLeft',
                description: 'Navigate to editor on the left',
                category: 'Navigation'
            },
            {
                key: 'Alt+Right',
                command: 'workbench.action.navigateRight',
                description: 'Navigate to editor on the right',
                category: 'Navigation'
            },

            // Editor Commands
            {
                key: 'Ctrl+M',
                command: 'editor.action.toggleTabFocusMode',
                description: 'Toggle Tab key behavior',
                category: 'Editor'
            },
            {
                key: 'Ctrl+K Ctrl+I',
                command: 'editor.action.showHover',
                description: 'Show hover information',
                category: 'Editor'
            },
            {
                key: 'F8',
                command: 'editor.action.marker.next',
                description: 'Go to next error or warning',
                category: 'Editor'
            },
            {
                key: 'Shift+F8',
                command: 'editor.action.marker.prev',
                description: 'Go to previous error or warning',
                category: 'Editor'
            },

            // Panel Commands
            {
                key: 'Ctrl+`',
                command: 'workbench.action.terminal.toggleTerminal',
                description: 'Toggle terminal panel',
                category: 'Panels'
            },
            {
                key: 'Ctrl+Shift+E',
                command: 'workbench.view.explorer',
                description: 'Show explorer panel',
                category: 'Panels'
            },
            {
                key: 'Ctrl+Shift+F',
                command: 'workbench.view.search',
                description: 'Show search panel',
                category: 'Panels'
            },
            {
                key: 'Ctrl+Shift+G',
                command: 'workbench.view.scm',
                description: 'Show source control panel',
                category: 'Panels'
            },
            {
                key: 'Ctrl+Shift+X',
                command: 'workbench.view.extensions',
                description: 'Show extensions panel',
                category: 'Panels'
            }
        ];
    }

    /**
     * Register custom keyboard shortcuts
     */
    private registerCustomShortcuts(): void {
        // Register quick navigation commands
        this.context.subscriptions.push(
            vscode.commands.registerCommand('a11yassist.quickNavigation', () => {
                this.showQuickNavigationMenu();
            })
        );

        // Register jump to section command
        this.context.subscriptions.push(
            vscode.commands.registerCommand('a11yassist.jumpToSection', () => {
                this.jumpToSection();
            })
        );

        // Register focus management command
        this.context.subscriptions.push(
            vscode.commands.registerCommand('a11yassist.manageFocus', () => {
                this.manageFocus();
            })
        );
    }

    /**
     * Show keyboard shortcuts guide
     */
    public showKeyboardGuide(): void {
        const panel = vscode.window.createWebviewPanel(
            'keyboardGuide',
            'Keyboard Navigation Guide',
            vscode.ViewColumn.One,
            {
                enableScripts: true
            }
        );

        panel.webview.html = this.getKeyboardGuideHTML();
    }

    /**
     * Generate HTML for keyboard guide
     */
    private getKeyboardGuideHTML(): string {
        const groupedShortcuts = this.groupShortcutsByCategory();

        let html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Keyboard Navigation Guide</title>
    <style>
        body {
            font-family: var(--vscode-font-family);
            color: var(--vscode-foreground);
            background-color: var(--vscode-editor-background);
            padding: 20px;
            line-height: 1.6;
        }
        h1 {
            color: var(--vscode-textLink-foreground);
            border-bottom: 2px solid var(--vscode-textSeparator-foreground);
            padding-bottom: 10px;
        }
        h2 {
            color: var(--vscode-textLink-foreground);
            margin-top: 30px;
            border-left: 4px solid var(--vscode-textLink-foreground);
            padding-left: 10px;
        }
        .shortcut-table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }
        .shortcut-table th,
        .shortcut-table td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid var(--vscode-panel-border);
        }
        .shortcut-table th {
            background-color: var(--vscode-editor-lineHighlightBackground);
            font-weight: bold;
        }
        .shortcut-table tr:hover {
            background-color: var(--vscode-list-hoverBackground);
        }
        .key {
            display: inline-block;
            padding: 4px 8px;
            background-color: var(--vscode-button-background);
            color: var(--vscode-button-foreground);
            border-radius: 4px;
            font-family: monospace;
            font-size: 0.9em;
            margin: 2px;
        }
        .intro {
            background-color: var(--vscode-textBlockQuote-background);
            border-left: 4px solid var(--vscode-textLink-foreground);
            padding: 15px;
            margin: 20px 0;
        }
        .tip {
            background-color: var(--vscode-inputValidation-infoBackground);
            border: 1px solid var(--vscode-inputValidation-infoBorder);
            padding: 10px;
            margin: 10px 0;
            border-radius: 4px;
        }
    </style>
</head>
<body>
    <h1>🎹 Keyboard Navigation Guide</h1>

    <div class="intro">
        <p><strong>Welcome to the Accessibility Enhancer Keyboard Navigation Guide!</strong></p>
        <p>This extension enhances VSCode for users who prefer or require keyboard-only navigation.
        All features are accessible without using a mouse.</p>
    </div>

    <div class="tip">
        <strong>💡 Tip:</strong> Press <span class="key">Ctrl+M</span> to toggle Tab key behavior
        between inserting tabs and navigating between UI elements.
    </div>
`;

        // Add shortcuts grouped by category
        for (const [category, shortcuts] of Object.entries(groupedShortcuts)) {
            html += `
    <h2>${category}</h2>
    <table class="shortcut-table" role="table">
        <thead>
            <tr>
                <th scope="col">Shortcut</th>
                <th scope="col">Description</th>
            </tr>
        </thead>
        <tbody>
`;

            for (const shortcut of shortcuts) {
                const keyParts = shortcut.key.split(/\s+/);
                const keyHTML = keyParts.map(k => `<span class="key">${k}</span>`).join(' ');

                html += `
            <tr>
                <td>${keyHTML}</td>
                <td>${shortcut.description}</td>
            </tr>
`;
            }

            html += `
        </tbody>
    </table>
`;
        }

        html += `
    <div class="tip">
        <strong>📚 Additional Resources:</strong>
        <ul>
            <li><a href="https://code.visualstudio.com/docs/getstarted/keybindings">VSCode Keyboard Shortcuts Reference</a></li>
            <li><a href="https://code.visualstudio.com/docs/editor/accessibility">VSCode Accessibility Documentation</a></li>
        </ul>
    </div>
</body>
</html>
`;

        return html;
    }

    /**
     * Group shortcuts by category
     */
    private groupShortcutsByCategory(): Record<string, KeyboardShortcut[]> {
        const grouped: Record<string, KeyboardShortcut[]> = {};

        for (const shortcut of this.shortcuts) {
            if (!grouped[shortcut.category]) {
                grouped[shortcut.category] = [];
            }
            grouped[shortcut.category].push(shortcut);
        }

        return grouped;
    }

    /**
     * Show quick navigation menu
     */
    private async showQuickNavigationMenu(): Promise<void> {
        const items = [
            {
                label: '$(file) Explorer',
                description: 'Open file explorer',
                command: 'workbench.view.explorer'
            },
            {
                label: '$(search) Search',
                description: 'Open search panel',
                command: 'workbench.view.search'
            },
            {
                label: '$(source-control) Source Control',
                description: 'Open source control panel',
                command: 'workbench.view.scm'
            },
            {
                label: '$(debug-alt) Debug',
                description: 'Open debug panel',
                command: 'workbench.view.debug'
            },
            {
                label: '$(extensions) Extensions',
                description: 'Open extensions panel',
                command: 'workbench.view.extensions'
            },
            {
                label: '$(terminal) Terminal',
                description: 'Open terminal',
                command: 'workbench.action.terminal.toggleTerminal'
            },
            {
                label: '$(output) Output',
                description: 'Open output panel',
                command: 'workbench.action.output.toggleOutput'
            },
            {
                label: '$(accessibility) Accessibility Panel',
                description: 'Open accessibility panel',
                command: 'a11yassist.showAccessibilityPanel'
            }
        ];

        const selected = await vscode.window.showQuickPick(items, {
            placeHolder: 'Navigate to...',
            matchOnDescription: true
        });

        if (selected) {
            vscode.commands.executeCommand(selected.command);
        }
    }

    /**
     * Jump to a specific section in the current file
     */
    private async jumpToSection(): Promise<void> {
        const editor = vscode.window.activeTextEditor;

        if (!editor) {
            vscode.window.showWarningMessage('No active editor');
            return;
        }

        // Get document symbols (functions, classes, etc.)
        const symbols = await vscode.commands.executeCommand<vscode.DocumentSymbol[]>(
            'vscode.executeDocumentSymbolProvider',
            editor.document.uri
        );

        if (!symbols || symbols.length === 0) {
            vscode.window.showInformationMessage('No symbols found in current file');
            return;
        }

        const items = this.flattenSymbols(symbols).map(symbol => ({
            label: symbol.name,
            description: vscode.SymbolKind[symbol.kind],
            detail: `Line ${symbol.range.start.line + 1}`,
            symbol
        }));

        const selected = await vscode.window.showQuickPick(items, {
            placeHolder: 'Jump to symbol...',
            matchOnDescription: true,
            matchOnDetail: true
        });

        if (selected) {
            const position = selected.symbol.range.start;
            editor.selection = new vscode.Selection(position, position);
            editor.revealRange(selected.symbol.range, vscode.TextEditorRevealType.InCenter);
        }
    }

    /**
     * Flatten nested symbols
     */
    private flattenSymbols(symbols: vscode.DocumentSymbol[]): vscode.DocumentSymbol[] {
        const result: vscode.DocumentSymbol[] = [];

        for (const symbol of symbols) {
            result.push(symbol);
            if (symbol.children) {
                result.push(...this.flattenSymbols(symbol.children));
            }
        }

        return result;
    }

    /**
     * Manage focus between editor and panels
     */
    private async manageFocus(): Promise<void> {
        const items = [
            {
                label: '$(edit) Focus Editor',
                description: 'Move focus to active editor',
                action: () => vscode.commands.executeCommand('workbench.action.focusActiveEditorGroup')
            },
            {
                label: '$(list-tree) Focus Sidebar',
                description: 'Move focus to sidebar',
                action: () => vscode.commands.executeCommand('workbench.action.focusSideBar')
            },
            {
                label: '$(terminal) Focus Terminal',
                description: 'Move focus to terminal',
                action: () => vscode.commands.executeCommand('workbench.action.terminal.focus')
            },
            {
                label: '$(panel) Focus Panel',
                description: 'Move focus to panel',
                action: () => vscode.commands.executeCommand('workbench.action.focusPanel')
            }
        ];

        const selected = await vscode.window.showQuickPick(items, {
            placeHolder: 'Move focus to...'
        });

        if (selected) {
            selected.action();
        }
    }

    /**
     * Get all keyboard shortcuts
     */
    public getShortcuts(): KeyboardShortcut[] {
        return [...this.shortcuts];
    }
}
