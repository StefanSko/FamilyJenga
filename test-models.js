// ABOUTME: Node.js test runner specifically for testing the models.js functionality
// ABOUTME: Imports and tests all model factory functions with comprehensive test cases

const models = require('./scripts/models.js');

const {
    createTableConfig,
    createSeat,
    parseGuestList,
    validateGuestList,
    createFixedAssignment,
    createAdjacencyConstraint,
    createSeatingArrangement
} = models;

class ModelTestRunner {
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

    assertEquals(actual, expected, message = '') {
        if (actual !== expected) {
            throw new Error(`Expected ${expected}, got ${actual}. ${message}`);
        }
    }

    assertThrows(fn, expectedMessage = null, message = '') {
        try {
            fn();
            throw new Error(`Expected function to throw an error. ${message}`);
        } catch (error) {
            if (expectedMessage && !error.message.includes(expectedMessage)) {
                throw new Error(`Expected error to contain "${expectedMessage}", got "${error.message}"`);
            }
        }
    }

    runAll() {
        console.log('🧪 Testing models.js functionality...\n');
        
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

const runner = new ModelTestRunner();

// Table Configuration Tests
runner.test('createTableConfig with valid inputs', function() {
    const config = createTableConfig(2, 3, 2, 1);
    runner.assertEquals(config.topSeats, 2);
    runner.assertEquals(config.rightSeats, 3);
    runner.assertEquals(config.bottomSeats, 2);
    runner.assertEquals(config.leftSeats, 1);
    runner.assertEquals(config.totalSeats, 8);
});

runner.test('createTableConfig with zero seats', function() {
    const config = createTableConfig(0, 2, 0, 2);
    runner.assertEquals(config.totalSeats, 4);
});

runner.test('createTableConfig rejects negative numbers', function() {
    runner.assertThrows(() => createTableConfig(-1, 2, 2, 2), 'positive');
});

runner.test('createTableConfig rejects non-integers', function() {
    runner.assertThrows(() => createTableConfig(1.5, 2, 2, 2), 'integer');
});

// Seat Position Tests
runner.test('createSeat with valid parameters', function() {
    const seat = createSeat(5, 'top', 2);
    runner.assertEquals(seat.id, 5);
    runner.assertEquals(seat.side, 'top');
    runner.assertEquals(seat.position, 2);
});

runner.test('createSeat generates correct display label', function() {
    const seat1 = createSeat(1, 'top', 0);
    runner.assertEquals(seat1.getDisplayLabel(), 'Top-1');
    
    const seat2 = createSeat(5, 'right', 2);
    runner.assertEquals(seat2.getDisplayLabel(), 'Right-3');
});

runner.test('createSeat accepts all valid sides', function() {
    const validSides = ['top', 'right', 'bottom', 'left'];
    validSides.forEach(side => {
        const seat = createSeat(1, side, 0);
        runner.assertEquals(seat.side, side);
    });
});

runner.test('createSeat rejects invalid side', function() {
    runner.assertThrows(() => createSeat(1, 'middle', 0), 'Invalid side');
});

// Guest List Utilities Tests
runner.test('parseGuestList splits by newlines', function() {
    const guests = parseGuestList('Alice\nBob\nCharlie');
    runner.assertEquals(guests.length, 3);
    runner.assertEquals(guests[0], 'Alice');
    runner.assertEquals(guests[1], 'Bob');
    runner.assertEquals(guests[2], 'Charlie');
});

runner.test('parseGuestList handles whitespace and empty lines', function() {
    const guests = parseGuestList('Alice\n\n  Bob  \n\nCharlie\n');
    runner.assertEquals(guests.length, 3);
    runner.assertEquals(guests[1], 'Bob');
});

runner.test('parseGuestList handles empty input', function() {
    const guests = parseGuestList('');
    runner.assertEquals(guests.length, 0);
});

runner.test('validateGuestList accepts valid guest list', function() {
    const result = validateGuestList(['Alice', 'Bob', 'Charlie']);
    runner.assertTrue(result.isValid);
    runner.assertEquals(result.errors.length, 0);
});

runner.test('validateGuestList detects duplicates case-insensitive', function() {
    const result = validateGuestList(['Alice', 'Bob', 'alice']);
    runner.assertTrue(!result.isValid);
    runner.assertTrue(result.errors.length > 0);
    runner.assertTrue(result.errors[0].includes('Duplicate'));
});

runner.test('validateGuestList detects empty names', function() {
    const result = validateGuestList(['Alice', '', 'Bob']);
    runner.assertTrue(!result.isValid);
    runner.assertTrue(result.errors[0].includes('empty'));
});

// Constraint Objects Tests
runner.test('createFixedAssignment stores data correctly', function() {
    const assignment = createFixedAssignment('Alice', 5);
    runner.assertEquals(assignment.guestName, 'Alice');
    runner.assertEquals(assignment.seatId, 5);
});

runner.test('createFixedAssignment validates inputs', function() {
    runner.assertThrows(() => createFixedAssignment('', 5), 'non-empty string');
    runner.assertThrows(() => createFixedAssignment('Alice', -1), 'positive number');
});

runner.test('createAdjacencyConstraint stores both guests', function() {
    const constraint = createAdjacencyConstraint('Alice', 'Bob');
    runner.assertEquals(constraint.guestA, 'Alice');
    runner.assertEquals(constraint.guestB, 'Bob');
});

runner.test('createAdjacencyConstraint rejects same guest', function() {
    runner.assertThrows(() => createAdjacencyConstraint('Alice', 'Alice'), 'different');
    runner.assertThrows(() => createAdjacencyConstraint('alice', 'Alice'), 'different');
});

// Seating Arrangement Tests
runner.test('createSeatingArrangement returns empty Map', function() {
    const arrangement = createSeatingArrangement();
    runner.assertTrue(arrangement instanceof Map);
    runner.assertEquals(arrangement.size, 0);
});

runner.test('seating arrangement can store assignments', function() {
    const arrangement = createSeatingArrangement();
    arrangement.set(1, 'Alice');
    arrangement.set(2, 'Bob');
    
    runner.assertEquals(arrangement.get(1), 'Alice');
    runner.assertEquals(arrangement.get(2), 'Bob');
    runner.assertEquals(arrangement.size, 2);
});

// Run all tests
runner.runAll();