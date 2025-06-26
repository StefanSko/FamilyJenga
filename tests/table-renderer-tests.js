// ABOUTME: Tests for the table renderer module functionality
// ABOUTME: Validates seat positioning, table rendering, and DOM element creation

// Test calculateSeatPositions function
TestFramework.test('calculateSeatPositions returns correct seat data structure', function() {
    if (typeof calculateSeatPositions !== 'undefined') {
        const tableConfig = { topSeats: 2, rightSeats: 2, bottomSeats: 2, leftSeats: 2, totalSeats: 8 };
        const positions = calculateSeatPositions(tableConfig);
        
        TestFramework.assertTrue(Array.isArray(positions), 'Should return an array');
        TestFramework.assertEquals(positions.length, 8, 'Should return 8 seat positions');
        
        // Check first position structure
        const firstSeat = positions[0];
        TestFramework.assertNotNull(firstSeat.seatId, 'Should have seatId');
        TestFramework.assertNotNull(firstSeat.side, 'Should have side');
        TestFramework.assertTrue(typeof firstSeat.position === 'number', 'Should have numeric position');
        TestFramework.assertTrue(typeof firstSeat.x === 'number', 'Should have x coordinate');
        TestFramework.assertTrue(typeof firstSeat.y === 'number', 'Should have y coordinate');
    } else {
        TestFramework.assertTrue(false, 'calculateSeatPositions function not defined yet');
    }
});

TestFramework.test('calculateSeatPositions distributes seats correctly by side', function() {
    if (typeof calculateSeatPositions !== 'undefined') {
        const tableConfig = { topSeats: 2, rightSeats: 1, bottomSeats: 2, leftSeats: 1, totalSeats: 6 };
        const positions = calculateSeatPositions(tableConfig);
        
        const topSeats = positions.filter(p => p.side === 'top');
        const rightSeats = positions.filter(p => p.side === 'right');
        const bottomSeats = positions.filter(p => p.side === 'bottom');
        const leftSeats = positions.filter(p => p.side === 'left');
        
        TestFramework.assertEquals(topSeats.length, 2, 'Should have 2 top seats');
        TestFramework.assertEquals(rightSeats.length, 1, 'Should have 1 right seat');
        TestFramework.assertEquals(bottomSeats.length, 2, 'Should have 2 bottom seats');
        TestFramework.assertEquals(leftSeats.length, 1, 'Should have 1 left seat');
    } else {
        TestFramework.assertTrue(false, 'calculateSeatPositions function not defined yet');
    }
});

TestFramework.test('calculateSeatPositions assigns sequential seat IDs clockwise', function() {
    if (typeof calculateSeatPositions !== 'undefined') {
        const tableConfig = { topSeats: 2, rightSeats: 2, bottomSeats: 2, leftSeats: 2, totalSeats: 8 };
        const positions = calculateSeatPositions(tableConfig);
        
        // Sort by seatId to check sequential numbering
        positions.sort((a, b) => a.seatId - b.seatId);
        
        for (let i = 0; i < positions.length; i++) {
            TestFramework.assertEquals(positions[i].seatId, i + 1, `Seat ${i} should have ID ${i + 1}`);
        }
        
        // Check clockwise order: top, right, bottom, left
        const firstTopSeat = positions.find(p => p.side === 'top' && p.position === 0);
        const firstRightSeat = positions.find(p => p.side === 'right' && p.position === 0);
        
        TestFramework.assertTrue(firstTopSeat.seatId < firstRightSeat.seatId, 'Top seats should come before right seats');
    } else {
        TestFramework.assertTrue(false, 'calculateSeatPositions function not defined yet');
    }
});

TestFramework.test('calculateSeatPositions handles zero seats on sides', function() {
    if (typeof calculateSeatPositions !== 'undefined') {
        const tableConfig = { topSeats: 2, rightSeats: 0, bottomSeats: 2, leftSeats: 0, totalSeats: 4 };
        const positions = calculateSeatPositions(tableConfig);
        
        TestFramework.assertEquals(positions.length, 4, 'Should return 4 seat positions');
        
        const rightSeats = positions.filter(p => p.side === 'right');
        const leftSeats = positions.filter(p => p.side === 'left');
        
        TestFramework.assertEquals(rightSeats.length, 0, 'Should have 0 right seats');
        TestFramework.assertEquals(leftSeats.length, 0, 'Should have 0 left seats');
    } else {
        TestFramework.assertTrue(false, 'calculateSeatPositions function not defined yet');
    }
});

// Test renderTable function
TestFramework.test('renderTable creates container and clears existing content', function() {
    if (typeof renderTable !== 'undefined') {
        const tableConfig = { topSeats: 2, rightSeats: 2, bottomSeats: 2, leftSeats: 2, totalSeats: 8 };
        
        // Create a test container
        const container = document.createElement('div');
        container.innerHTML = '<div>existing content</div>';
        document.body.appendChild(container);
        
        const result = renderTable(tableConfig, container);
        
        TestFramework.assertTrue(typeof result === 'object', 'Should return an object');
        TestFramework.assertEquals(container.querySelector('div:first-child').innerHTML, '', 'Should clear existing content or create new structure');
        
        document.body.removeChild(container);
    } else {
        TestFramework.assertTrue(false, 'renderTable function not defined yet');
    }
});

TestFramework.test('renderTable returns seat element mapping', function() {
    if (typeof renderTable !== 'undefined') {
        const tableConfig = { topSeats: 2, rightSeats: 2, bottomSeats: 2, leftSeats: 2, totalSeats: 8 };
        
        const container = document.createElement('div');
        document.body.appendChild(container);
        
        const seatElements = renderTable(tableConfig, container);
        
        TestFramework.assertTrue(typeof seatElements === 'object', 'Should return seat elements mapping');
        TestFramework.assertTrue(Object.keys(seatElements).length > 0, 'Should have seat elements');
        
        // Check that we have 8 seat elements
        TestFramework.assertEquals(Object.keys(seatElements).length, 8, 'Should have 8 seat elements');
        
        document.body.removeChild(container);
    } else {
        TestFramework.assertTrue(false, 'renderTable function not defined yet');
    }
});

TestFramework.test('renderTable creates seats with correct attributes', function() {
    if (typeof renderTable !== 'undefined') {
        const tableConfig = { topSeats: 1, rightSeats: 1, bottomSeats: 1, leftSeats: 1, totalSeats: 4 };
        
        const container = document.createElement('div');
        document.body.appendChild(container);
        
        const seatElements = renderTable(tableConfig, container);
        
        // Check first seat element
        const firstSeatElement = seatElements[1]; // Seat ID 1
        TestFramework.assertNotNull(firstSeatElement, 'Should have seat element for ID 1');
        
        // Check data attributes
        TestFramework.assertTrue(firstSeatElement.hasAttribute('data-seat-id'), 'Should have data-seat-id attribute');
        TestFramework.assertTrue(firstSeatElement.hasAttribute('data-side'), 'Should have data-side attribute');
        
        document.body.removeChild(container);
    } else {
        TestFramework.assertTrue(false, 'renderTable function not defined yet');
    }
});

TestFramework.test('renderTable creates clickable seat elements', function() {
    if (typeof renderTable !== 'undefined') {
        const tableConfig = { topSeats: 1, rightSeats: 1, bottomSeats: 1, leftSeats: 1, totalSeats: 4 };
        
        const container = document.createElement('div');
        document.body.appendChild(container);
        
        const seatElements = renderTable(tableConfig, container);
        const firstSeat = seatElements[1];
        
        // Check that seat is clickable (has cursor pointer or click handler potential)
        TestFramework.assertTrue(firstSeat.style.cursor === 'pointer' || firstSeat.classList.contains('seat'), 'Seat should be clickable');
        
        document.body.removeChild(container);
    } else {
        TestFramework.assertTrue(false, 'renderTable function not defined yet');
    }
});

// Test seat positioning calculations
TestFramework.test('seat positions are within reasonable bounds', function() {
    if (typeof calculateSeatPositions !== 'undefined') {
        const tableConfig = { topSeats: 3, rightSeats: 3, bottomSeats: 3, leftSeats: 3, totalSeats: 12 };
        const positions = calculateSeatPositions(tableConfig);
        
        positions.forEach(seat => {
            TestFramework.assertTrue(seat.x >= 0, `Seat ${seat.seatId} x coordinate should be non-negative`);
            TestFramework.assertTrue(seat.y >= 0, `Seat ${seat.seatId} y coordinate should be non-negative`);
            TestFramework.assertTrue(seat.x <= 1000, `Seat ${seat.seatId} x coordinate should be reasonable`);
            TestFramework.assertTrue(seat.y <= 1000, `Seat ${seat.seatId} y coordinate should be reasonable`);
        });
    } else {
        TestFramework.assertTrue(false, 'calculateSeatPositions function not defined yet');
    }
});

TestFramework.test('seats on same side have different positions', function() {
    if (typeof calculateSeatPositions !== 'undefined') {
        const tableConfig = { topSeats: 3, rightSeats: 2, bottomSeats: 3, leftSeats: 2, totalSeats: 10 };
        const positions = calculateSeatPositions(tableConfig);
        
        // Check top seats have different x coordinates
        const topSeats = positions.filter(p => p.side === 'top').sort((a, b) => a.position - b.position);
        if (topSeats.length > 1) {
            TestFramework.assertTrue(topSeats[0].x !== topSeats[1].x, 'Top seats should have different x coordinates');
        }
        
        // Check right seats have different y coordinates
        const rightSeats = positions.filter(p => p.side === 'right').sort((a, b) => a.position - b.position);
        if (rightSeats.length > 1) {
            TestFramework.assertTrue(rightSeats[0].y !== rightSeats[1].y, 'Right seats should have different y coordinates');
        }
    } else {
        TestFramework.assertTrue(false, 'calculateSeatPositions function not defined yet');
    }
});

// Test table scaling and responsive behavior
TestFramework.test('table scales appropriately for different configurations', function() {
    if (typeof calculateSeatPositions !== 'undefined') {
        const smallTable = { topSeats: 1, rightSeats: 1, bottomSeats: 1, leftSeats: 1, totalSeats: 4 };
        const largeTable = { topSeats: 5, rightSeats: 5, bottomSeats: 5, leftSeats: 5, totalSeats: 20 };
        
        const smallPositions = calculateSeatPositions(smallTable);
        const largePositions = calculateSeatPositions(largeTable);
        
        TestFramework.assertEquals(smallPositions.length, 4, 'Small table should have 4 seats');
        TestFramework.assertEquals(largePositions.length, 20, 'Large table should have 20 seats');
        
        // Both should use similar coordinate ranges (scaling)
        const maxSmallX = Math.max(...smallPositions.map(p => p.x));
        const maxLargeX = Math.max(...largePositions.map(p => p.x));
        
        TestFramework.assertTrue(maxSmallX > 0, 'Small table should have positive coordinates');
        TestFramework.assertTrue(maxLargeX > 0, 'Large table should have positive coordinates');
    } else {
        TestFramework.assertTrue(false, 'calculateSeatPositions function not defined yet');
    }
});