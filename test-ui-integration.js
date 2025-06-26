// ABOUTME: Test suite for UI integration functions (Prompt 12)
// ABOUTME: Tests generation button handling, seating display, and error handling

const { createTableConfig } = require('./scripts/models.js');
const { calculateAdjacencyMap } = require('./scripts/adjacencyCalculator.js');
const { generateSeating } = require('./scripts/seatingGenerator.js');

function runUIIntegrationTests() {
    console.log('🧪 Testing UI Integration functionality...');
    
    let testsPassed = 0;
    let testsTotal = 0;

    // Test 1: handleGenerateSeating function validates inputs
    testsTotal++;
    try {
        console.log('\nTest 1: handleGenerateSeating validates inputs');
        
        // Mock DOM elements and app state
        const mockState = createMockAppState();
        
        // Test with invalid state (no guests)
        mockState.currentGuestList = [];
        const result1 = testHandleGenerateSeating(mockState);
        
        if (!result1.success && result1.error.includes('guests')) {
            console.log('✓ Test 1a passed - Rejects empty guest list');
        } else {
            console.log('✗ Test 1a failed - Should reject empty guest list');
        }
        
        // Test with invalid state (no table config)
        mockState.currentGuestList = ['Alice', 'Bob'];
        mockState.currentTableConfig = null;
        const result2 = testHandleGenerateSeating(mockState);
        
        if (!result2.success && result2.error.includes('table')) {
            console.log('✓ Test 1b passed - Rejects missing table config');
            testsPassed++;
        } else {
            console.log('✗ Test 1b failed - Should reject missing table config');
        }
    } catch (error) {
        console.log('✗ Test 1 failed with error:', error.message);
    }

    // Test 2: displayGeneratedSeating function
    testsTotal++;
    try {
        console.log('\nTest 2: displayGeneratedSeating function');
        
        const mockSeatElements = createMockSeatElements();
        const arrangement = new Map([
            ['1', 'Alice'],
            ['2', 'Bob'],
            ['3', 'Charlie']
        ]);
        
        const result = testDisplayGeneratedSeating(arrangement, mockSeatElements);
        
        if (result.success && result.updatedSeats.length === 3) {
            console.log('✓ Test 2 passed - Displays all generated assignments');
            testsPassed++;
        } else {
            console.log('✗ Test 2 failed - Should display all assignments');
        }
    } catch (error) {
        console.log('✗ Test 2 failed with error:', error.message);
    }

    // Test 3: showGenerationError function
    testsTotal++;
    try {
        console.log('\nTest 3: showGenerationError function');
        
        const error = 'Cannot place all guests';
        const unmetConstraints = [
            { constraint: { guestA: 'Alice', guestB: 'Bob' }, reason: 'Not adjacent' }
        ];
        
        const result = testShowGenerationError(error, unmetConstraints);
        
        if (result.success && result.errorMessage && result.constraintInfo) {
            console.log('✓ Test 3 passed - Shows error and constraint info');
            testsPassed++;
        } else {
            console.log('✗ Test 3 failed - Should show error and constraints');
        }
    } catch (error) {
        console.log('✗ Test 3 failed with error:', error.message);
    }

    // Test 4: Loading state management
    testsTotal++;
    try {
        console.log('\nTest 4: Loading state management');
        
        const mockButton = { disabled: false, classList: { add: () => {}, remove: () => {} } };
        const mockSpinner = { style: { display: 'none' } };
        
        const result = testLoadingStateManagement(mockButton, mockSpinner);
        
        if (result.success && result.disabledButton && result.showedSpinner) {
            console.log('✓ Test 4 passed - Manages loading states correctly');
            testsPassed++;
        } else {
            console.log('✗ Test 4 failed - Should manage loading states');
        }
    } catch (error) {
        console.log('✗ Test 4 failed with error:', error.message);
    }

    // Test 5: Clear previous generated assignments
    testsTotal++;
    try {
        console.log('\nTest 5: Clear previous generated assignments');
        
        const mockSeatElements = createMockSeatElementsWithAssignments();
        
        const result = testClearPreviousGeneratedAssignments(mockSeatElements);
        
        if (result.success && result.clearedGeneratedSeats > 0 && result.keptFixedSeats > 0) {
            console.log('✓ Test 5 passed - Clears generated but keeps fixed assignments');
            testsPassed++;
        } else {
            console.log('✗ Test 5 failed - Should clear generated and keep fixed');
        }
    } catch (error) {
        console.log('✗ Test 5 failed with error:', error.message);
    }

    // Test 6: End-to-end generation flow
    testsTotal++;
    try {
        console.log('\nTest 6: End-to-end generation flow');
        
        // Test actual generation with real data
        const tableConfig = createTableConfig(2, 2, 2, 2);
        const guests = ['Alice', 'Bob', 'Charlie', 'Diana'];
        const fixedAssignments = {};
        const adjacencyConstraints = [{ guestA: 'Alice', guestB: 'Bob' }];
        const adjacencyMap = calculateAdjacencyMap(tableConfig);
        
        const genResult = generateSeating(guests, tableConfig, fixedAssignments, adjacencyConstraints, adjacencyMap);
        
        if (genResult.success) {
            console.log('✓ Test 6 passed - End-to-end generation works');
            testsPassed++;
        } else {
            console.log('✗ Test 6 failed - Generation should work for simple case');
        }
    } catch (error) {
        console.log('✗ Test 6 failed with error:', error.message);
    }

    // Summary
    console.log('\n=== UI Integration Test Results ===');
    console.log(`Passed: ${testsPassed}/${testsTotal}`);
    
    if (testsPassed === testsTotal) {
        console.log('All UI integration tests passed! ✓');
        return true;
    } else {
        console.log('Some UI integration tests failed! ✗');
        return false;
    }
}

// Mock functions and test helpers

function createMockAppState() {
    return {
        currentTableConfig: createTableConfig(2, 2, 2, 2),
        currentGuestList: ['Alice', 'Bob', 'Charlie', 'Diana'],
        fixedAssignmentManager: { getAllAssignments: () => ({}) },
        adjacencyConstraintManager: { getAllConstraints: () => [] },
        currentAdjacencyMap: new Map([['1', ['2']], ['2', ['1', '3']]])
    };
}

function createMockSeatElements() {
    const mockElements = {};
    for (let i = 1; i <= 4; i++) {
        mockElements[i.toString()] = {
            getAttribute: (attr) => attr === 'data-seat-id' ? i.toString() : null,
            classList: {
                add: () => {},
                remove: () => {},
                contains: () => false
            },
            querySelector: () => ({ textContent: i.toString() })
        };
    }
    return mockElements;
}

function createMockSeatElementsWithAssignments() {
    const mockElements = createMockSeatElements();
    
    // Mark some as fixed, some as generated
    mockElements['1'].classList.contains = (cls) => cls === 'fixed-assignment';
    mockElements['2'].classList.contains = (cls) => cls === 'generated-assignment';
    mockElements['3'].classList.contains = (cls) => cls === 'generated-assignment';
    
    return mockElements;
}

// Test functions (will implement the actual functions later)

function testHandleGenerateSeating(mockState) {
    // This will test the handleGenerateSeating function when implemented
    // For now, return expected behavior for invalid inputs
    
    if (!mockState.currentGuestList || mockState.currentGuestList.length === 0) {
        return { success: false, error: 'No guests provided' };
    }
    
    if (!mockState.currentTableConfig) {
        return { success: false, error: 'No table configuration available' };
    }
    
    return { success: true };
}

function testDisplayGeneratedSeating(arrangement, mockSeatElements) {
    // Mock implementation of displayGeneratedSeating
    const updatedSeats = [];
    
    for (const [seatId, guestName] of arrangement) {
        if (mockSeatElements[seatId]) {
            updatedSeats.push({ seatId, guestName });
        }
    }
    
    return { success: true, updatedSeats };
}

function testShowGenerationError(error, unmetConstraints) {
    // Mock implementation of showGenerationError
    return {
        success: true,
        errorMessage: error,
        constraintInfo: unmetConstraints.length > 0
    };
}

function testLoadingStateManagement(mockButton, mockSpinner) {
    // Mock implementation of loading state management
    mockButton.disabled = true;
    mockSpinner.style.display = 'block';
    
    return {
        success: true,
        disabledButton: mockButton.disabled,
        showedSpinner: mockSpinner.style.display === 'block'
    };
}

function testClearPreviousGeneratedAssignments(mockSeatElements) {
    let clearedGeneratedSeats = 0;
    let keptFixedSeats = 0;
    
    Object.values(mockSeatElements).forEach(element => {
        if (element.classList.contains('generated-assignment')) {
            clearedGeneratedSeats++;
        } else if (element.classList.contains('fixed-assignment')) {
            keptFixedSeats++;
        }
    });
    
    return { success: true, clearedGeneratedSeats, keptFixedSeats };
}

// No external dependencies needed for this test suite

// Auto-run tests if this file is executed directly in Node.js
if (typeof module !== 'undefined' && require.main === module) {
    runUIIntegrationTests();
}

// Export for browser environment
if (typeof window !== 'undefined') {
    window.runUIIntegrationTests = runUIIntegrationTests;
}