// ABOUTME: Tests for the validation.js module for table configuration inputs
// ABOUTME: Validates input validation, error handling, and constraint checking

// Test validateTableInputs function
TestFramework.test('validateTableInputs accepts valid inputs', function() {
    if (typeof validateTableInputs !== 'undefined') {
        const result = validateTableInputs(2, 3, 2, 1);
        TestFramework.assertTrue(result.isValid, 'Should accept valid positive integers');
        TestFramework.assertEquals(result.errors.length, 0, 'Should have no errors for valid inputs');
        TestFramework.assertEquals(result.total, 8, 'Should calculate correct total');
    } else {
        TestFramework.assertTrue(false, 'validateTableInputs function not defined yet');
    }
});

TestFramework.test('validateTableInputs rejects negative numbers', function() {
    if (typeof validateTableInputs !== 'undefined') {
        const result = validateTableInputs(-1, 2, 2, 2);
        TestFramework.assertFalse(result.isValid, 'Should reject negative numbers');
        TestFramework.assertTrue(result.errors.length > 0, 'Should have errors for negative inputs');
    } else {
        TestFramework.assertTrue(false, 'validateTableInputs function not defined yet');
    }
});

TestFramework.test('validateTableInputs rejects non-numeric inputs', function() {
    if (typeof validateTableInputs !== 'undefined') {
        const result = validateTableInputs('2', 2, 2, 2);
        TestFramework.assertFalse(result.isValid, 'Should reject string inputs');
        TestFramework.assertTrue(result.errors.length > 0, 'Should have errors for non-numeric inputs');
    } else {
        TestFramework.assertTrue(false, 'validateTableInputs function not defined yet');
    }
});

TestFramework.test('validateTableInputs rejects total exceeding 50 seats', function() {
    if (typeof validateTableInputs !== 'undefined') {
        const result = validateTableInputs(15, 15, 15, 15);
        TestFramework.assertFalse(result.isValid, 'Should reject totals over 50');
        TestFramework.assertTrue(result.errors.some(error => error.includes('50')), 'Should mention 50 seat limit');
    } else {
        TestFramework.assertTrue(false, 'validateTableInputs function not defined yet');
    }
});

TestFramework.test('validateTableInputs handles zero seats', function() {
    if (typeof validateTableInputs !== 'undefined') {
        const result = validateTableInputs(0, 2, 0, 2);
        TestFramework.assertTrue(result.isValid, 'Should accept zero seats on some sides');
        TestFramework.assertEquals(result.total, 4, 'Should calculate correct total with zeros');
    } else {
        TestFramework.assertTrue(false, 'validateTableInputs function not defined yet');
    }
});

TestFramework.test('validateTableInputs rejects non-integer inputs', function() {
    if (typeof validateTableInputs !== 'undefined') {
        const result = validateTableInputs(2.5, 2, 2, 2);
        TestFramework.assertFalse(result.isValid, 'Should reject decimal numbers');
        TestFramework.assertTrue(result.errors.length > 0, 'Should have errors for decimal inputs');
    } else {
        TestFramework.assertTrue(false, 'validateTableInputs function not defined yet');
    }
});

// Test validateGuestCount function
TestFramework.test('validateGuestCount accepts matching counts', function() {
    if (typeof validateGuestCount !== 'undefined') {
        const result = validateGuestCount(8, 8);
        TestFramework.assertTrue(result.isValid, 'Should accept matching guest and seat counts');
        TestFramework.assertEquals(result.errors.length, 0, 'Should have no errors for matching counts');
    } else {
        TestFramework.assertTrue(false, 'validateGuestCount function not defined yet');
    }
});

TestFramework.test('validateGuestCount rejects mismatched counts', function() {
    if (typeof validateGuestCount !== 'undefined') {
        const result = validateGuestCount(6, 8);
        TestFramework.assertFalse(result.isValid, 'Should reject mismatched counts');
        TestFramework.assertTrue(result.errors.length > 0, 'Should have errors for mismatched counts');
        TestFramework.assertTrue(result.errors[0].includes('6') && result.errors[0].includes('8'), 'Error should mention both counts');
    } else {
        TestFramework.assertTrue(false, 'validateGuestCount function not defined yet');
    }
});

TestFramework.test('validateGuestCount provides helpful error messages', function() {
    if (typeof validateGuestCount !== 'undefined') {
        const tooFewResult = validateGuestCount(5, 8);
        const tooManyResult = validateGuestCount(10, 8);
        
        TestFramework.assertTrue(tooFewResult.errors[0].includes('5'), 'Should mention actual guest count');
        TestFramework.assertTrue(tooManyResult.errors[0].includes('10'), 'Should mention actual guest count');
    } else {
        TestFramework.assertTrue(false, 'validateGuestCount function not defined yet');
    }
});

// Test findDuplicateGuests function
TestFramework.test('findDuplicateGuests detects exact duplicates', function() {
    if (typeof findDuplicateGuests !== 'undefined') {
        const guests = ['Alice', 'Bob', 'Alice', 'Charlie'];
        const duplicates = findDuplicateGuests(guests);
        TestFramework.assertTrue(duplicates.includes('Alice'), 'Should detect exact duplicate');
        TestFramework.assertEquals(duplicates.length, 1, 'Should find exactly one duplicate');
    } else {
        TestFramework.assertTrue(false, 'findDuplicateGuests function not defined yet');
    }
});

TestFramework.test('findDuplicateGuests detects case-insensitive duplicates', function() {
    if (typeof findDuplicateGuests !== 'undefined') {
        const guests = ['Alice', 'Bob', 'alice', 'ALICE'];
        const duplicates = findDuplicateGuests(guests);
        TestFramework.assertTrue(duplicates.length > 0, 'Should detect case-insensitive duplicates');
        TestFramework.assertTrue(duplicates.includes('alice'), 'Should return lowercase version');
    } else {
        TestFramework.assertTrue(false, 'findDuplicateGuests function not defined yet');
    }
});

TestFramework.test('findDuplicateGuests returns empty array for unique names', function() {
    if (typeof findDuplicateGuests !== 'undefined') {
        const guests = ['Alice', 'Bob', 'Charlie', 'Diana'];
        const duplicates = findDuplicateGuests(guests);
        TestFramework.assertEquals(duplicates.length, 0, 'Should return empty array for unique names');
    } else {
        TestFramework.assertTrue(false, 'findDuplicateGuests function not defined yet');
    }
});

TestFramework.test('findDuplicateGuests handles multiple duplicate pairs', function() {
    if (typeof findDuplicateGuests !== 'undefined') {
        const guests = ['Alice', 'Bob', 'alice', 'bob', 'Charlie'];
        const duplicates = findDuplicateGuests(guests);
        TestFramework.assertTrue(duplicates.length >= 2, 'Should detect multiple duplicate pairs');
    } else {
        TestFramework.assertTrue(false, 'findDuplicateGuests function not defined yet');
    }
});