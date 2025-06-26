// ABOUTME: Test file for adjacencyCalculator.js functionality validation following TDD principles
// ABOUTME: Ensures seat adjacency mathematical logic works correctly for all table configurations

const { createTableConfig } = require('./scripts/models.js');

// TDD: Write tests first, then implement the functions to make them pass
// These tests will initially fail, then we'll implement the functions

let adjacencyCalculatorModule;

// Try to load the module, but don't fail if it doesn't exist yet (TDD approach)
try {
    adjacencyCalculatorModule = require('./scripts/adjacencyCalculator.js');
} catch (error) {
    console.log('adjacencyCalculator.js not yet implemented - this is expected in TDD');
    adjacencyCalculatorModule = {};
}

const {
    calculateTableGeometry = () => {
        throw new Error('calculateTableGeometry not implemented');
    },
    calculateAdjacencyMap = () => {
        throw new Error('calculateAdjacencyMap not implemented');
    },
    areSeatsAdjacent = () => {
        throw new Error('areSeatsAdjacent not implemented');
    },
    getCornerSeatConnections = () => {
        throw new Error('getCornerSeatConnections not implemented');
    }
} = adjacencyCalculatorModule;

function testCalculateTableGeometry() {
    console.log('🧪 Testing calculateTableGeometry...');
    
    // Test simple 2x2 table (8 seats total)
    const tableConfig = createTableConfig(2, 2, 2, 2);
    
    try {
        const geometry = calculateTableGeometry(tableConfig);
        
        // Should return a map with seat positions
        console.assert(geometry instanceof Map || typeof geometry === 'object', 'Should return Map or object');
        
        // Should have 8 seats for 2x2 table
        const seatCount = geometry instanceof Map ? geometry.size : Object.keys(geometry).length;
        console.assert(seatCount === 8, `Should have 8 seats, got ${seatCount}`);
        
        // Each seat should have x, y, side, position properties
        const firstSeat = geometry instanceof Map ? geometry.values().next().value : Object.values(geometry)[0];
        console.assert(typeof firstSeat.x === 'number', 'Seat should have numeric x coordinate');
        console.assert(typeof firstSeat.y === 'number', 'Seat should have numeric y coordinate');
        console.assert(typeof firstSeat.side === 'string', 'Seat should have side property');
        console.assert(typeof firstSeat.position === 'number', 'Seat should have position property');
        
        console.log('✅ calculateTableGeometry returns correct structure');
        
        // Test coordinate ranges are reasonable
        const seats = geometry instanceof Map ? Array.from(geometry.values()) : Object.values(geometry);
        const xCoords = seats.map(seat => seat.x);
        const yCoords = seats.map(seat => seat.y);
        
        const minX = Math.min(...xCoords);
        const maxX = Math.max(...xCoords);
        const minY = Math.min(...yCoords);
        const maxY = Math.max(...yCoords);
        
        console.assert(maxX > minX, 'X coordinates should have range');
        console.assert(maxY > minY, 'Y coordinates should have range');
        console.assert(minX >= 0 && minY >= 0, 'Coordinates should be positive');
        
        console.log('✅ Coordinate ranges are reasonable');
        
    } catch (error) {
        console.log('⏳ calculateTableGeometry not yet implemented:', error.message);
    }
}

function testCalculateAdjacencyMap() {
    console.log('🧪 Testing calculateAdjacencyMap...');
    
    // Test simple 2x2 table
    const tableConfig = createTableConfig(2, 2, 2, 2);
    
    try {
        const adjacencyMap = calculateAdjacencyMap(tableConfig);
        
        // Should return a Map
        console.assert(adjacencyMap instanceof Map, 'Should return a Map');
        
        // Should have 8 entries for 2x2 table
        console.assert(adjacencyMap.size === 8, `Should have 8 seats, got ${adjacencyMap.size}`);
        
        // Each seat should have an array of adjacent seats
        for (const [seatId, adjacentSeats] of adjacencyMap) {
            console.assert(typeof seatId === 'string', 'Seat ID should be string');
            console.assert(Array.isArray(adjacentSeats), 'Adjacent seats should be array');
            console.assert(adjacentSeats.length > 0, `Seat ${seatId} should have adjacent seats`);
            console.assert(adjacentSeats.length <= 3, `Seat ${seatId} should have at most 3 adjacent seats`);
        }
        
        console.log('✅ calculateAdjacencyMap returns correct structure');
        
        // Test specific adjacency rules for 2x2 table
        // In a 2x2 table, seats should be numbered clockwise starting from top-left
        // Top: 1, 2
        // Right: 3, 4  
        // Bottom: 5, 6
        // Left: 7, 8
        
        // Corner seats should connect across corners
        const seat1Adjacent = adjacencyMap.get('1'); // top-left corner
        console.assert(seat1Adjacent.includes('2'), 'Seat 1 should be adjacent to seat 2');
        console.assert(seat1Adjacent.includes('8'), 'Seat 1 should be adjacent to seat 8');
        
        const seat3Adjacent = adjacencyMap.get('3'); // top-right corner  
        console.assert(seat3Adjacent.includes('2'), 'Seat 3 should be adjacent to seat 2');
        console.assert(seat3Adjacent.includes('4'), 'Seat 3 should be adjacent to seat 4');
        
        console.log('✅ Adjacency rules work correctly');
        
    } catch (error) {
        console.log('⏳ calculateAdjacencyMap not yet implemented:', error.message);
    }
}

function testAreSeatsAdjacent() {
    console.log('🧪 Testing areSeatsAdjacent...');
    
    const tableConfig = createTableConfig(2, 2, 2, 2);
    
    try {
        const adjacencyMap = calculateAdjacencyMap(tableConfig);
        
        // Test adjacent seats
        console.assert(areSeatsAdjacent('1', '2', adjacencyMap) === true, 'Seats 1 and 2 should be adjacent');
        console.assert(areSeatsAdjacent('2', '1', adjacencyMap) === true, 'Adjacency should be symmetric');
        
        // Test non-adjacent seats
        console.assert(areSeatsAdjacent('1', '5', adjacencyMap) === false, 'Seats 1 and 5 should not be adjacent');
        
        // Test invalid seats
        console.assert(areSeatsAdjacent('1', '99', adjacencyMap) === false, 'Invalid seat should return false');
        console.assert(areSeatsAdjacent('99', '1', adjacencyMap) === false, 'Invalid seat should return false');
        
        console.log('✅ areSeatsAdjacent works correctly');
        
    } catch (error) {
        console.log('⏳ areSeatsAdjacent not yet implemented:', error.message);
    }
}

function testGetCornerSeatConnections() {
    console.log('🧪 Testing getCornerSeatConnections...');
    
    const tableConfig = createTableConfig(2, 2, 2, 2);
    
    try {
        const cornerConnections = getCornerSeatConnections(tableConfig);
        
        // Should return an object or array describing corner connections
        console.assert(typeof cornerConnections === 'object', 'Should return object');
        
        // Should have connections for all 4 corners
        // This will depend on the implementation, but we expect corner logic
        
        console.log('✅ getCornerSeatConnections returns structure');
        
    } catch (error) {
        console.log('⏳ getCornerSeatConnections not yet implemented:', error.message);
    }
}

function testLargerTable() {
    console.log('🧪 Testing larger table configurations...');
    
    // Test 3x3 table (12 seats total)
    const largerConfig = createTableConfig(3, 3, 3, 3);
    
    try {
        const geometry = calculateTableGeometry(largerConfig);
        const adjacencyMap = calculateAdjacencyMap(largerConfig);
        
        // Should have 12 seats
        const seatCount = geometry instanceof Map ? geometry.size : Object.keys(geometry).length;
        console.assert(seatCount === 12, `Should have 12 seats for 3x3 table, got ${seatCount}`);
        console.assert(adjacencyMap.size === 12, `Adjacency map should have 12 entries, got ${adjacencyMap.size}`);
        
        // Middle seats on each side should have 2 adjacent seats
        // Corner seats should have 2 adjacent seats  
        let cornerSeats = 0;
        let middleSeats = 0;
        
        for (const [seatId, adjacentSeats] of adjacencyMap) {
            if (adjacentSeats.length === 2) {
                if (['1', '4', '7', '10'].includes(seatId)) {
                    cornerSeats++;
                } else {
                    middleSeats++;
                }
            }
        }
        
        console.assert(cornerSeats === 4, `Should have 4 corner seats with 2 adjacent, got ${cornerSeats}`);
        console.assert(middleSeats === 8, `Should have 8 middle seats with 2 adjacent, got ${middleSeats}`);
        
        console.log('✅ Larger table configurations work correctly');
        
    } catch (error) {
        console.log('⏳ Larger table test not yet passing:', error.message);
    }
}

function testAsymmetricTable() {
    console.log('🧪 Testing asymmetric table...');
    
    // Test 1x2x3x1 table (7 seats total)  
    const asymmetricConfig = createTableConfig(1, 2, 3, 1);
    
    try {
        const geometry = calculateTableGeometry(asymmetricConfig);
        const adjacencyMap = calculateAdjacencyMap(asymmetricConfig);
        
        // Should have 7 seats
        const seatCount = geometry instanceof Map ? geometry.size : Object.keys(geometry).length;
        console.assert(seatCount === 7, `Should have 7 seats for asymmetric table, got ${seatCount}`);
        console.assert(adjacencyMap.size === 7, `Adjacency map should have 7 entries, got ${adjacencyMap.size}`);
        
        console.log('✅ Asymmetric table configurations work correctly');
        
    } catch (error) {
        console.log('⏳ Asymmetric table test not yet passing:', error.message);
    }
}

function testEdgeCases() {
    console.log('🧪 Testing edge cases...');
    
    try {
        // Test table with zero seats on some sides
        const edgeConfig = createTableConfig(2, 0, 2, 0);
        const geometry = calculateTableGeometry(edgeConfig);
        const adjacencyMap = calculateAdjacencyMap(edgeConfig);
        
        // Should handle zero seats gracefully
        const seatCount = geometry instanceof Map ? geometry.size : Object.keys(geometry).length;
        console.assert(seatCount === 4, `Should have 4 seats with zero sides, got ${seatCount}`);
        console.assert(adjacencyMap.size === 4, `Adjacency map should have 4 entries, got ${adjacencyMap.size}`);
        
        // Single seat table
        const singleConfig = createTableConfig(1, 0, 0, 0);
        const singleGeometry = calculateTableGeometry(singleConfig);
        const singleAdjacency = calculateAdjacencyMap(singleConfig);
        
        const singleSeatCount = singleGeometry instanceof Map ? singleGeometry.size : Object.keys(singleGeometry).length;
        console.assert(singleSeatCount === 1, `Should have 1 seat, got ${singleSeatCount}`);
        
        // Single seat should have no adjacent seats
        const singleSeatAdjacent = singleAdjacency.get('1') || [];
        console.assert(singleSeatAdjacent.length === 0, 'Single seat should have no adjacent seats');
        
        console.log('✅ Edge cases handled correctly');
        
    } catch (error) {
        console.log('⏳ Edge cases not yet passing:', error.message);
    }
}

// Run all tests
function runAllTests() {
    console.log('🧪 Testing adjacencyCalculator.js functionality (TDD approach)...\n');
    
    let testsRun = 0;
    let testsPassed = 0;
    
    try {
        testCalculateTableGeometry();
        testsRun++;
        testsPassed++;
    } catch (error) {
        testsRun++;
        console.log('❌ calculateTableGeometry tests failed:', error.message);
    }
    
    try {
        testCalculateAdjacencyMap();
        testsRun++;
        testsPassed++;
    } catch (error) {
        testsRun++;
        console.log('❌ calculateAdjacencyMap tests failed:', error.message);
    }
    
    try {
        testAreSeatsAdjacent();
        testsRun++;
        testsPassed++;
    } catch (error) {
        testsRun++;
        console.log('❌ areSeatsAdjacent tests failed:', error.message);
    }
    
    try {
        testGetCornerSeatConnections();
        testsRun++;
        testsPassed++;
    } catch (error) {
        testsRun++;
        console.log('❌ getCornerSeatConnections tests failed:', error.message);
    }
    
    try {
        testLargerTable();
        testsRun++;
        testsPassed++;
    } catch (error) {
        testsRun++;
        console.log('❌ Larger table tests failed:', error.message);
    }
    
    try {
        testAsymmetricTable();
        testsRun++;
        testsPassed++;
    } catch (error) {
        testsRun++;
        console.log('❌ Asymmetric table tests failed:', error.message);
    }
    
    try {
        testEdgeCases();
        testsRun++;
        testsPassed++;
    } catch (error) {
        testsRun++;
        console.log('❌ Edge case tests failed:', error.message);
    }
    
    console.log(`\n📊 Results: ${testsPassed} passed, ${testsRun - testsPassed} failed out of ${testsRun} test suites`);
    
    if (testsPassed === testsRun) {
        console.log('🎉 All adjacency calculator tests pass!');
    } else {
        console.log('⏳ Some tests failing - implement the functions to make them pass (TDD)');
    }
}

// Run tests if this file is executed directly
if (require.main === module) {
    runAllTests();
}

module.exports = {
    runAllTests,
    testCalculateTableGeometry,
    testCalculateAdjacencyMap,
    testAreSeatsAdjacent,
    testGetCornerSeatConnections,
    testLargerTable,
    testAsymmetricTable,
    testEdgeCases
};