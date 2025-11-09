"use strict";
/**
 * Accessibility Guide Provider (Tree View)
 *
 * @author Sudha Rajendran and Rohitha Janga
 * @institution Ontario Tech University
 * @description Tree view provider for displaying contextual accessibility guidance
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
exports.AccessibilityGuideProvider = void 0;
const vscode = __importStar(require("vscode"));
/**
 * a11yassistGuideProvider class
 * Provides tree view for contextual guidance
 */
class AccessibilityGuideProvider {
    constructor() {
        this._onDidChangeTreeData = new vscode.EventEmitter();
        this.onDidChangeTreeData = this._onDidChangeTreeData.event;
        this.currentGuidance = null;
    }
    /**
     * Update guidance and refresh tree view
     */
    updateGuidance(guidance) {
        if (guidance) {
            console.log(`[GuideProvider] Updating guidance: ${guidance.title}`);
        }
        else {
            console.log(`[GuideProvider] Clearing guidance (null)`);
        }
        this.currentGuidance = guidance;
        this._onDidChangeTreeData.fire();
        console.log(`[GuideProvider] Tree view refreshed`);
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
        if (!this.currentGuidance) {
            const item = new GuideTreeItem('No contextual guidance available', vscode.TreeItemCollapsibleState.None);
            item.description = 'Navigate to code to see guidance';
            return Promise.resolve([item]);
        }
        if (!element) {
            // Root level - show guidance sections
            return Promise.resolve(this.getRootItems());
        }
        else if (element.contextValue === 'tips-section') {
            // Show tips
            return Promise.resolve(this.getTipItems());
        }
        else if (element.contextValue === 'resources-section') {
            // Show resources
            return Promise.resolve(this.getResourceItems());
        }
        return Promise.resolve([]);
    }
    /**
     * Get root items
     */
    getRootItems() {
        if (!this.currentGuidance) {
            return [];
        }
        const items = [];
        // Title and description
        const titleItem = new GuideTreeItem(this.currentGuidance.title, vscode.TreeItemCollapsibleState.None);
        titleItem.description = this.currentGuidance.description;
        titleItem.iconPath = new vscode.ThemeIcon('book');
        items.push(titleItem);
        // Tips section
        if (this.currentGuidance.tips.length > 0) {
            const tipsItem = new GuideTreeItem('Best Practices', vscode.TreeItemCollapsibleState.Expanded);
            tipsItem.contextValue = 'tips-section';
            tipsItem.iconPath = new vscode.ThemeIcon('lightbulb');
            items.push(tipsItem);
        }
        // Resources section
        if (this.currentGuidance.resources.length > 0) {
            const resourcesItem = new GuideTreeItem('Resources', vscode.TreeItemCollapsibleState.Expanded);
            resourcesItem.contextValue = 'resources-section';
            resourcesItem.iconPath = new vscode.ThemeIcon('link-external');
            items.push(resourcesItem);
        }
        return items;
    }
    /**
     * Get tip items
     */
    getTipItems() {
        if (!this.currentGuidance) {
            return [];
        }
        return this.currentGuidance.tips.map((tip, index) => {
            const item = new GuideTreeItem(tip, vscode.TreeItemCollapsibleState.None);
            item.iconPath = new vscode.ThemeIcon('symbol-number');
            item.contextValue = 'tip';
            return item;
        });
    }
    /**
     * Get resource items
     */
    getResourceItems() {
        if (!this.currentGuidance) {
            return [];
        }
        return this.currentGuidance.resources.map(resource => {
            const item = new GuideTreeItem(resource.title, vscode.TreeItemCollapsibleState.None);
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
    getResourceIcon(type) {
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
exports.AccessibilityGuideProvider = AccessibilityGuideProvider;
/**
 * Tree item for guide view
 */
class GuideTreeItem extends vscode.TreeItem {
    constructor(label, collapsibleState) {
        super(label, collapsibleState);
        this.label = label;
        this.collapsibleState = collapsibleState;
    }
}
//# sourceMappingURL=accessibilityGuideProvider.js.map