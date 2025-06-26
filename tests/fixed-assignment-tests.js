// ABOUTME: Tests for fixed assignment management functionality
// ABOUTME: Validates assignment tracking, validation, and conflict prevention

// Test FixedAssignmentManager class
TestFramework.test('FixedAssignmentManager can be instantiated', function() {
    if (typeof FixedAssignmentManager !== 'undefined') {
        const manager = new FixedAssignmentManager();
        TestFramework.assertNotNull(manager, 'Should create manager instance');
        TestFramework.assertTrue(typeof manager.addAssignment === 'function', 'Should have addAssignment method');
        TestFramework.assertTrue(typeof manager.removeAssignment === 'function', 'Should have removeAssignment method');
        TestFramework.assertTrue(typeof manager.getAssignment === 'function', 'Should have getAssignment method');
        TestFramework.assertTrue(typeof manager.getAllAssignments === 'function', 'Should have getAllAssignments method');
        TestFramework.assertTrue(typeof manager.hasGuest === 'function', 'Should have hasGuest method');
    } else {
        TestFramework.assertTrue(false, 'FixedAssignmentManager class not defined yet');
    }
});

TestFramework.test('addAssignment stores guest-seat assignment', function() {
    if (typeof FixedAssignmentManager !== 'undefined') {
        const manager = new FixedAssignmentManager();
        
        const result = manager.addAssignment('Alice', 'seat-1');
        TestFramework.assertTrue(result.success, 'Should successfully add assignment');
        
        const assignment = manager.getAssignment('seat-1');
        TestFramework.assertEquals(assignment, 'Alice', 'Should retrieve correct guest for seat');
        
        TestFramework.assertTrue(manager.hasGuest('Alice'), 'Should find guest is assigned');
        TestFramework.assertFalse(manager.hasGuest('Bob'), 'Should not find unassigned guest');
    } else {
        TestFramework.assertTrue(false, 'FixedAssignmentManager class not defined yet');
    }
});

TestFramework.test('addAssignment prevents double-booking seats', function() {
    if (typeof FixedAssignmentManager !== 'undefined') {
        const manager = new FixedAssignmentManager();
        
        manager.addAssignment('Alice', 'seat-1');
        const result = manager.addAssignment('Bob', 'seat-1');
        
        TestFramework.assertFalse(result.success, 'Should reject double-booking seat');
        TestFramework.assertTrue(result.error.includes('already assigned'), 'Should provide meaningful error');
        
        const assignment = manager.getAssignment('seat-1');
        TestFramework.assertEquals(assignment, 'Alice', 'Should keep original assignment');
    } else {
        TestFramework.assertTrue(false, 'FixedAssignmentManager class not defined yet');
    }
});

TestFramework.test('addAssignment prevents double-booking guests', function() {
    if (typeof FixedAssignmentManager !== 'undefined') {
        const manager = new FixedAssignmentManager();
        
        manager.addAssignment('Alice', 'seat-1');
        const result = manager.addAssignment('Alice', 'seat-2');
        
        TestFramework.assertFalse(result.success, 'Should reject assigning guest to multiple seats');
        TestFramework.assertTrue(result.error.includes('already assigned'), 'Should provide meaningful error');
        
        TestFramework.assertEquals(manager.getAssignment('seat-1'), 'Alice', 'Should keep original assignment');
        TestFramework.assertEquals(manager.getAssignment('seat-2'), null, 'Should not assign to second seat');
    } else {
        TestFramework.assertTrue(false, 'FixedAssignmentManager class not defined yet');
    }
});

TestFramework.test('removeAssignment clears seat assignment', function() {
    if (typeof FixedAssignmentManager !== 'undefined') {
        const manager = new FixedAssignmentManager();
        
        manager.addAssignment('Alice', 'seat-1');
        TestFramework.assertEquals(manager.getAssignment('seat-1'), 'Alice', 'Should have assignment before removal');
        
        const result = manager.removeAssignment('seat-1');
        TestFramework.assertTrue(result.success, 'Should successfully remove assignment');
        TestFramework.assertEquals(result.removedGuest, 'Alice', 'Should return removed guest name');
        
        TestFramework.assertEquals(manager.getAssignment('seat-1'), null, 'Should clear seat assignment');
        TestFramework.assertFalse(manager.hasGuest('Alice'), 'Should remove guest from tracking');
    } else {
        TestFramework.assertTrue(false, 'FixedAssignmentManager class not defined yet');
    }
});

TestFramework.test('removeAssignment handles empty seats gracefully', function() {
    if (typeof FixedAssignmentManager !== 'undefined') {
        const manager = new FixedAssignmentManager();
        
        const result = manager.removeAssignment('seat-1');
        TestFramework.assertFalse(result.success, 'Should indicate no assignment to remove');
        TestFramework.assertTrue(result.error.includes('No assignment'), 'Should provide clear error message');
    } else {
        TestFramework.assertTrue(false, 'FixedAssignmentManager class not defined yet');
    }
});

TestFramework.test('getAllAssignments returns all current assignments', function() {
    if (typeof FixedAssignmentManager !== 'undefined') {
        const manager = new FixedAssignmentManager();
        
        const emptyAssignments = manager.getAllAssignments();
        TestFramework.assertEquals(Object.keys(emptyAssignments).length, 0, 'Should start with no assignments');
        
        manager.addAssignment('Alice', 'seat-1');
        manager.addAssignment('Bob', 'seat-3');
        
        const assignments = manager.getAllAssignments();
        TestFramework.assertEquals(Object.keys(assignments).length, 2, 'Should have two assignments');
        TestFramework.assertEquals(assignments['seat-1'], 'Alice', 'Should include Alice assignment');
        TestFramework.assertEquals(assignments['seat-3'], 'Bob', 'Should include Bob assignment');
    } else {
        TestFramework.assertTrue(false, 'FixedAssignmentManager class not defined yet');
    }
});

TestFramework.test('hasGuest accurately tracks guest assignments', function() {
    if (typeof FixedAssignmentManager !== 'undefined') {
        const manager = new FixedAssignmentManager();
        
        TestFramework.assertFalse(manager.hasGuest('Alice'), 'Should not find unassigned guest');
        
        manager.addAssignment('Alice', 'seat-1');
        TestFramework.assertTrue(manager.hasGuest('Alice'), 'Should find assigned guest');
        TestFramework.assertFalse(manager.hasGuest('Bob'), 'Should not find other guests');
        
        manager.removeAssignment('seat-1');
        TestFramework.assertFalse(manager.hasGuest('Alice'), 'Should not find guest after removal');
    } else {
        TestFramework.assertTrue(false, 'FixedAssignmentManager class not defined yet');
    }
});

TestFramework.test('assignment validation prevents invalid inputs', function() {
    if (typeof FixedAssignmentManager !== 'undefined') {
        const manager = new FixedAssignmentManager();
        
        const emptyGuest = manager.addAssignment('', 'seat-1');
        TestFramework.assertFalse(emptyGuest.success, 'Should reject empty guest name');
        
        const nullGuest = manager.addAssignment(null, 'seat-1');
        TestFramework.assertFalse(nullGuest.success, 'Should reject null guest name');
        
        const emptySeat = manager.addAssignment('Alice', '');
        TestFramework.assertFalse(emptySeat.success, 'Should reject empty seat ID');
        
        const nullSeat = manager.addAssignment('Alice', null);
        TestFramework.assertFalse(nullSeat.success, 'Should reject null seat ID');
    } else {
        TestFramework.assertTrue(false, 'FixedAssignmentManager class not defined yet');
    }
});

TestFramework.test('assignment manager handles multiple assignments correctly', function() {
    if (typeof FixedAssignmentManager !== 'undefined') {
        const manager = new FixedAssignmentManager();
        
        manager.addAssignment('Alice', 'seat-1');
        manager.addAssignment('Bob', 'seat-2');
        manager.addAssignment('Charlie', 'seat-5');
        
        TestFramework.assertEquals(Object.keys(manager.getAllAssignments()).length, 3, 'Should track multiple assignments');
        
        manager.removeAssignment('seat-2');
        TestFramework.assertEquals(Object.keys(manager.getAllAssignments()).length, 2, 'Should have 2 after removal');
        TestFramework.assertFalse(manager.hasGuest('Bob'), 'Should remove Bob from tracking');
        TestFramework.assertTrue(manager.hasGuest('Alice'), 'Should still track Alice');
        TestFramework.assertTrue(manager.hasGuest('Charlie'), 'Should still track Charlie');
    } else {
        TestFramework.assertTrue(false, 'FixedAssignmentManager class not defined yet');
    }
});

TestFramework.test('getAssignment returns null for unassigned seats', function() {
    if (typeof FixedAssignmentManager !== 'undefined') {
        const manager = new FixedAssignmentManager();
        
        TestFramework.assertEquals(manager.getAssignment('seat-1'), null, 'Should return null for empty seat');
        TestFramework.assertEquals(manager.getAssignment('nonexistent'), null, 'Should return null for invalid seat');
        
        manager.addAssignment('Alice', 'seat-1');
        TestFramework.assertEquals(manager.getAssignment('seat-2'), null, 'Should return null for other empty seats');
    } else {
        TestFramework.assertTrue(false, 'FixedAssignmentManager class not defined yet');
    }
});

TestFramework.test('assignment manager maintains data integrity', function() {
    if (typeof FixedAssignmentManager !== 'undefined') {
        const manager = new FixedAssignmentManager();
        
        // Add multiple assignments
        manager.addAssignment('Alice', 'seat-1');
        manager.addAssignment('Bob', 'seat-2');
        
        // Try to break integrity
        manager.addAssignment('Alice', 'seat-3'); // Should fail
        manager.addAssignment('Charlie', 'seat-1'); // Should fail
        
        const assignments = manager.getAllAssignments();
        TestFramework.assertEquals(Object.keys(assignments).length, 2, 'Should maintain original assignments');
        TestFramework.assertEquals(assignments['seat-1'], 'Alice', 'Alice should stay at seat-1');
        TestFramework.assertEquals(assignments['seat-2'], 'Bob', 'Bob should stay at seat-2');
        TestFramework.assertTrue(!assignments['seat-3'], 'seat-3 should remain empty');
    } else {
        TestFramework.assertTrue(false, 'FixedAssignmentManager class not defined yet');
    }
});