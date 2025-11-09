/**
 * Accessibility Issues Provider (Tree View)
 *
 * @author Sudha Rajendran and Rohitha Janga
 * @institution Ontario Tech University
 * @description Tree view provider for displaying accessibility issues in the sidebar
 */

import * as vscode from 'vscode';
import { AccessibilityIssue, AccessibilitySeverity } from '../types';

/**
 * a11yassistIssuesProvider class
 * Provides tree view for accessibility issues
 */
export class AccessibilityIssuesProvider implements vscode.TreeDataProvider<IssueTreeItem> {
    private _onDidChangeTreeData: vscode.EventEmitter<IssueTreeItem | undefined | null | void> =
        new vscode.EventEmitter<IssueTreeItem | undefined | null | void>();
    readonly onDidChangeTreeData: vscode.Event<IssueTreeItem | undefined | null | void> =
        this._onDidChangeTreeData.event;

    private issues: AccessibilityIssue[] = [];
    private expandedStates: Map<string, boolean> = new Map();

    /**
     * Update issues and refresh tree view
     */
    public updateIssues(issues: AccessibilityIssue[]): void {
        this.issues = issues;
        this._onDidChangeTreeData.fire();
    }

    /**
     * Get tree item
     */
    getTreeItem(element: IssueTreeItem): vscode.TreeItem {
        return element;
    }

    /**
     * Get children for tree view
     */
    getChildren(element?: IssueTreeItem): Thenable<IssueTreeItem[]> {
        if (!element) {
            // Root level - group by severity
            return Promise.resolve(this.getSeverityGroups());
        } else if (element.contextValue === 'severity' && element.id) {
            // Show issues for this severity
            // Extract severity from id: "severity-critical" -> "critical"
            const severity = element.id.replace('severity-', '') as AccessibilitySeverity;
            const issuesForSeverity = this.issues.filter(i => i.severity === severity);
            console.log(`Getting children for severity: ${severity}, found ${issuesForSeverity.length} issues`);
            return Promise.resolve(this.getIssueItems(issuesForSeverity));
        }

        return Promise.resolve([]);
    }

    /**
     * Get severity groups
     */
    private getSeverityGroups(): IssueTreeItem[] {
        const groups: IssueTreeItem[] = [];

        const severities: AccessibilitySeverity[] = [
            AccessibilitySeverity.CRITICAL,
            AccessibilitySeverity.SERIOUS,
            AccessibilitySeverity.MODERATE,
            AccessibilitySeverity.MINOR
        ];

        for (const severity of severities) {
            const count = this.issues.filter(i => i.severity === severity).length;

            if (count > 0) {
                const severityKey = `severity-${severity}`;
                const isExpanded = this.expandedStates.get(severityKey) !== false;

                const item = new IssueTreeItem(
                    `${this.formatSeverity(severity)} (${count})`,
                    isExpanded ? vscode.TreeItemCollapsibleState.Expanded : vscode.TreeItemCollapsibleState.Collapsed
                );
                item.contextValue = 'severity';
                item.id = severityKey;
                item.iconPath = new vscode.ThemeIcon(this.getSeverityIcon(severity));
                groups.push(item);
            }
        }

        if (groups.length === 0) {
            const item = new IssueTreeItem(
                'No accessibility issues found',
                vscode.TreeItemCollapsibleState.None
            );
            item.iconPath = new vscode.ThemeIcon('check');
            return [item];
        }

        return groups;
    }

    /**
     * Get issue items for display
     */
    private getIssueItems(issues: AccessibilityIssue[]): IssueTreeItem[] {
        return issues.map((issue, index) => {
            const item = new IssueTreeItem(
                issue.message,
                vscode.TreeItemCollapsibleState.None
            );

            item.description = `Line ${issue.line + 1}`;
            item.tooltip = `${issue.description}\n\nSuggestion: ${issue.suggestion}`;
            item.contextValue = 'issue';
            item.id = `issue-${issue.id || index}`;
            item.iconPath = new vscode.ThemeIcon(this.getIssueIcon(issue));

            // Command to navigate to issue
            item.command = {
                command: 'a11yassist.navigateToIssue',
                title: 'Navigate to Issue',
                arguments: [issue]
            };

            return item;
        });
    }

    /**
     * Format severity for display
     */
    private formatSeverity(severity: AccessibilitySeverity): string {
        return severity.charAt(0).toUpperCase() + severity.slice(1);
    }

    /**
     * Get icon for severity
     */
    private getSeverityIcon(severity: AccessibilitySeverity): string {
        switch (severity) {
            case AccessibilitySeverity.CRITICAL:
                return 'error';
            case AccessibilitySeverity.SERIOUS:
                return 'warning';
            case AccessibilitySeverity.MODERATE:
                return 'info';
            case AccessibilitySeverity.MINOR:
                return 'lightbulb';
            default:
                return 'info';
        }
    }

    /**
     * Get icon for specific issue
     */
    private getIssueIcon(issue: AccessibilityIssue): string {
        return this.getSeverityIcon(issue.severity);
    }

    /**
     * Clear all issues
     */
    public clearIssues(): void {
        this.issues = [];
        this._onDidChangeTreeData.fire();
    }

    /**
     * Set expanded state for a severity group
     */
    public setSeverityExpandedState(severityKey: string, isExpanded: boolean): void {
        this.expandedStates.set(severityKey, isExpanded);
    }
}

/**
 * Tree item for issues view
 */
class IssueTreeItem extends vscode.TreeItem {
    constructor(
        public readonly label: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState
    ) {
        super(label, collapsibleState);
    }
}
