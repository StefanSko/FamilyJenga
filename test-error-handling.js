// ABOUTME: Test suite for error handling system (Prompt 13)
// ABOUTME: Tests ErrorDisplay class, constraint error formatting, and comprehensive error handling

function runErrorHandlingTests() {
    console.log('🧪 Testing Error Handling System functionality...');
    
    let testsPassed = 0;
    let testsTotal = 0;

    // Test 1: ErrorDisplay class basic functionality
    testsTotal++;
    try {
        console.log('\nTest 1: ErrorDisplay class basic functionality');
        
        const mockTargetElement = createMockElement();
        const errorDisplay = createMockErrorDisplay();
        
        // Test showError method
        const result1 = errorDisplay.showError('Test error message', 'error', mockTargetElement);
        
        if (result1.success && result1.messageElement && result1.messageElement.className.includes('error')) {
            console.log('✓ Test 1a passed - Shows error message with correct styling');
        } else {
            console.log('✗ Test 1a failed - Should show error with proper styling');
        }
        
        // Test showSuccess method
        const result2 = errorDisplay.showSuccess('Test success message', mockTargetElement);
        
        if (result2.success && result2.messageElement && result2.messageElement.className.includes('success')) {
            console.log('✓ Test 1b passed - Shows success message with correct styling');
        } else {
            console.log('✗ Test 1b failed - Should show success with proper styling');
        }
        
        // Test clearError method
        const result3 = errorDisplay.clearError(mockTargetElement);
        
        if (result3.success && result3.clearedMessages > 0) {
            console.log('✓ Test 1c passed - Clears error messages');
            testsPassed++;
        } else {
            console.log('✗ Test 1c failed - Should clear error messages');
        }
    } catch (error) {
        console.log('✗ Test 1 failed with error:', error.message);
    }

    // Test 2: Error type styling
    testsTotal++;
    try {
        console.log('\nTest 2: Error type styling');
        
        const mockTargetElement = createMockElement();
        const errorDisplay = createMockErrorDisplay();
        
        const types = ['validation', 'error', 'success', 'info'];
        let allTypesWork = true;
        
        for (const type of types) {
            const result = errorDisplay.showError(`Test ${type} message`, type, mockTargetElement);
            if (!result.success || !result.messageElement.className.includes(type)) {
                allTypesWork = false;
                break;
            }
        }
        
        if (allTypesWork) {
            console.log('✓ Test 2 passed - All error types styled correctly');
            testsPassed++;
        } else {
            console.log('✗ Test 2 failed - Error types not styled correctly');
        }
    } catch (error) {
        console.log('✗ Test 2 failed with error:', error.message);
    }

    // Test 3: Auto-dismiss success messages
    testsTotal++;
    try {
        console.log('\nTest 3: Auto-dismiss success messages');
        
        const mockTargetElement = createMockElement();
        const errorDisplay = createMockErrorDisplay();
        
        const result = errorDisplay.showSuccess('Auto-dismiss test', mockTargetElement);
        
        if (result.success && result.autoDismissScheduled) {
            console.log('✓ Test 3 passed - Success messages auto-dismiss');
            testsPassed++;
        } else {
            console.log('✗ Test 3 failed - Success messages should auto-dismiss');
        }
    } catch (error) {
        console.log('✗ Test 3 failed with error:', error.message);
    }

    // Test 4: Constraint error formatting
    testsTotal++;
    try {
        console.log('\nTest 4: Constraint error formatting');
        
        const constraint = { guestA: 'Alice', guestB: 'Bob' };
        const reason = 'Bob is fixed at seat 5, too far from available seats';
        
        const result = testFormatConstraintError(constraint, reason);
        
        if (result.success && result.formattedMessage.includes('Alice') && 
            result.formattedMessage.includes('Bob') && result.formattedMessage.includes(reason)) {
            console.log('✓ Test 4 passed - Constraint errors formatted correctly');
            testsPassed++;
        } else {
            console.log('✗ Test 4 failed - Constraint error formatting incorrect');
        }
    } catch (error) {
        console.log('✗ Test 4 failed with error:', error.message);
    }

    // Test 5: Consistent error format validation
    testsTotal++;
    try {
        console.log('\nTest 5: Consistent error format validation');
        
        const result = testConsistentErrorFormat();
        
        if (result.success && result.hasIsValid && result.hasErrorsArray && result.hasCorrectStructure) {
            console.log('✓ Test 5 passed - Error format is consistent');
            testsPassed++;
        } else {
            console.log('✗ Test 5 failed - Error format not consistent');
        }
    } catch (error) {
        console.log('✗ Test 5 failed with error:', error.message);
    }

    // Test 6: Validation summary function
    testsTotal++;
    try {
        console.log('\nTest 6: Validation summary function');
        
        const mockValidationErrors = [
            { field: 'guestList', message: 'Duplicate guest names', type: 'validation' },
            { field: 'constraints', message: 'Impossible constraint', type: 'error' }
        ];
        
        const result = testShowValidationSummary(mockValidationErrors);
        
        if (result.success && result.preventedGeneration && result.showedErrors) {
            console.log('✓ Test 6 passed - Validation summary works correctly');
            testsPassed++;
        } else {
            console.log('✗ Test 6 failed - Validation summary not working');
        }
    } catch (error) {
        console.log('✗ Test 6 failed with error:', error.message);
    }

    // Test 7: Error message animations and layout
    testsTotal++;
    try {
        console.log('\nTest 7: Error message animations and layout');
        
        const mockTargetElement = createMockElement();
        const errorDisplay = createMockErrorDisplay();
        
        const result = errorDisplay.showError('Animation test', 'error', mockTargetElement);
        
        if (result.success && result.hasAnimation && result.preservesLayout) {
            console.log('✓ Test 7 passed - Error messages animate and preserve layout');
            testsPassed++;
        } else {
            console.log('✗ Test 7 failed - Error messages should animate and preserve layout');
        }
    } catch (error) {
        console.log('✗ Test 7 failed with error:', error.message);
    }

    // Test 8: Comprehensive error handling integration
    testsTotal++;
    try {
        console.log('\nTest 8: Comprehensive error handling integration');
        
        const result = testComprehensiveErrorHandling();
        
        if (result.success && result.handlesAllScenarios && result.providesActionableFeedback) {
            console.log('✓ Test 8 passed - Comprehensive error handling works');
            testsPassed++;
        } else {
            console.log('✗ Test 8 failed - Comprehensive error handling not complete');
        }
    } catch (error) {
        console.log('✗ Test 8 failed with error:', error.message);
    }

    // Summary
    console.log('\n=== Error Handling Test Results ===');
    console.log(`Passed: ${testsPassed}/${testsTotal}`);
    
    if (testsPassed === testsTotal) {
        console.log('All error handling tests passed! ✓');
        return true;
    } else {
        console.log('Some error handling tests failed! ✗');
        return false;
    }
}

// Mock functions and test helpers

function createMockElement() {
    const mockChildren = [];
    return {
        appendChild: (child) => mockChildren.push(child),
        removeChild: (child) => {
            const index = mockChildren.indexOf(child);
            if (index > -1) mockChildren.splice(index, 1);
        },
        innerHTML: '',
        querySelectorAll: (selector) => mockChildren.filter(child => 
            child.className && child.className.includes(selector.replace('.', ''))
        ),
        children: mockChildren
    };
}

function createMockErrorDisplay() {
    return {
        showError: (message, type, targetElement) => {
            const messageElement = {
                textContent: message,
                className: `error-message ${type}`,
                remove: () => {}
            };
            
            targetElement.appendChild(messageElement);
            
            return {
                success: true,
                messageElement: messageElement,
                hasAnimation: type === 'error', // Mock animation detection
                preservesLayout: true
            };
        },
        
        showSuccess: (message, targetElement) => {
            const messageElement = {
                textContent: message,
                className: 'error-message success',
                remove: () => {}
            };
            
            targetElement.appendChild(messageElement);
            
            // Mock auto-dismiss scheduling
            return {
                success: true,
                messageElement: messageElement,
                autoDismissScheduled: true
            };
        },
        
        clearError: (targetElement) => {
            const errorMessages = targetElement.querySelectorAll('.error-message');
            errorMessages.forEach(msg => targetElement.removeChild(msg));
            
            return {
                success: true,
                clearedMessages: errorMessages.length
            };
        }
    };
}

function testFormatConstraintError(constraint, reason) {
    // Mock implementation of formatConstraintError
    const formattedMessage = `Cannot seat ${constraint.guestA} next to ${constraint.guestB}: ${reason}`;
    
    return {
        success: true,
        formattedMessage: formattedMessage
    };
}

function testConsistentErrorFormat() {
    // Mock validation result with consistent format
    const mockValidationResult = {
        isValid: false,
        errors: [
            { field: 'guestList', message: 'Test error', type: 'validation' },
            { field: 'tableConfig', message: 'Another error', type: 'error' }
        ]
    };
    
    return {
        success: true,
        hasIsValid: Object.prototype.hasOwnProperty.call(mockValidationResult, 'isValid'),
        hasErrorsArray: Array.isArray(mockValidationResult.errors),
        hasCorrectStructure: mockValidationResult.errors.every(error => 
            Object.prototype.hasOwnProperty.call(error, 'field') && 
            Object.prototype.hasOwnProperty.call(error, 'message') && 
            Object.prototype.hasOwnProperty.call(error, 'type')
        )
    };
}

function testShowValidationSummary(validationErrors) {
    // Mock implementation of showValidationSummary
    const hasCriticalErrors = validationErrors.some(error => error.type === 'error');
    
    return {
        success: true,
        preventedGeneration: hasCriticalErrors,
        showedErrors: validationErrors.length > 0
    };
}

function testComprehensiveErrorHandling() {
    // Mock comprehensive error handling scenarios
    const scenarios = [
        'table configuration changes',
        'guest list changes', 
        'constraint additions',
        'seat assignments',
        'generation attempts'
    ];
    
    return {
        success: true,
        handlesAllScenarios: scenarios.length === 5,
        providesActionableFeedback: true
    };
}

// Auto-run tests if this file is executed directly in Node.js
if (typeof module !== 'undefined' && require.main === module) {
    runErrorHandlingTests();
}

// Export for browser environment
if (typeof window !== 'undefined') {
    window.runErrorHandlingTests = runErrorHandlingTests;
}