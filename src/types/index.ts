/**
 * Type Definitions and Interfaces for A11YAssist extension
 *
 * @author Sudha Rajendran
 * @institution Ontario Tech University
 * @description Comprehensive type definitions for accessibility features
 */

import * as vscode from 'vscode';

/**
 * Severity levels for accessibility issues
 */
export enum AccessibilitySeverity {
    CRITICAL = 'critical',
    SERIOUS = 'serious',
    MODERATE = 'moderate',
    MINOR = 'minor'
}

/**
 * WCAG 2.1 Conformance Levels
 */
export enum WCAGLevel {
    A = 'A',
    AA = 'AA',
    AAA = 'AAA'
}

/**
 * Accessibility issue types based on WCAG 2.1 guidelines
 */
export enum IssueType {
    MISSING_ALT_TEXT = 'missing-alt-text',
    MISSING_ARIA_LABEL = 'missing-aria-label',
    INVALID_ARIA_ATTRIBUTE = 'invalid-aria-attribute',
    LOW_COLOR_CONTRAST = 'low-color-contrast',
    MISSING_FORM_LABEL = 'missing-form-label',
    MISSING_HEADING_STRUCTURE = 'missing-heading-structure',
    MISSING_LANG_ATTRIBUTE = 'missing-lang-attribute',
    KEYBOARD_TRAP = 'keyboard-trap',
    MISSING_FOCUS_INDICATOR = 'missing-focus-indicator',
    IMPROPER_TAB_INDEX = 'improper-tab-index',
    MISSING_ROLE = 'missing-role',
    REDUNDANT_TITLE = 'redundant-title',
    EMPTY_LINK = 'empty-link',
    EMPTY_BUTTON = 'empty-button'
}

/**
 * Represents an accessibility issue found in the code
 */
export interface AccessibilityIssue {
    id: string;
    type: IssueType;
    severity: AccessibilitySeverity;
    wcagLevel: WCAGLevel;
    message: string;
    description: string;
    line: number;
    column: number;
    code: string;
    suggestion: string;
    documentation: string;
    filePath: string;
}

/**
 * Represents the result of an accessibility audit
 */
export interface AccessibilityAuditResult {
    timestamp: string;
    fileName: string;
    filePath: string;
    totalIssues: number;
    criticalCount: number;
    seriousCount: number;
    moderateCount: number;
    minorCount: number;
    issues: AccessibilityIssue[];
    wcagCompliance: {
        levelA: boolean;
        levelAA: boolean;
        levelAAA: boolean;
    };
}

/**
 * Configuration for screen reader verbosity
 */
export enum VerbosityLevel {
    MINIMAL = 'minimal',
    NORMAL = 'normal',
    VERBOSE = 'verbose'
}

/**
 * Screen reader announcement
 */
export interface ScreenReaderAnnouncement {
    message: string;
    priority: 'polite' | 'assertive';
    context?: string;
}

/**
 * Keyboard navigation shortcut
 */
export interface KeyboardShortcut {
    key: string;
    command: string;
    description: string;
    category: string;
    when?: string;
}

/**
 * Contextual guidance information
 */
export interface ContextualGuidance {
    title: string;
    description: string;
    tips: string[];
    resources: GuidanceResource[];
    applicableElements: string[];
}

/**
 * Guidance resource link
 */
export interface GuidanceResource {
    title: string;
    url: string;
    type: 'documentation' | 'tutorial' | 'example' | 'standard';
}

/**
 * Analytics event
 */
export interface AnalyticsEvent {
    eventName: string;
    timestamp: string;
    properties?: Record<string, any>;
}

/**
 * User feedback
 */
export interface UserFeedback {
    type: string;
    content: string;
    timestamp: string;
    userAgent?: string;
    extensionVersion?: string;
}

/**
 * Usage statistics
 */
export interface UsageStatistics {
    totalAuditsRun: number;
    totalIssuesFound: number;
    totalIssuesFixed: number;
    featuresUsed: Record<string, number>;
    lastUsed: string;
}

/**
 * Color contrast result
 */
export interface ColorContrastResult {
    foreground: string;
    background: string;
    contrastRatio: number;
    passesAA: boolean;
    passesAAA: boolean;
    passesAALarge: boolean;
    passesAAALarge: boolean;
}

/**
 * ARIA attribute validation result
 */
export interface ARIAValidationResult {
    isValid: boolean;
    attribute: string;
    value: string;
    allowedValues?: string[];
    recommendation?: string;
}

/**
 * HTML element analysis
 */
export interface ElementAnalysis {
    tagName: string;
    attributes: Record<string, string>;
    hasAccessibleName: boolean;
    hasRole: boolean;
    isFocusable: boolean;
    isInteractive: boolean;
    ariaAttributes: string[];
    issues: AccessibilityIssue[];
}

/**
 * Extension configuration
 */
export interface ExtensionConfig {
    enableScreenReaderEnhancements: boolean;
    enableContextualGuidance: boolean;
    enableAnalytics: boolean;
    highContrastMode: boolean;
    verbosityLevel: VerbosityLevel;
    enableKeyboardNavigation: boolean;
    announceEditorChanges: boolean;
    cognitiveLoadReduction: boolean;
}

/**
 * Tree view item for accessibility issues
 */
export interface IssueTreeItem {
    issue: AccessibilityIssue;
    treeItem: vscode.TreeItem;
}
