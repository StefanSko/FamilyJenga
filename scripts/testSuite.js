// ABOUTME: Comprehensive test suite with test data sets for the dinner seating application
// ABOUTME: Provides automated testing functionality to verify constraint satisfaction and performance

// Test data sets
const testDataSets = {
    // Simple 8-person dinner
    simple: {
        name: 'Simple 8-Person Dinner',
        tableConfig: {
            topSeats: 2,
            rightSeats: 2,
            bottomSeats: 2,
            leftSeats: 2
        },
        guests: [
            'Alice Johnson',
            'Bob Smith',
            'Carol Davis',
            'David Wilson',
            'Eve Brown',
            'Frank Miller',
            'Grace Lee',
            'Henry Taylor'
        ],
        fixedAssignments: [
            { guest: 'Alice Johnson', seatId: 1 },
            { guest: 'Bob Smith', seatId: 5 }
        ],
        adjacencyConstraints: [
            { guestA: 'Carol Davis', guestB: 'David Wilson' },
            { guestA: 'Eve Brown', guestB: 'Frank Miller' }
        ],
        expectedSuccess: true
    },

    // Complex 20-person dinner with many constraints
    complex: {
        name: 'Complex 20-Person Wedding',
        tableConfig: {
            topSeats: 5,
            rightSeats: 5,
            bottomSeats: 5,
            leftSeats: 5
        },
        guests: [
            'Bride Smith', 'Groom Johnson', 'Mother Smith', 'Father Smith',
            'Mother Johnson', 'Father Johnson', 'Sister Smith', 'Brother Smith',
            'Grandma Smith', 'Grandpa Smith', 'Grandma Johnson', 'Grandpa Johnson',
            'Best Man', 'Maid of Honor', 'Friend 1', 'Friend 2',
            'Friend 3', 'Friend 4', 'Cousin Smith', 'Cousin Johnson'
        ],
        fixedAssignments: [
            { guest: 'Bride Smith', seatId: 3 },
            { guest: 'Groom Johnson', seatId: 4 },
            { guest: 'Mother Smith', seatId: 2 },
            { guest: 'Father Smith', seatId: 5 }
        ],
        adjacencyConstraints: [
            { guestA: 'Mother Johnson', guestB: 'Father Johnson' },
            { guestA: 'Sister Smith', guestB: 'Brother Smith' },
            { guestA: 'Grandma Smith', guestB: 'Grandpa Smith' },
            { guestA: 'Grandma Johnson', guestB: 'Grandpa Johnson' },
            { guestA: 'Best Man', guestB: 'Maid of Honor' },
            { guestA: 'Friend 1', guestB: 'Friend 2' },
            { guestA: 'Friend 3', guestB: 'Friend 4' }
        ],
        expectedSuccess: true
    },

    // Edge case: 1 person
    minimal: {
        name: 'Solo Diner',
        tableConfig: {
            topSeats: 1,
            rightSeats: 0,
            bottomSeats: 0,
            leftSeats: 0
        },
        guests: ['Lonely Larry'],
        fixedAssignments: [],
        adjacencyConstraints: [],
        expectedSuccess: true
    },

    // Edge case: Maximum capacity
    maxCapacity: {
        name: 'Maximum Capacity (50 seats)',
        tableConfig: {
            topSeats: 13,
            rightSeats: 12,
            bottomSeats: 13,
            leftSeats: 12
        },
        guests: Array.from({ length: 50 }, (_, i) => `Guest ${i + 1}`),
        fixedAssignments: [
            { guest: 'Guest 1', seatId: 1 },
            { guest: 'Guest 50', seatId: 50 }
        ],
        adjacencyConstraints: [
            { guestA: 'Guest 10', guestB: 'Guest 11' },
            { guestA: 'Guest 20', guestB: 'Guest 21' },
            { guestA: 'Guest 30', guestB: 'Guest 31' },
            { guestA: 'Guest 40', guestB: 'Guest 41' }
        ],
        expectedSuccess: true
    },

    // Impossible constraints: All must be adjacent
    impossibleAllAdjacent: {
        name: 'Impossible - All Must Be Adjacent',
        tableConfig: {
            topSeats: 2,
            rightSeats: 2,
            bottomSeats: 2,
            leftSeats: 2
        },
        guests: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
        fixedAssignments: [],
        adjacencyConstraints: [
            { guestA: 'A', guestB: 'B' },
            { guestA: 'B', guestB: 'C' },
            { guestA: 'C', guestB: 'D' },
            { guestA: 'D', guestB: 'E' },
            { guestA: 'E', guestB: 'F' },
            { guestA: 'F', guestB: 'G' },
            { guestA: 'G', guestB: 'H' },
            { guestA: 'H', guestB: 'A' }
        ],
        expectedSuccess: false
    },

    // Impossible constraints: Fixed assignments too far
    impossibleFixed: {
        name: 'Impossible - Fixed Too Far Apart',
        tableConfig: {
            topSeats: 3,
            rightSeats: 3,
            bottomSeats: 3,
            leftSeats: 3
        },
        guests: Array.from({ length: 12 }, (_, i) => `Person ${i + 1}`),
        fixedAssignments: [
            { guest: 'Person 1', seatId: 1 },
            { guest: 'Person 2', seatId: 7 }
        ],
        adjacencyConstraints: [
            { guestA: 'Person 1', guestB: 'Person 2' }
        ],
        expectedSuccess: false
    }
};

// Test runner function
async function runTest(testData) {
    console.log(`\n=== Running Test: ${testData.name} ===`);
    
    const startTime = performance.now();
    
    try {
        // Create table configuration
        const tableConfig = createTableConfig(
            testData.tableConfig.topSeats,
            testData.tableConfig.rightSeats,
            testData.tableConfig.bottomSeats,
            testData.tableConfig.leftSeats
        );
        
        // Create adjacency map
        const adjacencyMap = calculateAdjacencyMap(tableConfig);
        
        // Set up fixed assignments
        const fixedAssignments = new Map();
        testData.fixedAssignments.forEach(assignment => {
            fixedAssignments.set(assignment.seatId, assignment.guest);
        });
        
        // Run the generator
        // eslint-disable-next-line no-undef
        const result = generateSeating(
            testData.guests,
            tableConfig,
            fixedAssignments,
            testData.adjacencyConstraints,
            adjacencyMap
        );
        
        const endTime = performance.now();
        const duration = endTime - startTime;
        
        // Report results
        console.log(`Success: ${result.success}`);
        console.log(`Expected: ${testData.expectedSuccess}`);
        console.log(`Duration: ${duration.toFixed(2)}ms`);
        
        if (result.success) {
            // Verify all constraints are satisfied
            const verification = verifyConstraints(
                result.arrangement,
                testData.adjacencyConstraints,
                adjacencyMap
            );
            console.log(`Constraints satisfied: ${verification.allSatisfied}`);
            if (!verification.allSatisfied) {
                console.log('Unsatisfied constraints:', verification.unsatisfied);
            }
        } else {
            console.log('Unmet constraints:', result.unmetConstraints);
        }
        
        // Check performance requirement (< 2 seconds)
        if (duration > 2000) {
            console.warn(`⚠️ Performance warning: Test took ${duration.toFixed(2)}ms (> 2000ms)`);
        }
        
        return {
            testName: testData.name,
            success: result.success === testData.expectedSuccess,
            duration: duration,
            details: result
        };
        
    } catch (error) {
        console.error(`Error in test: ${error.message}`);
        return {
            testName: testData.name,
            success: false,
            error: error.message
        };
    }
}

// Verify constraints function
function verifyConstraints(arrangement, constraints, adjacencyMap) {
    const unsatisfied = [];
    
    // Create reverse mapping (guest -> seatId)
    const guestToSeat = new Map();
    arrangement.forEach((guest, seatId) => {
        guestToSeat.set(guest, seatId);
    });
    
    // Check each constraint
    constraints.forEach(constraint => {
        const seatA = guestToSeat.get(constraint.guestA);
        const seatB = guestToSeat.get(constraint.guestB);
        
        if (!seatA || !seatB) {
            unsatisfied.push({
                constraint,
                reason: 'Guest not seated'
            });
        } else if (!areSeatsAdjacent(seatA, seatB, adjacencyMap)) {
            unsatisfied.push({
                constraint,
                reason: `Seats ${seatA} and ${seatB} are not adjacent`
            });
        }
    });
    
    return {
        allSatisfied: unsatisfied.length === 0,
        unsatisfied
    };
}

// Run all tests
async function runAllTests() {
    console.log('Starting comprehensive test suite...');
    
    const results = [];
    
    for (const testData of Object.values(testDataSets)) {
        const result = await runTest(testData);
        results.push(result);
        
        // Small delay between tests
        await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    // Summary
    console.log('\n=== Test Summary ===');
    const passed = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;
    console.log(`Total tests: ${results.length}`);
    console.log(`Passed: ${passed}`);
    console.log(`Failed: ${failed}`);
    
    // Performance summary
    const avgDuration = results.reduce((sum, r) => sum + (r.duration || 0), 0) / results.length;
    const maxDuration = Math.max(...results.map(r => r.duration || 0));
    console.log(`Average duration: ${avgDuration.toFixed(2)}ms`);
    console.log(`Max duration: ${maxDuration.toFixed(2)}ms`);
    
    return results;
}

// UI test helpers
function populateFormWithTestData(testKey) {
    const testData = testDataSets[testKey];
    if (!testData) {
        console.error(`Test data '${testKey}' not found`);
        return;
    }
    
    // Set table configuration
    document.getElementById('top-seats').value = testData.tableConfig.topSeats;
    document.getElementById('right-seats').value = testData.tableConfig.rightSeats;
    document.getElementById('bottom-seats').value = testData.tableConfig.bottomSeats;
    document.getElementById('left-seats').value = testData.tableConfig.leftSeats;
    
    // Trigger input events to update the display
    ['top-seats', 'right-seats', 'bottom-seats', 'left-seats'].forEach(id => {
        document.getElementById(id).dispatchEvent(new Event('input'));
    });
    
    // Set guest list
    document.getElementById('guest-list-input').value = testData.guests.join('\n');
    document.getElementById('guest-list-input').dispatchEvent(new Event('input'));
    
    console.log(`Loaded test data: ${testData.name}`);
}

// Function to verify visual state
function verifyVisualState() {
    const errors = [];
    
    // Check table display
    const tableDisplay = document.getElementById('table-display');
    if (!tableDisplay) {
        errors.push('Table display element not found');
    }
    
    // Check if table is rendered
    const tableSvg = tableDisplay.querySelector('.table-svg');
    if (!tableSvg) {
        errors.push('Table SVG not rendered');
    }
    
    // Check seat count
    const seatElements = tableDisplay.querySelectorAll('.seat-group');
    const totalSeatsDisplay = document.getElementById('total-seats');
    if (totalSeatsDisplay && seatElements.length !== parseInt(totalSeatsDisplay.textContent)) {
        errors.push(`Seat count mismatch: ${seatElements.length} rendered, ${totalSeatsDisplay.textContent} displayed`);
    }
    
    // Check generate button state
    const generateBtn = document.getElementById('generate-btn');
    if (generateBtn && generateBtn.disabled && !document.querySelector('.validation-errors .error-item')) {
        errors.push('Generate button disabled without visible errors');
    }
    
    return {
        valid: errors.length === 0,
        errors
    };
}

// Export functions for use in app.js
window.testSuite = {
    testDataSets,
    runTest,
    runAllTests,
    populateFormWithTestData,
    verifyVisualState
};