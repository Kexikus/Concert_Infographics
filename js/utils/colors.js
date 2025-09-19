// Centralized Color Configuration
// This file defines all colors used throughout the application

/**
 * Main color palette for the application
 * These colors should match the CSS custom properties in styles.css
 */
const COLORS = {
    white: '#ffffff',
    black: '#000000',
    darkGrey: '#323232',
    lightGrey: '#828282',
    red: '#c80000',
    darkRed: '#640000'
};

/**
 * Color utilities and derived colors
 */
const COLOR_UTILS = {
    /**
     * Convert hex color to RGB values
     * @param {string} hex - Hex color string (e.g., '#ffffff')
     * @returns {object} RGB values {r, g, b}
     */
    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    },

    /**
     * Create rgba color string with opacity
     * @param {string} hex - Hex color string
     * @param {number} opacity - Opacity value (0-1)
     * @returns {string} rgba color string
     */
    withOpacity(hex, opacity) {
        const rgb = this.hexToRgb(hex);
        return rgb ? `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})` : hex;
    }
};

/**
 * Generate CSS custom properties for opacity variants
 * This function creates CSS custom properties that can be injected into the document
 */
const generateCSSProperties = () => {
    const properties = {
        // Base colors
        '--white': COLORS.white,
        '--black': COLORS.black,
        '--dark-grey': COLORS.darkGrey,
        '--light-grey': COLORS.lightGrey,
        '--red': COLORS.red,
        '--dark-red': COLORS.darkRed,
        
        // Opacity variants
        '--red-opacity-20': COLOR_UTILS.withOpacity(COLORS.red, 0.2),
        '--red-opacity-15': COLOR_UTILS.withOpacity(COLORS.red, 0.15),
        '--red-opacity-50': COLOR_UTILS.withOpacity(COLORS.red, 0.5),
        '--black-opacity-90': COLOR_UTILS.withOpacity(COLORS.black, 0.9),
        '--black-opacity-30': COLOR_UTILS.withOpacity(COLORS.black, 0.3),
        '--white-opacity-10': COLOR_UTILS.withOpacity(COLORS.white, 0.1)
    };
    
    return properties;
};

/**
 * Inject CSS custom properties into the document
 * This should be called when the application initializes
 */
const injectCSSProperties = () => {
    const properties = generateCSSProperties();
    const root = document.documentElement;
    
    Object.entries(properties).forEach(([property, value]) => {
        root.style.setProperty(property, value);
    });
};

// Make available globally
window.COLORS = COLORS;
window.COLOR_UTILS = COLOR_UTILS;
window.generateCSSProperties = generateCSSProperties;
window.injectCSSProperties = injectCSSProperties;