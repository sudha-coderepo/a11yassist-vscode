/**
 * Contextual Guidance Provider
 *
 * @author Sudha Rajendran
 * @institution Ontario Tech University
 * @description Provides context-aware accessibility guidance and recommendations
 *
 * Features:
 * - Real-time accessibility suggestions
 * - Context-aware recommendations
 * - Best practices guidance
 * - Code examples
 * - WCAG guidelines reference
 */

import * as vscode from 'vscode';
import { ContextualGuidance, GuidanceResource, ExtensionConfig } from '../types';

/**
 * ContextualGuidanceProvider class
 * Provides contextual accessibility guidance based on current code context
 */
export class ContextualGuidanceProvider {
    private context: vscode.ExtensionContext;
    private config: ExtensionConfig;
    private currentGuidance: ContextualGuidance | null = null;

    /**
     * Constructor
     * @param context - VSCode extension context
     */
    constructor(context: vscode.ExtensionContext) {
        this.context = context;
        this.config = this.loadConfiguration();
    }

    /**
     * Load configuration from workspace settings
     */
    private loadConfiguration(): ExtensionConfig {
        const config = vscode.workspace.getConfiguration('a11yassist');

        return {
            enableScreenReaderEnhancements: config.get('enableScreenReaderEnhancements', true),
            enableContextualGuidance: config.get('enableContextualGuidance', true),
            enableAnalytics: config.get('enableAnalytics', false),
            highContrastMode: config.get('highContrastMode', false),
            verbosityLevel: config.get('verbosityLevel', 'normal') as any,
            enableKeyboardNavigation: config.get('enableKeyboardNavigation', true),
            announceEditorChanges: config.get('announceEditorChanges', true),
            cognitiveLoadReduction: config.get('cognitiveLoadReduction', false)
        };
    }

    /**
     * Update configuration when settings change
     */
    public updateConfiguration(): void {
        this.config = this.loadConfiguration();
    }

    /**
     * Provide guidance based on current editor context
     */
    public async provideGuidance(editor: vscode.TextEditor): Promise<void> {
        if (!this.config.enableContextualGuidance) {
            console.log('[Guidance] Contextual guidance is disabled');
            return;
        }

        const document = editor.document;
        const position = editor.selection.active;
        const line = document.lineAt(position.line);
        const lineText = line.text;

        console.log(`[Guidance] Analyzing line ${position.line + 1}: "${lineText.trim().substring(0, 60)}..."`);

        // Detect context and provide appropriate guidance
        this.currentGuidance = this.detectContext(lineText, document.languageId);

        // Show guidance notification if available (tree view always shows via updateGuidance)
        if (this.currentGuidance) {
            // Show notification if cognitive load reduction is enabled
            if (this.config.cognitiveLoadReduction) {
                console.log(`[Guidance] Showing notification for: ${this.currentGuidance.title}`);
                this.showGuidanceNotification(this.currentGuidance);
            }
            // Log that guidance was found for debugging
            console.log(`[Guidance] Contextual guidance detected for: ${this.currentGuidance.title}`);
        } else {
            console.log(`[Guidance] No guidance detected for line ${position.line + 1}`);
        }
    }

    /**
     * Detect context from line text and provide guidance
     */
    private detectContext(lineText: string, languageId: string): ContextualGuidance | null {
        console.log(`[Guidance] Detecting context for language: ${languageId}`);

        // Image elements
        if (/<img[\s>\/]/.test(lineText)) {
            console.log(`[Guidance] Matched image pattern`);
            return this.getImageGuidance();
        }

        // Form elements
        if (/<input[\s>\/]|<select[\s>\/]|<textarea[\s>\/]/.test(lineText)) {
            console.log(`[Guidance] Matched form input pattern`);
            return this.getFormInputGuidance();
        }

        // Button elements
        if (/<button[\s>]/.test(lineText) || /onClick/.test(lineText)) {
            console.log(`[Guidance] Matched button pattern`);
            return this.getButtonGuidance();
        }

        // Link elements
        if (/<a[\s>\/]/.test(lineText)) {
            console.log(`[Guidance] Matched link pattern`);
            return this.getLinkGuidance();
        }

        // ARIA attributes (check before other patterns)
        if (/aria-/.test(lineText)) {
            console.log(`[Guidance] Matched ARIA pattern`);
            return this.getARIAGuidance();
        }

        // Heading elements
        if (/<h[1-6][\s>]/.test(lineText)) {
            console.log(`[Guidance] Matched heading pattern`);
            return this.getHeadingGuidance();
        }

        // Color/CSS
        if ((languageId === 'css' || languageId === 'scss') && /color|background/.test(lineText)) {
            console.log(`[Guidance] Matched color contrast pattern`);
            return this.getColorContrastGuidance();
        }

        // Tables
        if (/<table[\s>\/]/.test(lineText)) {
            console.log(`[Guidance] Matched table pattern`);
            return this.getTableGuidance();
        }

        console.log(`[Guidance] No patterns matched for: "${lineText.trim().substring(0, 60)}"`);
        return null;
    }

    /**
     * Get guidance for images
     */
    private getImageGuidance(): ContextualGuidance {
        return {
            title: 'Image Accessibility',
            description: 'Images must have alternative text for screen readers',
            tips: [
                'Always include an alt attribute on <img> elements',
                'Alt text should describe the image content and purpose',
                'Use alt="" for decorative images that don\'t convey information',
                'Avoid redundant phrases like "image of" or "picture of"',
                'For complex images (charts, diagrams), provide longer descriptions'
            ],
            resources: [
                {
                    title: 'WCAG 2.1 - Non-text Content',
                    url: 'https://www.w3.org/WAI/WCAG21/quickref/#non-text-content',
                    type: 'standard'
                },
                {
                    title: 'WebAIM - Alternative Text',
                    url: 'https://webaim.org/techniques/alttext/',
                    type: 'tutorial'
                },
                {
                    title: 'Alt Text Examples',
                    url: 'https://www.w3.org/WAI/tutorials/images/',
                    type: 'example'
                }
            ],
            applicableElements: ['img', 'Image (React)']
        };
    }

    /**
     * Get guidance for form inputs
     */
    private getFormInputGuidance(): ContextualGuidance {
        return {
            title: 'Form Input Accessibility',
            description: 'Form inputs must be properly labeled and accessible',
            tips: [
                'Associate every input with a <label> element using for/id',
                'Use aria-label or aria-labelledby if visual labels aren\'t appropriate',
                'Add aria-required="true" for required fields',
                'Use aria-invalid="true" and aria-describedby for error messages',
                'Group related inputs with <fieldset> and <legend>',
                'Ensure error messages are announced to screen readers'
            ],
            resources: [
                {
                    title: 'WCAG 2.1 - Labels or Instructions',
                    url: 'https://www.w3.org/WAI/WCAG21/quickref/#labels-or-instructions',
                    type: 'standard'
                },
                {
                    title: 'WebAIM - Creating Accessible Forms',
                    url: 'https://webaim.org/techniques/forms/',
                    type: 'tutorial'
                }
            ],
            applicableElements: ['input', 'select', 'textarea', 'form']
        };
    }

    /**
     * Get guidance for buttons
     */
    private getButtonGuidance(): ContextualGuidance {
        return {
            title: 'Button Accessibility',
            description: 'Buttons must be keyboard accessible and have clear labels',
            tips: [
                'Use native <button> elements instead of divs with onClick',
                'Ensure buttons have descriptive text content or aria-label',
                'Make sure buttons are keyboard accessible (don\'t use tabindex="-1")',
                'Use aria-pressed for toggle buttons',
                'Use aria-expanded for buttons that expand/collapse content',
                'Provide visual focus indicators for keyboard navigation'
            ],
            resources: [
                {
                    title: 'WCAG 2.1 - Name, Role, Value',
                    url: 'https://www.w3.org/WAI/WCAG21/quickref/#name-role-value',
                    type: 'standard'
                },
                {
                    title: 'MDN - Button Accessibility',
                    url: 'https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/button_role',
                    type: 'documentation'
                }
            ],
            applicableElements: ['button', 'Button (React)', '[role="button"]']
        };
    }

    /**
     * Get guidance for links
     */
    private getLinkGuidance(): ContextualGuidance {
        return {
            title: 'Link Accessibility',
            description: 'Links must have descriptive text and clear purpose',
            tips: [
                'Link text should describe the destination or purpose',
                'Avoid generic text like "click here" or "read more"',
                'Use aria-label if link text isn\'t sufficient',
                'Indicate when links open in new windows/tabs',
                'Ensure links are distinguishable (not just by color)',
                'Provide focus indicators for keyboard navigation'
            ],
            resources: [
                {
                    title: 'WCAG 2.1 - Link Purpose',
                    url: 'https://www.w3.org/WAI/WCAG21/quickref/#link-purpose-in-context',
                    type: 'standard'
                },
                {
                    title: 'WebAIM - Links and Hypertext',
                    url: 'https://webaim.org/techniques/hypertext/',
                    type: 'tutorial'
                }
            ],
            applicableElements: ['a', 'Link (React)']
        };
    }

    /**
     * Get guidance for ARIA attributes
     */
    private getARIAGuidance(): ContextualGuidance {
        return {
            title: 'ARIA Attributes',
            description: 'Use ARIA attributes correctly to enhance accessibility',
            tips: [
                'First rule of ARIA: Don\'t use ARIA if native HTML works',
                'Use ARIA roles to define the purpose of elements',
                'Use ARIA states and properties to convey current state',
                'Ensure ARIA attributes have valid values',
                'Test with screen readers to verify ARIA implementation',
                'Keep ARIA attributes up to date as content changes'
            ],
            resources: [
                {
                    title: 'WAI-ARIA 1.2 Specification',
                    url: 'https://www.w3.org/TR/wai-aria-1.2/',
                    type: 'standard'
                },
                {
                    title: 'ARIA Authoring Practices',
                    url: 'https://www.w3.org/WAI/ARIA/apg/',
                    type: 'documentation'
                },
                {
                    title: 'Using ARIA',
                    url: 'https://www.w3.org/TR/using-aria/',
                    type: 'tutorial'
                }
            ],
            applicableElements: ['All elements with ARIA attributes']
        };
    }

    /**
     * Get guidance for headings
     */
    private getHeadingGuidance(): ContextualGuidance {
        return {
            title: 'Heading Structure',
            description: 'Headings must follow a logical hierarchical structure',
            tips: [
                'Use heading levels sequentially (h1, h2, h3, etc.)',
                'Don\'t skip heading levels (e.g., h1 to h3)',
                'Use only one h1 per page',
                'Headings should describe the content that follows',
                'Don\'t use headings just for styling (use CSS instead)',
                'Screen readers use headings for navigation'
            ],
            resources: [
                {
                    title: 'WCAG 2.1 - Headings and Labels',
                    url: 'https://www.w3.org/WAI/WCAG21/quickref/#headings-and-labels',
                    type: 'standard'
                },
                {
                    title: 'WebAIM - Semantic Structure',
                    url: 'https://webaim.org/techniques/semanticstructure/',
                    type: 'tutorial'
                }
            ],
            applicableElements: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']
        };
    }

    /**
     * Get guidance for color contrast
     */
    private getColorContrastGuidance(): ContextualGuidance {
        return {
            title: 'Color Contrast',
            description: 'Ensure sufficient color contrast for readability',
            tips: [
                'WCAG AA requires 4.5:1 contrast ratio for normal text',
                'WCAG AA requires 3:1 for large text (18pt+ or 14pt+ bold)',
                'WCAG AAA requires 7:1 for normal text',
                'Don\'t rely on color alone to convey information',
                'Test contrast with online tools or browser extensions',
                'Consider users with color blindness and low vision'
            ],
            resources: [
                {
                    title: 'WCAG 2.1 - Contrast (Minimum)',
                    url: 'https://www.w3.org/WAI/WCAG21/quickref/#contrast-minimum',
                    type: 'standard'
                },
                {
                    title: 'WebAIM Contrast Checker',
                    url: 'https://webaim.org/resources/contrastchecker/',
                    type: 'documentation'
                }
            ],
            applicableElements: ['CSS color properties']
        };
    }

    /**
     * Get guidance for tables
     */
    private getTableGuidance(): ContextualGuidance {
        return {
            title: 'Table Accessibility',
            description: 'Tables must be properly structured for screen readers',
            tips: [
                'Use <th> for header cells with scope attribute',
                'Use <caption> to describe the table purpose',
                'Use <thead>, <tbody>, and <tfoot> for structure',
                'Associate data cells with headers using headers attribute if needed',
                'Don\'t use tables for layout (use CSS Grid or Flexbox)',
                'Keep tables simple; split complex tables into multiple tables'
            ],
            resources: [
                {
                    title: 'WCAG 2.1 - Info and Relationships',
                    url: 'https://www.w3.org/WAI/WCAG21/quickref/#info-and-relationships',
                    type: 'standard'
                },
                {
                    title: 'WebAIM - Creating Accessible Tables',
                    url: 'https://webaim.org/techniques/tables/',
                    type: 'tutorial'
                }
            ],
            applicableElements: ['table', 'th', 'td', 'caption']
        };
    }

    /**
     * Show guidance notification
     */
    private showGuidanceNotification(guidance: ContextualGuidance): void {
        vscode.window.showInformationMessage(
            `Accessibility Tip: ${guidance.title}`,
            'Show Details',
            'Dismiss'
        ).then(selection => {
            if (selection === 'Show Details') {
                this.showGuidancePanel(guidance);
            }
        });
    }

    /**
     * Show guidance in a panel
     */
    private showGuidancePanel(guidance: ContextualGuidance): void {
        const panel = vscode.window.createWebviewPanel(
            'accessibilityGuidance',
            guidance.title,
            vscode.ViewColumn.Beside,
            {
                enableScripts: false
            }
        );

        panel.webview.html = this.generateGuidanceHTML(guidance);
    }

    /**
     * Generate HTML for guidance panel
     */
    private generateGuidanceHTML(guidance: ContextualGuidance): string {
        const tipsHTML = guidance.tips.map(tip => `<li>${tip}</li>`).join('');
        const resourcesHTML = guidance.resources.map(resource => `
            <li>
                <a href="${resource.url}" target="_blank">${resource.title}</a>
                <span class="resource-type">[${resource.type}]</span>
            </li>
        `).join('');

        return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${guidance.title}</title>
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
            margin-top: 25px;
        }
        .description {
            background-color: var(--vscode-textBlockQuote-background);
            border-left: 4px solid var(--vscode-textLink-foreground);
            padding: 15px;
            margin: 20px 0;
        }
        ul {
            padding-left: 25px;
        }
        li {
            margin: 10px 0;
        }
        a {
            color: var(--vscode-textLink-foreground);
            text-decoration: none;
        }
        a:hover {
            text-decoration: underline;
        }
        .resource-type {
            color: var(--vscode-descriptionForeground);
            font-size: 0.9em;
            margin-left: 8px;
        }
    </style>
</head>
<body>
    <h1>${guidance.title}</h1>

    <div class="description">
        ${guidance.description}
    </div>

    <h2>Best Practices</h2>
    <ul>
        ${tipsHTML}
    </ul>

    <h2>Resources</h2>
    <ul>
        ${resourcesHTML}
    </ul>
</body>
</html>
`;
    }

    /**
     * Get current guidance
     */
    public getCurrentGuidance(): ContextualGuidance | null {
        return this.currentGuidance;
    }
}
