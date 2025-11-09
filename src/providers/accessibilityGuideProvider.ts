/**
 * Accessibility Guide Provider (Tree View)
 *
 * @author Sudha Rajendran
 * @institution Ontario Tech University
 * @description Tree view provider for displaying contextual accessibility guidance
 */

import * as vscode from 'vscode';
import { ContextualGuidance } from '../types';

/**
 * a11yassistGuideProvider class
 * Provides tree view for contextual guidance
 */
export class AccessibilityGuideProvider implements vscode.TreeDataProvider<GuideTreeItem> {
    private _onDidChangeTreeData: vscode.EventEmitter<GuideTreeItem | undefined | null | void> =
        new vscode.EventEmitter<GuideTreeItem | undefined | null | void>();
    readonly onDidChangeTreeData: vscode.Event<GuideTreeItem | undefined | null | void> =
        this._onDidChangeTreeData.event;

    private currentGuidance: ContextualGuidance | null = null;

    /**
     * Update guidance and refresh tree view
     */
    public updateGuidance(guidance: ContextualGuidance | null): void {
        if (guidance) {
            console.log(`[GuideProvider] Updating guidance: ${guidance.title}`);
        } else {
            console.log(`[GuideProvider] Clearing guidance (null)`);
        }
        this.currentGuidance = guidance;
        this._onDidChangeTreeData.fire();
        console.log(`[GuideProvider] Tree view refreshed`);
    }

    /**
     * Get tree item
     */
    getTreeItem(element: GuideTreeItem): vscode.TreeItem {
        return element;
    }

    /**
     * Get children for tree view
     */
    getChildren(element?: GuideTreeItem): Thenable<GuideTreeItem[]> {
        if (!this.currentGuidance) {
            const item = new GuideTreeItem(
                'No contextual guidance available',
                vscode.TreeItemCollapsibleState.None
            );
            item.description = 'Navigate to code to see guidance';
            return Promise.resolve([item]);
        }

        if (!element) {
            // Root level - show guidance sections
            return Promise.resolve(this.getRootItems());
        } else if (element.contextValue === 'tips-section') {
            // Show tips
            return Promise.resolve(this.getTipItems());
        } else if (element.contextValue === 'resources-section') {
            // Show resources
            return Promise.resolve(this.getResourceItems());
        }

        return Promise.resolve([]);
    }

    /**
     * Get root items
     */
    private getRootItems(): GuideTreeItem[] {
        if (!this.currentGuidance) {
            return [];
        }

        const items: GuideTreeItem[] = [];

        // Title and description
        const titleItem = new GuideTreeItem(
            this.currentGuidance.title,
            vscode.TreeItemCollapsibleState.None
        );
        titleItem.description = this.currentGuidance.description;
        titleItem.iconPath = new vscode.ThemeIcon('book');
        items.push(titleItem);

        // Tips section
        if (this.currentGuidance.tips.length > 0) {
            const tipsItem = new GuideTreeItem(
                'Best Practices',
                vscode.TreeItemCollapsibleState.Expanded
            );
            tipsItem.contextValue = 'tips-section';
            tipsItem.iconPath = new vscode.ThemeIcon('lightbulb');
            items.push(tipsItem);
        }

        // Resources section
        if (this.currentGuidance.resources.length > 0) {
            const resourcesItem = new GuideTreeItem(
                'Resources',
                vscode.TreeItemCollapsibleState.Expanded
            );
            resourcesItem.contextValue = 'resources-section';
            resourcesItem.iconPath = new vscode.ThemeIcon('link-external');
            items.push(resourcesItem);
        }

        return items;
    }

    /**
     * Get tip items
     */
    private getTipItems(): GuideTreeItem[] {
        if (!this.currentGuidance) {
            return [];
        }

        return this.currentGuidance.tips.map((tip, index) => {
            const item = new GuideTreeItem(
                tip,
                vscode.TreeItemCollapsibleState.None
            );
            item.iconPath = new vscode.ThemeIcon('symbol-number');
            item.contextValue = 'tip';
            return item;
        });
    }

    /**
     * Get resource items
     */
    private getResourceItems(): GuideTreeItem[] {
        if (!this.currentGuidance) {
            return [];
        }

        return this.currentGuidance.resources.map(resource => {
            const item = new GuideTreeItem(
                resource.title,
                vscode.TreeItemCollapsibleState.None
            );
            item.description = `[${resource.type}]`;
            item.iconPath = new vscode.ThemeIcon(this.getResourceIcon(resource.type));
            item.contextValue = 'resource';
            item.tooltip = resource.url;

            // Command to open URL
            item.command = {
                command: 'vscode.open',
                title: 'Open Resource',
                arguments: [vscode.Uri.parse(resource.url)]
            };

            return item;
        });
    }

    /**
     * Get icon for resource type
     */
    private getResourceIcon(type: string): string {
        switch (type) {
            case 'documentation':
                return 'book';
            case 'tutorial':
                return 'mortar-board';
            case 'example':
                return 'code';
            case 'standard':
                return 'law';
            default:
                return 'link';
        }
    }
}

/**
 * Tree item for guide view
 */
class GuideTreeItem extends vscode.TreeItem {
    constructor(
        public readonly label: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState
    ) {
        super(label, collapsibleState);
    }
}
