// ABOUTME: Node.js test runner for fixed assignment functionality
// ABOUTME: Tests FixedAssignmentManager class without requiring full DOM environment

const models = require('./scripts/models.js');

// Extract FixedAssignmentManager if it exists
const FixedAssignmentManager = models.FixedAssignmentManager || undefined;

class FixedAssignmentTestRunner {
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
        console.log('🧪 Testing FixedAssignmentManager functionality...\n');
        
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

const runner = new FixedAssignmentTestRunner();

// Test FixedAssignmentManager instantiation
runner.test('FixedAssignmentManager can be instantiated', function() {
    if (typeof FixedAssignmentManager !== 'undefined') {
        const manager = new FixedAssignmentManager();
        runner.assertNotNull(manager);
        runner.assertTrue(typeof manager.addAssignment === 'function');
        runner.assertTrue(typeof manager.removeAssignment === 'function');
        runner.assertTrue(typeof manager.getAssignment === 'function');
        runner.assertTrue(typeof manager.getAllAssignments === 'function');
        runner.assertTrue(typeof manager.hasGuest === 'function');
    } else {
        runner.assertTrue(false, 'FixedAssignmentManager class not defined yet');
    }
});

// Test adding assignments
runner.test('addAssignment stores guest-seat assignment', function() {
    if (typeof FixedAssignmentManager !== 'undefined') {
        const manager = new FixedAssignmentManager();
        
        const result = manager.addAssignment('Alice', 'seat-1');
        runner.assertTrue(result.success);
        
        const assignment = manager.getAssignment('seat-1');
        runner.assertEquals(assignment, 'Alice');
        
        runner.assertTrue(manager.hasGuest('Alice'));
        runner.assertFalse(manager.hasGuest('Bob'));
    } else {
        runner.assertTrue(false, 'FixedAssignmentManager class not defined yet');
    }
});

// Test conflict prevention
runner.test('addAssignment prevents double-booking seats', function() {
    if (typeof FixedAssignmentManager !== 'undefined') {
        const manager = new FixedAssignmentManager();
        
        manager.addAssignment('Alice', 'seat-1');
        const result = manager.addAssignment('Bob', 'seat-1');
        
        runner.assertFalse(result.success);
        runner.assertTrue(result.error.includes('already assigned'));
        
        const assignment = manager.getAssignment('seat-1');
        runner.assertEquals(assignment, 'Alice');
    } else {
        runner.assertTrue(false, 'FixedAssignmentManager class not defined yet');
    }
});

runner.test('addAssignment prevents double-booking guests', function() {
    if (typeof FixedAssignmentManager !== 'undefined') {
        const manager = new FixedAssignmentManager();
        
        manager.addAssignment('Alice', 'seat-1');
        const result = manager.addAssignment('Alice', 'seat-2');
        
        runner.assertFalse(result.success);
        runner.assertTrue(result.error.includes('already assigned'));
        
        runner.assertEquals(manager.getAssignment('seat-1'), 'Alice');
        runner.assertEquals(manager.getAssignment('seat-2'), null);
    } else {
        runner.assertTrue(false, 'FixedAssignmentManager class not defined yet');
    }
});

// Test removal
runner.test('removeAssignment clears seat assignment', function() {
    if (typeof FixedAssignmentManager !== 'undefined') {
        const manager = new FixedAssignmentManager();
        
        manager.addAssignment('Alice', 'seat-1');
        runner.assertEquals(manager.getAssignment('seat-1'), 'Alice');
        
        const result = manager.removeAssignment('seat-1');
        runner.assertTrue(result.success);
        runner.assertEquals(result.removedGuest, 'Alice');
        
        runner.assertEquals(manager.getAssignment('seat-1'), null);
        runner.assertFalse(manager.hasGuest('Alice'));
    } else {
        runner.assertTrue(false, 'FixedAssignmentManager class not defined yet');
    }
});

runner.test('removeAssignment handles empty seats gracefully', function() {
    if (typeof FixedAssignmentManager !== 'undefined') {
        const manager = new FixedAssignmentManager();
        
        const result = manager.removeAssignment('seat-1');
        runner.assertFalse(result.success);
        runner.assertTrue(result.error.includes('No assignment'));
    } else {
        runner.assertTrue(false, 'FixedAssignmentManager class not defined yet');
    }
});

// Test getting all assignments
runner.test('getAllAssignments returns all current assignments', function() {
    if (typeof FixedAssignmentManager !== 'undefined') {
        const manager = new FixedAssignmentManager();
        
        const emptyAssignments = manager.getAllAssignments();
        runner.assertEquals(Object.keys(emptyAssignments).length, 0);
        
        manager.addAssignment('Alice', 'seat-1');
        manager.addAssignment('Bob', 'seat-3');
        
        const assignments = manager.getAllAssignments();
        runner.assertEquals(Object.keys(assignments).length, 2);
        runner.assertEquals(assignments['seat-1'], 'Alice');
        runner.assertEquals(assignments['seat-3'], 'Bob');
    } else {
        runner.assertTrue(false, 'FixedAssignmentManager class not defined yet');
    }
});

// Test validation
runner.test('assignment validation prevents invalid inputs', function() {
    if (typeof FixedAssignmentManager !== 'undefined') {
        const manager = new FixedAssignmentManager();
        
        const emptyGuest = manager.addAssignment('', 'seat-1');
        runner.assertFalse(emptyGuest.success);
        
        const nullGuest = manager.addAssignment(null, 'seat-1');
        runner.assertFalse(nullGuest.success);
        
        const emptySeat = manager.addAssignment('Alice', '');
        runner.assertFalse(emptySeat.success);
        
        const nullSeat = manager.addAssignment('Alice', null);
        runner.assertFalse(nullSeat.success);
    } else {
        runner.assertTrue(false, 'FixedAssignmentManager class not defined yet');
    }
});

// Run all tests
runner.runAll();