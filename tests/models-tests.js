// ABOUTME: Tests for the core data models and factory functions
// ABOUTME: Validates table configuration, seat positions, guest lists, and constraints

// Table Configuration Tests
TestFramework.test('createTableConfig validates positive integers', function() {
    // This test will fail initially - we need to implement createTableConfig
    if (typeof createTableConfig !== 'undefined') {
        const config = createTableConfig(2, 2, 2, 2);
        TestFramework.assertEquals(config.topSeats, 2, 'Should store top seats');
        TestFramework.assertEquals(config.rightSeats, 2, 'Should store right seats');
        TestFramework.assertEquals(config.bottomSeats, 2, 'Should store bottom seats');
        TestFramework.assertEquals(config.leftSeats, 2, 'Should store left seats');
        TestFramework.assertEquals(config.totalSeats, 8, 'Should calculate total seats');
    } else {
        TestFramework.assertTrue(false, 'createTableConfig function not defined yet');
    }
});

TestFramework.test('createTableConfig rejects invalid inputs', function() {
    if (typeof createTableConfig !== 'undefined') {
        try {
            createTableConfig(-1, 2, 2, 2);
            TestFramework.assertTrue(false, 'Should throw error for negative input');
        } catch (error) {
            TestFramework.assertContains(error.message, 'positive', 'Error should mention positive integers');
        }
        
        try {
            createTableConfig(1.5, 2, 2, 2);
            TestFramework.assertTrue(false, 'Should throw error for non-integer input');
        } catch (error) {
            TestFramework.assertContains(error.message, 'integer', 'Error should mention integers');
        }
    } else {
        TestFramework.assertTrue(false, 'createTableConfig function not defined yet');
    }
});

TestFramework.test('createTableConfig handles zero seats', function() {
    if (typeof createTableConfig !== 'undefined') {
        const config = createTableConfig(0, 2, 0, 2);
        TestFramework.assertEquals(config.totalSeats, 4, 'Should handle zero seats on some sides');
    } else {
        TestFramework.assertTrue(false, 'createTableConfig function not defined yet');
    }
});

// Seat Position Tests
TestFramework.test('createSeat validates side parameter', function() {
    if (typeof createSeat !== 'undefined') {
        const seat = createSeat(1, 'top', 0);
        TestFramework.assertEquals(seat.id, 1, 'Should store seat ID');
        TestFramework.assertEquals(seat.side, 'top', 'Should store side');
        TestFramework.assertEquals(seat.position, 0, 'Should store position');
        
        try {
            createSeat(1, 'invalid-side', 0);
            TestFramework.assertTrue(false, 'Should reject invalid side');
        } catch (error) {
            TestFramework.assertContains(error.message, 'side', 'Error should mention invalid side');
        }
    } else {
        TestFramework.assertTrue(false, 'createSeat function not defined yet');
    }
});

TestFramework.test('createSeat generates display label', function() {
    if (typeof createSeat !== 'undefined') {
        const seat = createSeat(5, 'right', 2);
        const label = seat.getDisplayLabel();
        TestFramework.assertEquals(label, 'Right-3', 'Should generate correct display label (1-indexed)');
    } else {
        TestFramework.assertTrue(false, 'createSeat function not defined yet');
    }
});

TestFramework.test('createSeat handles all valid sides', function() {
    if (typeof createSeat !== 'undefined') {
        const validSides = ['top', 'right', 'bottom', 'left'];
        validSides.forEach(side => {
            const seat = createSeat(1, side, 0);
            TestFramework.assertEquals(seat.side, side, `Should accept ${side} as valid side`);
        });
    } else {
        TestFramework.assertTrue(false, 'createSeat function not defined yet');
    }
});

// Guest List Utilities Tests
TestFramework.test('parseGuestList splits by newlines', function() {
    if (typeof parseGuestList !== 'undefined') {
        const input = 'Alice\nBob\nCharlie';
        const guests = parseGuestList(input);
        TestFramework.assertEquals(guests.length, 3, 'Should split into 3 guests');
        TestFramework.assertEquals(guests[0], 'Alice', 'Should preserve first guest name');
        TestFramework.assertEquals(guests[2], 'Charlie', 'Should preserve last guest name');
    } else {
        TestFramework.assertTrue(false, 'parseGuestList function not defined yet');
    }
});

TestFramework.test('parseGuestList handles empty lines and whitespace', function() {
    if (typeof parseGuestList !== 'undefined') {
        const input = 'Alice\n\n  Bob  \n\nCharlie\n';
        const guests = parseGuestList(input);
        TestFramework.assertEquals(guests.length, 3, 'Should filter out empty lines');
        TestFramework.assertEquals(guests[1], 'Bob', 'Should trim whitespace');
    } else {
        TestFramework.assertTrue(false, 'parseGuestList function not defined yet');
    }
});

TestFramework.test('validateGuestList detects duplicates', function() {
    if (typeof validateGuestList !== 'undefined') {
        const validGuests = ['Alice', 'Bob', 'Charlie'];
        const invalidGuests = ['Alice', 'Bob', 'alice', 'Dave'];
        
        const validResult = validateGuestList(validGuests);
        TestFramework.assertTrue(validResult.isValid, 'Should validate unique guests');
        TestFramework.assertEquals(validResult.errors.length, 0, 'Should have no errors for unique guests');
        
        const invalidResult = validateGuestList(invalidGuests);
        TestFramework.assertFalse(invalidResult.isValid, 'Should detect case-insensitive duplicates');
        TestFramework.assertTrue(invalidResult.errors.length > 0, 'Should have errors for duplicates');
    } else {
        TestFramework.assertTrue(false, 'validateGuestList function not defined yet');
    }
});

TestFramework.test('validateGuestList detects empty names', function() {
    if (typeof validateGuestList !== 'undefined') {
        const guestsWithEmpty = ['Alice', '', 'Bob'];
        const result = validateGuestList(guestsWithEmpty);
        TestFramework.assertFalse(result.isValid, 'Should reject empty names');
        TestFramework.assertTrue(result.errors.length > 0, 'Should have errors for empty names');
    } else {
        TestFramework.assertTrue(false, 'validateGuestList function not defined yet');
    }
});

// Constraint Objects Tests
TestFramework.test('createFixedAssignment stores guest and seat', function() {
    if (typeof createFixedAssignment !== 'undefined') {
        const assignment = createFixedAssignment('Alice', 5);
        TestFramework.assertEquals(assignment.guestName, 'Alice', 'Should store guest name');
        TestFramework.assertEquals(assignment.seatId, 5, 'Should store seat ID');
    } else {
        TestFramework.assertTrue(false, 'createFixedAssignment function not defined yet');
    }
});

TestFramework.test('createAdjacencyConstraint stores both guests', function() {
    if (typeof createAdjacencyConstraint !== 'undefined') {
        const constraint = createAdjacencyConstraint('Alice', 'Bob');
        TestFramework.assertEquals(constraint.guestA, 'Alice', 'Should store first guest');
        TestFramework.assertEquals(constraint.guestB, 'Bob', 'Should store second guest');
    } else {
        TestFramework.assertTrue(false, 'createAdjacencyConstraint function not defined yet');
    }
});

TestFramework.test('createAdjacencyConstraint validates different guests', function() {
    if (typeof createAdjacencyConstraint !== 'undefined') {
        try {
            createAdjacencyConstraint('Alice', 'Alice');
            TestFramework.assertTrue(false, 'Should reject same guest for both positions');
        } catch (error) {
            TestFramework.assertContains(error.message, 'different', 'Error should mention different guests');
        }
    } else {
        TestFramework.assertTrue(false, 'createAdjacencyConstraint function not defined yet');
    }
});

// Seating Arrangement Tests
TestFramework.test('createSeatingArrangement returns empty Map', function() {
    if (typeof createSeatingArrangement !== 'undefined') {
        const arrangement = createSeatingArrangement();
        TestFramework.assertTrue(arrangement instanceof Map, 'Should return a Map');
        TestFramework.assertEquals(arrangement.size, 0, 'Should be empty initially');
    } else {
        TestFramework.assertTrue(false, 'createSeatingArrangement function not defined yet');
    }
});

TestFramework.test('seating arrangement Map can store seat assignments', function() {
    if (typeof createSeatingArrangement !== 'undefined') {
        const arrangement = createSeatingArrangement();
        arrangement.set(1, 'Alice');
        arrangement.set(2, 'Bob');
        
        TestFramework.assertEquals(arrangement.get(1), 'Alice', 'Should store Alice at seat 1');
        TestFramework.assertEquals(arrangement.get(2), 'Bob', 'Should store Bob at seat 2');
        TestFramework.assertEquals(arrangement.size, 2, 'Should have 2 assignments');
    } else {
        TestFramework.assertTrue(false, 'createSeatingArrangement function not defined yet');
    }
});