// ABOUTME: Node.js test runner specifically for testing the validation.js functionality
// ABOUTME: Imports and tests all validation functions with comprehensive test cases

const validation = require('./scripts/validation.js');

const {
    validateTableInputs,
    validateGuestCount,
    findDuplicateGuests,
    validateFixedAssignment
} = validation;

class ValidationTestRunner {
    constructor() {
        this.tests = [];
        this.results = [];
    }

    test(name, fn) {
        this.tests.push({ name, fn });
    }

    assertTrue(condition, message = '') {
        if (!condition) {
            throw new Error(`Expected true, got false. ${message}`);
        }
    }

    assertFalse(condition, message = '') {
        if (condition) {
            throw new Error(`Expected false, got true. ${message}`);
        }
    }

    assertEquals(actual, expected, message = '') {
        if (actual !== expected) {
            throw new Error(`Expected ${expected}, got ${actual}. ${message}`);
        }
    }

    assertContains(container, item, message = '') {
        if (!container.includes(item)) {
            throw new Error(`Expected container to include ${item}. ${message}`);
        }
    }

    runAll() {
        console.log('🧪 Testing validation.js functionality...\n');
        
        let passed = 0;
        let failed = 0;

        for (const test of this.tests) {
            try {
                test.fn();
                console.log(`✅ ${test.name}`);
                passed++;
            } catch (error) {
                console.log(`❌ ${test.name}: ${error.message}`);
                failed++;
            }
        }

        console.log(`\n📊 Results: ${passed} passed, ${failed} failed`);
        
        if (failed > 0) {
            process.exit(1);
        }
    }
}

const runner = new ValidationTestRunner();

// validateTableInputs tests
runner.test('validateTableInputs accepts valid inputs', function() {
    const result = validateTableInputs(2, 3, 2, 1);
    runner.assertTrue(result.isValid);
    runner.assertEquals(result.errors.length, 0);
    runner.assertEquals(result.total, 8);
});

runner.test('validateTableInputs rejects negative numbers', function() {
    const result = validateTableInputs(-1, 2, 2, 2);
    runner.assertFalse(result.isValid);
    runner.assertTrue(result.errors.length > 0);
    runner.assertContains(result.errors[0], 'must be 0 or greater');
});

runner.test('validateTableInputs rejects non-numeric inputs', function() {
    const result = validateTableInputs('2', 2, 2, 2);
    runner.assertFalse(result.isValid);
    runner.assertTrue(result.errors.length > 0);
    runner.assertContains(result.errors[0], 'must be a number');
});

runner.test('validateTableInputs rejects decimal inputs', function() {
    const result = validateTableInputs(2.5, 2, 2, 2);
    runner.assertFalse(result.isValid);
    runner.assertTrue(result.errors.length > 0);
    runner.assertContains(result.errors[0], 'whole number');
});

runner.test('validateTableInputs rejects total over 50', function() {
    const result = validateTableInputs(15, 15, 15, 15);
    runner.assertFalse(result.isValid);
    runner.assertTrue(result.errors.some(error => error.includes('50')));
});

runner.test('validateTableInputs accepts zero seats', function() {
    const result = validateTableInputs(0, 2, 0, 2);
    runner.assertTrue(result.isValid);
    runner.assertEquals(result.total, 4);
});

// validateGuestCount tests
runner.test('validateGuestCount accepts matching counts', function() {
    const result = validateGuestCount(8, 8);
    runner.assertTrue(result.isValid);
    runner.assertEquals(result.errors.length, 0);
});

runner.test('validateGuestCount rejects too few guests', function() {
    const result = validateGuestCount(6, 8);
    runner.assertFalse(result.isValid);
    runner.assertTrue(result.errors.length > 0);
    runner.assertContains(result.errors[0], '6');
    runner.assertContains(result.errors[0], '8');
});

runner.test('validateGuestCount rejects too many guests', function() {
    const result = validateGuestCount(10, 8);
    runner.assertFalse(result.isValid);
    runner.assertTrue(result.errors.length > 0);
    runner.assertContains(result.errors[0], '10');
    runner.assertContains(result.errors[0], '8');
});

// findDuplicateGuests tests
runner.test('findDuplicateGuests detects exact duplicates', function() {
    const duplicates = findDuplicateGuests(['Alice', 'Bob', 'Alice', 'Charlie']);
    runner.assertTrue(duplicates.includes('alice'));
    runner.assertEquals(duplicates.length, 1);
});

runner.test('findDuplicateGuests detects case-insensitive duplicates', function() {
    const duplicates = findDuplicateGuests(['Alice', 'Bob', 'alice', 'ALICE']);
    runner.assertTrue(duplicates.length > 0);
    runner.assertTrue(duplicates.includes('alice'));
});

runner.test('findDuplicateGuests returns empty for unique names', function() {
    const duplicates = findDuplicateGuests(['Alice', 'Bob', 'Charlie', 'Diana']);
    runner.assertEquals(duplicates.length, 0);
});

runner.test('findDuplicateGuests handles multiple duplicate pairs', function() {
    const duplicates = findDuplicateGuests(['Alice', 'Bob', 'alice', 'bob', 'Charlie']);
    runner.assertTrue(duplicates.length >= 2);
});

// Test validateFixedAssignment function
runner.test('validateFixedAssignment accepts valid assignment', function() {
    const guestList = ['Alice', 'Bob', 'Charlie'];
    const result = validateFixedAssignment('Alice', 'seat-1', guestList, null);
    runner.assertTrue(result.isValid);
    runner.assertEquals(result.guestName, 'Alice');
    runner.assertEquals(result.seatId, 'seat-1');
});

runner.test('validateFixedAssignment rejects invalid guest name', function() {
    const guestList = ['Alice', 'Bob', 'Charlie'];
    
    const emptyResult = validateFixedAssignment('', 'seat-1', guestList, null);
    runner.assertFalse(emptyResult.isValid);
    runner.assertContains(emptyResult.error, 'non-empty string');
    
    const nullResult = validateFixedAssignment(null, 'seat-1', guestList, null);
    runner.assertFalse(nullResult.isValid);
    runner.assertContains(nullResult.error, 'non-empty string');
});

runner.test('validateFixedAssignment rejects invalid seat ID', function() {
    const guestList = ['Alice', 'Bob', 'Charlie'];
    
    const emptyResult = validateFixedAssignment('Alice', '', guestList, null);
    runner.assertFalse(emptyResult.isValid);
    runner.assertContains(emptyResult.error, 'non-empty string');
    
    const nullResult = validateFixedAssignment('Alice', null, guestList, null);
    runner.assertFalse(nullResult.isValid);
    runner.assertContains(nullResult.error, 'non-empty string');
});

runner.test('validateFixedAssignment rejects guest not in list', function() {
    const guestList = ['Alice', 'Bob', 'Charlie'];
    const result = validateFixedAssignment('Diana', 'seat-1', guestList, null);
    runner.assertFalse(result.isValid);
    runner.assertContains(result.error, 'not in the current guest list');
});

// Run all tests
runner.runAll();