// ABOUTME: Node.js test runner for basic validation of our application structure
// ABOUTME: Runs file existence and basic structure tests without requiring a browser

const fs = require('fs');

class TestRunner {
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

    assertEquals(actual, expected, message = '') {
        if (actual !== expected) {
            throw new Error(`Expected ${expected}, got ${actual}. ${message}`);
        }
    }

    assertFileExists(filePath, message = '') {
        if (!fs.existsSync(filePath)) {
            throw new Error(`File does not exist: ${filePath}. ${message}`);
        }
    }

    assertFileContains(filePath, searchString, message = '') {
        if (!fs.existsSync(filePath)) {
            throw new Error(`File does not exist: ${filePath}`);
        }
        const content = fs.readFileSync(filePath, 'utf8');
        if (!content.includes(searchString)) {
            throw new Error(`File ${filePath} does not contain "${searchString}". ${message}`);
        }
    }

    runAll() {
        console.log('🧪 Running tests...\n');
        
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

const runner = new TestRunner();

// File structure tests
runner.test('HTML file exists', function() {
    runner.assertFileExists('index.html');
});

runner.test('CSS file exists in correct location', function() {
    runner.assertFileExists('styles/main.css');
});

runner.test('JavaScript files exist in correct location', function() {
    runner.assertFileExists('scripts/app.js');
    runner.assertFileExists('scripts/models.js');
    runner.assertFileExists('scripts/validation.js');
    runner.assertFileExists('scripts/tableRenderer.js');
});

runner.test('Test files exist', function() {
    runner.assertFileExists('tests/test-runner.html');
    runner.assertFileExists('tests/test-framework.js');
    runner.assertFileExists('tests/dom-tests.js');
    runner.assertFileExists('tests/app-tests.js');
    runner.assertFileExists('tests/models-tests.js');
    runner.assertFileExists('tests/validation-tests.js');
    runner.assertFileExists('tests/ui-tests.js');
    runner.assertFileExists('tests/table-renderer-tests.js');
});

// Content validation tests
runner.test('HTML contains required structure', function() {
    runner.assertFileContains('index.html', 'Random Dinner Table Seating', 'HTML should contain app title');
    runner.assertFileContains('index.html', 'app-container', 'HTML should have main container');
    runner.assertFileContains('index.html', 'config-panel', 'HTML should have config panel');
    runner.assertFileContains('index.html', 'table-display', 'HTML should have table display');
    runner.assertFileContains('index.html', 'id="table-display"', 'HTML should have table display ID');
});

runner.test('CSS contains required layout', function() {
    runner.assertFileContains('styles/main.css', 'display: grid', 'CSS should use CSS Grid');
    runner.assertFileContains('styles/main.css', 'grid-template-columns: 30% 70%', 'CSS should have correct column layout');
    runner.assertFileContains('styles/main.css', '.app-container', 'CSS should style app container');
    runner.assertFileContains('styles/main.css', '.config-panel', 'CSS should style config panel');
});

runner.test('JavaScript contains initialization', function() {
    runner.assertFileContains('scripts/app.js', 'DOMContentLoaded', 'JS should listen for DOM ready');
    runner.assertFileContains('scripts/app.js', 'console.log', 'JS should have logging');
    runner.assertFileContains('scripts/app.js', 'initializeApp', 'JS should have initialization function');
    runner.assertFileContains('scripts/app.js', 'testModels', 'JS should test models');
});

runner.test('Models.js contains required functions', function() {
    runner.assertFileContains('scripts/models.js', 'createTableConfig', 'Models should have table config factory');
    runner.assertFileContains('scripts/models.js', 'createSeat', 'Models should have seat factory');
    runner.assertFileContains('scripts/models.js', 'parseGuestList', 'Models should have guest list parser');
    runner.assertFileContains('scripts/models.js', 'validateGuestList', 'Models should have guest list validator');
    runner.assertFileContains('scripts/models.js', 'createFixedAssignment', 'Models should have fixed assignment factory');
    runner.assertFileContains('scripts/models.js', 'createAdjacencyConstraint', 'Models should have adjacency constraint factory');
    runner.assertFileContains('scripts/models.js', 'createSeatingArrangement', 'Models should have seating arrangement factory');
});

runner.test('HTML has semantic structure', function() {
    runner.assertFileContains('index.html', '<header>', 'HTML should use semantic header');
    runner.assertFileContains('index.html', '<main', 'HTML should use semantic main');
    runner.assertFileContains('index.html', '<section', 'HTML should use semantic sections');
});

runner.test('CSS has responsive design', function() {
    runner.assertFileContains('styles/main.css', '@media', 'CSS should have media queries');
    runner.assertFileContains('styles/main.css', 'min-width: 1024px', 'CSS should enforce minimum width');
});

runner.test('Files have proper ABOUTME comments', function() {
    runner.assertFileContains('styles/main.css', 'ABOUTME:', 'CSS should have ABOUTME comment');
    runner.assertFileContains('scripts/app.js', 'ABOUTME:', 'JS should have ABOUTME comment');
    runner.assertFileContains('scripts/models.js', 'ABOUTME:', 'Models should have ABOUTME comment');
    runner.assertFileContains('scripts/validation.js', 'ABOUTME:', 'Validation should have ABOUTME comment');
});

runner.test('HTML contains table configuration inputs', function() {
    runner.assertFileContains('index.html', 'id="topSeats"', 'HTML should have top seats input');
    runner.assertFileContains('index.html', 'id="rightSeats"', 'HTML should have right seats input');
    runner.assertFileContains('index.html', 'id="bottomSeats"', 'HTML should have bottom seats input');
    runner.assertFileContains('index.html', 'id="leftSeats"', 'HTML should have left seats input');
    runner.assertFileContains('index.html', 'id="total-seats"', 'HTML should have total seats display');
    runner.assertFileContains('index.html', 'id="table-validation-errors"', 'HTML should have validation errors container');
});

runner.test('CSS contains form styling', function() {
    runner.assertFileContains('styles/main.css', '.input-group', 'CSS should style input groups');
    runner.assertFileContains('styles/main.css', '.total-display', 'CSS should style total display');
    runner.assertFileContains('styles/main.css', '.validation-errors', 'CSS should style validation errors');
    runner.assertFileContains('styles/main.css', 'input[type="number"].error', 'CSS should have error state styling');
});

runner.test('CSS contains table visualization styling', function() {
    runner.assertFileContains('styles/main.css', '.table-svg-container', 'CSS should style SVG container');
    runner.assertFileContains('styles/main.css', '.seat-group', 'CSS should style seat groups');
    runner.assertFileContains('styles/main.css', '.seat-circle', 'CSS should style seat circles');
    runner.assertFileContains('styles/main.css', '.table-surface', 'CSS should style table surface');
});

// Run all tests
runner.runAll();