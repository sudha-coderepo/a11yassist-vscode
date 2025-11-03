/**
 * Color Contrast Analyzer Utility
 *
 * @author Sudha Rajendran and Rohitha Janga
 * @institution Ontario Tech University
 * @description Analyzes color contrast ratios according to WCAG 2.1 guidelines
 */

import { ColorContrastResult } from '../types';

/**
 * ColorContrastAnalyzer class
 * Provides methods to calculate and validate color contrast ratios
 * according to WCAG 2.1 Level AA and AAA standards
 */
export class ColorContrastAnalyzer {
    /**
     * WCAG 2.1 contrast ratio thresholds
     */
    private static readonly WCAG_AA_NORMAL = 4.5;
    private static readonly WCAG_AA_LARGE = 3.0;
    private static readonly WCAG_AAA_NORMAL = 7.0;
    private static readonly WCAG_AAA_LARGE = 4.5;

    /**
     * Analyze color contrast between foreground and background colors
     * @param foreground - Foreground color in any CSS format
     * @param background - Background color in any CSS format
     * @returns ColorContrastResult with detailed analysis
     */
    public analyzeContrast(foreground: string, background: string): ColorContrastResult {
        const fgRgb = this.parseColor(foreground);
        const bgRgb = this.parseColor(background);

        if (!fgRgb || !bgRgb) {
            throw new Error('Invalid color format. Use hex, rgb, or rgba format.');
        }

        const contrastRatio = this.calculateContrastRatio(fgRgb, bgRgb);

        return {
            foreground,
            background,
            contrastRatio: Math.round(contrastRatio * 100) / 100,
            passesAA: contrastRatio >= ColorContrastAnalyzer.WCAG_AA_NORMAL,
            passesAAA: contrastRatio >= ColorContrastAnalyzer.WCAG_AAA_NORMAL,
            passesAALarge: contrastRatio >= ColorContrastAnalyzer.WCAG_AA_LARGE,
            passesAAALarge: contrastRatio >= ColorContrastAnalyzer.WCAG_AAA_LARGE
        };
    }

    /**
     * Calculate contrast ratio between two RGB colors
     * Formula: (L1 + 0.05) / (L2 + 0.05) where L1 is the lighter color
     */
    private calculateContrastRatio(rgb1: RGB, rgb2: RGB): number {
        const l1 = this.getRelativeLuminance(rgb1);
        const l2 = this.getRelativeLuminance(rgb2);

        const lighter = Math.max(l1, l2);
        const darker = Math.min(l1, l2);

        return (lighter + 0.05) / (darker + 0.05);
    }

    /**
     * Calculate relative luminance of an RGB color
     * Formula from WCAG 2.1: https://www.w3.org/WAI/GL/wiki/Relative_luminance
     */
    private getRelativeLuminance(rgb: RGB): number {
        const rsRGB = rgb.r / 255;
        const gsRGB = rgb.g / 255;
        const bsRGB = rgb.b / 255;

        const r = rsRGB <= 0.03928 ? rsRGB / 12.92 : Math.pow((rsRGB + 0.055) / 1.055, 2.4);
        const g = gsRGB <= 0.03928 ? gsRGB / 12.92 : Math.pow((gsRGB + 0.055) / 1.055, 2.4);
        const b = bsRGB <= 0.03928 ? bsRGB / 12.92 : Math.pow((bsRGB + 0.055) / 1.055, 2.4);

        return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    }

    /**
     * Parse color string to RGB values
     * Supports hex (#RRGGBB, #RGB), rgb(r,g,b), and rgba(r,g,b,a) formats
     */
    private parseColor(color: string): RGB | null {
        color = color.trim();

        // Hex format (#RRGGBB or #RGB)
        if (color.startsWith('#')) {
            return this.parseHexColor(color);
        }

        // RGB or RGBA format
        if (color.startsWith('rgb')) {
            return this.parseRgbColor(color);
        }

        // Named colors (basic set)
        const namedColors: Record<string, RGB> = {
            'white': { r: 255, g: 255, b: 255 },
            'black': { r: 0, g: 0, b: 0 },
            'red': { r: 255, g: 0, b: 0 },
            'green': { r: 0, g: 128, b: 0 },
            'blue': { r: 0, g: 0, b: 255 },
            'yellow': { r: 255, g: 255, b: 0 },
            'cyan': { r: 0, g: 255, b: 255 },
            'magenta': { r: 255, g: 0, b: 255 },
            'gray': { r: 128, g: 128, b: 128 },
            'grey': { r: 128, g: 128, b: 128 }
        };

        return namedColors[color.toLowerCase()] || null;
    }

    /**
     * Parse hex color format
     */
    private parseHexColor(hex: string): RGB | null {
        hex = hex.replace('#', '');

        // Convert 3-digit hex to 6-digit
        if (hex.length === 3) {
            hex = hex.split('').map(c => c + c).join('');
        }

        if (hex.length !== 6) {
            return null;
        }

        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);

        if (isNaN(r) || isNaN(g) || isNaN(b)) {
            return null;
        }

        return { r, g, b };
    }

    /**
     * Parse RGB/RGBA color format
     */
    private parseRgbColor(rgb: string): RGB | null {
        const matches = rgb.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);

        if (!matches) {
            return null;
        }

        const r = parseInt(matches[1]);
        const g = parseInt(matches[2]);
        const b = parseInt(matches[3]);

        if (isNaN(r) || isNaN(g) || isNaN(b)) {
            return null;
        }

        return { r, g, b };
    }

    /**
     * Extract colors from CSS code
     * Finds color properties in CSS and returns them with their line numbers
     */
    public extractColorsFromCSS(cssCode: string): Array<{
        line: number;
        property: string;
        foreground?: string;
        background?: string;
    }> {
        const results: Array<{
            line: number;
            property: string;
            foreground?: string;
            background?: string;
        }> = [];

        const lines = cssCode.split('\n');

        lines.forEach((line, index) => {
            // Find color properties
            const colorMatch = line.match(/color\s*:\s*([^;]+)/i);
            const bgColorMatch = line.match(/background(?:-color)?\s*:\s*([^;]+)/i);

            if (colorMatch || bgColorMatch) {
                results.push({
                    line: index + 1,
                    property: line.trim(),
                    foreground: colorMatch ? colorMatch[1].trim() : undefined,
                    background: bgColorMatch ? bgColorMatch[1].trim() : undefined
                });
            }
        });

        return results;
    }

    /**
     * Suggest accessible color alternatives
     */
    public suggestAccessibleColor(
        originalColor: string,
        backgroundColor: string,
        targetRatio: number = ColorContrastAnalyzer.WCAG_AA_NORMAL
    ): string | null {
        const bgRgb = this.parseColor(backgroundColor);
        if (!bgRgb) {
            return null;
        }

        const bgLuminance = this.getRelativeLuminance(bgRgb);

        // Try adjusting the lightness
        for (let lightness = 0; lightness <= 100; lightness += 5) {
            const testColor = this.adjustLightness(originalColor, lightness);
            const testRgb = this.parseColor(testColor);

            if (testRgb) {
                const ratio = this.calculateContrastRatio(testRgb, bgRgb);
                if (ratio >= targetRatio) {
                    return testColor;
                }
            }
        }

        // Fallback: suggest black or white based on background luminance
        return bgLuminance > 0.5 ? '#000000' : '#FFFFFF';
    }

    /**
     * Adjust lightness of a color
     */
    private adjustLightness(color: string, lightness: number): string {
        const rgb = this.parseColor(color);
        if (!rgb) {
            return color;
        }

        const factor = lightness / 100;
        const r = Math.round(rgb.r * factor);
        const g = Math.round(rgb.g * factor);
        const b = Math.round(rgb.b * factor);

        return `rgb(${r}, ${g}, ${b})`;
    }
}

/**
 * RGB color interface
 */
interface RGB {
    r: number;
    g: number;
    b: number;
}
