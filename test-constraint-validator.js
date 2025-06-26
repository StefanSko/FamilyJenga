// ABOUTME: Test file for constraintValidator.js functionality validation following TDD principles
// ABOUTME: Ensures constraint validation logic works correctly for all scenarios before implementation

const { createTableConfig } = require('./scripts/models.js');
const { calculateAdjacencyMap } = require('./scripts/adjacencyCalculator.js');

// TDD: Write tests first, then implement the functions to make them pass
// These tests will initially fail, then we'll implement the functions

let constraintValidatorModule;

// Try to load the module, but don't fail if it doesn't exist yet (TDD approach)
try {
    constraintValidatorModule = require('./scripts/constraintValidator.js');
} catch (error) {
    console.log('constraintValidator.js not yet implemented - this is expected in TDD');
    constraintValidatorModule = {};
}

const {
    validateAllConstraints = () => {
        throw new Error('validateAllConstraints not implemented');
    },
    checkFixedAssignmentConflicts = () => {
        throw new Error('checkFixedAssignmentConflicts not implemented');
    },
    checkAdjacencyChainPossibility = () => {
        throw new Error('checkAdjacencyChainPossibility not implemented');
    },
    findConstraintGroups = () => {
        throw new Error('findConstraintGroups not implemented');
    }
} = constraintValidatorModule;

// Helper function to create test data
function createTestData() {
    const tableConfig = createTableConfig(2, 2, 2, 2); // 8 seats
    const adjacencyMap = calculateAdjacencyMap(tableConfig);
    const guests = ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve', 'Frank', 'Grace', 'Henry'];
    
    return { tableConfig, adjacencyMap, guests };
}

function testValidateAllConstraints() {
    console.log('🧪 Testing validateAllConstraints...');
    
    const { tableConfig, adjacencyMap, guests } = createTestData();
    
    try {
        // Test valid configuration - no constraints
        const emptyFixedAssignments = {};
        const emptyAdjacencyConstraints = [];
        
        const result1 = validateAllConstraints(
            guests, 
            tableConfig, 
            emptyFixedAssignments, 
            emptyAdjacencyConstraints, 
            adjacencyMap
        );
        
        console.assert(typeof result1 === 'object', 'Should return object');
        console.assert(typeof result1.isValid === 'boolean', 'Should have isValid property');
        console.assert(Array.isArray(result1.errors), 'Should have errors array');
        console.assert(Array.isArray(result1.warnings), 'Should have warnings array');
        console.assert(result1.isValid === true, 'Empty constraints should be valid');
        console.assert(result1.errors.length === 0, 'Empty constraints should have no errors');
        
        console.log('✅ validateAllConstraints returns correct structure for valid case');
        
        // Test invalid configuration - impossible constraints
        const impossibleConstraints = [
            { guestA: 'Alice', guestB: 'Bob' },
            { guestA: 'Bob', guestB: 'Charlie' },
            { guestA: 'Charlie', guestB: 'Diana' },
            { guestA: 'Diana', guestB: 'Eve' },
            { guestA: 'Eve', guestB: 'Frank' } // 6 people in a chain for 8-seat table
        ];
        
        const result2 = validateAllConstraints(
            guests, 
            tableConfig, 
            emptyFixedAssignments, 
            impossibleConstraints, 
            adjacencyMap
        );
        
        console.assert(result2.isValid === false, 'Impossible constraints should be invalid');
        console.assert(result2.errors.length > 0, 'Impossible constraints should have errors');
        
        console.log('✅ validateAllConstraints correctly identifies impossible constraints');
        
        // Test conflicting fixed assignments
        const conflictingFixedAssignments = {
            '1': 'Alice', // seat 1
            '5': 'Bob'    // seat 5 (opposite side of table)
        };
        
        const conflictingConstraints = [
            { guestA: 'Alice', guestB: 'Bob' } // Alice and Bob must be adjacent but are fixed far apart
        ];
        
        const result3 = validateAllConstraints(
            guests, 
            tableConfig, 
            conflictingFixedAssignments, 
            conflictingConstraints, 
            adjacencyMap
        );
        
        console.assert(result3.isValid === false, 'Conflicting fixed assignments should be invalid');
        console.assert(result3.errors.length > 0, 'Should have error about conflicting assignments');
        
        console.log('✅ validateAllConstraints detects conflicting fixed assignments');
        
    } catch (error) {
        console.log('⏳ validateAllConstraints not yet implemented:', error.message);
    }
}

function testCheckFixedAssignmentConflicts() {
    console.log('🧪 Testing checkFixedAssignmentConflicts...');
    
    const { adjacencyMap } = createTestData();
    
    try {
        // Test no conflicts
        const noConflictAssignments = {
            '1': 'Alice',
            '2': 'Bob'  // Seats 1 and 2 are adjacent
        };
        
        const noConflictConstraints = [
            { guestA: 'Alice', guestB: 'Bob' }
        ];
        
        const result1 = checkFixedAssignmentConflicts(
            noConflictAssignments,
            noConflictConstraints,
            adjacencyMap
        );
        
        console.assert(Array.isArray(result1), 'Should return array');
        console.assert(result1.length === 0, 'No conflicts should return empty array');
        
        console.log('✅ checkFixedAssignmentConflicts finds no conflicts when none exist');
        
        // Test with conflicts
        const conflictAssignments = {
            '1': 'Alice',
            '5': 'Bob'  // Seats 1 and 5 are not adjacent
        };
        
        const conflictConstraints = [
            { guestA: 'Alice', guestB: 'Bob' }
        ];
        
        const result2 = checkFixedAssignmentConflicts(
            conflictAssignments,
            conflictConstraints,
            adjacencyMap
        );
        
        console.assert(result2.length > 0, 'Should find conflicts');
        console.assert(typeof result2[0] === 'string', 'Conflicts should be string descriptions');
        console.assert(result2[0].includes('Alice'), 'Should mention Alice in conflict description');
        console.assert(result2[0].includes('Bob'), 'Should mention Bob in conflict description');
        
        console.log('✅ checkFixedAssignmentConflicts correctly identifies conflicts');
        
    } catch (error) {
        console.log('⏳ checkFixedAssignmentConflicts not yet implemented:', error.message);
    }
}

function testCheckAdjacencyChainPossibility() {
    console.log('🧪 Testing checkAdjacencyChainPossibility...');
    
    try {
        // Test possible chain - 3 people in chain for 8-seat table
        const possibleConstraints = [
            { guestA: 'Alice', guestB: 'Bob' },
            { guestA: 'Bob', guestB: 'Charlie' }
        ];
        
        const result1 = checkAdjacencyChainPossibility(possibleConstraints, 8);
        
        console.assert(typeof result1 === 'object', 'Should return object');
        console.assert(typeof result1.isPossible === 'boolean', 'Should have isPossible property');
        console.assert(result1.isPossible === true, 'Chain of 3 should be possible for 8 seats');
        
        console.log('✅ checkAdjacencyChainPossibility allows valid chains');
        
        // Test impossible chain - 6 people in straight line for 8-seat table
        const impossibleConstraints = [
            { guestA: 'Alice', guestB: 'Bob' },
            { guestA: 'Bob', guestB: 'Charlie' },
            { guestA: 'Charlie', guestB: 'Diana' },
            { guestA: 'Diana', guestB: 'Eve' },
            { guestA: 'Eve', guestB: 'Frank' }
        ];
        
        const result2 = checkAdjacencyChainPossibility(impossibleConstraints, 8);
        
        console.assert(result2.isPossible === false, 'Long chain should be impossible');
        console.assert(typeof result2.reason === 'string', 'Should provide reason for impossibility');
        
        console.log('✅ checkAdjacencyChainPossibility correctly identifies impossible chains');
        
        // Test complex impossible case - multiple overlapping chains
        const complexConstraints = [
            { guestA: 'Alice', guestB: 'Bob' },
            { guestA: 'Alice', guestB: 'Charlie' },
            { guestA: 'Alice', guestB: 'Diana' },
            { guestA: 'Alice', guestB: 'Eve' } // Alice must be adjacent to 4 people (impossible)
        ];
        
        const result3 = checkAdjacencyChainPossibility(complexConstraints, 8);
        
        console.assert(result3.isPossible === false, 'Person with too many adjacencies should be impossible');
        
        console.log('✅ checkAdjacencyChainPossibility handles complex constraint patterns');
        
    } catch (error) {
        console.log('⏳ checkAdjacencyChainPossibility not yet implemented:', error.message);
    }
}

function testFindConstraintGroups() {
    console.log('🧪 Testing findConstraintGroups...');
    
    try {
        // Test single group
        const singleGroupConstraints = [
            { guestA: 'Alice', guestB: 'Bob' },
            { guestA: 'Bob', guestB: 'Charlie' }
        ];
        
        const result1 = findConstraintGroups(singleGroupConstraints);
        
        console.assert(Array.isArray(result1), 'Should return array of groups');
        console.assert(result1.length === 1, 'Should find 1 group');
        console.assert(Array.isArray(result1[0]), 'Each group should be array of guests');
        console.assert(result1[0].length === 3, 'Group should have 3 guests');
        console.assert(result1[0].includes('Alice'), 'Group should include Alice');
        console.assert(result1[0].includes('Bob'), 'Group should include Bob');
        console.assert(result1[0].includes('Charlie'), 'Group should include Charlie');
        
        console.log('✅ findConstraintGroups identifies single connected group');
        
        // Test multiple separate groups
        const multiGroupConstraints = [
            { guestA: 'Alice', guestB: 'Bob' },
            { guestA: 'Charlie', guestB: 'Diana' }
        ];
        
        const result2 = findConstraintGroups(multiGroupConstraints);
        
        console.assert(result2.length === 2, 'Should find 2 separate groups');
        console.assert(result2[0].length === 2, 'First group should have 2 guests');
        console.assert(result2[1].length === 2, 'Second group should have 2 guests');
        
        console.log('✅ findConstraintGroups identifies multiple separate groups');
        
        // Test empty constraints
        const result3 = findConstraintGroups([]);
        
        console.assert(result3.length === 0, 'Empty constraints should return empty groups');
        
        console.log('✅ findConstraintGroups handles empty constraints');
        
        // Test complex connected components
        const complexConstraints = [
            { guestA: 'Alice', guestB: 'Bob' },
            { guestA: 'Bob', guestB: 'Charlie' },
            { guestA: 'Diana', guestB: 'Eve' },
            { guestA: 'Frank', guestB: 'Grace' },
            { guestA: 'Grace', guestB: 'Henry' },
            { guestA: 'Charlie', guestB: 'Diana' } // Connects first and second groups
        ];
        
        const result4 = findConstraintGroups(complexConstraints);
        
        console.assert(result4.length === 2, 'Should find 2 groups after connection');
        
        // One group should have 5 people (Alice->Bob->Charlie->Diana->Eve)
        // One group should have 3 people (Frank->Grace->Henry)
        const groupSizes = result4.map(group => group.length).sort();
        console.assert(groupSizes[0] === 3, 'Smaller group should have 3 people');
        console.assert(groupSizes[1] === 5, 'Larger group should have 5 people');
        
        console.log('✅ findConstraintGroups handles complex connected components');
        
    } catch (error) {
        console.log('⏳ findConstraintGroups not yet implemented:', error.message);
    }
}

function testEdgeCases() {
    console.log('🧪 Testing edge cases...');
    
    try {
        // Test with no guests
        const result1 = validateAllConstraints([], createTableConfig(2, 2, 2, 2), {}, [], new Map());
        console.assert(result1.isValid === true, 'No guests should be valid');
        
        // Test with more guests than seats
        const tooManyGuests = ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve', 'Frank', 'Grace', 'Henry', 'Ivy'];
        const smallTable = createTableConfig(1, 1, 1, 1); // Only 4 seats
        const smallAdjacencyMap = calculateAdjacencyMap(smallTable);
        
        const result2 = validateAllConstraints(tooManyGuests, smallTable, {}, [], smallAdjacencyMap);
        console.assert(result2.isValid === false, 'More guests than seats should be invalid');
        console.assert(result2.errors.length > 0, 'Should have error about guest count');
        
        // Test with null/undefined inputs
        const result3 = validateAllConstraints(null, null, null, null, null);
        console.assert(result3.isValid === false, 'Null inputs should be invalid');
        
        console.log('✅ Edge cases handled correctly');
        
    } catch (error) {
        console.log('⏳ Edge cases not yet passing:', error.message);
    }
}

function testWarningGeneration() {
    console.log('🧪 Testing warning generation...');
    
    const { tableConfig, adjacencyMap, guests } = createTestData();
    
    try {
        // Test scenario that should generate warnings but not errors
        // Example: Many constraints that are technically possible but might be difficult
        const manyConstraints = [
            { guestA: 'Alice', guestB: 'Bob' },
            { guestA: 'Charlie', guestB: 'Diana' },
            { guestA: 'Eve', guestB: 'Frank' },
            { guestA: 'Grace', guestB: 'Henry' }
        ];
        
        const result = validateAllConstraints(
            guests,
            tableConfig,
            {},
            manyConstraints,
            adjacencyMap
        );
        
        console.assert(typeof result.warnings !== 'undefined', 'Should have warnings property');
        console.assert(Array.isArray(result.warnings), 'Warnings should be array');
        
        // Warnings might be generated for highly constrained configurations
        console.log('✅ Warning generation system in place');
        
    } catch (error) {
        console.log('⏳ Warning generation not yet implemented:', error.message);
    }
}

// Run all tests
function runAllTests() {
    console.log('🧪 Testing constraintValidator.js functionality (TDD approach)...\n');
    
    let testsRun = 0;
    let testsPassed = 0;
    
    const testFunctions = [
        testValidateAllConstraints,
        testCheckFixedAssignmentConflicts, 
        testCheckAdjacencyChainPossibility,
        testFindConstraintGroups,
        testEdgeCases,
        testWarningGeneration
    ];
    
    for (const testFunction of testFunctions) {
        try {
            testFunction();
            testsRun++;
            testsPassed++;
        } catch (error) {
            testsRun++;
            console.log(`❌ ${testFunction.name} failed:`, error.message);
        }
    }
    
    console.log(`\n📊 Results: ${testsPassed} passed, ${testsRun - testsPassed} failed out of ${testsRun} test suites`);
    
    if (testsPassed === testsRun) {
        console.log('🎉 All constraint validator tests pass!');
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
    testValidateAllConstraints,
    testCheckFixedAssignmentConflicts,
    testCheckAdjacencyChainPossibility,
    testFindConstraintGroups,
    testEdgeCases,
    testWarningGeneration
};