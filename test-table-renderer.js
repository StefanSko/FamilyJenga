// ABOUTME: Node.js test runner for the table renderer functionality
// ABOUTME: Tests seat position calculations and table rendering logic without DOM

const tableRenderer = require('./scripts/tableRenderer.js');

const {
    calculateSeatPositions
} = tableRenderer;

class TableRendererTestRunner {
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

    assertNotNull(value, message = '') {
        if (value === null || value === undefined) {
            throw new Error(`Expected non-null value, got ${value}. ${message}`);
        }
    }

    runAll() {
        console.log('🧪 Testing tableRenderer.js functionality...\n');
        
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

const runner = new TableRendererTestRunner();

// calculateSeatPositions tests
runner.test('calculateSeatPositions returns correct data structure', function() {
    const tableConfig = { topSeats: 2, rightSeats: 2, bottomSeats: 2, leftSeats: 2, totalSeats: 8 };
    const positions = calculateSeatPositions(tableConfig);
    
    runner.assertTrue(Array.isArray(positions));
    runner.assertEquals(positions.length, 8);
    
    const firstSeat = positions[0];
    runner.assertNotNull(firstSeat.seatId);
    runner.assertNotNull(firstSeat.side);
    runner.assertTrue(typeof firstSeat.position === 'number');
    runner.assertTrue(typeof firstSeat.x === 'number');
    runner.assertTrue(typeof firstSeat.y === 'number');
});

runner.test('calculateSeatPositions distributes seats by side correctly', function() {
    const tableConfig = { topSeats: 2, rightSeats: 1, bottomSeats: 2, leftSeats: 1, totalSeats: 6 };
    const positions = calculateSeatPositions(tableConfig);
    
    const topSeats = positions.filter(p => p.side === 'top');
    const rightSeats = positions.filter(p => p.side === 'right');
    const bottomSeats = positions.filter(p => p.side === 'bottom');
    const leftSeats = positions.filter(p => p.side === 'left');
    
    runner.assertEquals(topSeats.length, 2);
    runner.assertEquals(rightSeats.length, 1);
    runner.assertEquals(bottomSeats.length, 2);
    runner.assertEquals(leftSeats.length, 1);
});

runner.test('calculateSeatPositions assigns sequential IDs clockwise', function() {
    const tableConfig = { topSeats: 2, rightSeats: 2, bottomSeats: 2, leftSeats: 2, totalSeats: 8 };
    const positions = calculateSeatPositions(tableConfig);
    
    // Sort by seatId
    positions.sort((a, b) => a.seatId - b.seatId);
    
    for (let i = 0; i < positions.length; i++) {
        runner.assertEquals(positions[i].seatId, i + 1);
    }
    
    // Check clockwise order
    const firstTopSeat = positions.find(p => p.side === 'top' && p.position === 0);
    const firstRightSeat = positions.find(p => p.side === 'right' && p.position === 0);
    
    runner.assertTrue(firstTopSeat.seatId < firstRightSeat.seatId);
});

runner.test('calculateSeatPositions handles zero seats on sides', function() {
    const tableConfig = { topSeats: 2, rightSeats: 0, bottomSeats: 2, leftSeats: 0, totalSeats: 4 };
    const positions = calculateSeatPositions(tableConfig);
    
    runner.assertEquals(positions.length, 4);
    
    const rightSeats = positions.filter(p => p.side === 'right');
    const leftSeats = positions.filter(p => p.side === 'left');
    
    runner.assertEquals(rightSeats.length, 0);
    runner.assertEquals(leftSeats.length, 0);
});

runner.test('calculateSeatPositions generates reasonable coordinates', function() {
    const tableConfig = { topSeats: 3, rightSeats: 3, bottomSeats: 3, leftSeats: 3, totalSeats: 12 };
    const positions = calculateSeatPositions(tableConfig);
    
    positions.forEach(seat => {
        runner.assertTrue(seat.x >= 0, `Seat ${seat.seatId} x should be non-negative`);
        runner.assertTrue(seat.y >= 0, `Seat ${seat.seatId} y should be non-negative`);
        runner.assertTrue(seat.x <= 1000, `Seat ${seat.seatId} x should be reasonable`);
        runner.assertTrue(seat.y <= 1000, `Seat ${seat.seatId} y should be reasonable`);
    });
});

runner.test('seats on same side have different positions', function() {
    const tableConfig = { topSeats: 3, rightSeats: 2, bottomSeats: 3, leftSeats: 2, totalSeats: 10 };
    const positions = calculateSeatPositions(tableConfig);
    
    // Check top seats have different x coordinates
    const topSeats = positions.filter(p => p.side === 'top').sort((a, b) => a.position - b.position);
    if (topSeats.length > 1) {
        runner.assertTrue(topSeats[0].x !== topSeats[1].x);
    }
    
    // Check right seats have different y coordinates  
    const rightSeats = positions.filter(p => p.side === 'right').sort((a, b) => a.position - b.position);
    if (rightSeats.length > 1) {
        runner.assertTrue(rightSeats[0].y !== rightSeats[1].y);
    }
});

runner.test('single seat per side is centered', function() {
    const tableConfig = { topSeats: 1, rightSeats: 1, bottomSeats: 1, leftSeats: 1, totalSeats: 4 };
    const positions = calculateSeatPositions(tableConfig);
    
    const topSeat = positions.find(p => p.side === 'top');
    const rightSeat = positions.find(p => p.side === 'right');
    const bottomSeat = positions.find(p => p.side === 'bottom');
    const leftSeat = positions.find(p => p.side === 'left');
    
    // Top and bottom seats should be horizontally centered
    runner.assertEquals(topSeat.x, bottomSeat.x, 'Top and bottom seats should align horizontally');
    
    // Left and right seats should be vertically centered
    runner.assertEquals(leftSeat.y, rightSeat.y, 'Left and right seats should align vertically');
});

runner.test('table scales appropriately for different sizes', function() {
    const smallTable = { topSeats: 1, rightSeats: 1, bottomSeats: 1, leftSeats: 1, totalSeats: 4 };
    const largeTable = { topSeats: 5, rightSeats: 5, bottomSeats: 5, leftSeats: 5, totalSeats: 20 };
    
    const smallPositions = calculateSeatPositions(smallTable);
    const largePositions = calculateSeatPositions(largeTable);
    
    runner.assertEquals(smallPositions.length, 4);
    runner.assertEquals(largePositions.length, 20);
    
    // Both should use similar coordinate ranges
    const maxSmallX = Math.max(...smallPositions.map(p => p.x));
    const maxLargeX = Math.max(...largePositions.map(p => p.x));
    
    runner.assertTrue(maxSmallX > 0);
    runner.assertTrue(maxLargeX > 0);
});

runner.test('positions maintain clockwise order consistency', function() {
    const tableConfig = { topSeats: 2, rightSeats: 3, bottomSeats: 2, leftSeats: 1, totalSeats: 8 };
    const positions = calculateSeatPositions(tableConfig);
    
    // Get seats by side in order
    const topSeats = positions.filter(p => p.side === 'top').sort((a, b) => a.seatId - b.seatId);
    const rightSeats = positions.filter(p => p.side === 'right').sort((a, b) => a.seatId - b.seatId);
    const bottomSeats = positions.filter(p => p.side === 'bottom').sort((a, b) => a.seatId - b.seatId);
    const leftSeats = positions.filter(p => p.side === 'left').sort((a, b) => a.seatId - b.seatId);
    
    // Verify clockwise order: top -> right -> bottom -> left
    if (topSeats.length > 0 && rightSeats.length > 0) {
        runner.assertTrue(topSeats[topSeats.length - 1].seatId < rightSeats[0].seatId);
    }
    if (rightSeats.length > 0 && bottomSeats.length > 0) {
        runner.assertTrue(rightSeats[rightSeats.length - 1].seatId < bottomSeats[0].seatId);
    }
    if (bottomSeats.length > 0 && leftSeats.length > 0) {
        runner.assertTrue(bottomSeats[bottomSeats.length - 1].seatId < leftSeats[0].seatId);
    }
});

// Run all tests
runner.runAll();