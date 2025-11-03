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

import * as vscode from 'vscode';
import { ScreenReaderManager } from './features/screenReaderManager';
import { KeyboardNavigationManager } from './features/keyboardNavigationManager';
import { AccessibilityAuditor } from './features/accessibilityAuditor';
import { ContextualGuidanceProvider } from './features/contextualGuidanceProvider';
import { AnalyticsManager } from './features/analyticsManager';
import { AccessibilityIssuesProvider } from './providers/accessibilityIssuesProvider';
import { AccessibilityGuideProvider } from './providers/accessibilityGuideProvider';
import { AccessibilityStatsProvider } from './providers/accessibilityStatsProvider';

let screenReaderManager: ScreenReaderManager;
let keyboardNavigationManager: KeyboardNavigationManager;
let accessibilityAuditor: AccessibilityAuditor;
let contextualGuidanceProvider: ContextualGuidanceProvider;
let analyticsManager: AnalyticsManager;

export function activate(context: vscode.ExtensionContext) {
    console.log('A11YAssist extension is now active!');

    // Initialize managers
    screenReaderManager = new ScreenReaderManager(context);
    keyboardNavigationManager = new KeyboardNavigationManager(context);
    accessibilityAuditor = new AccessibilityAuditor(context);
    contextualGuidanceProvider = new ContextualGuidanceProvider(context);
    analyticsManager = new AnalyticsManager(context);

    // Register Tree View Providers
    const a11yassistIssuesProvider = new AccessibilityIssuesProvider();
    const a11yassistGuideProvider = new AccessibilityGuideProvider();
    const a11yassistStatsProvider = new AccessibilityStatsProvider(analyticsManager);

    vscode.window.registerTreeDataProvider('a11yassistIssues', a11yassistIssuesProvider);
    vscode.window.registerTreeDataProvider('a11yassistGuide', a11yassistGuideProvider);
    vscode.window.registerTreeDataProvider('a11yassistStats', a11yassistStatsProvider);

    // Register Commands

    // Run Accessibility Audit
    const runAuditCommand = vscode.commands.registerCommand(
        'a11yassist.runAudit',
        async () => {
            analyticsManager.trackEvent('audit_run');
            const results = await accessibilityAuditor.runAudit();
            a11yassistIssuesProvider.updateIssues(results);

            vscode.window.showInformationMessage(
                `Accessibility Audit Complete: Found ${results.length} issue(s)`
            );
        }
    );

    // Show Keyboard Shortcuts Guide
    const showKeyboardShortcutsCommand = vscode.commands.registerCommand(
        'a11yassist.showKeyboardShortcuts',
        () => {
            analyticsManager.trackEvent('keyboard_shortcuts_viewed');
            keyboardNavigationManager.showKeyboardGuide();
        }
    );

    // Toggle Screen Reader Mode
    const toggleScreenReaderCommand = vscode.commands.registerCommand(
        'a11yassist.toggleScreenReaderMode',
        () => {
            analyticsManager.trackEvent('screen_reader_toggled');
            screenReaderManager.toggleEnhancedMode();
        }
    );

    // Provide Feedback
    const provideFeedbackCommand = vscode.commands.registerCommand(
        'a11yassist.provideFeedback',
        async () => {
            analyticsManager.trackEvent('feedback_initiated');
            await showFeedbackForm(context, analyticsManager);
        }
    );

    // Show Accessibility Panel
    const showAccessibilityPanelCommand = vscode.commands.registerCommand(
        'a11yassist.showAccessibilityPanel',
        () => {
            analyticsManager.trackEvent('panel_opened');
            vscode.commands.executeCommand('workbench.view.extension.a11yassist-panel');
        }
    );

    // Announce Current Context
    const announceCurrentContextCommand = vscode.commands.registerCommand(
        'a11yassist.announceCurrentContext',
        () => {
            analyticsManager.trackEvent('context_announced');
            screenReaderManager.announceCurrentContext();
        }
    );

    // Describe Current Element
    const describeElementCommand = vscode.commands.registerCommand(
        'a11yassist.describeElement',
        () => {
            analyticsManager.trackEvent('element_described');
            screenReaderManager.describeCurrentElement();
        }
    );

    // Navigate to Issue
    const navigateToIssueCommand = vscode.commands.registerCommand(
        'a11yassist.navigateToIssue',
        (issue: any) => {
            const editor = vscode.window.activeTextEditor;
            if (editor) {
                const position = new vscode.Position(issue.line, issue.column);
                editor.selection = new vscode.Selection(position, position);
                editor.revealRange(
                    new vscode.Range(position, position),
                    vscode.TextEditorRevealType.InCenter
                );
            }
        }
    );

    // Show Analytics Summary
    const showAnalyticsSummaryCommand = vscode.commands.registerCommand(
        'a11yassist.showAnalyticsSummary',
        () => {
            analyticsManager.showAnalyticsSummary();
        }
    );

    // Add all commands to subscriptions
    context.subscriptions.push(
        runAuditCommand,
        showKeyboardShortcutsCommand,
        toggleScreenReaderCommand,
        provideFeedbackCommand,
        showAccessibilityPanelCommand,
        announceCurrentContextCommand,
        describeElementCommand,
        navigateToIssueCommand,
        showAnalyticsSummaryCommand
    );

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
            a11yassistGuideProvider.updateGuidance(
                contextualGuidanceProvider.getCurrentGuidance()
            );
        }
    });

    // Listen to selection changes
    vscode.window.onDidChangeTextEditorSelection(event => {
        screenReaderManager.handleSelectionChange(event);
    });

    // Show welcome message
    showWelcomeMessage(context);
}

async function showFeedbackForm(context: vscode.ExtensionContext, analyticsManager: AnalyticsManager) {
    const feedbackType = await vscode.window.showQuickPick(
        [
            { label: 'Bug Report', description: 'Report an accessibility issue' },
            { label: 'Feature Request', description: 'Suggest a new accessibility feature' },
            { label: 'General Feedback', description: 'Share your experience' }
        ],
        {
            placeHolder: 'Select feedback type'
        }
    );

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

        vscode.window.showInformationMessage(
            'Thank you for your feedback! It helps us improve accessibility.'
        );
    }
}

function showWelcomeMessage(context: vscode.ExtensionContext) {
    const hasShownWelcome = context.globalState.get('hasShownWelcome', false);

    if (!hasShownWelcome) {
        vscode.window.showInformationMessage(
            'Welcome to A11YAssist! Press Ctrl+Shift+K to view keyboard shortcuts.',
            'Show Guide',
            'Don\'t show again'
        ).then(selection => {
            if (selection === 'Show Guide') {
                vscode.commands.executeCommand('a11yassist.showKeyboardShortcuts');
            } else if (selection === 'Don\'t show again') {
                context.globalState.update('hasShownWelcome', true);
            }
        });
    }
}

export function deactivate() {
    console.log('A11YAssist extension is now deactivated');
}
