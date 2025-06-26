// ABOUTME: Tests for guest list management UI components and functionality
// ABOUTME: Validates guest parsing, validation, real-time updates, and UI state management

// Test guest list UI structure
TestFramework.test('guest list textarea has correct attributes', function() {
    const textarea = document.createElement('textarea');
    textarea.id = 'guest-list-input';
    textarea.rows = 10;
    textarea.placeholder = 'Enter guest names (one per line):\nAlice\nBob\nCharlie';
    document.body.appendChild(textarea);
    
    const found = document.getElementById('guest-list-input');
    TestFramework.assertNotNull(found, 'Should have guest list textarea');
    TestFramework.assertEquals(found.rows, 10, 'Should have 10 rows');
    TestFramework.assertContains(found.placeholder, 'one per line', 'Should have helpful placeholder');
    
    document.body.removeChild(textarea);
});

TestFramework.test('guest count display element exists', function() {
    const countDisplay = document.createElement('span');
    countDisplay.id = 'guest-count';
    countDisplay.textContent = '0';
    document.body.appendChild(countDisplay);
    
    const found = document.getElementById('guest-count');
    TestFramework.assertNotNull(found, 'Should have guest count display');
    TestFramework.assertEquals(found.textContent, '0', 'Should initialize to 0');
    
    document.body.removeChild(countDisplay);
});

TestFramework.test('guest validation errors container exists', function() {
    const errorContainer = document.createElement('div');
    errorContainer.id = 'guest-validation-errors';
    errorContainer.className = 'validation-errors';
    document.body.appendChild(errorContainer);
    
    const found = document.getElementById('guest-validation-errors');
    TestFramework.assertNotNull(found, 'Should have guest validation error container');
    TestFramework.assertTrue(found.classList.contains('validation-errors'), 'Should have validation-errors class');
    
    document.body.removeChild(errorContainer);
});

// Test guest list event handling functions
TestFramework.test('handleGuestListChange function exists', function() {
    if (typeof handleGuestListChange !== 'undefined') {
        TestFramework.assertTrue(typeof handleGuestListChange === 'function', 'handleGuestListChange should be a function');
    } else {
        TestFramework.assertTrue(false, 'handleGuestListChange function not defined yet');
    }
});

TestFramework.test('updateGuestCountDisplay function updates correctly', function() {
    if (typeof updateGuestCountDisplay !== 'undefined') {
        const countDisplay = document.createElement('span');
        countDisplay.id = 'guest-count';
        document.body.appendChild(countDisplay);
        
        updateGuestCountDisplay(5);
        TestFramework.assertEquals(countDisplay.textContent, '5', 'Should update guest count display');
        
        updateGuestCountDisplay(0);
        TestFramework.assertEquals(countDisplay.textContent, '0', 'Should handle zero guests');
        
        document.body.removeChild(countDisplay);
    } else {
        TestFramework.assertTrue(false, 'updateGuestCountDisplay function not defined yet');
    }
});

TestFramework.test('showGuestValidationErrors function displays errors', function() {
    if (typeof showGuestValidationErrors !== 'undefined') {
        const errorContainer = document.createElement('div');
        errorContainer.id = 'guest-validation-errors';
        document.body.appendChild(errorContainer);
        
        const errors = ['Duplicate name: alice', 'Guest count mismatch'];
        showGuestValidationErrors(errors);
        
        TestFramework.assertTrue(errorContainer.children.length > 0, 'Should add error elements');
        TestFramework.assertContains(errorContainer.innerHTML, 'Duplicate name', 'Should display duplicate error');
        TestFramework.assertContains(errorContainer.innerHTML, 'mismatch', 'Should display count error');
        
        document.body.removeChild(errorContainer);
    } else {
        TestFramework.assertTrue(false, 'showGuestValidationErrors function not defined yet');
    }
});

TestFramework.test('clearGuestValidationErrors function clears errors', function() {
    if (typeof clearGuestValidationErrors !== 'undefined') {
        const errorContainer = document.createElement('div');
        errorContainer.id = 'guest-validation-errors';
        errorContainer.innerHTML = '<div class="error-item">Test error</div>';
        document.body.appendChild(errorContainer);
        
        clearGuestValidationErrors();
        TestFramework.assertEquals(errorContainer.innerHTML, '', 'Should clear all error content');
        
        document.body.removeChild(errorContainer);
    } else {
        TestFramework.assertTrue(false, 'clearGuestValidationErrors function not defined yet');
    }
});

// Test guest list parsing integration
TestFramework.test('parseAndValidateGuestList processes input correctly', function() {
    if (typeof parseAndValidateGuestList !== 'undefined') {
        const input = 'Alice\nBob\n  Charlie  \n\nDiana\n';
        const result = parseAndValidateGuestList(input);
        
        TestFramework.assertTrue(typeof result === 'object', 'Should return an object');
        TestFramework.assertTrue('guests' in result, 'Should have guests property');
        TestFramework.assertTrue('isValid' in result, 'Should have isValid property');
        TestFramework.assertTrue('errors' in result, 'Should have errors property');
        
        if (result.isValid) {
            TestFramework.assertEquals(result.guests.length, 4, 'Should parse 4 guests');
            TestFramework.assertEquals(result.guests[1], 'Bob', 'Should preserve guest names');
            TestFramework.assertEquals(result.guests[2], 'Charlie', 'Should trim whitespace');
        }
    } else {
        TestFramework.assertTrue(false, 'parseAndValidateGuestList function not defined yet');
    }
});

TestFramework.test('parseAndValidateGuestList detects duplicates', function() {
    if (typeof parseAndValidateGuestList !== 'undefined') {
        const input = 'Alice\nBob\nalice\nCharlie';
        const result = parseAndValidateGuestList(input);
        
        TestFramework.assertFalse(result.isValid, 'Should be invalid due to duplicates');
        TestFramework.assertTrue(result.errors.length > 0, 'Should have error messages');
        TestFramework.assertTrue(result.errors.some(error => error.includes('Duplicate') || error.includes('duplicate')), 'Should mention duplicates');
    } else {
        TestFramework.assertTrue(false, 'parseAndValidateGuestList function not defined yet');
    }
});

TestFramework.test('parseAndValidateGuestList handles empty input', function() {
    if (typeof parseAndValidateGuestList !== 'undefined') {
        const result = parseAndValidateGuestList('');
        
        TestFramework.assertTrue(result.guests.length === 0, 'Should return empty guest list');
        TestFramework.assertTrue(Array.isArray(result.guests), 'Guests should be an array');
    } else {
        TestFramework.assertTrue(false, 'parseAndValidateGuestList function not defined yet');
    }
});

// Test guest-seat count validation
TestFramework.test('validateGuestSeatCount compares correctly', function() {
    if (typeof validateGuestSeatCount !== 'undefined') {
        const matchingResult = validateGuestSeatCount(4, 4);
        TestFramework.assertTrue(matchingResult.isValid, 'Should be valid when counts match');
        TestFramework.assertEquals(matchingResult.errors.length, 0, 'Should have no errors when matching');
        
        const mismatchResult = validateGuestSeatCount(3, 6);
        TestFramework.assertFalse(mismatchResult.isValid, 'Should be invalid when counts mismatch');
        TestFramework.assertTrue(mismatchResult.errors.length > 0, 'Should have errors when mismatching');
    } else {
        TestFramework.assertTrue(false, 'validateGuestSeatCount function not defined yet');
    }
});

TestFramework.test('validateGuestSeatCount provides helpful messages', function() {
    if (typeof validateGuestSeatCount !== 'undefined') {
        const tooFewGuests = validateGuestSeatCount(3, 8);
        const tooManyGuests = validateGuestSeatCount(10, 6);
        
        TestFramework.assertTrue(tooFewGuests.errors[0].includes('3'), 'Should mention actual guest count');
        TestFramework.assertTrue(tooFewGuests.errors[0].includes('8'), 'Should mention seat count');
        TestFramework.assertTrue(tooManyGuests.errors[0].includes('10'), 'Should mention actual guest count');
        TestFramework.assertTrue(tooManyGuests.errors[0].includes('6'), 'Should mention seat count');
    } else {
        TestFramework.assertTrue(false, 'validateGuestSeatCount function not defined yet');
    }
});

// Test initialization functions
TestFramework.test('initializeGuestListUI function sets up event listeners', function() {
    if (typeof initializeGuestListUI !== 'undefined') {
        // Create mock textarea
        const textarea = document.createElement('textarea');
        textarea.id = 'guest-list-input';
        document.body.appendChild(textarea);
        
        // Test that initialization doesn't throw
        try {
            initializeGuestListUI();
            TestFramework.assertTrue(true, 'Should initialize without errors');
        } catch (error) {
            TestFramework.assertTrue(false, `Initialization failed: ${error.message}`);
        }
        
        document.body.removeChild(textarea);
    } else {
        TestFramework.assertTrue(false, 'initializeGuestListUI function not defined yet');
    }
});

// Test real-time validation
TestFramework.test('guest list validates against current table configuration', function() {
    if (typeof validateGuestListWithTable !== 'undefined') {
        const guests = ['Alice', 'Bob', 'Charlie'];
        const tableConfig = { totalSeats: 3 };
        
        const result = validateGuestListWithTable(guests, tableConfig);
        TestFramework.assertTrue(typeof result === 'object', 'Should return validation result');
        TestFramework.assertTrue('isValid' in result, 'Should have isValid property');
        TestFramework.assertTrue('errors' in result, 'Should have errors property');
    } else {
        TestFramework.assertTrue(false, 'validateGuestListWithTable function not defined yet');
    }
});

TestFramework.test('guest list shows validation state visually', function() {
    if (typeof updateGuestListValidationState !== 'undefined') {
        const textarea = document.createElement('textarea');
        textarea.id = 'guest-list-input';
        document.body.appendChild(textarea);
        
        // Test valid state
        updateGuestListValidationState(true);
        TestFramework.assertFalse(textarea.classList.contains('error'), 'Should not have error class for valid state');
        
        // Test invalid state
        updateGuestListValidationState(false);
        TestFramework.assertTrue(textarea.classList.contains('error'), 'Should have error class for invalid state');
        
        document.body.removeChild(textarea);
    } else {
        TestFramework.assertTrue(false, 'updateGuestListValidationState function not defined yet');
    }
});