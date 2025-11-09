/**
 * Screen Reader Manager
 *
 * @author Sudha Rajendran
 * @institution Ontario Tech University
 * @description Manages screen reader compatibility and announcements for visually impaired users
 *
 * Features:
 * - Context-aware announcements
 * - Verbosity level management
 * - Editor change notifications
 * - Selection change handling
 * - Keyboard shortcut announcements
 */

import * as vscode from 'vscode';
import { ScreenReaderAnnouncement, VerbosityLevel, ExtensionConfig } from '../types';

/**
 * ScreenReaderManager class
 * Provides enhanced screen reader support for VSCode
 */
export class ScreenReaderManager {
    private context: vscode.ExtensionContext;
    private config: ExtensionConfig;
    private isEnhancedModeEnabled: boolean = true;
    private announcementHistory: ScreenReaderAnnouncement[] = [];
    private statusBarItem: vscode.StatusBarItem;

    /**
     * Constructor
     * @param context - VSCode extension context
     */
    constructor(context: vscode.ExtensionContext) {
        this.context = context;
        this.config = this.loadConfiguration();

        // Create status bar item
        this.statusBarItem = vscode.window.createStatusBarItem(
            vscode.StatusBarAlignment.Right,
            100
        );
        this.statusBarItem.text = "$(accessibility) SR Enhanced";
        this.statusBarItem.tooltip = "Screen Reader Enhanced Mode Active";
        this.statusBarItem.command = 'a11yassist.toggleScreenReaderMode';

        if (this.config.enableScreenReaderEnhancements) {
            this.statusBarItem.show();
        }

        context.subscriptions.push(this.statusBarItem);

        // Announce activation
        this.announce({
            message: 'Accessibility Enhancer activated. Screen reader enhanced mode is enabled.',
            priority: 'polite',
            context: 'Extension Activation'
        });
    }

    /**
     * Load configuration from workspace settings
     */
    private loadConfiguration(): ExtensionConfig {
        const config = vscode.workspace.getConfiguration('a11yassist');

        return {
            enableScreenReaderEnhancements: config.get('enableScreenReaderEnhancements', true),
            enableContextualGuidance: config.get('enableContextualGuidance', true),
            enableAnalytics: config.get('enableAnalytics', false),
            highContrastMode: config.get('highContrastMode', false),
            verbosityLevel: config.get('verbosityLevel', VerbosityLevel.NORMAL) as VerbosityLevel,
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

        if (this.config.enableScreenReaderEnhancements) {
            this.statusBarItem.show();
        } else {
            this.statusBarItem.hide();
        }

        this.announce({
            message: 'Accessibility settings updated',
            priority: 'polite',
            context: 'Configuration Change'
        });
    }

    /**
     * Toggle enhanced screen reader mode
     */
    public toggleEnhancedMode(): void {
        this.isEnhancedModeEnabled = !this.isEnhancedModeEnabled;

        if (this.isEnhancedModeEnabled) {
            this.statusBarItem.text = "$(accessibility) SR Enhanced";
            this.statusBarItem.tooltip = "Screen Reader Enhanced Mode Active - Click to disable";
            this.announce({
                message: 'Screen reader enhanced mode enabled',
                priority: 'assertive',
                context: 'Mode Toggle'
            });
        } else {
            this.statusBarItem.text = "$(accessibility) SR Basic";
            this.statusBarItem.tooltip = "Screen Reader Enhanced Mode Inactive - Click to enable";
            this.announce({
                message: 'Screen reader enhanced mode disabled',
                priority: 'assertive',
                context: 'Mode Toggle'
            });
        }
    }

    /**
     * Make an announcement to the screen reader
     * @param announcement - Announcement details
     */
    public announce(announcement: ScreenReaderAnnouncement): void {
        if (!this.config.enableScreenReaderEnhancements || !this.isEnhancedModeEnabled) {
            return;
        }

        // Apply verbosity filtering
        const message = this.applyVerbosityLevel(announcement.message);

        // Store in history
        this.announcementHistory.push({
            ...announcement,
            message
        });

        // Keep only last 50 announcements
        if (this.announcementHistory.length > 50) {
            this.announcementHistory.shift();
        }

        // Make the announcement
        // VSCode doesn't have a direct screen reader API, so we use status bar and output
        if (announcement.priority === 'assertive') {
            vscode.window.showInformationMessage(message);
        } else {
            // Use output channel for polite announcements
            this.getOutputChannel().appendLine(`[${new Date().toLocaleTimeString()}] ${message}`);
        }
    }

    /**
     * Apply verbosity level to message
     */
    private applyVerbosityLevel(message: string): string {
        switch (this.config.verbosityLevel) {
            case VerbosityLevel.MINIMAL:
                // Return only the essential part (first sentence)
                return message.split('.')[0] + '.';

            case VerbosityLevel.VERBOSE:
                // Add context information
                return `[Accessibility] ${message}`;

            case VerbosityLevel.NORMAL:
            default:
                return message;
        }
    }

    /**
     * Announce current editor context
     */
    public announceCurrentContext(): void {
        const editor = vscode.window.activeTextEditor;

        if (!editor) {
            this.announce({
                message: 'No active editor',
                priority: 'assertive',
                context: 'Editor Context'
            });
            return;
        }

        const document = editor.document;
        const position = editor.selection.active;
        const lineCount = document.lineCount;
        const currentLine = position.line + 1;
        const currentColumn = position.character + 1;
        const languageId = document.languageId;
        const fileName = document.fileName.split(/[\\/]/).pop();

        const contextMessage = this.buildContextMessage({
            fileName,
            languageId,
            currentLine,
            currentColumn,
            lineCount,
            hasSelection: !editor.selection.isEmpty
        });

        this.announce({
            message: contextMessage,
            priority: 'assertive',
            context: 'Current Context'
        });
    }

    /**
     * Build context message based on verbosity level
     */
    private buildContextMessage(context: {
        fileName?: string;
        languageId: string;
        currentLine: number;
        currentColumn: number;
        lineCount: number;
        hasSelection: boolean;
    }): string {
        const parts: string[] = [];

        if (context.fileName) {
            parts.push(`File: ${context.fileName}`);
        }

        parts.push(`Language: ${context.languageId}`);
        parts.push(`Line ${context.currentLine} of ${context.lineCount}`);
        parts.push(`Column ${context.currentColumn}`);

        if (context.hasSelection) {
            parts.push('Text selected');
        }

        switch (this.config.verbosityLevel) {
            case VerbosityLevel.MINIMAL:
                return `Line ${context.currentLine}, Column ${context.currentColumn}`;

            case VerbosityLevel.VERBOSE:
                return parts.join(', ');

            case VerbosityLevel.NORMAL:
            default:
                return `${context.fileName || 'Document'}: Line ${context.currentLine}, Column ${context.currentColumn}`;
        }
    }

    /**
     * Describe the current element under cursor
     */
    public describeCurrentElement(): void {
        const editor = vscode.window.activeTextEditor;

        if (!editor) {
            this.announce({
                message: 'No active editor',
                priority: 'assertive',
                context: 'Element Description'
            });
            return;
        }

        const position = editor.selection.active;
        const line = editor.document.lineAt(position.line);
        const lineText = line.text;
        const wordRange = editor.document.getWordRangeAtPosition(position);

        let description = `Line ${position.line + 1}: `;

        if (wordRange) {
            const word = editor.document.getText(wordRange);
            description += `Current word: ${word}. `;
        }

        // Add line content based on verbosity
        if (this.config.verbosityLevel === VerbosityLevel.VERBOSE) {
            description += `Line content: ${lineText.trim()}`;
        } else if (lineText.trim().length === 0) {
            description += 'Empty line';
        } else {
            description += `Line has ${lineText.length} characters`;
        }

        this.announce({
            message: description,
            priority: 'assertive',
            context: 'Element Description'
        });
    }

    /**
     * Handle text selection changes
     */
    public handleSelectionChange(event: vscode.TextEditorSelectionChangeEvent): void {
        if (!this.config.announceEditorChanges || !this.isEnhancedModeEnabled) {
            return;
        }

        // Only announce significant selection changes
        const selection = event.selections[0];

        if (!selection.isEmpty) {
            const selectedText = event.textEditor.document.getText(selection);
            const lineCount = selectedText.split('\n').length;

            let message: string;

            if (lineCount > 1) {
                message = `Selected ${lineCount} lines`;
            } else {
                const wordCount = selectedText.split(/\s+/).length;
                message = `Selected ${wordCount} word${wordCount !== 1 ? 's' : ''}`;
            }

            this.announce({
                message,
                priority: 'polite',
                context: 'Selection Change'
            });
        }
    }

    /**
     * Announce document change
     */
    public announceDocumentChange(change: vscode.TextDocumentChangeEvent): void {
        if (!this.config.announceEditorChanges || !this.isEnhancedModeEnabled) {
            return;
        }

        // Announce only significant changes (not every keystroke)
        const changeText = change.contentChanges[0]?.text;

        if (changeText && changeText.length > 20) {
            this.announce({
                message: `Document modified: ${changeText.length} characters changed`,
                priority: 'polite',
                context: 'Document Change'
            });
        }
    }

    /**
     * Announce diagnostic (error/warning) at cursor
     */
    public announceDiagnosticAtCursor(): void {
        const editor = vscode.window.activeTextEditor;

        if (!editor) {
            return;
        }

        const position = editor.selection.active;
        const diagnostics = vscode.languages.getDiagnostics(editor.document.uri);

        const diagnosticsAtPosition = diagnostics.filter(d =>
            d.range.contains(position)
        );

        if (diagnosticsAtPosition.length === 0) {
            this.announce({
                message: 'No errors or warnings at current position',
                priority: 'polite',
                context: 'Diagnostics'
            });
            return;
        }

        const messages = diagnosticsAtPosition.map(d => {
            const severityText = this.getDiagnosticSeverityText(d.severity);
            return `${severityText}: ${d.message}`;
        });

        this.announce({
            message: messages.join('. '),
            priority: 'assertive',
            context: 'Diagnostics'
        });
    }

    /**
     * Get diagnostic severity as text
     */
    private getDiagnosticSeverityText(severity: vscode.DiagnosticSeverity | undefined): string {
        switch (severity) {
            case vscode.DiagnosticSeverity.Error:
                return 'Error';
            case vscode.DiagnosticSeverity.Warning:
                return 'Warning';
            case vscode.DiagnosticSeverity.Information:
                return 'Information';
            case vscode.DiagnosticSeverity.Hint:
                return 'Hint';
            default:
                return 'Issue';
        }
    }

    /**
     * Get or create output channel for announcements
     */
    private getOutputChannel(): vscode.OutputChannel {
        const channelName = 'Accessibility Announcements';
        let channel = this.context.workspaceState.get<vscode.OutputChannel>('outputChannel');

        if (!channel) {
            channel = vscode.window.createOutputChannel(channelName);
            this.context.subscriptions.push(channel);
        }

        return channel;
    }

    /**
     * Get announcement history
     */
    public getAnnouncementHistory(): ScreenReaderAnnouncement[] {
        return [...this.announcementHistory];
    }

    /**
     * Clear announcement history
     */
    public clearHistory(): void {
        this.announcementHistory = [];
        this.getOutputChannel().clear();
    }
}
