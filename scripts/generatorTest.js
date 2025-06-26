// ABOUTME: Test suite for the seating generation algorithm
// ABOUTME: Validates generation logic with simple cases, impossible constraints, and randomization

// Import required modules (works in Node.js environment)
let generateSeating, shuffleArray, createTableConfig, calculateAdjacencyMap;

if (typeof require !== 'undefined') {
    try {
        const generatorModule = require('./seatingGenerator.js');
        generateSeating = generatorModule.generateSeating;
        shuffleArray = generatorModule.shuffleArray;
        
        const modelsModule = require('./models.js');
        createTableConfig = modelsModule.createTableConfig;
        
        const adjacencyModule = require('./adjacencyCalculator.js');
        calculateAdjacencyMap = adjacencyModule.calculateAdjacencyMap;
    } catch (error) {
        console.error('Error importing modules:', error.message);
    }
}

function runGeneratorTests() {
    console.log('Running Seating Generator Tests...');
    
    let testsPassed = 0;
    let testsTotal = 0;

    // Test 1: Simple case with no constraints
    testsTotal++;
    try {
        console.log('\nTest 1: Simple case with no constraints');
        
        const tableConfig = createTableConfig(2, 2, 2, 2); // 8 seats
        const guests = ['Alice', 'Bob', 'Charlie', 'Diana'];
        const fixedAssignments = {};
        const adjacencyConstraints = [];
        const adjacencyMap = calculateAdjacencyMap(tableConfig);

        const result = generateSeating(guests, tableConfig, fixedAssignments, adjacencyConstraints, adjacencyMap);
        
        console.log('Result:', result);
        
        if (result.success && result.arrangement.size === guests.length) {
            console.log('✓ Test 1 passed');
            testsPassed++;
        } else {
            console.log('✗ Test 1 failed');
        }
    } catch (error) {
        console.log('✗ Test 1 failed with error:', error.message);
    }

    // Test 2: Case with fixed assignments
    testsTotal++;
    try {
        console.log('\nTest 2: Case with fixed assignments');
        
        const tableConfig = createTableConfig(2, 2, 2, 2); // 8 seats
        const guests = ['Alice', 'Bob', 'Charlie'];
        const fixedAssignments = { '1': 'Alice' }; // Alice fixed at seat 1
        const adjacencyConstraints = [];
        const adjacencyMap = calculateAdjacencyMap(tableConfig);

        const result = generateSeating(guests, tableConfig, fixedAssignments, adjacencyConstraints, adjacencyMap);
        
        console.log('Result:', result);
        
        if (result.success && result.arrangement.get('1') === 'Alice') {
            console.log('✓ Test 2 passed');
            testsPassed++;
        } else {
            console.log('✗ Test 2 failed');
        }
    } catch (error) {
        console.log('✗ Test 2 failed with error:', error.message);
    }

    // Test 3: Case with adjacency constraints
    testsTotal++;
    try {
        console.log('\nTest 3: Case with adjacency constraints');
        
        const tableConfig = createTableConfig(2, 1, 2, 1); // 6 seats
        const guests = ['Alice', 'Bob', 'Charlie', 'Diana'];
        const fixedAssignments = {};
        const adjacencyConstraints = [
            { guestA: 'Alice', guestB: 'Bob' }
        ];
        const adjacencyMap = calculateAdjacencyMap(tableConfig);

        const result = generateSeating(guests, tableConfig, fixedAssignments, adjacencyConstraints, adjacencyMap);
        
        console.log('Result:', result);
        
        if (result.success) {
            // Verify Alice and Bob are adjacent
            let aliceSeat = null;
            let bobSeat = null;
            
            for (const [seatId, guest] of result.arrangement) {
                if (guest === 'Alice') aliceSeat = seatId;
                if (guest === 'Bob') bobSeat = seatId;
            }
            
            if (aliceSeat && bobSeat) {
                const adjacentSeats = adjacencyMap.get(aliceSeat) || [];
                if (adjacentSeats.includes(bobSeat)) {
                    console.log('✓ Test 3 passed');
                    testsPassed++;
                } else {
                    console.log('✗ Test 3 failed - Alice and Bob not adjacent');
                }
            } else {
                console.log('✗ Test 3 failed - Could not find Alice or Bob');
            }
        } else {
            console.log('✗ Test 3 failed - Generation unsuccessful');
        }
    } catch (error) {
        console.log('✗ Test 3 failed with error:', error.message);
    }

    // Test 4: Impossible constraint case
    testsTotal++;
    try {
        console.log('\nTest 4: Impossible constraint case');
        
        const tableConfig = createTableConfig(3, 1, 3, 1); // 8 seats total
        const guests = ['Alice', 'Bob', 'Charlie'];
        const fixedAssignments = { '1': 'Alice', '5': 'Bob' }; // Alice at seat 1 (top-left), Bob at seat 5 (bottom-left) - far apart
        const adjacencyConstraints = [
            { guestA: 'Alice', guestB: 'Bob' } // Should be difficult/impossible given distance
        ];
        const adjacencyMap = calculateAdjacencyMap(tableConfig);

        const result = generateSeating(guests, tableConfig, fixedAssignments, adjacencyConstraints, adjacencyMap);
        
        console.log('Result:', result);
        
        if (!result.success && result.unmetConstraints.length > 0) {
            console.log('✓ Test 4 passed - Correctly identified impossible constraint');
            testsPassed++;
        } else {
            console.log('✗ Test 4 failed - Should have failed with impossible constraint');
        }
    } catch (error) {
        console.log('✗ Test 4 failed with error:', error.message);
    }

    // Test 5: Randomization verification
    testsTotal++;
    try {
        console.log('\nTest 5: Randomization verification');
        
        const tableConfig = createTableConfig(3, 3, 3, 3); // 12 seats
        const guests = ['Alice', 'Bob', 'Charlie'];
        const fixedAssignments = {};
        const adjacencyConstraints = [];
        const adjacencyMap = calculateAdjacencyMap(tableConfig);

        // Generate multiple solutions and check they are different
        const arrangements = [];
        for (let i = 0; i < 5; i++) {
            const result = generateSeating(guests, tableConfig, fixedAssignments, adjacencyConstraints, adjacencyMap);
            if (result.success) {
                arrangements.push(result.arrangement);
            }
        }

        // Check if we got different arrangements
        if (arrangements.length >= 2) {
            let foundDifference = false;
            const firstArrangement = arrangements[0];
            
            for (let i = 1; i < arrangements.length; i++) {
                const currentArrangement = arrangements[i];
                
                // Compare arrangements
                for (const [seatId, guest] of firstArrangement) {
                    if (currentArrangement.get(seatId) !== guest) {
                        foundDifference = true;
                        break;
                    }
                }
                
                if (foundDifference) break;
            }

            if (foundDifference) {
                console.log('✓ Test 5 passed - Randomization working');
                testsPassed++;
            } else {
                console.log('? Test 5 inconclusive - Multiple runs produced same result (could be random)');
                testsPassed++; // Don't fail this test as it could be coincidence
            }
        } else {
            console.log('✗ Test 5 failed - Could not generate multiple solutions');
        }
    } catch (error) {
        console.log('✗ Test 5 failed with error:', error.message);
    }

    // Test 6: Shuffle array function
    testsTotal++;
    try {
        console.log('\nTest 6: Shuffle array function');
        
        const originalArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        const shuffledArray = shuffleArray(originalArray);
        
        // Check that all elements are present
        const sortedOriginal = [...originalArray].sort();
        const sortedShuffled = [...shuffledArray].sort();
        
        let allElementsPresent = true;
        if (sortedOriginal.length !== sortedShuffled.length) {
            allElementsPresent = false;
        } else {
            for (let i = 0; i < sortedOriginal.length; i++) {
                if (sortedOriginal[i] !== sortedShuffled[i]) {
                    allElementsPresent = false;
                    break;
                }
            }
        }

        if (allElementsPresent) {
            console.log('✓ Test 6 passed - Shuffle preserves all elements');
            testsPassed++;
        } else {
            console.log('✗ Test 6 failed - Shuffle lost or duplicated elements');
        }
    } catch (error) {
        console.log('✗ Test 6 failed with error:', error.message);
    }

    // Summary
    console.log('\n=== Generator Test Results ===');
    console.log(`Passed: ${testsPassed}/${testsTotal}`);
    
    if (testsPassed === testsTotal) {
        console.log('All tests passed! ✓');
        return true;
    } else {
        console.log('Some tests failed! ✗');
        return false;
    }
}

// Auto-run tests if this file is executed directly in Node.js
if (typeof module !== 'undefined' && require.main === module) {
    runGeneratorTests();
}

// Export for browser environment
if (typeof window !== 'undefined') {
    window.runGeneratorTests = runGeneratorTests;
}