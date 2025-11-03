/**
 * Accessibility Stats Provider (Tree View)
 *
 * @author Sudha Rajendran and Rohitha Janga
 * @institution Ontario Tech University
 * @description Tree view provider for displaying usage statistics and analytics
 */

import * as vscode from 'vscode';
import { AnalyticsManager } from '../features/analyticsManager';
import { UsageStatistics } from '../types';

/**
 * a11yassistStatsProvider class
 * Provides tree view for usage statistics
 */
export class AccessibilityStatsProvider implements vscode.TreeDataProvider<StatsTreeItem> {
    private _onDidChangeTreeData: vscode.EventEmitter<StatsTreeItem | undefined | null | void> =
        new vscode.EventEmitter<StatsTreeItem | undefined | null | void>();
    readonly onDidChangeTreeData: vscode.Event<StatsTreeItem | undefined | null | void> =
        this._onDidChangeTreeData.event;

    private analyticsManager: AnalyticsManager;

    /**
     * Constructor
     * @param analyticsManager - Analytics manager instance
     */
    constructor(analyticsManager: AnalyticsManager) {
        this.analyticsManager = analyticsManager;

        // Refresh stats every minute
        setInterval(() => {
            this.refresh();
        }, 60000);
    }

    /**
     * Refresh tree view
     */
    public refresh(): void {
        this._onDidChangeTreeData.fire();
    }

    /**
     * Get tree item
     */
    getTreeItem(element: StatsTreeItem): vscode.TreeItem {
        return element;
    }

    /**
     * Get children for tree view
     */
    getChildren(element?: StatsTreeItem): Thenable<StatsTreeItem[]> {
        if (!element) {
            // Root level - show summary statistics
            return Promise.resolve(this.getSummaryItems());
        } else if (element.contextValue === 'feature-usage') {
            // Show feature usage details
            return Promise.resolve(this.getFeatureUsageItems());
        }

        return Promise.resolve([]);
    }

    /**
     * Get summary items
     */
    private getSummaryItems(): StatsTreeItem[] {
        const stats = this.analyticsManager.getUsageStatistics();
        const items: StatsTreeItem[] = [];

        // Total audits run
        const auditsItem = new StatsTreeItem(
            'Total Audits Run',
            vscode.TreeItemCollapsibleState.None
        );
        auditsItem.description = stats.totalAuditsRun.toString();
        auditsItem.iconPath = new vscode.ThemeIcon('search');
        auditsItem.contextValue = 'stat';
        items.push(auditsItem);

        // Total issues found
        const issuesFoundItem = new StatsTreeItem(
            'Issues Found',
            vscode.TreeItemCollapsibleState.None
        );
        issuesFoundItem.description = stats.totalIssuesFound.toString();
        issuesFoundItem.iconPath = new vscode.ThemeIcon('warning');
        issuesFoundItem.contextValue = 'stat';
        items.push(issuesFoundItem);

        // Total issues fixed
        const issuesFixedItem = new StatsTreeItem(
            'Issues Fixed',
            vscode.TreeItemCollapsibleState.None
        );
        issuesFixedItem.description = stats.totalIssuesFixed.toString();
        issuesFixedItem.iconPath = new vscode.ThemeIcon('check');
        issuesFixedItem.contextValue = 'stat';
        items.push(issuesFixedItem);

        // Fix rate
        if (stats.totalIssuesFound > 0) {
            const fixRate = Math.round((stats.totalIssuesFixed / stats.totalIssuesFound) * 100);
            const fixRateItem = new StatsTreeItem(
                'Fix Rate',
                vscode.TreeItemCollapsibleState.None
            );
            fixRateItem.description = `${fixRate}%`;
            fixRateItem.iconPath = new vscode.ThemeIcon('graph');
            fixRateItem.contextValue = 'stat';
            items.push(fixRateItem);
        }

        // Feature usage section
        if (Object.keys(stats.featuresUsed).length > 0) {
            const featureUsageItem = new StatsTreeItem(
                'Feature Usage',
                vscode.TreeItemCollapsibleState.Collapsed
            );
            featureUsageItem.iconPath = new vscode.ThemeIcon('pulse');
            featureUsageItem.contextValue = 'feature-usage';
            items.push(featureUsageItem);
        }

        // Last used
        const lastUsedItem = new StatsTreeItem(
            'Last Used',
            vscode.TreeItemCollapsibleState.None
        );
        lastUsedItem.description = this.formatDate(stats.lastUsed);
        lastUsedItem.iconPath = new vscode.ThemeIcon('clock');
        lastUsedItem.contextValue = 'stat';
        items.push(lastUsedItem);

        // Actions
        const viewDetailsItem = new StatsTreeItem(
            'View Detailed Analytics',
            vscode.TreeItemCollapsibleState.None
        );
        viewDetailsItem.iconPath = new vscode.ThemeIcon('graph-line');
        viewDetailsItem.contextValue = 'action';
        viewDetailsItem.command = {
            command: 'a11yassist.showAnalyticsSummary',
            title: 'Show Analytics Summary'
        };
        items.push(viewDetailsItem);

        return items;
    }

    /**
     * Get feature usage items
     */
    private getFeatureUsageItems(): StatsTreeItem[] {
        const stats = this.analyticsManager.getUsageStatistics();

        // Sort by usage count
        const sortedFeatures = Object.entries(stats.featuresUsed)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10); // Top 10 features

        return sortedFeatures.map(([featureName, count]) => {
            const item = new StatsTreeItem(
                this.formatFeatureName(featureName),
                vscode.TreeItemCollapsibleState.None
            );
            item.description = `${count} times`;
            item.iconPath = new vscode.ThemeIcon('symbol-event');
            item.contextValue = 'feature';
            return item;
        });
    }

    /**
     * Format feature name for display
     */
    private formatFeatureName(featureName: string): string {
        return featureName
            .split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }

    /**
     * Format date for display
     */
    private formatDate(isoString: string): string {
        const date = new Date(isoString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) {
            return 'Just now';
        } else if (diffMins < 60) {
            return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
        } else if (diffHours < 24) {
            return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
        } else if (diffDays < 7) {
            return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
        } else {
            return date.toLocaleDateString();
        }
    }
}

/**
 * Tree item for stats view
 */
class StatsTreeItem extends vscode.TreeItem {
    constructor(
        public readonly label: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState
    ) {
        super(label, collapsibleState);
    }
}
