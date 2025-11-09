"use strict";
/**
 * Accessibility Auditor
 *
 * @author Sudha Rajendran and Rohitha Janga
 * @institution Ontario Tech University
 * @description Performs comprehensive accessibility audits on code files
 *
 * Checks for:
 * - WCAG 2.1 compliance (Level A, AA, AAA)
 * - ARIA attributes validation
 * - Color contrast ratios
 * - Semantic HTML structure
 * - Keyboard accessibility
 * - Screen reader compatibility
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
exports.AccessibilityAuditor = void 0;
const vscode = __importStar(require("vscode"));
const types_1 = require("../types");
const ariaValidator_1 = require("../utils/ariaValidator");
const colorContrastAnalyzer_1 = require("../utils/colorContrastAnalyzer");
/**
 * AccessibilityAuditor class
 * Performs accessibility audits on code files
 */
class AccessibilityAuditor {
    /**
     * Constructor
     * @param context - VSCode extension context
     */
    constructor(context) {
        this.context = context;
        this.ariaValidator = new ariaValidator_1.ARIAValidator();
        this.colorAnalyzer = new colorContrastAnalyzer_1.ColorContrastAnalyzer();
        // Create diagnostic collection for accessibility issues
        this.diagnosticCollection = vscode.languages.createDiagnosticCollection('accessibility');
        context.subscriptions.push(this.diagnosticCollection);
    }
    /**
     * Run accessibility audit on current file
     */
    async runAudit() {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showWarningMessage('No active editor to audit');
            return [];
        }
        const document = editor.document;
        const issues = [];
        // Determine file type and run appropriate audits
        const languageId = document.languageId;
        await vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: 'Running Accessibility Audit',
            cancellable: false
        }, async (progress) => {
            progress.report({ increment: 0, message: 'Analyzing document...' });
            if (languageId === 'html' || languageId === 'handlebars' || languageId === 'php') {
                issues.push(...await this.auditHTML(document));
            }
            progress.report({ increment: 30, message: 'Checking ARIA attributes...' });
            if (languageId === 'typescript' || languageId === 'typescriptreact' ||
                languageId === 'javascript' || languageId === 'javascriptreact') {
                issues.push(...await this.auditJSX(document));
            }
            progress.report({ increment: 30, message: 'Analyzing color contrast...' });
            if (languageId === 'css' || languageId === 'scss' || languageId === 'less') {
                issues.push(...await this.auditCSS(document));
            }
            progress.report({ increment: 20, message: 'Validating structure...' });
            // Check for common issues across all file types
            issues.push(...await this.auditCommonIssues(document));
            progress.report({ increment: 20, message: 'Complete!' });
        });
        // Update diagnostics after all audits complete
        this.updateDiagnostics(document, issues);
        return issues;
    }
    /**
     * Audit HTML content
     */
    async auditHTML(document) {
        const issues = [];
        const text = document.getText();
        const lines = text.split('\n');
        lines.forEach((line, lineIndex) => {
            // Check for images without alt text
            if (/<img\s/.test(line) && !/alt\s*=/.test(line)) {
                issues.push(this.createIssue({
                    type: types_1.IssueType.MISSING_ALT_TEXT,
                    severity: types_1.AccessibilitySeverity.CRITICAL,
                    wcagLevel: types_1.WCAGLevel.A,
                    message: 'Image missing alt attribute',
                    description: 'All images must have an alt attribute for screen readers',
                    line: lineIndex,
                    column: line.indexOf('<img'),
                    code: line.trim(),
                    suggestion: 'Add alt="descriptive text" to the image tag',
                    filePath: document.uri.fsPath
                }));
            }
            // Check for form inputs without labels
            if (/<input\s/.test(line)) {
                const hasLabel = /aria-label\s*=|aria-labelledby\s*=|id\s*=/.test(line);
                if (!hasLabel) {
                    issues.push(this.createIssue({
                        type: types_1.IssueType.MISSING_FORM_LABEL,
                        severity: types_1.AccessibilitySeverity.SERIOUS,
                        wcagLevel: types_1.WCAGLevel.A,
                        message: 'Form input missing label',
                        description: 'Form inputs must have associated labels',
                        line: lineIndex,
                        column: line.indexOf('<input'),
                        code: line.trim(),
                        suggestion: 'Add aria-label or associate with a <label> element',
                        filePath: document.uri.fsPath
                    }));
                }
            }
            // Check for buttons without accessible names
            if (/<button[^>]*>(\s*)<\/button>/.test(line)) {
                issues.push(this.createIssue({
                    type: types_1.IssueType.EMPTY_BUTTON,
                    severity: types_1.AccessibilitySeverity.CRITICAL,
                    wcagLevel: types_1.WCAGLevel.A,
                    message: 'Empty button element',
                    description: 'Buttons must have accessible text content',
                    line: lineIndex,
                    column: line.indexOf('<button'),
                    code: line.trim(),
                    suggestion: 'Add text content or aria-label to the button',
                    filePath: document.uri.fsPath
                }));
            }
            // Check for links without accessible names
            if (/<a\s[^>]*>(\s*)<\/a>/.test(line)) {
                issues.push(this.createIssue({
                    type: types_1.IssueType.EMPTY_LINK,
                    severity: types_1.AccessibilitySeverity.SERIOUS,
                    wcagLevel: types_1.WCAGLevel.A,
                    message: 'Empty link element',
                    description: 'Links must have accessible text content',
                    line: lineIndex,
                    column: line.indexOf('<a'),
                    code: line.trim(),
                    suggestion: 'Add text content or aria-label to the link',
                    filePath: document.uri.fsPath
                }));
            }
            // Check for improper tabindex
            const tabindexMatch = line.match(/tabindex\s*=\s*["'](\d+)["']/);
            if (tabindexMatch && parseInt(tabindexMatch[1]) > 0) {
                issues.push(this.createIssue({
                    type: types_1.IssueType.IMPROPER_TAB_INDEX,
                    severity: types_1.AccessibilitySeverity.MODERATE,
                    wcagLevel: types_1.WCAGLevel.A,
                    message: 'Positive tabindex value',
                    description: 'Positive tabindex values can create confusing navigation order',
                    line: lineIndex,
                    column: line.indexOf('tabindex'),
                    code: line.trim(),
                    suggestion: 'Use tabindex="0" or tabindex="-1" instead',
                    filePath: document.uri.fsPath
                }));
            }
            // Validate ARIA attributes
            const ariaMatches = line.matchAll(/aria-[\w-]+\s*=\s*["']([^"']*)["']/g);
            for (const match of ariaMatches) {
                const fullMatch = match[0];
                const attrName = fullMatch.split('=')[0].trim();
                const attrValue = match[1];
                const validation = this.ariaValidator.validateAttribute(attrName, attrValue);
                if (!validation.isValid) {
                    issues.push(this.createIssue({
                        type: types_1.IssueType.INVALID_ARIA_ATTRIBUTE,
                        severity: types_1.AccessibilitySeverity.SERIOUS,
                        wcagLevel: types_1.WCAGLevel.A,
                        message: `Invalid ARIA attribute: ${attrName}`,
                        description: validation.recommendation || 'ARIA attribute is invalid',
                        line: lineIndex,
                        column: line.indexOf(fullMatch),
                        code: line.trim(),
                        suggestion: validation.recommendation || 'Fix or remove this ARIA attribute',
                        filePath: document.uri.fsPath
                    }));
                }
            }
            // Check for role attribute
            const roleMatch = line.match(/role\s*=\s*["']([^"']*)["']/);
            if (roleMatch) {
                const role = roleMatch[1];
                const validation = this.ariaValidator.validateRole(role);
                if (!validation.isValid) {
                    issues.push(this.createIssue({
                        type: types_1.IssueType.MISSING_ROLE,
                        severity: types_1.AccessibilitySeverity.SERIOUS,
                        wcagLevel: types_1.WCAGLevel.A,
                        message: `Invalid ARIA role: ${role}`,
                        description: 'ARIA role is not valid',
                        line: lineIndex,
                        column: line.indexOf('role'),
                        code: line.trim(),
                        suggestion: validation.recommendation || 'Use a valid ARIA role',
                        filePath: document.uri.fsPath
                    }));
                }
            }
        });
        // Check for missing lang attribute on html tag
        if (/<html[^>]*>/.test(text) && !/<html[^>]*lang\s*=/.test(text)) {
            issues.push(this.createIssue({
                type: types_1.IssueType.MISSING_LANG_ATTRIBUTE,
                severity: types_1.AccessibilitySeverity.SERIOUS,
                wcagLevel: types_1.WCAGLevel.A,
                message: 'HTML element missing lang attribute',
                description: 'The lang attribute helps screen readers pronounce content correctly',
                line: 0,
                column: 0,
                code: '<html>',
                suggestion: 'Add lang="en" (or appropriate language code) to <html> tag',
                filePath: document.uri.fsPath
            }));
        }
        return issues;
    }
    /**
     * Audit JSX/React content
     */
    async auditJSX(document) {
        const issues = [];
        const text = document.getText();
        const lines = text.split('\n');
        lines.forEach((line, lineIndex) => {
            // Check for onClick without onKeyPress
            if (/onClick\s*=/.test(line) && !/<(button|a|input|select|textarea)\s/.test(line)) {
                if (!/onKeyPress\s*=|onKeyDown\s*=|onKeyUp\s*=/.test(line)) {
                    issues.push(this.createIssue({
                        type: types_1.IssueType.KEYBOARD_TRAP,
                        severity: types_1.AccessibilitySeverity.SERIOUS,
                        wcagLevel: types_1.WCAGLevel.A,
                        message: 'onClick without keyboard handler',
                        description: 'Interactive elements with onClick should have keyboard handlers',
                        line: lineIndex,
                        column: line.indexOf('onClick'),
                        code: line.trim(),
                        suggestion: 'Add onKeyPress, onKeyDown, or use a button element',
                        filePath: document.uri.fsPath
                    }));
                }
            }
            // Check for img without alt
            if (/<img\s/.test(line) && !/alt\s*=/.test(line)) {
                issues.push(this.createIssue({
                    type: types_1.IssueType.MISSING_ALT_TEXT,
                    severity: types_1.AccessibilitySeverity.CRITICAL,
                    wcagLevel: types_1.WCAGLevel.A,
                    message: 'Image missing alt attribute',
                    description: 'All images must have an alt attribute',
                    line: lineIndex,
                    column: line.indexOf('<img'),
                    code: line.trim(),
                    suggestion: 'Add alt="descriptive text" or alt="" for decorative images',
                    filePath: document.uri.fsPath
                }));
            }
            // Check for label without htmlFor
            if (/<label[^>]*>/.test(line) && !/htmlFor\s*=/.test(line)) {
                issues.push(this.createIssue({
                    type: types_1.IssueType.MISSING_FORM_LABEL,
                    severity: types_1.AccessibilitySeverity.MODERATE,
                    wcagLevel: types_1.WCAGLevel.A,
                    message: 'Label without htmlFor attribute',
                    description: 'Labels should be associated with form inputs',
                    line: lineIndex,
                    column: line.indexOf('<label'),
                    code: line.trim(),
                    suggestion: 'Add htmlFor attribute matching the input id',
                    filePath: document.uri.fsPath
                }));
            }
        });
        return issues;
    }
    /**
     * Audit CSS for color contrast issues
     */
    async auditCSS(document) {
        const issues = [];
        const text = document.getText();
        // Extract color declarations
        const colorPairs = this.extractColorPairs(text);
        colorPairs.forEach(pair => {
            if (pair.foreground && pair.background) {
                try {
                    const result = this.colorAnalyzer.analyzeContrast(pair.foreground, pair.background);
                    if (!result.passesAA) {
                        issues.push(this.createIssue({
                            type: types_1.IssueType.LOW_COLOR_CONTRAST,
                            severity: types_1.AccessibilitySeverity.SERIOUS,
                            wcagLevel: types_1.WCAGLevel.AA,
                            message: `Low color contrast ratio: ${result.contrastRatio}:1`,
                            description: 'Color contrast does not meet WCAG AA standards (4.5:1)',
                            line: pair.line,
                            column: 0,
                            code: pair.code,
                            suggestion: `Adjust colors to achieve at least 4.5:1 contrast ratio`,
                            filePath: document.uri.fsPath
                        }));
                    }
                }
                catch (error) {
                    // Invalid color format, skip
                }
            }
        });
        return issues;
    }
    /**
     * Extract color pairs from CSS
     */
    extractColorPairs(css) {
        const pairs = [];
        const lines = css.split('\n');
        let currentFg;
        let currentBg;
        let ruleStartLine = 0;
        lines.forEach((line, index) => {
            if (/{/.test(line)) {
                ruleStartLine = index;
                currentFg = undefined;
                currentBg = undefined;
            }
            const colorMatch = line.match(/color\s*:\s*([^;]+)/i);
            if (colorMatch) {
                currentFg = colorMatch[1].trim();
            }
            const bgMatch = line.match(/background(?:-color)?\s*:\s*([^;]+)/i);
            if (bgMatch) {
                currentBg = bgMatch[1].trim();
            }
            if (/}/.test(line) && (currentFg || currentBg)) {
                pairs.push({
                    line: ruleStartLine,
                    foreground: currentFg,
                    background: currentBg,
                    code: lines.slice(ruleStartLine, index + 1).join('\n')
                });
            }
        });
        return pairs;
    }
    /**
     * Audit common accessibility issues
     */
    async auditCommonIssues(document) {
        const issues = [];
        const text = document.getText();
        const lines = text.split('\n');
        // Check for autofocus attribute
        lines.forEach((line, lineIndex) => {
            if (/autofocus|autoFocus/.test(line)) {
                issues.push(this.createIssue({
                    type: types_1.IssueType.KEYBOARD_TRAP,
                    severity: types_1.AccessibilitySeverity.MODERATE,
                    wcagLevel: types_1.WCAGLevel.A,
                    message: 'Autofocus can cause accessibility issues',
                    description: 'Autofocus can disorient keyboard and screen reader users',
                    line: lineIndex,
                    column: line.search(/autofocus|autoFocus/),
                    code: line.trim(),
                    suggestion: 'Remove autofocus or use with caution',
                    filePath: document.uri.fsPath
                }));
            }
        });
        return issues;
    }
    /**
     * Create an accessibility issue object
     */
    createIssue(params) {
        return {
            id: `${params.type}-${params.line}-${params.column}`,
            type: params.type,
            severity: params.severity,
            wcagLevel: params.wcagLevel,
            message: params.message,
            description: params.description,
            line: params.line,
            column: params.column,
            code: params.code,
            suggestion: params.suggestion,
            documentation: this.getDocumentationLink(params.type),
            filePath: params.filePath
        };
    }
    /**
     * Get documentation link for issue type
     */
    getDocumentationLink(type) {
        const baseUrl = 'https://www.w3.org/WAI/WCAG21/quickref/';
        const links = {
            [types_1.IssueType.MISSING_ALT_TEXT]: `${baseUrl}#non-text-content`,
            [types_1.IssueType.MISSING_ARIA_LABEL]: `${baseUrl}#name-role-value`,
            [types_1.IssueType.INVALID_ARIA_ATTRIBUTE]: `${baseUrl}#name-role-value`,
            [types_1.IssueType.LOW_COLOR_CONTRAST]: `${baseUrl}#contrast-minimum`,
            [types_1.IssueType.MISSING_FORM_LABEL]: `${baseUrl}#labels-or-instructions`,
            [types_1.IssueType.MISSING_HEADING_STRUCTURE]: `${baseUrl}#info-and-relationships`,
            [types_1.IssueType.MISSING_LANG_ATTRIBUTE]: `${baseUrl}#language-of-page`,
            [types_1.IssueType.KEYBOARD_TRAP]: `${baseUrl}#keyboard`,
            [types_1.IssueType.MISSING_FOCUS_INDICATOR]: `${baseUrl}#focus-visible`,
            [types_1.IssueType.IMPROPER_TAB_INDEX]: `${baseUrl}#focus-order`,
            [types_1.IssueType.MISSING_ROLE]: `${baseUrl}#name-role-value`,
            [types_1.IssueType.REDUNDANT_TITLE]: `${baseUrl}#name-role-value`,
            [types_1.IssueType.EMPTY_LINK]: `${baseUrl}#link-purpose-in-context`,
            [types_1.IssueType.EMPTY_BUTTON]: `${baseUrl}#name-role-value`
        };
        return links[type] || baseUrl;
    }
    /**
     * Update diagnostics collection
     */
    updateDiagnostics(document, issues) {
        const diagnostics = issues.map(issue => {
            const range = new vscode.Range(issue.line, issue.column, issue.line, issue.column + issue.code.length);
            const severity = this.mapSeverityToDiagnostic(issue.severity);
            const diagnostic = new vscode.Diagnostic(range, `${issue.message}: ${issue.suggestion}`, severity);
            diagnostic.code = issue.type;
            diagnostic.source = 'Accessibility Enhancer';
            return diagnostic;
        });
        this.diagnosticCollection.set(document.uri, diagnostics);
    }
    /**
     * Map custom severity to VSCode diagnostic severity
     */
    mapSeverityToDiagnostic(severity) {
        switch (severity) {
            case types_1.AccessibilitySeverity.CRITICAL:
                return vscode.DiagnosticSeverity.Error;
            case types_1.AccessibilitySeverity.SERIOUS:
                return vscode.DiagnosticSeverity.Warning;
            case types_1.AccessibilitySeverity.MODERATE:
                return vscode.DiagnosticSeverity.Information;
            case types_1.AccessibilitySeverity.MINOR:
                return vscode.DiagnosticSeverity.Hint;
            default:
                return vscode.DiagnosticSeverity.Information;
        }
    }
}
exports.AccessibilityAuditor = AccessibilityAuditor;
//# sourceMappingURL=accessibilityAuditor.js.map