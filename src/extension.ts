/**
 * Main Extension Entry Point
 *
 * @author Sudha Rajendran
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

    // Export Feedback
    const exportFeedbackCommand = vscode.commands.registerCommand(
        'a11yassist.exportFeedback',
        async () => {
            await analyticsManager.trackEvent('feedback_exported');
            await exportFeedbackToFile(analyticsManager);
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
        clearStatisticsCommand,
        exportFeedbackCommand
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

async function exportFeedbackToFile(analyticsManager: AnalyticsManager) {
    const feedbackItems = analyticsManager.getFeedback();
    const stats = analyticsManager.getUsageStatistics();

    if (feedbackItems.length === 0) {
        vscode.window.showInformationMessage(
            'No feedback collected yet. Submit feedback using "Provide Accessibility Feedback" command.'
        );
        return;
    }

    // Ask user to choose export format
    const format = await vscode.window.showQuickPick(
        [
            { label: 'JSON', description: 'Machine-readable format (recommended for research)' },
            { label: 'CSV', description: 'Spreadsheet-compatible format' },
            { label: 'HTML', description: 'Human-readable format for email' }
        ],
        {
            placeHolder: 'Choose export format',
            title: `Export ${feedbackItems.length} feedback item(s)`
        }
    );

    if (!format) {
        return;
    }

    let fileContent: string;
    let fileExtension: string;

    switch (format.label) {
        case 'JSON':
            fileContent = formatFeedbackAsJSON(feedbackItems, stats);
            fileExtension = 'json';
            break;
        case 'CSV':
            fileContent = formatFeedbackAsCSV(feedbackItems, stats);
            fileExtension = 'csv';
            break;
        case 'HTML':
            fileContent = formatFeedbackAsHTML(feedbackItems, stats);
            fileExtension = 'html';
            break;
        default:
            return;
    }

    // Generate filename with timestamp
    const timestamp = new Date().toISOString().split('T')[0];
    const defaultFileName = `a11yassist-feedback-${timestamp}.${fileExtension}`;

    const fileUri = await vscode.window.showSaveDialog({
        defaultUri: vscode.Uri.file(defaultFileName),
        filters: {
            [format.label]: [fileExtension],
            'All Files': ['*']
        },
        title: `Export feedback as ${format.label}`
    });

    if (fileUri) {
        try {
            await vscode.workspace.fs.writeFile(
                fileUri,
                new TextEncoder().encode(fileContent)
            );

            const message = `Feedback exported successfully! (${feedbackItems.length} items)\n\nFile: ${fileUri.fsPath}\n\nTo send via email:\n1. Open the exported file\n2. Send to: sudha.rajendran@ontariotechu.net`;

            vscode.window.showInformationMessage(message);
            console.log(`[Extension] Feedback exported to: ${fileUri.fsPath}`);
        } catch (error) {
            vscode.window.showErrorMessage(`Failed to export feedback: ${error}`);
            console.error('[Extension] Export failed:', error);
        }
    }
}

function formatFeedbackAsJSON(feedbackItems: any[], stats: any): string {
    const exportData = {
        exportDate: new Date().toISOString(),
        extensionVersion: vscode.extensions.getExtension('ontario-tech-university.a11yassist')?.packageJSON.version || 'unknown',
        totalFeedbackItems: feedbackItems.length,
        usageStatistics: stats,
        feedbackItems: feedbackItems
    };

    return JSON.stringify(exportData, null, 2);
}

function formatFeedbackAsCSV(feedbackItems: any[], stats: any): string {
    const headers = ['Feedback Type', 'Content', 'Timestamp', 'Platform', 'Extension Version'];
    const rows = feedbackItems.map(item => [
        `"${(item.type || '').replace(/"/g, '""')}"`,
        `"${(item.content || '').replace(/"/g, '""')}"`,
        `"${item.timestamp || ''}"`,
        `"${item.userAgent || ''}"`,
        `"${item.extensionVersion || ''}"`
    ]);

    const csvContent = [
        headers.join(','),
        '',
        '# Usage Statistics',
        `Total Audits Run,${stats.totalAuditsRun}`,
        `Total Issues Found,${stats.totalIssuesFound}`,
        `Total Issues Fixed,${stats.totalIssuesFixed}`,
        `Export Date,${new Date().toISOString()}`,
        '',
        '# Feedback Data',
        ...rows.map(row => row.join(','))
    ].join('\n');

    return csvContent;
}

function formatFeedbackAsHTML(feedbackItems: any[], stats: any): string {
    const feedbackRows = feedbackItems.map(item => `
        <tr>
            <td>${escapeHtml(item.type || '')}</td>
            <td>${escapeHtml(item.content || '')}</td>
            <td>${item.timestamp || ''}</td>
            <td>${escapeHtml(item.userAgent || '')}</td>
            <td>${escapeHtml(item.extensionVersion || '')}</td>
        </tr>
    `).join('');

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>A11YAssist Feedback Report</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f5f5f5;
            padding: 20px;
        }
        .container {
            max-width: 1000px;
            margin: 0 auto;
            background-color: white;
            padding: 40px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        h1 {
            color: #0078d4;
            border-bottom: 3px solid #0078d4;
            padding-bottom: 10px;
            margin-bottom: 30px;
        }
        h2 {
            color: #0078d4;
            margin-top: 30px;
            margin-bottom: 15px;
            font-size: 1.3em;
        }
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin: 20px 0;
        }
        .stat-card {
            background: linear-gradient(135deg, #0078d4 0%, #005a9e 100%);
            color: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .stat-card .label {
            font-size: 0.9em;
            opacity: 0.9;
            margin-bottom: 5px;
        }
        .stat-card .value {
            font-size: 2em;
            font-weight: bold;
        }
        .info-box {
            background-color: #f0f8ff;
            border-left: 4px solid #0078d4;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
        }
        .info-box strong {
            color: #0078d4;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        thead {
            background-color: #f0f0f0;
        }
        th {
            padding: 15px;
            text-align: left;
            font-weight: 600;
            border-bottom: 2px solid #ddd;
            background-color: #f0f0f0;
        }
        td {
            padding: 12px 15px;
            border-bottom: 1px solid #eee;
        }
        tbody tr:hover {
            background-color: #f9f9f9;
        }
        .feedback-type-badge {
            display: inline-block;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 0.85em;
            font-weight: 500;
        }
        .bug {
            background-color: #fee;
            color: #d00;
        }
        .feature {
            background-color: #efe;
            color: #0a0;
        }
        .general {
            background-color: #eef;
            color: #00a;
        }
        footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #eee;
            text-align: center;
            color: #666;
            font-size: 0.9em;
        }
        .email-instruction {
            background-color: #fff3cd;
            border: 1px solid #ffc107;
            padding: 15px;
            border-radius: 4px;
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🎯 A11YAssist Feedback Report</h1>

        <div class="info-box">
            <strong>Export Date:</strong> ${new Date().toLocaleString()}<br>
            <strong>Total Feedback Items:</strong> ${feedbackItems.length}
        </div>

        <h2>📊 Usage Statistics</h2>
        <div class="stats-grid">
            <div class="stat-card">
                <div class="label">Total Audits Run</div>
                <div class="value">${stats.totalAuditsRun}</div>
            </div>
            <div class="stat-card">
                <div class="label">Total Issues Found</div>
                <div class="value">${stats.totalIssuesFound}</div>
            </div>
            <div class="stat-card">
                <div class="label">Total Issues Fixed</div>
                <div class="value">${stats.totalIssuesFixed}</div>
            </div>
        </div>

        <div class="email-instruction">
            <strong>📧 To send this feedback via email:</strong><br>
            Send this file to: <strong>sudha.rajendran@ontariotechu.net</strong><br>
            Subject: <em>A11YAssist Feedback Report - ${new Date().toLocaleDateString()}</em>
        </div>

        <h2>💬 Feedback Items (${feedbackItems.length})</h2>
        ${feedbackItems.length > 0 ? `
            <table>
                <thead>
                    <tr>
                        <th>Type</th>
                        <th>Content</th>
                        <th>Timestamp</th>
                        <th>Platform</th>
                        <th>Extension Version</th>
                    </tr>
                </thead>
                <tbody>
                    ${feedbackRows}
                </tbody>
            </table>
        ` : '<p>No feedback items to display.</p>'}

        <footer>
            <p>Generated by <strong>A11YAssist</strong> - Accessibility Assistant for VS Code</p>
            <p>Version: ${vscode.extensions.getExtension('ontario-tech-university.a11yassist')?.packageJSON.version || 'unknown'}</p>
        </footer>
    </div>
</body>
</html>
    `;

    return html;
}

function escapeHtml(text: string): string {
    const map: Record<string, string> = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

async function showFeedbackForm(_context: vscode.ExtensionContext, analyticsManager: AnalyticsManager) {
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
