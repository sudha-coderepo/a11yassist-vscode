"use strict";
/**
 * Type Definitions and Interfaces for A11YAssist extension
 *
 * @author Sudha Rajendran and Rohitha Janga
 * @institution Ontario Tech University
 * @description Comprehensive type definitions for accessibility features
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerbosityLevel = exports.IssueType = exports.WCAGLevel = exports.AccessibilitySeverity = void 0;
/**
 * Severity levels for accessibility issues
 */
var AccessibilitySeverity;
(function (AccessibilitySeverity) {
    AccessibilitySeverity["CRITICAL"] = "critical";
    AccessibilitySeverity["SERIOUS"] = "serious";
    AccessibilitySeverity["MODERATE"] = "moderate";
    AccessibilitySeverity["MINOR"] = "minor";
})(AccessibilitySeverity || (exports.AccessibilitySeverity = AccessibilitySeverity = {}));
/**
 * WCAG 2.1 Conformance Levels
 */
var WCAGLevel;
(function (WCAGLevel) {
    WCAGLevel["A"] = "A";
    WCAGLevel["AA"] = "AA";
    WCAGLevel["AAA"] = "AAA";
})(WCAGLevel || (exports.WCAGLevel = WCAGLevel = {}));
/**
 * Accessibility issue types based on WCAG 2.1 guidelines
 */
var IssueType;
(function (IssueType) {
    IssueType["MISSING_ALT_TEXT"] = "missing-alt-text";
    IssueType["MISSING_ARIA_LABEL"] = "missing-aria-label";
    IssueType["INVALID_ARIA_ATTRIBUTE"] = "invalid-aria-attribute";
    IssueType["LOW_COLOR_CONTRAST"] = "low-color-contrast";
    IssueType["MISSING_FORM_LABEL"] = "missing-form-label";
    IssueType["MISSING_HEADING_STRUCTURE"] = "missing-heading-structure";
    IssueType["MISSING_LANG_ATTRIBUTE"] = "missing-lang-attribute";
    IssueType["KEYBOARD_TRAP"] = "keyboard-trap";
    IssueType["MISSING_FOCUS_INDICATOR"] = "missing-focus-indicator";
    IssueType["IMPROPER_TAB_INDEX"] = "improper-tab-index";
    IssueType["MISSING_ROLE"] = "missing-role";
    IssueType["REDUNDANT_TITLE"] = "redundant-title";
    IssueType["EMPTY_LINK"] = "empty-link";
    IssueType["EMPTY_BUTTON"] = "empty-button";
})(IssueType || (exports.IssueType = IssueType = {}));
/**
 * Configuration for screen reader verbosity
 */
var VerbosityLevel;
(function (VerbosityLevel) {
    VerbosityLevel["MINIMAL"] = "minimal";
    VerbosityLevel["NORMAL"] = "normal";
    VerbosityLevel["VERBOSE"] = "verbose";
})(VerbosityLevel || (exports.VerbosityLevel = VerbosityLevel = {}));
//# sourceMappingURL=index.js.map