"use strict";
/**
 * Screen Reader Manager
 *
 * @author Sudha Rajendran and Rohitha Janga
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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScreenReaderManager = void 0;
const vscode = __importStar(require("vscode"));
const types_1 = require("../types");
/**
 * ScreenReaderManager class
 * Provides enhanced screen reader support for VSCode
 */
class ScreenReaderManager {
    /**
     * Constructor
     * @param context - VSCode extension context
     */
    constructor(context) {
        this.isEnhancedModeEnabled = true;
        this.announcementHistory = [];
        this.context = context;
        this.config = this.loadConfiguration();
        // Create status bar item
        this.statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
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
    loadConfiguration() {
        const config = vscode.workspace.getConfiguration('a11yassist');
        return {
            enableScreenReaderEnhancements: config.get('enableScreenReaderEnhancements', true),
            enableContextualGuidance: config.get('enableContextualGuidance', true),
            enableAnalytics: config.get('enableAnalytics', false),
            highContrastMode: config.get('highContrastMode', false),
            verbosityLevel: config.get('verbosityLevel', types_1.VerbosityLevel.NORMAL),
            enableKeyboardNavigation: config.get('enableKeyboardNavigation', true),
            announceEditorChanges: config.get('announceEditorChanges', true),
            cognitiveLoadReduction: config.get('cognitiveLoadReduction', false)
        };
    }
    /**
     * Update configuration when settings change
     */
    updateConfiguration() {
        this.config = this.loadConfiguration();
        if (this.config.enableScreenReaderEnhancements) {
            this.statusBarItem.show();
        }
        else {
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
    toggleEnhancedMode() {
        this.isEnhancedModeEnabled = !this.isEnhancedModeEnabled;
        if (this.isEnhancedModeEnabled) {
            this.statusBarItem.text = "$(accessibility) SR Enhanced";
            this.statusBarItem.tooltip = "Screen Reader Enhanced Mode Active - Click to disable";
            this.announce({
                message: 'Screen reader enhanced mode enabled',
                priority: 'assertive',
                context: 'Mode Toggle'
            });
        }
        else {
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
    announce(announcement) {
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
        }
        else {
            // Use output channel for polite announcements
            this.getOutputChannel().appendLine(`[${new Date().toLocaleTimeString()}] ${message}`);
        }
    }
    /**
     * Apply verbosity level to message
     */
    applyVerbosityLevel(message) {
        switch (this.config.verbosityLevel) {
            case types_1.VerbosityLevel.MINIMAL:
                // Return only the essential part (first sentence)
                return message.split('.')[0] + '.';
            case types_1.VerbosityLevel.VERBOSE:
                // Add context information
                return `[Accessibility] ${message}`;
            case types_1.VerbosityLevel.NORMAL:
            default:
                return message;
        }
    }
    /**
     * Announce current editor context
     */
    announceCurrentContext() {
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
    buildContextMessage(context) {
        const parts = [];
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
            case types_1.VerbosityLevel.MINIMAL:
                return `Line ${context.currentLine}, Column ${context.currentColumn}`;
            case types_1.VerbosityLevel.VERBOSE:
                return parts.join(', ');
            case types_1.VerbosityLevel.NORMAL:
            default:
                return `${context.fileName || 'Document'}: Line ${context.currentLine}, Column ${context.currentColumn}`;
        }
    }
    /**
     * Describe the current element under cursor
     */
    describeCurrentElement() {
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
        if (this.config.verbosityLevel === types_1.VerbosityLevel.VERBOSE) {
            description += `Line content: ${lineText.trim()}`;
        }
        else if (lineText.trim().length === 0) {
            description += 'Empty line';
        }
        else {
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
    handleSelectionChange(event) {
        if (!this.config.announceEditorChanges || !this.isEnhancedModeEnabled) {
            return;
        }
        // Only announce significant selection changes
        const selection = event.selections[0];
        if (!selection.isEmpty) {
            const selectedText = event.textEditor.document.getText(selection);
            const lineCount = selectedText.split('\n').length;
            let message;
            if (lineCount > 1) {
                message = `Selected ${lineCount} lines`;
            }
            else {
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
    announceDocumentChange(change) {
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
    announceDiagnosticAtCursor() {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }
        const position = editor.selection.active;
        const diagnostics = vscode.languages.getDiagnostics(editor.document.uri);
        const diagnosticsAtPosition = diagnostics.filter(d => d.range.contains(position));
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
    getDiagnosticSeverityText(severity) {
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
    getOutputChannel() {
        const channelName = 'Accessibility Announcements';
        let channel = this.context.workspaceState.get('outputChannel');
        if (!channel) {
            channel = vscode.window.createOutputChannel(channelName);
            this.context.subscriptions.push(channel);
        }
        return channel;
    }
    /**
     * Get announcement history
     */
    getAnnouncementHistory() {
        return [...this.announcementHistory];
    }
    /**
     * Clear announcement history
     */
    clearHistory() {
        this.announcementHistory = [];
        this.getOutputChannel().clear();
    }
}
exports.ScreenReaderManager = ScreenReaderManager;
//# sourceMappingURL=screenReaderManager.js.map