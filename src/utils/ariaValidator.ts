/**
 * ARIA Validator Utility
 *
 * @author Sudha Rajendran
 * @institution Ontario Tech University
 * @description Validates ARIA attributes and roles according to WAI-ARIA 1.2 specification
 */

import { ARIAValidationResult } from '../types';

/**
 * ARIAValidator class
 * Validates ARIA attributes, roles, and properties according to WAI-ARIA 1.2
 */
export class ARIAValidator {
    /**
     * Valid ARIA roles according to WAI-ARIA 1.2
     */
    private static readonly VALID_ROLES = [
        // Document structure roles
        'article', 'columnheader', 'definition', 'directory', 'document',
        'feed', 'figure', 'group', 'heading', 'img', 'list', 'listitem',
        'math', 'none', 'note', 'presentation', 'region', 'row',
        'rowgroup', 'rowheader', 'separator', 'table', 'term', 'toolbar',
        'tooltip',

        // Landmark roles
        'banner', 'complementary', 'contentinfo', 'form', 'main',
        'navigation', 'region', 'search',

        // Widget roles
        'alert', 'alertdialog', 'button', 'checkbox', 'dialog', 'gridcell',
        'link', 'log', 'marquee', 'menuitem', 'menuitemcheckbox',
        'menuitemradio', 'option', 'progressbar', 'radio', 'scrollbar',
        'searchbox', 'slider', 'spinbutton', 'status', 'switch', 'tab',
        'tabpanel', 'textbox', 'timer', 'tooltip', 'treeitem',

        // Composite roles
        'combobox', 'grid', 'listbox', 'menu', 'menubar', 'radiogroup',
        'tablist', 'tree', 'treegrid'
    ];

    /**
     * Valid ARIA properties and their allowed values
     */
    private static readonly ARIA_PROPERTIES: Record<string, {
        type: 'boolean' | 'tristate' | 'string' | 'token' | 'tokenlist' | 'integer' | 'number';
        allowedValues?: string[];
        description: string;
    }> = {
        'aria-activedescendant': {
            type: 'string',
            description: 'Identifies the currently active element when focus is on a composite widget'
        },
        'aria-atomic': {
            type: 'boolean',
            description: 'Indicates whether assistive technologies will present all or only parts of the changed region'
        },
        'aria-autocomplete': {
            type: 'token',
            allowedValues: ['none', 'inline', 'list', 'both'],
            description: 'Indicates whether inputting text could trigger display of suggestions'
        },
        'aria-busy': {
            type: 'boolean',
            description: 'Indicates an element is being modified and assistive technologies may want to wait'
        },
        'aria-checked': {
            type: 'tristate',
            allowedValues: ['true', 'false', 'mixed'],
            description: 'Indicates the current checked state of checkboxes, radio buttons, and other widgets'
        },
        'aria-controls': {
            type: 'tokenlist',
            description: 'Identifies the element(s) whose contents or presence are controlled by the current element'
        },
        'aria-current': {
            type: 'token',
            allowedValues: ['page', 'step', 'location', 'date', 'time', 'true', 'false'],
            description: 'Indicates the element that represents the current item within a container or set'
        },
        'aria-describedby': {
            type: 'tokenlist',
            description: 'Identifies the element(s) that describes the object'
        },
        'aria-details': {
            type: 'tokenlist',
            description: 'Identifies the element that provides a detailed description'
        },
        'aria-disabled': {
            type: 'boolean',
            description: 'Indicates that the element is perceivable but disabled'
        },
        'aria-expanded': {
            type: 'boolean',
            description: 'Indicates whether the element is expanded or collapsed'
        },
        'aria-haspopup': {
            type: 'token',
            allowedValues: ['false', 'true', 'menu', 'listbox', 'tree', 'grid', 'dialog'],
            description: 'Indicates the availability and type of interactive popup element'
        },
        'aria-hidden': {
            type: 'boolean',
            description: 'Indicates whether the element is exposed to an accessibility API'
        },
        'aria-invalid': {
            type: 'token',
            allowedValues: ['false', 'true', 'grammar', 'spelling'],
            description: 'Indicates the entered value does not conform to the format expected'
        },
        'aria-label': {
            type: 'string',
            description: 'Defines a string value that labels the current element'
        },
        'aria-labelledby': {
            type: 'tokenlist',
            description: 'Identifies the element(s) that labels the current element'
        },
        'aria-level': {
            type: 'integer',
            description: 'Defines the hierarchical level of an element within a structure'
        },
        'aria-live': {
            type: 'token',
            allowedValues: ['off', 'polite', 'assertive'],
            description: 'Indicates that an element will be updated, and describes the types of updates'
        },
        'aria-modal': {
            type: 'boolean',
            description: 'Indicates whether an element is modal when displayed'
        },
        'aria-multiline': {
            type: 'boolean',
            description: 'Indicates whether a text box accepts multiple lines of input'
        },
        'aria-multiselectable': {
            type: 'boolean',
            description: 'Indicates that the user may select more than one item'
        },
        'aria-orientation': {
            type: 'token',
            allowedValues: ['horizontal', 'vertical', 'undefined'],
            description: 'Indicates whether the element\'s orientation is horizontal or vertical'
        },
        'aria-placeholder': {
            type: 'string',
            description: 'Defines a short hint intended to aid the user with data entry'
        },
        'aria-pressed': {
            type: 'tristate',
            allowedValues: ['true', 'false', 'mixed'],
            description: 'Indicates the current pressed state of toggle buttons'
        },
        'aria-readonly': {
            type: 'boolean',
            description: 'Indicates that the element is not editable, but is otherwise operable'
        },
        'aria-required': {
            type: 'boolean',
            description: 'Indicates that user input is required on the element before form submission'
        },
        'aria-selected': {
            type: 'boolean',
            description: 'Indicates the current selected state of various widgets'
        },
        'aria-valuemax': {
            type: 'number',
            description: 'Defines the maximum allowed value for a range widget'
        },
        'aria-valuemin': {
            type: 'number',
            description: 'Defines the minimum allowed value for a range widget'
        },
        'aria-valuenow': {
            type: 'number',
            description: 'Defines the current value for a range widget'
        },
        'aria-valuetext': {
            type: 'string',
            description: 'Defines the human readable text alternative of aria-valuenow'
        }
    };

    /**
     * Interactive elements that should have accessible names
     */
    private static readonly INTERACTIVE_ELEMENTS = [
        'a', 'button', 'input', 'select', 'textarea', 'summary'
    ];

    /**
     * Validate an ARIA role
     */
    public validateRole(role: string): ARIAValidationResult {
        const isValid = ARIAValidator.VALID_ROLES.includes(role);

        return {
            isValid,
            attribute: 'role',
            value: role,
            allowedValues: ARIAValidator.VALID_ROLES,
            recommendation: isValid
                ? undefined
                : `'${role}' is not a valid ARIA role. Use one of the standard WAI-ARIA roles.`
        };
    }

    /**
     * Validate an ARIA attribute
     */
    public validateAttribute(attributeName: string, value: string): ARIAValidationResult {
        // Check if attribute exists
        if (!attributeName.startsWith('aria-')) {
            return {
                isValid: false,
                attribute: attributeName,
                value,
                recommendation: 'Attribute name must start with "aria-"'
            };
        }

        const propName = attributeName;
        const property = ARIAValidator.ARIA_PROPERTIES[propName];

        if (!property) {
            return {
                isValid: false,
                attribute: attributeName,
                value,
                recommendation: `'${attributeName}' is not a valid ARIA attribute`
            };
        }

        // Validate value based on type
        switch (property.type) {
            case 'boolean':
                return this.validateBooleanValue(attributeName, value, property.allowedValues);

            case 'tristate':
                return this.validateTristateValue(attributeName, value);

            case 'token':
                return this.validateTokenValue(attributeName, value, property.allowedValues || []);

            case 'tokenlist':
                return this.validateTokenListValue(attributeName, value);

            case 'integer':
                return this.validateIntegerValue(attributeName, value);

            case 'number':
                return this.validateNumberValue(attributeName, value);

            case 'string':
                return this.validateStringValue(attributeName, value);

            default:
                return {
                    isValid: true,
                    attribute: attributeName,
                    value
                };
        }
    }

    /**
     * Validate boolean ARIA value
     */
    private validateBooleanValue(
        attribute: string,
        value: string,
        allowedValues?: string[]
    ): ARIAValidationResult {
        const validValues = allowedValues || ['true', 'false'];
        const isValid = validValues.includes(value.toLowerCase());

        return {
            isValid,
            attribute,
            value,
            allowedValues: validValues,
            recommendation: isValid
                ? undefined
                : `Value must be one of: ${validValues.join(', ')}`
        };
    }

    /**
     * Validate tristate ARIA value
     */
    private validateTristateValue(attribute: string, value: string): ARIAValidationResult {
        const validValues = ['true', 'false', 'mixed'];
        const isValid = validValues.includes(value.toLowerCase());

        return {
            isValid,
            attribute,
            value,
            allowedValues: validValues,
            recommendation: isValid
                ? undefined
                : `Value must be one of: ${validValues.join(', ')}`
        };
    }

    /**
     * Validate token ARIA value
     */
    private validateTokenValue(
        attribute: string,
        value: string,
        allowedValues: string[]
    ): ARIAValidationResult {
        const isValid = allowedValues.includes(value.toLowerCase());

        return {
            isValid,
            attribute,
            value,
            allowedValues,
            recommendation: isValid
                ? undefined
                : `Value must be one of: ${allowedValues.join(', ')}`
        };
    }

    /**
     * Validate token list ARIA value (space-separated IDs)
     */
    private validateTokenListValue(attribute: string, value: string): ARIAValidationResult {
        const tokens = value.trim().split(/\s+/);
        const isValid = tokens.every(token => /^[a-zA-Z][\w\-:.]*$/.test(token));

        return {
            isValid,
            attribute,
            value,
            recommendation: isValid
                ? undefined
                : 'Value must be a space-separated list of valid ID references'
        };
    }

    /**
     * Validate integer ARIA value
     */
    private validateIntegerValue(attribute: string, value: string): ARIAValidationResult {
        const isValid = /^-?\d+$/.test(value);

        return {
            isValid,
            attribute,
            value,
            recommendation: isValid
                ? undefined
                : 'Value must be an integer'
        };
    }

    /**
     * Validate number ARIA value
     */
    private validateNumberValue(attribute: string, value: string): ARIAValidationResult {
        const isValid = !isNaN(parseFloat(value));

        return {
            isValid,
            attribute,
            value,
            recommendation: isValid
                ? undefined
                : 'Value must be a valid number'
        };
    }

    /**
     * Validate string ARIA value
     */
    private validateStringValue(attribute: string, value: string): ARIAValidationResult {
        const isValid = value.trim().length > 0;

        return {
            isValid,
            attribute,
            value,
            recommendation: isValid
                ? undefined
                : 'Value must be a non-empty string'
        };
    }

    /**
     * Check if an element needs an accessible name
     */
    public needsAccessibleName(tagName: string, role?: string): boolean {
        // Check if it's an interactive element
        if (ARIAValidator.INTERACTIVE_ELEMENTS.includes(tagName.toLowerCase())) {
            return true;
        }

        // Check if role requires accessible name
        const rolesRequiringName = [
            'button', 'link', 'checkbox', 'radio', 'textbox', 'combobox',
            'listbox', 'option', 'tab', 'menuitem', 'slider', 'switch'
        ];

        return role ? rolesRequiringName.includes(role) : false;
    }

    /**
     * Extract ARIA attributes from HTML element string
     */
    public extractARIAAttributes(elementString: string): Record<string, string> {
        const ariaAttrs: Record<string, string> = {};
        const ariaRegex = /aria-[\w-]+\s*=\s*["']([^"']*)["']/g;
        let match;

        while ((match = ariaRegex.exec(elementString)) !== null) {
            const fullMatch = match[0];
            const attrName = fullMatch.split('=')[0].trim();
            const attrValue = match[1];
            ariaAttrs[attrName] = attrValue;
        }

        // Also check for role attribute
        const roleMatch = elementString.match(/role\s*=\s*["']([^"']*)["']/);
        if (roleMatch) {
            ariaAttrs['role'] = roleMatch[1];
        }

        return ariaAttrs;
    }

    /**
     * Get recommended ARIA attributes for an element
     */
    public getRecommendedAttributes(tagName: string, role?: string): string[] {
        const recommendations: string[] = [];

        // Based on element type or role, suggest appropriate ARIA attributes
        if (tagName === 'button' || role === 'button') {
            recommendations.push('aria-pressed (for toggle buttons)');
            recommendations.push('aria-expanded (for disclosure buttons)');
        }

        if (tagName === 'input') {
            recommendations.push('aria-label or aria-labelledby');
            recommendations.push('aria-required (if required)');
            recommendations.push('aria-invalid (for validation)');
        }

        if (role === 'dialog') {
            recommendations.push('aria-modal');
            recommendations.push('aria-labelledby or aria-label');
        }

        if (role === 'region') {
            recommendations.push('aria-labelledby or aria-label');
        }

        return recommendations;
    }
}
