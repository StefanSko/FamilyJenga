// ABOUTME: Comprehensive error handling system with user-friendly feedback
// ABOUTME: Provides ErrorDisplay class and constraint error formatting functions

class ErrorDisplay {
    constructor() {
        this.messageCounter = 0;
    }
    
    /**
     * Show an error message in the target element
     * @param {string} message - The error message to display
     * @param {string} type - Error type: 'validation', 'error', 'success', 'info'
     * @param {HTMLElement} targetElement - The element to display the message in
     * @returns {HTMLElement} The created message element
     */
    showError(message, type, targetElement) {
        if (!targetElement) {
            console.error('ErrorDisplay.showError: targetElement is required');
            return null;
        }
        
        // Create message element
        const messageElement = document.createElement('div');
        messageElement.className = `error-message ${type}`;
        messageElement.setAttribute('data-message-id', ++this.messageCounter);
        
        // Add icon based on type
        const icon = this.getIconForType(type);
        if (icon) {
            const iconElement = document.createElement('span');
            iconElement.className = 'error-icon';
            iconElement.textContent = icon;
            messageElement.appendChild(iconElement);
        }
        
        // Add message content
        const contentElement = document.createElement('span');
        contentElement.className = 'error-content';
        contentElement.textContent = message;
        messageElement.appendChild(contentElement);
        
        // Add close button for persistent messages
        if (type === 'error' || type === 'validation') {
            const closeButton = document.createElement('button');
            closeButton.className = 'error-close';
            closeButton.textContent = '×';
            closeButton.setAttribute('aria-label', 'Close error message');
            closeButton.addEventListener('click', () => {
                this.removeMessage(messageElement);
            });
            messageElement.appendChild(closeButton);
        }
        
        // Add to target with animation
        messageElement.style.opacity = '0';
        messageElement.style.transform = 'translateY(-10px)';
        targetElement.appendChild(messageElement);
        
        // Trigger animation
        requestAnimationFrame(() => {
            messageElement.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            messageElement.style.opacity = '1';
            messageElement.style.transform = 'translateY(0)';
        });
        
        // Auto-dismiss success messages after 3 seconds
        if (type === 'success') {
            setTimeout(() => {
                this.removeMessage(messageElement);
            }, 3000);
        }
        
        return messageElement;
    }
    
    /**
     * Show a success message (convenience method)
     * @param {string} message - The success message to display
     * @param {HTMLElement} targetElement - The element to display the message in
     * @returns {HTMLElement} The created message element
     */
    showSuccess(message, targetElement) {
        return this.showError(message, 'success', targetElement);
    }
    
    /**
     * Clear all error messages from the target element
     * @param {HTMLElement} targetElement - The element to clear messages from
     */
    clearError(targetElement) {
        if (!targetElement) {
            console.error('ErrorDisplay.clearError: targetElement is required');
            return;
        }
        
        const errorMessages = targetElement.querySelectorAll('.error-message');
        errorMessages.forEach(message => {
            this.removeMessage(message);
        });
    }
    
    /**
     * Clear specific type of messages from the target element
     * @param {HTMLElement} targetElement - The element to clear messages from
     * @param {string} type - The type of messages to clear
     */
    clearErrorsByType(targetElement, type) {
        if (!targetElement) {
            console.error('ErrorDisplay.clearErrorsByType: targetElement is required');
            return;
        }
        
        const errorMessages = targetElement.querySelectorAll(`.error-message.${type}`);
        errorMessages.forEach(message => {
            this.removeMessage(message);
        });
    }
    
    /**
     * Remove a message element with animation
     * @param {HTMLElement} messageElement - The message element to remove
     */
    removeMessage(messageElement) {
        if (!messageElement || !messageElement.parentNode) {
            return;
        }
        
        messageElement.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        messageElement.style.opacity = '0';
        messageElement.style.transform = 'translateY(-10px)';
        
        setTimeout(() => {
            if (messageElement.parentNode) {
                messageElement.parentNode.removeChild(messageElement);
            }
        }, 300);
    }
    
    /**
     * Get icon for error type
     * @param {string} type - Error type
     * @returns {string} Icon character
     */
    getIconForType(type) {
        const icons = {
            'validation': '⚠️',
            'error': '❌',
            'success': '✅',
            'info': 'ℹ️'
        };
        return icons[type] || '';
    }
}

/**
 * Format a constraint error into a human-readable message
 * @param {Object} constraint - The constraint object with guestA and guestB
 * @param {string} reason - The specific reason the constraint failed
 * @returns {string} Formatted error message
 */
function formatConstraintError(constraint, reason) {
    if (!constraint || !constraint.guestA || !constraint.guestB) {
        return reason || 'Unknown constraint error';
    }
    
    return `Cannot seat ${constraint.guestA} next to ${constraint.guestB}: ${reason}`;
}

/**
 * Create a standardized error result object
 * @param {boolean} isValid - Whether the validation passed
 * @param {Array} errors - Array of error objects with field, message, and type
 * @param {Array} warnings - Array of warning objects (optional)
 * @returns {Object} Standardized error result
 */
function createErrorResult(isValid, errors = [], warnings = []) {
    return {
        isValid: Boolean(isValid),
        errors: errors.map(error => ({
            field: error.field || 'unknown',
            message: error.message || 'Unknown error',
            type: error.type || 'error'
        })),
        warnings: warnings.map(warning => ({
            field: warning.field || 'unknown',
            message: warning.message || 'Unknown warning',
            type: warning.type || 'warning'
        }))
    };
}

/**
 * Validate error object structure
 * @param {Object} errorResult - Error result to validate
 * @returns {boolean} True if structure is valid
 */
function isValidErrorResult(errorResult) {
    if (!errorResult || typeof errorResult !== 'object') {
        return false;
    }
    
    if (!Object.prototype.hasOwnProperty.call(errorResult, 'isValid') || typeof errorResult.isValid !== 'boolean') {
        return false;
    }
    
    if (!Array.isArray(errorResult.errors)) {
        return false;
    }
    
    // Validate error objects structure
    return errorResult.errors.every(error => 
        error && 
        typeof error === 'object' &&
        typeof error.field === 'string' &&
        typeof error.message === 'string' &&
        typeof error.type === 'string'
    );
}

/**
 * Get user-friendly suggestions for common error types
 * @param {string} errorType - The type of error
 * @param {Object} context - Additional context for suggestions
 * @returns {string} User-friendly suggestion
 */
function getErrorSuggestion(errorType) {
    const suggestions = {
        'duplicate_guests': 'Remove duplicate names from the guest list or use different spellings.',
        'guest_count_mismatch': 'Adjust the number of seats or the number of guests to match.',
        'impossible_constraint': 'Try removing some adjacency constraints or changing fixed seat assignments.',
        'invalid_table_config': 'Ensure all seat counts are positive integers and the total is reasonable.',
        'generation_timeout': 'Simplify constraints or increase table size for easier placement.',
        'no_valid_placement': 'Check that fixed assignments don\'t conflict with adjacency requirements.'
    };
    
    return suggestions[errorType] || 'Please review your configuration and try again.';
}

/**
 * Create a detailed error message with suggestions
 * @param {string} mainMessage - The main error message
 * @param {string} errorType - The type of error for suggestions
 * @param {Object} context - Additional context
 * @returns {string} Detailed error message with suggestions
 */
function createDetailedErrorMessage(mainMessage, errorType) {
    const suggestion = getErrorSuggestion(errorType);
    
    if (suggestion) {
        return `${mainMessage}\n\nSuggestion: ${suggestion}`;
    }
    
    return mainMessage;
}

// Export for Node.js environment if available
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        ErrorDisplay,
        formatConstraintError,
        createErrorResult,
        isValidErrorResult,
        getErrorSuggestion,
        createDetailedErrorMessage
    };
}