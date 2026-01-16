// ABOUTME: Simple test runner for export/import functionality
// ABOUTME: Tests the core assignment manager export logic

const fs = require('fs');

// Mock DOM for Node.js environment
global.window = global;
global.document = {
    getElementById: () => ({ value: '', innerHTML: '', style: {} }),
    createElement: () => ({ click: () => {}, remove: () => {} }),
    body: { appendChild: () => {}, removeChild: () => {} }
};

// Load the modules
eval(fs.readFileSync('./scripts/models.js', 'utf8'));
eval(fs.readFileSync('./tests/test-framework.js', 'utf8'));
eval(fs.readFileSync('./tests/export-import-tests.js', 'utf8'));

// Run the new tests
console.log('🧪 Testing export/import functionality...\n');

TestFramework.runAllTests();

console.log('Export/Import Tests Results:');
let passed = 0;
let failed = 0;

TestFramework.results.forEach(result => {
    if (result.name.includes('Export') || result.name.includes('assignment') || result.name.includes('Manager')) {
        const status = result.passed ? '✅' : '❌';
        console.log(status + ' ' + result.name);
        if (!result.passed && result.error) {
            console.log('   Error: ' + result.error);
            failed++;
        } else if (result.passed) {
            passed++;
        }
    }
});

console.log(`\n📊 Results: ${passed} passed, ${failed} failed`);

if (failed === 0) {
    console.log('🎉 All export/import tests passed!');
    process.exit(0);
} else {
    console.log('❌ Some tests failed');
    process.exit(1);
}