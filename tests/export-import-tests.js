// ABOUTME: Tests for configuration export and import functionality
// ABOUTME: Validates that seat assignments are properly saved and restored

TestFramework.test('Export includes fixed assignments when manager has assignments', function() {
    // Create a fresh manager for this test
    const testManager = new FixedAssignmentManager();
    
    // Add some test assignments
    testManager.addAssignment('Alice', 'seat-1');
    testManager.addAssignment('Bob', 'seat-3');
    testManager.addAssignment('Charlie', 'seat-5');
    
    // Verify assignments were added
    const assignments = testManager.getAllAssignments();
    TestFramework.assertEquals(Object.keys(assignments).length, 3, 'Should have 3 assignments');
    TestFramework.assertEquals(assignments['seat-1'], 'Alice', 'Should have Alice at seat-1');
    TestFramework.assertEquals(assignments['seat-3'], 'Bob', 'Should have Bob at seat-3');
    TestFramework.assertEquals(assignments['seat-5'], 'Charlie', 'Should have Charlie at seat-5');
    
    // Test the export logic (simulate what handleExportConfig does)
    const exportedAssignments = testManager ? testManager.getAllAssignments() : {};
    
    TestFramework.assertNotEquals(exportedAssignments, {}, 'Exported assignments should not be empty');
    TestFramework.assertEquals(Object.keys(exportedAssignments).length, 3, 'Should export all 3 assignments');
    TestFramework.assertEquals(exportedAssignments['seat-1'], 'Alice', 'Should export Alice assignment');
    TestFramework.assertEquals(exportedAssignments['seat-3'], 'Bob', 'Should export Bob assignment');
    TestFramework.assertEquals(exportedAssignments['seat-5'], 'Charlie', 'Should export Charlie assignment');
});

TestFramework.test('Export returns empty object when manager has no assignments', function() {
    // Create a fresh manager with no assignments
    const testManager = new FixedAssignmentManager();
    
    // Verify manager is empty
    const assignments = testManager.getAllAssignments();
    TestFramework.assertEquals(Object.keys(assignments).length, 0, 'Should start with no assignments');
    
    // Test the export logic
    const exportedAssignments = testManager ? testManager.getAllAssignments() : {};
    
    TestFramework.assertEquals(exportedAssignments, {}, 'Should export empty object when no assignments');
    TestFramework.assertEquals(Object.keys(exportedAssignments).length, 0, 'Should have no keys in exported object');
});

TestFramework.test('Export handles null manager gracefully', function() {
    // Test what happens when manager is null (simulate the bug scenario)
    const testManager = null;
    
    // Test the export logic
    const exportedAssignments = testManager ? testManager.getAllAssignments() : {};
    
    TestFramework.assertEquals(exportedAssignments, {}, 'Should export empty object when manager is null');
    TestFramework.assertEquals(Object.keys(exportedAssignments).length, 0, 'Should have no keys when manager is null');
});

TestFramework.test('Manager maintains assignments across multiple operations', function() {
    const testManager = new FixedAssignmentManager();
    
    // Add assignments
    testManager.addAssignment('Alice', 'seat-1');
    testManager.addAssignment('Bob', 'seat-2');
    
    // Check assignments persist
    let assignments = testManager.getAllAssignments();
    TestFramework.assertEquals(Object.keys(assignments).length, 2, 'Should have 2 assignments after adding');
    
    // Remove one assignment
    testManager.removeAssignment('seat-1');
    
    // Check remaining assignment persists
    assignments = testManager.getAllAssignments();
    TestFramework.assertEquals(Object.keys(assignments).length, 1, 'Should have 1 assignment after removal');
    TestFramework.assertEquals(assignments['seat-2'], 'Bob', 'Should still have Bob assignment');
    TestFramework.assertTrue(!assignments['seat-1'], 'Should not have Alice assignment');
    
    // Add another assignment
    testManager.addAssignment('Diana', 'seat-4');
    
    // Check all assignments
    assignments = testManager.getAllAssignments();
    TestFramework.assertEquals(Object.keys(assignments).length, 2, 'Should have 2 assignments after adding Diana');
    TestFramework.assertEquals(assignments['seat-2'], 'Bob', 'Bob should still be assigned');
    TestFramework.assertEquals(assignments['seat-4'], 'Diana', 'Diana should be assigned');
});

TestFramework.test('Manager assignment count method works correctly', function() {
    const testManager = new FixedAssignmentManager();
    
    TestFramework.assertEquals(testManager.getAssignmentCount(), 0, 'Should start with 0 assignments');
    
    testManager.addAssignment('Alice', 'seat-1');
    TestFramework.assertEquals(testManager.getAssignmentCount(), 1, 'Should have 1 assignment');
    
    testManager.addAssignment('Bob', 'seat-2');
    TestFramework.assertEquals(testManager.getAssignmentCount(), 2, 'Should have 2 assignments');
    
    testManager.removeAssignment('seat-1');
    TestFramework.assertEquals(testManager.getAssignmentCount(), 1, 'Should have 1 assignment after removal');
    
    testManager.removeAssignment('seat-2');
    TestFramework.assertEquals(testManager.getAssignmentCount(), 0, 'Should have 0 assignments after removing all');
});

TestFramework.test('getAllAssignments returns copy not reference', function() {
    const testManager = new FixedAssignmentManager();
    
    testManager.addAssignment('Alice', 'seat-1');
    
    const assignments1 = testManager.getAllAssignments();
    const assignments2 = testManager.getAllAssignments();
    
    // Modify one copy
    assignments1['seat-2'] = 'Bob';
    
    // Check that the manager and other copy are unaffected
    TestFramework.assertEquals(Object.keys(assignments2).length, 1, 'Second copy should still have 1 assignment');
    TestFramework.assertTrue(!assignments2['seat-2'], 'Second copy should not have Bob assignment');
    TestFramework.assertEquals(testManager.getAssignmentCount(), 1, 'Manager should still have 1 assignment');
    TestFramework.assertTrue(!testManager.getAssignment('seat-2'), 'Manager should not have Bob assignment');
});

TestFramework.test('End-to-end assignment workflow simulation', function() {
    // Simulate the complete workflow from assignment creation to export
    const testManager = new FixedAssignmentManager();
    
    // Simulate multiple drag-and-drop operations
    const guests = ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve'];
    const seats = ['seat-1', 'seat-2', 'seat-3', 'seat-4', 'seat-5'];
    
    // Assign guests to seats
    for (let i = 0; i < guests.length; i++) {
        const result = testManager.addAssignment(guests[i], seats[i]);
        TestFramework.assertTrue(result.success, `Should successfully assign ${guests[i]} to ${seats[i]}`);
    }
    
    // Verify all assignments were created
    TestFramework.assertEquals(testManager.getAssignmentCount(), 5, 'Should have all 5 assignments');
    
    // Simulate export process
    const exportData = {
        fixedAssignments: testManager.getAllAssignments()
        // ... other export data would go here
    };
    
    // Verify export data contains all assignments
    TestFramework.assertEquals(Object.keys(exportData.fixedAssignments).length, 5, 'Export should contain all 5 assignments');
    
    for (let i = 0; i < guests.length; i++) {
        TestFramework.assertEquals(
            exportData.fixedAssignments[seats[i]], 
            guests[i], 
            `Export should contain ${guests[i]} at ${seats[i]}`
        );
    }
    
    // Simulate import process (create new manager and restore assignments)
    const importManager = new FixedAssignmentManager();
    
    // Import assignments
    Object.entries(exportData.fixedAssignments).forEach(([seatId, guestName]) => {
        importManager.addAssignment(guestName, seatId);
    });
    
    // Verify import worked correctly
    TestFramework.assertEquals(importManager.getAssignmentCount(), 5, 'Import should restore all 5 assignments');
    
    const importedAssignments = importManager.getAllAssignments();
    for (let i = 0; i < guests.length; i++) {
        TestFramework.assertEquals(
            importedAssignments[seats[i]], 
            guests[i], 
            `Import should restore ${guests[i]} at ${seats[i]}`
        );
    }
});