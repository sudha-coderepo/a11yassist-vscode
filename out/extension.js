"use strict";
/**
 * Main Extension Entry Point
 *
 * @author Sudha Rajendran and Rohitha Janga
 * @institution Ontario Tech University
 * @description VSCode A11YAssist extension
 *
 * This extension provides comprehensive accessibility features including:
 * - Screen reader enhancements for visually impaired users
 * - Keyboard navigation support for motor-limited users
 * - Contextual accessibility guidance
 * - Automated accessibility auditing
 * - Usage analytics and feedback collection
 *
 * This file initializes all accessibility features
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
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
const screenReaderManager_1 = require("./features/screenReaderManager");
const keyboardNavigationManager_1 = require("./features/keyboardNavigationManager");
const accessibilityAuditor_1 = require("./features/accessibilityAuditor");
const contextualGuidanceProvider_1 = require("./features/contextualGuidanceProvider");
const analyticsManager_1 = require("./features/analyticsManager");
const accessibilityIssuesProvider_1 = require("./providers/accessibilityIssuesProvider");
const accessibilityGuideProvider_1 = require("./providers/accessibilityGuideProvider");
const accessibilityStatsProvider_1 = require("./providers/accessibilityStatsProvider");
let screenReaderManager;
let keyboardNavigationManager;
let accessibilityAuditor;
let contextualGuidanceProvider;
let analyticsManager;
function activate(context) {
    console.log('A11YAssist extension is now active!');
    // Initialize managers
    screenReaderManager = new screenReaderManager_1.ScreenReaderManager(context);
    keyboardNavigationManager = new keyboardNavigationManager_1.KeyboardNavigationManager(context);
    accessibilityAuditor = new accessibilityAuditor_1.AccessibilityAuditor(context);
    contextualGuidanceProvider = new contextualGuidanceProvider_1.ContextualGuidanceProvider(context);
    analyticsManager = new analyticsManager_1.AnalyticsManager(context);
    // Register Tree View Providers
    const a11yassistIssuesProvider = new accessibilityIssuesProvider_1.AccessibilityIssuesProvider();
    const a11yassistGuideProvider = new accessibilityGuideProvider_1.AccessibilityGuideProvider();
    const a11yassistStatsProvider = new accessibilityStatsProvider_1.AccessibilityStatsProvider(analyticsManager);
    vscode.window.registerTreeDataProvider('a11yassistIssues', a11yassistIssuesProvider);
    vscode.window.registerTreeDataProvider('a11yassistGuide', a11yassistGuideProvider);
    vscode.window.registerTreeDataProvider('a11yassistStats', a11yassistStatsProvider);
    // Register Commands
    // Run Accessibility Audit
    const runAuditCommand = vscode.commands.registerCommand('a11yassist.runAudit', async () => {
        analyticsManager.trackEvent('audit_run');
        const results = await accessibilityAuditor.runAudit();
        a11yassistIssuesProvider.updateIssues(results);
        vscode.window.showInformationMessage(`Accessibility Audit Complete: Found ${results.length} issue(s)`);
    });
    // Show Keyboard Shortcuts Guide
    const showKeyboardShortcutsCommand = vscode.commands.registerCommand('a11yassist.showKeyboardShortcuts', () => {
        analyticsManager.trackEvent('keyboard_shortcuts_viewed');
        keyboardNavigationManager.showKeyboardGuide();
    });
    // Toggle Screen Reader Mode
    const toggleScreenReaderCommand = vscode.commands.registerCommand('a11yassist.toggleScreenReaderMode', () => {
        analyticsManager.trackEvent('screen_reader_toggled');
        screenReaderManager.toggleEnhancedMode();
    });
    // Provide Feedback
    const provideFeedbackCommand = vscode.commands.registerCommand('a11yassist.provideFeedback', async () => {
        analyticsManager.trackEvent('feedback_initiated');
        await showFeedbackForm(context, analyticsManager);
    });
    // Show Accessibility Panel
    const showAccessibilityPanelCommand = vscode.commands.registerCommand('a11yassist.showAccessibilityPanel', () => {
        analyticsManager.trackEvent('panel_opened');
        vscode.commands.executeCommand('workbench.view.extension.a11yassist-panel');
    });
    // Announce Current Context
    const announceCurrentContextCommand = vscode.commands.registerCommand('a11yassist.announceCurrentContext', () => {
        analyticsManager.trackEvent('context_announced');
        screenReaderManager.announceCurrentContext();
    });
    // Describe Current Element
    const describeElementCommand = vscode.commands.registerCommand('a11yassist.describeElement', () => {
        analyticsManager.trackEvent('element_described');
        screenReaderManager.describeCurrentElement();
    });
    // Navigate to Issue
    const navigateToIssueCommand = vscode.commands.registerCommand('a11yassist.navigateToIssue', (issue) => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            const position = new vscode.Position(issue.line, issue.column);
            editor.selection = new vscode.Selection(position, position);
            editor.revealRange(new vscode.Range(position, position), vscode.TextEditorRevealType.InCenter);
        }
    });
    // Show Analytics Summary
    const showAnalyticsSummaryCommand = vscode.commands.registerCommand('a11yassist.showAnalyticsSummary', () => {
        analyticsManager.showAnalyticsSummary();
    });
    // Add all commands to subscriptions
    context.subscriptions.push(runAuditCommand, showKeyboardShortcutsCommand, toggleScreenReaderCommand, provideFeedbackCommand, showAccessibilityPanelCommand, announceCurrentContextCommand, describeElementCommand, navigateToIssueCommand, showAnalyticsSummaryCommand);
    // Listen to configuration changes
    vscode.workspace.onDidChangeConfiguration(e => {
        if (e.affectsConfiguration('accessibilityEnhancer')) {
            screenReaderManager.updateConfiguration();
            keyboardNavigationManager.updateConfiguration();
            contextualGuidanceProvider.updateConfiguration();
        }
    });
    // Listen to editor changes for contextual guidance
    vscode.window.onDidChangeActiveTextEditor(editor => {
        if (editor) {
            contextualGuidanceProvider.provideGuidance(editor);
            a11yassistGuideProvider.updateGuidance(contextualGuidanceProvider.getCurrentGuidance());
        }
    });
    // Listen to selection changes
    vscode.window.onDidChangeTextEditorSelection(event => {
        screenReaderManager.handleSelectionChange(event);
    });
    // Show welcome message
    showWelcomeMessage(context);
}
async function showFeedbackForm(context, analyticsManager) {
    const feedbackType = await vscode.window.showQuickPick([
        { label: 'Bug Report', description: 'Report an accessibility issue' },
        { label: 'Feature Request', description: 'Suggest a new accessibility feature' },
        { label: 'General Feedback', description: 'Share your experience' }
    ], {
        placeHolder: 'Select feedback type'
    });
    if (!feedbackType) {
        return;
    }
    const feedback = await vscode.window.showInputBox({
        prompt: 'Please describe your feedback',
        placeHolder: 'Your feedback helps us improve accessibility...',
        validateInput: (text) => {
            return text.length < 10 ? 'Please provide more detailed feedback' : null;
        }
    });
    if (feedback) {
        analyticsManager.submitFeedback({
            type: feedbackType.label,
            content: feedback,
            timestamp: new Date().toISOString()
        });
        vscode.window.showInformationMessage('Thank you for your feedback! It helps us improve accessibility.');
    }
}
function showWelcomeMessage(context) {
    const hasShownWelcome = context.globalState.get('hasShownWelcome', false);
    if (!hasShownWelcome) {
        vscode.window.showInformationMessage('Welcome to A11YAssist! Press Ctrl+Shift+K to view keyboard shortcuts.', 'Show Guide', 'Don\'t show again').then(selection => {
            if (selection === 'Show Guide') {
                vscode.commands.executeCommand('a11yassist.showKeyboardShortcuts');
            }
            else if (selection === 'Don\'t show again') {
                context.globalState.update('hasShownWelcome', true);
            }
        });
    }
}
function deactivate() {
    console.log('A11YAssist extension is now deactivated');
}
//# sourceMappingURL=extension.js.map