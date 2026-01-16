// ABOUTME: Test the complete assignment workflow to identify the export bug
// ABOUTME: Simulates user creating assignments and then exporting

const fs = require('fs');

// Mock DOM for Node.js environment
global.window = global;
global.document = {
    getElementById: () => ({ value: '', innerHTML: '', style: {}, dispatchEvent: () => {} }),
    createElement: () => ({ click: () => {}, remove: () => {} }),
    body: { appendChild: () => {}, removeChild: () => {} }
};

// Mock functions that would be available in browser
global.console = console;

// Load the modules
console.log('Loading models.js...');
eval(fs.readFileSync('./scripts/models.js', 'utf8'));

console.log('🧪 Testing Assignment → Export Workflow\n');

// Test 1: Create assignments and export
console.log('=== Test 1: Assignment Creation and Export ===');

// Create a manager instance
const manager = new FixedAssignmentManager();
console.log('✅ Manager created');

// Add some assignments (simulating drag-and-drop)
const testAssignments = [
    { guest: 'Stefan', seat: 'seat-1' },
    { guest: 'Lara', seat: 'seat-3' },
    { guest: 'Georg', seat: 'seat-5' }
];

console.log('Adding test assignments...');
testAssignments.forEach(({ guest, seat }) => {
    const result = manager.addAssignment(guest, seat);
    if (result.success) {
        console.log(`✅ Added: ${guest} → ${seat}`);
    } else {
        console.log(`❌ Failed: ${guest} → ${seat} (${result.error})`);
    }
});

// Check manager state
console.log('\nManager state after assignments:');
const assignments = manager.getAllAssignments();
console.log('- Assignment count:', manager.getAssignmentCount());
console.log('- Assignments:', assignments);

// Simulate export (what handleExportConfig does)
console.log('\n=== Simulating Export ===');
const exportedAssignments = manager ? manager.getAllAssignments() : {};
console.log('Export result:', exportedAssignments);
console.log('Export keys count:', Object.keys(exportedAssignments).length);

// Test 2: Check if assignments persist across operations
console.log('\n=== Test 2: Assignment Persistence ===');

// Simulate some operations that might clear assignments
console.log('Checking assignment persistence...');

// Get assignments again (should be the same)
const persistentAssignments = manager.getAllAssignments();
console.log('Persistent assignments:', persistentAssignments);

// Compare
const persistent = JSON.stringify(persistentAssignments);
const original = JSON.stringify(assignments);
const match = persistent === original;

console.log('Assignments match after operations:', match);

if (match) {
    console.log('✅ Assignments persisted correctly');
} else {
    console.log('❌ Assignments were lost or modified');
    console.log('Original:', original);
    console.log('Current:', persistent);
}

// Final result
console.log('\n=== Summary ===');
if (Object.keys(exportedAssignments).length === testAssignments.length) {
    console.log('🎉 Export functionality works correctly in isolation');
    console.log('The bug is likely in the UI workflow, not the core export logic');
} else {
    console.log('❌ Export failed even in isolation');
    console.log('Expected:', testAssignments.length, 'assignments');
    console.log('Got:', Object.keys(exportedAssignments).length, 'assignments');
}