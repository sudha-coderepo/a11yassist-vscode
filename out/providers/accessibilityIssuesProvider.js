"use strict";
/**
 * Accessibility Issues Provider (Tree View)
 *
 * @author Sudha Rajendran and Rohitha Janga
 * @institution Ontario Tech University
 * @description Tree view provider for displaying accessibility issues in the sidebar
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
exports.AccessibilityIssuesProvider = void 0;
const vscode = __importStar(require("vscode"));
const types_1 = require("../types");
/**
 * a11yassistIssuesProvider class
 * Provides tree view for accessibility issues
 */
class AccessibilityIssuesProvider {
    constructor() {
        this._onDidChangeTreeData = new vscode.EventEmitter();
        this.onDidChangeTreeData = this._onDidChangeTreeData.event;
        this.issues = [];
        this.expandedStates = new Map();
    }
    /**
     * Update issues and refresh tree view
     */
    updateIssues(issues) {
        this.issues = issues;
        this._onDidChangeTreeData.fire();
    }
    /**
     * Get tree item
     */
    getTreeItem(element) {
        return element;
    }
    /**
     * Get children for tree view
     */
    getChildren(element) {
        if (!element) {
            // Root level - group by severity
            return Promise.resolve(this.getSeverityGroups());
        }
        else if (element.contextValue === 'severity' && element.id) {
            // Show issues for this severity
            // Extract severity from id: "severity-critical" -> "critical"
            const severity = element.id.replace('severity-', '');
            const issuesForSeverity = this.issues.filter(i => i.severity === severity);
            console.log(`Getting children for severity: ${severity}, found ${issuesForSeverity.length} issues`);
            return Promise.resolve(this.getIssueItems(issuesForSeverity));
        }
        return Promise.resolve([]);
    }
    /**
     * Get severity groups
     */
    getSeverityGroups() {
        const groups = [];
        const severities = [
            types_1.AccessibilitySeverity.CRITICAL,
            types_1.AccessibilitySeverity.SERIOUS,
            types_1.AccessibilitySeverity.MODERATE,
            types_1.AccessibilitySeverity.MINOR
        ];
        for (const severity of severities) {
            const count = this.issues.filter(i => i.severity === severity).length;
            if (count > 0) {
                const severityKey = `severity-${severity}`;
                const isExpanded = this.expandedStates.get(severityKey) !== false;
                const item = new IssueTreeItem(`${this.formatSeverity(severity)} (${count})`, isExpanded ? vscode.TreeItemCollapsibleState.Expanded : vscode.TreeItemCollapsibleState.Collapsed);
                item.contextValue = 'severity';
                item.id = severityKey;
                item.iconPath = new vscode.ThemeIcon(this.getSeverityIcon(severity));
                groups.push(item);
            }
        }
        if (groups.length === 0) {
            const item = new IssueTreeItem('No accessibility issues found', vscode.TreeItemCollapsibleState.None);
            item.iconPath = new vscode.ThemeIcon('check');
            return [item];
        }
        return groups;
    }
    /**
     * Get issue items for display
     */
    getIssueItems(issues) {
        return issues.map((issue, index) => {
            const item = new IssueTreeItem(issue.message, vscode.TreeItemCollapsibleState.None);
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
    formatSeverity(severity) {
        return severity.charAt(0).toUpperCase() + severity.slice(1);
    }
    /**
     * Get icon for severity
     */
    getSeverityIcon(severity) {
        switch (severity) {
            case types_1.AccessibilitySeverity.CRITICAL:
                return 'error';
            case types_1.AccessibilitySeverity.SERIOUS:
                return 'warning';
            case types_1.AccessibilitySeverity.MODERATE:
                return 'info';
            case types_1.AccessibilitySeverity.MINOR:
                return 'lightbulb';
            default:
                return 'info';
        }
    }
    /**
     * Get icon for specific issue
     */
    getIssueIcon(issue) {
        return this.getSeverityIcon(issue.severity);
    }
    /**
     * Clear all issues
     */
    clearIssues() {
        this.issues = [];
        this._onDidChangeTreeData.fire();
    }
    /**
     * Set expanded state for a severity group
     */
    setSeverityExpandedState(severityKey, isExpanded) {
        this.expandedStates.set(severityKey, isExpanded);
    }
}
exports.AccessibilityIssuesProvider = AccessibilityIssuesProvider;
/**
 * Tree item for issues view
 */
class IssueTreeItem extends vscode.TreeItem {
    constructor(label, collapsibleState) {
        super(label, collapsibleState);
        this.label = label;
        this.collapsibleState = collapsibleState;
    }
}
//# sourceMappingURL=accessibilityIssuesProvider.js.map