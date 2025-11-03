"use strict";
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
exports.AnalyticsManager = void 0;
const vscode = __importStar(require("vscode"));
/**
 * AnalyticsManager class
 * Handles analytics and feedback collection with user privacy in mind
 */
class AnalyticsManager {
    /**
     * Constructor
     * @param context - VSCode extension context
     */
    constructor(context) {
        this.events = [];
        this.feedbackItems = [];
        this.context = context;
        this.isAnalyticsEnabled = this.checkAnalyticsEnabled();
        // Load existing data
        this.loadAnalyticsData();
    }
    /**
     * Check if analytics are enabled in settings
     */
    checkAnalyticsEnabled() {
        const config = vscode.workspace.getConfiguration('accessibilityEnhancer');
        return config.get('enableAnalytics', false);
    }
    /**
     * Load analytics data from storage
     */
    loadAnalyticsData() {
        this.events = this.context.globalState.get('analyticsEvents', []);
        this.feedbackItems = this.context.globalState.get('feedbackItems', []);
    }
    /**
     * Save analytics data to storage
     */
    async saveAnalyticsData() {
        await this.context.globalState.update('analyticsEvents', this.events);
        await this.context.globalState.update('feedbackItems', this.feedbackItems);
    }
    /**
     * Track an event
     * @param eventName - Name of the event
     * @param properties - Optional event properties
     */
    trackEvent(eventName, properties) {
        if (!this.isAnalyticsEnabled) {
            return;
        }
        const event = {
            eventName,
            timestamp: new Date().toISOString(),
            properties
        };
        this.events.push(event);
        // Keep only last 1000 events
        if (this.events.length > 1000) {
            this.events = this.events.slice(-1000);
        }
        // Save asynchronously
        this.saveAnalyticsData();
    }
    /**
     * Submit user feedback
     * @param feedback - User feedback object
     */
    async submitFeedback(feedback) {
        const extension = vscode.extensions.getExtension('ontario-tech-university.a11yassist');
        const extensionVersion = extension?.packageJSON.version || 'unknown';
        const enhancedFeedback = {
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
    getUsageStatistics() {
        // Count feature usage
        const featuresUsed = {};
        for (const event of this.events) {
            if (!featuresUsed[event.eventName]) {
                featuresUsed[event.eventName] = 0;
            }
            featuresUsed[event.eventName]++;
        }
        // Get audit statistics
        const totalAuditsRun = featuresUsed['audit_run'] || 0;
        const totalIssuesFound = this.context.globalState.get('totalIssuesFound', 0);
        const totalIssuesFixed = this.context.globalState.get('totalIssuesFixed', 0);
        // Get last used date
        const lastEvent = this.events[this.events.length - 1];
        const lastUsed = lastEvent ? lastEvent.timestamp : new Date().toISOString();
        return {
            totalAuditsRun,
            totalIssuesFound,
            totalIssuesFixed,
            featuresUsed,
            lastUsed
        };
    }
    /**
     * Increment issues found counter
     */
    incrementIssuesFound(count) {
        const current = this.context.globalState.get('totalIssuesFound', 0);
        this.context.globalState.update('totalIssuesFound', current + count);
    }
    /**
     * Increment issues fixed counter
     */
    incrementIssuesFixed() {
        const current = this.context.globalState.get('totalIssuesFixed', 0);
        this.context.globalState.update('totalIssuesFixed', current + 1);
        this.trackEvent('issue_fixed');
    }
    /**
     * Get all events
     */
    getEvents() {
        return [...this.events];
    }
    /**
     * Get all feedback
     */
    getFeedback() {
        return [...this.feedbackItems];
    }
    /**
     * Clear analytics data
     */
    async clearAnalytics() {
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
    exportAnalyticsData() {
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
    showAnalyticsSummary() {
        const stats = this.getUsageStatistics();
        const panel = vscode.window.createWebviewPanel('analyticsSummary', 'Usage Analytics Summary', vscode.ViewColumn.One, {
            enableScripts: true
        });
        panel.webview.html = this.generateAnalyticsHTML(stats);
    }
    /**
     * Generate HTML for analytics summary
     */
    generateAnalyticsHTML(stats) {
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
    formatEventName(eventName) {
        return eventName
            .split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }
}
exports.AnalyticsManager = AnalyticsManager;
//# sourceMappingURL=analyticsManager.js.map