/**
 * Analytics Manager
 *
 * @author Sudha Rajendran and Rohitha Janga
 * @institution Ontario Tech University
 * @description Manages usage analytics and feedback collection for empirical research
 *
 * Features:
 * - Anonymous usage tracking
 * - Feature usage statistics
 * - User feedback collection
 * - Performance metrics
 * - Privacy-focused analytics
 */

import * as vscode from 'vscode';
import { AnalyticsEvent, UserFeedback, UsageStatistics } from '../types';

/**
 * AnalyticsManager class
 * Handles analytics and feedback collection with user privacy in mind
 */
export class AnalyticsManager {
    private context: vscode.ExtensionContext;
    private isAnalyticsEnabled: boolean;
    private events: AnalyticsEvent[] = [];
    private feedbackItems: UserFeedback[] = [];

    /**
     * Constructor
     * @param context - VSCode extension context
     */
    constructor(context: vscode.ExtensionContext) {
        this.context = context;
        this.isAnalyticsEnabled = this.checkAnalyticsEnabled();

        // Load existing data
        this.loadAnalyticsData();
    }

    /**
     * Check if analytics are enabled in settings
     */
    private checkAnalyticsEnabled(): boolean {
        const config = vscode.workspace.getConfiguration('a11yassist');
        // Enable analytics by default to track usage statistics
        return config.get('enableAnalytics', true);
    }

    /**
     * Load analytics data from storage
     */
    private loadAnalyticsData(): void {
        this.events = this.context.globalState.get<AnalyticsEvent[]>('analyticsEvents', []);
        this.feedbackItems = this.context.globalState.get<UserFeedback[]>('feedbackItems', []);

        // Log current statistics for debugging
        const totalIssuesFound = this.context.globalState.get<number>('totalIssuesFound', 0);
        const totalIssuesFixed = this.context.globalState.get<number>('totalIssuesFixed', 0);
        const auditRunCount = this.events.filter(e => e.eventName === 'audit_run').length;
        console.log(`[Analytics] Constructor - Loaded data from storage:
        - Total Events: ${this.events.length}
        - Audit Runs: ${auditRunCount}
        - Issues Found: ${totalIssuesFound}
        - Issues Fixed: ${totalIssuesFixed}
        - Analytics Enabled: ${this.isAnalyticsEnabled}`);
        if (this.events.length > 0) {
            console.log(`[Analytics] First event: ${JSON.stringify(this.events[0])}`);
            console.log(`[Analytics] Last event: ${JSON.stringify(this.events[this.events.length - 1])}`);
        }
    }

    /**
     * Save analytics data to storage
     */
    private async saveAnalyticsData(): Promise<void> {
        await this.context.globalState.update('analyticsEvents', this.events);
        await this.context.globalState.update('feedbackItems', this.feedbackItems);
    }

    /**
     * Track an event
     * @param eventName - Name of the event
     * @param properties - Optional event properties
     */
    public async trackEvent(eventName: string, properties?: Record<string, any>): Promise<void> {
        console.log(`[Analytics] trackEvent called with: ${eventName}`);

        if (!this.isAnalyticsEnabled) {
            console.log(`[Analytics] Analytics disabled, skipping event`);
            return;
        }

        const event: AnalyticsEvent = {
            eventName,
            timestamp: new Date().toISOString(),
            properties
        };

        this.events.push(event);
        console.log(`[Analytics] Event added to in-memory array. Total events: ${this.events.length}`);

        // Keep only last 1000 events
        if (this.events.length > 1000) {
            this.events = this.events.slice(-1000);
        }

        // Save and wait for completion
        await this.saveAnalyticsData();
        console.log(`[Analytics] Event tracked and saved: ${eventName}. Total audits so far: ${this.events.filter(e => e.eventName === 'audit_run').length}`);
    }

    /**
     * Submit user feedback
     * @param feedback - User feedback object
     */
    public async submitFeedback(feedback: UserFeedback): Promise<void> {
        const extension = vscode.extensions.getExtension('ontario-tech-university.a11yassist');
        const extensionVersion = extension?.packageJSON.version || 'unknown';

        const enhancedFeedback: UserFeedback = {
            ...feedback,
            userAgent: process.platform,
            extensionVersion
        };

        this.feedbackItems.push(enhancedFeedback);

        // Save feedback
        await this.saveAnalyticsData();

        // Track feedback submission
        this.trackEvent('feedback_submitted', {
            type: feedback.type
        });
    }

    /**
     * Get usage statistics
     */
    public getUsageStatistics(): UsageStatistics {
        console.log(`[Analytics] getUsageStatistics called. Total events in memory: ${this.events.length}`);

        // Count feature usage
        const featuresUsed: Record<string, number> = {};

        for (const event of this.events) {
            if (!featuresUsed[event.eventName]) {
                featuresUsed[event.eventName] = 0;
            }
            featuresUsed[event.eventName]++;
        }

        // Get audit statistics
        const totalAuditsRun = featuresUsed['audit_run'] || 0;
        const totalIssuesFound = this.context.globalState.get<number>('totalIssuesFound', 0);
        const totalIssuesFixed = this.context.globalState.get<number>('totalIssuesFixed', 0);

        // Get last used date
        const lastEvent = this.events[this.events.length - 1];
        const lastUsed = lastEvent ? lastEvent.timestamp : new Date().toISOString();

        console.log(`[Analytics] Stats - Audits: ${totalAuditsRun}, Issues Found: ${totalIssuesFound}, Issues Fixed: ${totalIssuesFixed}`);
        console.log(`[Analytics] Feature usage: ${JSON.stringify(featuresUsed)}`);

        return {
            totalAuditsRun,
            totalIssuesFound,
            totalIssuesFixed,
            featuresUsed,
            lastUsed
        };
    }

    /**
     * Set total issues found (for tracking baseline)
     */
    public async setTotalIssuesFound(count: number): Promise<void> {
        await this.context.globalState.update('totalIssuesFound', count);
        console.log(`Total issues found set to: ${count}`);
    }

    /**
     * Increment issues found counter
     */
    public async incrementIssuesFound(count: number): Promise<void> {
        const current = this.context.globalState.get<number>('totalIssuesFound', 0);
        await this.context.globalState.update('totalIssuesFound', current + count);
        console.log(`Issues found incremented by ${count}, total: ${current + count}`);
    }

    /**
     * Increment issues fixed counter
     * @param count - Number of issues fixed (default 1)
     */
    public async incrementIssuesFixed(count: number = 1): Promise<void> {
        const current = this.context.globalState.get<number>('totalIssuesFixed', 0);
        await this.context.globalState.update('totalIssuesFixed', current + count);
        await this.trackEvent('issue_fixed', { count });
        console.log(`Issues fixed incremented by ${count}, total: ${current + count}`);
    }

    /**
     * Decrement issues fixed counter (when fixes are reverted)
     * @param count - Number of issues to decrement
     */
    public async decrementIssuesFixed(count: number = 1): Promise<void> {
        const current = this.context.globalState.get<number>('totalIssuesFixed', 0);
        const newCount = Math.max(0, current - count); // Don't go below 0
        await this.context.globalState.update('totalIssuesFixed', newCount);
        console.log(`Issues fixed decremented by ${count}, total: ${newCount}`);
    }

    /**
     * Get last audit issue count
     */
    public async getLastAuditCount(): Promise<number> {
        return this.context.globalState.get<number>('lastAuditCount', 0);
    }

    /**
     * Set last audit issue count
     */
    public async setLastAuditCount(count: number): Promise<void> {
        await this.context.globalState.update('lastAuditCount', count);
        console.log(`Last audit count set to: ${count}`);
    }

    /**
     * Reset statistics (for debugging or user request)
     */
    public async resetStatistics(): Promise<void> {
        await this.context.globalState.update('totalIssuesFound', 0);
        await this.context.globalState.update('totalIssuesFixed', 0);
        this.events = [];
        await this.saveAnalyticsData();
        console.log('[Analytics] Statistics reset');
    }

    /**
     * Get all events
     */
    public getEvents(): AnalyticsEvent[] {
        return [...this.events];
    }

    /**
     * Get all feedback
     */
    public getFeedback(): UserFeedback[] {
        return [...this.feedbackItems];
    }

    /**
     * Clear analytics data
     */
    public async clearAnalytics(): Promise<void> {
        this.events = [];
        this.feedbackItems = [];
        await this.saveAnalyticsData();
        await this.context.globalState.update('totalIssuesFound', 0);
        await this.context.globalState.update('totalIssuesFixed', 0);

        vscode.window.showInformationMessage('Analytics data cleared');
    }

    /**
     * Export analytics data
     */
    public exportAnalyticsData(): string {
        const stats = this.getUsageStatistics();

        const data = {
            statistics: stats,
            events: this.events,
            feedback: this.feedbackItems,
            exportDate: new Date().toISOString()
        };

        return JSON.stringify(data, null, 2);
    }

    /**
     * Show analytics summary
     */
    public showAnalyticsSummary(): void {
        const stats = this.getUsageStatistics();

        const panel = vscode.window.createWebviewPanel(
            'analyticsSummary',
            'Usage Analytics Summary',
            vscode.ViewColumn.One,
            {
                enableScripts: true
            }
        );

        panel.webview.html = this.generateAnalyticsHTML(stats);
    }

    /**
     * Generate HTML for analytics summary
     */
    private generateAnalyticsHTML(stats: UsageStatistics): string {
        const featuresHTML = Object.entries(stats.featuresUsed)
            .sort((a, b) => b[1] - a[1])
            .map(([feature, count]) => `
                <tr>
                    <td>${this.formatEventName(feature)}</td>
                    <td>${count}</td>
                </tr>
            `).join('');

        return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Usage Analytics</title>
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
        }
        .stat-card {
            background-color: var(--vscode-editor-lineHighlightBackground);
            border: 1px solid var(--vscode-panel-border);
            border-radius: 8px;
            padding: 20px;
            margin: 15px 0;
        }
        .stat-value {
            font-size: 2em;
            font-weight: bold;
            color: var(--vscode-textLink-foreground);
        }
        .stat-label {
            color: var(--vscode-descriptionForeground);
            font-size: 0.9em;
            margin-top: 5px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }
        th, td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid var(--vscode-panel-border);
        }
        th {
            background-color: var(--vscode-editor-lineHighlightBackground);
            font-weight: bold;
        }
        tr:hover {
            background-color: var(--vscode-list-hoverBackground);
        }
        .privacy-notice {
            background-color: var(--vscode-inputValidation-infoBackground);
            border: 1px solid var(--vscode-inputValidation-infoBorder);
            padding: 15px;
            border-radius: 4px;
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <h1>Usage Analytics Summary</h1>

    <div class="privacy-notice">
        <strong>Privacy Notice:</strong> All analytics data is stored locally on your machine.
        No data is sent to external servers. This data helps improve the extension based on usage patterns.
    </div>

    <div class="stat-card">
        <div class="stat-value">${stats.totalAuditsRun}</div>
        <div class="stat-label">Total Accessibility Audits Run</div>
    </div>

    <div class="stat-card">
        <div class="stat-value">${stats.totalIssuesFound}</div>
        <div class="stat-label">Total Accessibility Issues Found</div>
    </div>

    <div class="stat-card">
        <div class="stat-value">${stats.totalIssuesFixed}</div>
        <div class="stat-label">Total Issues Fixed</div>
    </div>

    <h2>Feature Usage</h2>
    <table>
        <thead>
            <tr>
                <th>Feature</th>
                <th>Usage Count</th>
            </tr>
        </thead>
        <tbody>
            ${featuresHTML}
        </tbody>
    </table>

    <div class="stat-card">
        <div class="stat-label">Last Used</div>
        <div>${new Date(stats.lastUsed).toLocaleString()}</div>
    </div>
</body>
</html>
`;
    }

    /**
     * Format event name for display
     */
    private formatEventName(eventName: string): string {
        return eventName
            .split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }
}
