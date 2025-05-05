/**
 * Logger utility for consistent application logging
 * Can be enabled/disabled based on environment or flag
 */

// Environment flag - disable logging in production
const IS_PRODUCTION = import.meta.env.PROD;

// Global toggle to enable/disable all logging
let loggingEnabled = !IS_PRODUCTION;

/**
 * Logger object with methods that match console but can be disabled
 */
export const logger = {
    // Get or set the logging enabled state
    isEnabled: () => loggingEnabled,
    enable: () => { loggingEnabled = true; },
    disable: () => { loggingEnabled = false; },

    // Log methods that proxy to console
    log: (...args: any[]) => {
        if (loggingEnabled) console.log(...args);
    },
    
    debug: (...args: any[]) => {
        if (loggingEnabled) console.debug('[DEBUG]', ...args);
    },
    
    info: (...args: any[]) => {
        if (loggingEnabled) console.info('[INFO]', ...args);
    },
    
    warn: (...args: any[]) => {
        if (loggingEnabled) console.warn('[WARN]', ...args);
    },
    
    error: (...args: any[]) => {
        // Errors are always logged, even if general logging is disabled
        console.error('[ERROR]', ...args);
    },
    
    // Group methods
    group: (label: string) => {
        if (loggingEnabled) console.group(label);
    },
    
    groupEnd: () => {
        if (loggingEnabled) console.groupEnd();
    },
    
    // Timer methods
    time: (label: string) => {
        if (loggingEnabled) console.time(label);
    },
    
    timeEnd: (label: string) => {
        if (loggingEnabled) console.timeEnd(label);
    }
};

// Export a convenience method to toggle logging
export function toggleLogging(): boolean {
    loggingEnabled = !loggingEnabled;
    return loggingEnabled;
} 