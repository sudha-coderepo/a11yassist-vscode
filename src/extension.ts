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

    const issuesTreeView = vscode.window.createTreeView('a11yassistIssues', {
        treeDataProvider: a11yassistIssuesProvider,
        showCollapseAll: true
    });
    vscode.window.registerTreeDataProvider('a11yassistGuide', a11yassistGuideProvider);
    vscode.window.registerTreeDataProvider('a11yassistStats', a11yassistStatsProvider);

    context.subscriptions.push(issuesTreeView);

    // Track expand/collapse events
    issuesTreeView.onDidExpandElement(event => {
        const element = event.element as any;
        console.log('Tree item expanded:', element?.label, element?.contextValue, element?.id);
        if (element && element.contextValue === 'severity' && element.id) {
            a11yassistIssuesProvider.setSeverityExpandedState(element.id, true);
        }
    });

    issuesTreeView.onDidCollapseElement(event => {
        const element = event.element as any;
        console.log('Tree item collapsed:', element?.label, element?.contextValue, element?.id);
        if (element && element.contextValue === 'severity' && element.id) {
            a11yassistIssuesProvider.setSeverityExpandedState(element.id, false);
        }
    });

    // Register Commands

    // Run Accessibility Audit
    const runAuditCommand = vscode.commands.registerCommand(
        'a11yassist.runAudit',
        async () => {
            console.log('[Audit] Starting audit command...');
            await analyticsManager.trackEvent('audit_run');
            console.log('[Audit] trackEvent completed, now running audit...');
            const results = await accessibilityAuditor.runAudit();
            a11yassistIssuesProvider.updateIssues(results);

            // Update analytics with issue counts
            const stats = analyticsManager.getUsageStatistics();
            const baselineIssuesCount = stats.totalIssuesFound; // Baseline (max ever found)
            const currentIssuesCount = results.length; // Current audit result
            const lastAuditCount = await analyticsManager.getLastAuditCount();

            console.log(`[Audit] Stats after trackEvent - Total Audits: ${stats.totalAuditsRun}`);

            console.log(`[Audit] Baseline: ${baselineIssuesCount}, Last Audit: ${lastAuditCount}, Current: ${currentIssuesCount}`);

            // First audit or reset - set the baseline
            if (baselineIssuesCount === 0) {
                await analyticsManager.setTotalIssuesFound(currentIssuesCount);
                await analyticsManager.setLastAuditCount(currentIssuesCount);
                console.log(`[Audit] First audit: baseline set to ${currentIssuesCount}`);
            }
            // Subsequent audits - calculate actual fixed based on difference from last audit
            else {
                const previousAuditCount = lastAuditCount || baselineIssuesCount;
                const actualFixed = previousAuditCount - currentIssuesCount; // No Math.max, allow negative

                if (actualFixed > 0) {
                    // Issues were fixed
                    await analyticsManager.incrementIssuesFixed(actualFixed);
                    console.log(`[Audit] Issues fixed: ${actualFixed} (last: ${previousAuditCount}, current: ${currentIssuesCount})`);
                } else if (actualFixed < 0) {
                    // Issues were unfixed (reverted) OR new issues added
                    const unFixed = Math.abs(actualFixed);
                    await analyticsManager.decrementIssuesFixed(unFixed);
                    console.log(`[Audit] Issues unfixed/reverted: ${unFixed} (last: ${previousAuditCount}, current: ${currentIssuesCount})`);

                    // If new issues were added (current > baseline), update baseline
                    if (currentIssuesCount > baselineIssuesCount) {
                        const newIssuesAdded = currentIssuesCount - baselineIssuesCount;
                        await analyticsManager.setTotalIssuesFound(currentIssuesCount);
                        console.log(`[Audit] New issues added: ${newIssuesAdded} (baseline updated from ${baselineIssuesCount} to ${currentIssuesCount})`);
                    }
                } else {
                    console.log(`[Audit] No change in issue count: ${currentIssuesCount}`);
                }

                // Update last audit count for next comparison
                await analyticsManager.setLastAuditCount(currentIssuesCount);
            }

            a11yassistStatsProvider.refresh();

            vscode.window.showInformationMessage(
                `Accessibility Audit Complete: Found ${results.length} issue(s)`
            );
        }
    );

    // Show Keyboard Shortcuts Guide
    const showKeyboardShortcutsCommand = vscode.commands.registerCommand(
        'a11yassist.showKeyboardShortcuts',
        async () => {
            await analyticsManager.trackEvent('keyboard_shortcuts_viewed');
            keyboardNavigationManager.showKeyboardGuide();
        }
    );

    // Toggle Screen Reader Mode
    const toggleScreenReaderCommand = vscode.commands.registerCommand(
        'a11yassist.toggleScreenReaderMode',
        async () => {
            await analyticsManager.trackEvent('screen_reader_toggled');
            screenReaderManager.toggleEnhancedMode();
        }
    );

    // Provide Feedback
    const provideFeedbackCommand = vscode.commands.registerCommand(
        'a11yassist.provideFeedback',
        async () => {
            await analyticsManager.trackEvent('feedback_initiated');
            await showFeedbackForm(context, analyticsManager);
        }
    );

    // Show Accessibility Panel
    const showAccessibilityPanelCommand = vscode.commands.registerCommand(
        'a11yassist.showAccessibilityPanel',
        async () => {
            await analyticsManager.trackEvent('panel_opened');
            vscode.commands.executeCommand('workbench.view.extension.a11yassist-panel');
        }
    );

    // Announce Current Context
    const announceCurrentContextCommand = vscode.commands.registerCommand(
        'a11yassist.announceCurrentContext',
        async () => {
            await analyticsManager.trackEvent('context_announced');
            screenReaderManager.announceCurrentContext();
        }
    );

    // Describe Current Element
    const describeElementCommand = vscode.commands.registerCommand(
        'a11yassist.describeElement',
        async () => {
            await analyticsManager.trackEvent('element_described');
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

    // Clear Statistics Data (for testing)
    const clearStatisticsCommand = vscode.commands.registerCommand(
        'a11yassist.clearStatistics',
        async () => {
            const confirm = await vscode.window.showWarningMessage(
                'Clear all accessibility audit statistics and analytics data?',
                { modal: true },
                'Clear'
            );

            if (confirm === 'Clear') {
                await analyticsManager.resetStatistics();
                a11yassistStatsProvider.refresh();
                vscode.window.showInformationMessage('Statistics cleared successfully!');
                console.log('[Extension] Statistics cleared by user');
            }
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
        showAnalyticsSummaryCommand,
        clearStatisticsCommand
    );

    // Listen to configuration changes
    vscode.workspace.onDidChangeConfiguration(e => {
        if (e.affectsConfiguration('a11yassist')) {
            screenReaderManager.updateConfiguration();
            keyboardNavigationManager.updateConfiguration();
            contextualGuidanceProvider.updateConfiguration();
        }
    });

    // Listen to editor changes for contextual guidance
    vscode.window.onDidChangeActiveTextEditor(editor => {
        if (editor) {
            console.log('[Extension] Editor changed, providing guidance...');
            contextualGuidanceProvider.provideGuidance(editor);
            a11yassistGuideProvider.updateGuidance(
                contextualGuidanceProvider.getCurrentGuidance()
            );
        }
    });

    // Listen to selection changes for contextual guidance and screen reader
    vscode.window.onDidChangeTextEditorSelection(event => {
        const editor = event.textEditor;
        console.log('[Extension] Selection changed, providing guidance...');
        contextualGuidanceProvider.provideGuidance(editor);
        a11yassistGuideProvider.updateGuidance(
            contextualGuidanceProvider.getCurrentGuidance()
        );
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
