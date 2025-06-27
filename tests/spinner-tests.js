// ABOUTME: Comprehensive test suite for spinner state management and generation process error handling
// ABOUTME: Tests all aspects of the enhanced spinner functionality including failsafe mechanisms and recovery

/* global setLoadingState, setLoadingStateWithTimeout, validateSpinnerState, resetSpinnerState, getSpinnerStateHistory, handleGenerateSeating, spinnerStateHistory */
/* global currentSpinnerState:writable */

// Test the spinner functionality
TestFramework.test('setLoadingState - should show spinner when isLoading is true', function() {
    // Create mock DOM elements
    document.body.innerHTML = `
        <div id="loading-spinner" class="hidden"></div>
        <button class="generate-btn">Generate Seating</button>
    `;
    
    const success = setLoadingState(true, 'test-show');
    
    TestFramework.assertTrue(success, 'setLoadingState should return true on success');
    
    const spinner = document.getElementById('loading-spinner');
    TestFramework.assertFalse(spinner.classList.contains('hidden'), 'Spinner should not have hidden class');
    
    const button = document.querySelector('.generate-btn');
    TestFramework.assertTrue(button.disabled, 'Generate button should be disabled when loading');
});

TestFramework.test('setLoadingState - should hide spinner when isLoading is false', function() {
    // Create mock DOM elements
    document.body.innerHTML = `
        <div id="loading-spinner"></div>
        <button class="generate-btn" disabled>Generate Seating</button>
    `;
    
    const success = setLoadingState(false, 'test-hide');
    
    TestFramework.assertTrue(success, 'setLoadingState should return true on success');
    
    const spinner = document.getElementById('loading-spinner');
    TestFramework.assertTrue(spinner.classList.contains('hidden'), 'Spinner should have hidden class');
    
    const button = document.querySelector('.generate-btn');
    TestFramework.assertFalse(button.disabled, 'Generate button should be enabled when not loading');
});

TestFramework.test('setLoadingState - should handle missing spinner element gracefully', function() {
    // Create DOM without spinner element
    document.body.innerHTML = '<button class="generate-btn">Generate Seating</button>';
    
    const success = setLoadingState(true, 'test-missing-spinner');
    
    TestFramework.assertFalse(success, 'setLoadingState should return false when spinner element is missing');
});

TestFramework.test('setLoadingState - should track state history', function() {
    // Create mock DOM elements
    document.body.innerHTML = `
        <div id="loading-spinner" class="hidden"></div>
        <button class="generate-btn">Generate Seating</button>
    `;
    
    // Clear history first
    spinnerStateHistory.length = 0;
    
    setLoadingState(true, 'test-history-1');
    setLoadingState(false, 'test-history-2');
    
    const history = getSpinnerStateHistory();
    
    TestFramework.assertEquals(history.history.length, 2, 'Should track 2 state changes');
    TestFramework.assertEquals(history.history[0].context, 'test-history-1', 'First entry should have correct context');
    TestFramework.assertEquals(history.history[1].context, 'test-history-2', 'Second entry should have correct context');
    TestFramework.assertTrue(history.history[0].isLoading, 'First entry should be loading');
    TestFramework.assertFalse(history.history[1].isLoading, 'Second entry should not be loading');
});

TestFramework.test('setLoadingStateWithTimeout - should set timeout when loading starts', function() {
    // Create mock DOM elements
    document.body.innerHTML = `
        <div id="loading-spinner" class="hidden"></div>
        <button class="generate-btn">Generate Seating</button>
    `;
    
    const success = setLoadingStateWithTimeout(true, 'test-timeout', 1000);
    
    TestFramework.assertTrue(success, 'setLoadingStateWithTimeout should return true on success');
    
    const history = getSpinnerStateHistory();
    TestFramework.assertTrue(history.hasActiveTimeout, 'Should have active timeout');
    
    // Clean up
    setLoadingStateWithTimeout(false, 'test-cleanup');
});

TestFramework.test('setLoadingStateWithTimeout - should clear timeout when loading stops', function() {
    // Create mock DOM elements
    document.body.innerHTML = `
        <div id="loading-spinner" class="hidden"></div>
        <button class="generate-btn">Generate Seating</button>
    `;
    
    setLoadingStateWithTimeout(true, 'test-timeout-clear', 5000);
    const successStop = setLoadingStateWithTimeout(false, 'test-timeout-clear-stop');
    
    TestFramework.assertTrue(successStop, 'Should successfully stop loading state');
    
    const history = getSpinnerStateHistory();
    TestFramework.assertFalse(history.hasActiveTimeout, 'Should not have active timeout after stopping');
});

TestFramework.test('validateSpinnerState - should detect state mismatch', function() {
    // Create mock DOM elements with mismatched state
    document.body.innerHTML = `
        <div id="loading-spinner"></div>
        <button class="generate-btn">Generate Seating</button>
    `;
    
    // Set internal state to false but DOM shows visible
    currentSpinnerState = false;
    
    const isValid = validateSpinnerState();
    
    TestFramework.assertTrue(isValid, 'validateSpinnerState should fix mismatch and return true');
    
    const spinner = document.getElementById('loading-spinner');
    TestFramework.assertTrue(spinner.classList.contains('hidden'), 'Spinner should be hidden after validation fix');
});

TestFramework.test('resetSpinnerState - should force spinner off', function() {
    // Create mock DOM elements
    document.body.innerHTML = `
        <div id="loading-spinner"></div>
        <button class="generate-btn" disabled>Generate Seating</button>
    `;
    
    // Set spinner to loading state
    currentSpinnerState = true;
    
    const success = resetSpinnerState();
    
    TestFramework.assertTrue(success, 'resetSpinnerState should return true on success');
    TestFramework.assertFalse(currentSpinnerState, 'currentSpinnerState should be false after reset');
    
    const spinner = document.getElementById('loading-spinner');
    TestFramework.assertTrue(spinner.classList.contains('hidden'), 'Spinner should be hidden after reset');
});

TestFramework.test('handleGenerateSeating - should show spinner during generation', function() {
    // Create mock DOM elements and required globals
    document.body.innerHTML = `
        <div id="loading-spinner" class="hidden"></div>
        <button class="generate-btn">Generate Seating</button>
        <div id="status-messages"></div>
        <div id="table-container">
            <svg><circle id="seat-1" r="10"></circle></svg>
        </div>
    `;
    
    // Mock required global variables and functions for minimal test
    window.currentGuestList = ['Alice', 'Bob'];
    window.currentTableConfig = { totalSeats: 2, shape: 'round' };
    window.fixedAssignmentManager = { getAllAssignments: () => ({}) };
    window.adjacencyConstraintManager = { getAllConstraints: () => [] };
    window.currentAdjacencyMap = new Map();
    window.currentSeatElements = { 'seat-1': document.getElementById('seat-1') };
    
    // Mock validation to return true
    window.showValidationSummary = () => true;
    window.clearStatusMessages = () => {};
    window.clearPreviousGeneratedAssignments = () => {};
    
    // Mock generation algorithm to return immediately
    window.generateSeating = () => ({
        success: true,
        arrangement: new Map([['seat-1', 'Alice']])
    });
    
    // Mock display functions
    window.displayGeneratedSeating = () => {};
    window.showGenerationSuccess = () => {};
    
    // Call the function
    handleGenerateSeating();
    
    // The spinner should have been shown and then hidden
    const history = getSpinnerStateHistory();
    TestFramework.assertTrue(history.history.length >= 2, 'Should have at least 2 state changes');
    
    // Check that final state is not loading
    TestFramework.assertFalse(currentSpinnerState, 'Spinner should not be loading after generation completes');
});

TestFramework.test('handleGenerateSeating - should handle validation failure', function() {
    // Create mock DOM elements
    document.body.innerHTML = `
        <div id="loading-spinner" class="hidden"></div>
        <button class="generate-btn">Generate Seating</button>
        <div id="status-messages"></div>
    `;
    
    // Mock validation to return false
    window.showValidationSummary = () => false;
    
    // Call the function
    handleGenerateSeating();
    
    // Spinner should not have been activated for validation failure
    TestFramework.assertFalse(currentSpinnerState, 'Spinner should not be active after validation failure');
});

TestFramework.test('handleGenerateSeating - should handle generation algorithm error', function() {
    // Create mock DOM elements
    document.body.innerHTML = `
        <div id="loading-spinner" class="hidden"></div>
        <button class="generate-btn">Generate Seating</button>
        <div id="status-messages"></div>
    `;
    
    // Mock required globals
    window.currentGuestList = ['Alice'];
    window.currentTableConfig = { totalSeats: 1 };
    window.fixedAssignmentManager = { getAllAssignments: () => ({}) };
    window.adjacencyConstraintManager = { getAllConstraints: () => [] };
    window.currentAdjacencyMap = new Map();
    
    // Mock validation to return true
    window.showValidationSummary = () => true;
    window.clearStatusMessages = () => {};
    window.clearPreviousGeneratedAssignments = () => {};
    
    // Mock generation algorithm to throw error
    window.generateSeating = () => {
        throw new Error('Test generation error');
    };
    
    // Mock error display function
    window.showGenerationError = () => {};
    
    // Call the function
    handleGenerateSeating();
    
    // Spinner should be hidden after error
    TestFramework.assertFalse(currentSpinnerState, 'Spinner should be hidden after generation error');
});

TestFramework.test('handleGenerateSeating - should handle empty guest list', function() {
    // Create mock DOM elements
    document.body.innerHTML = `
        <div id="loading-spinner" class="hidden"></div>
        <button class="generate-btn">Generate Seating</button>
        <div id="status-messages"></div>
    `;
    
    // Mock required globals with empty guest list
    window.currentGuestList = [];
    window.currentTableConfig = { totalSeats: 1 };
    window.fixedAssignmentManager = { getAllAssignments: () => ({}) };
    window.adjacencyConstraintManager = { getAllConstraints: () => [] };
    window.currentAdjacencyMap = new Map();
    
    // Mock validation to return true
    window.showValidationSummary = () => true;
    window.clearStatusMessages = () => {};
    window.clearPreviousGeneratedAssignments = () => {};
    
    // Mock error display function
    window.showGenerationError = () => {};
    
    // Call the function
    handleGenerateSeating();
    
    // Spinner should be hidden after detecting empty guest list
    TestFramework.assertFalse(currentSpinnerState, 'Spinner should be hidden after detecting empty guest list');
});

TestFramework.test('spinner timeout failsafe - should trigger after timeout', function(done) {
    // Create mock DOM elements
    document.body.innerHTML = `
        <div id="loading-spinner" class="hidden"></div>
        <button class="generate-btn">Generate Seating</button>
        <div id="status-messages"></div>
    `;
    
    // Mock status message function
    window.showStatusMessage = () => {};
    
    // Set a very short timeout for testing
    setLoadingStateWithTimeout(true, 'test-timeout-trigger', 50);
    
    // Check that timeout triggers
    setTimeout(() => {
        TestFramework.assertFalse(currentSpinnerState, 'Spinner should be off after timeout');
        const history = getSpinnerStateHistory();
        const hasTimeoutEntry = history.history.some(entry => entry.context === 'failsafe-timeout');
        TestFramework.assertTrue(hasTimeoutEntry, 'Should have failsafe-timeout entry in history');
        
        if (typeof done === 'function') done();
    }, 100);
});

// Test spinner state persistence across page interactions
TestFramework.test('spinner state - should maintain consistency across interactions', function() {
    // Create mock DOM elements
    document.body.innerHTML = `
        <div id="loading-spinner" class="hidden"></div>
        <button class="generate-btn">Generate Seating</button>
    `;
    
    // Test multiple state changes
    setLoadingState(true, 'test-consistency-1');
    TestFramework.assertTrue(currentSpinnerState, 'State should be true after setting to true');
    
    setLoadingState(false, 'test-consistency-2');
    TestFramework.assertFalse(currentSpinnerState, 'State should be false after setting to false');
    
    // Test state validation
    const isValid = validateSpinnerState();
    TestFramework.assertTrue(isValid, 'State should be valid after validation');
});

console.log('Spinner tests loaded successfully');