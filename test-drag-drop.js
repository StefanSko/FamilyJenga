// ABOUTME: Node.js test runner for drag and drop functionality
// ABOUTME: Tests core drag and drop logic without requiring full DOM environment

const dragDrop = require('./scripts/dragDrop.js');

const {
    // eslint-disable-next-line no-unused-vars
    makeDraggable,
    // eslint-disable-next-line no-unused-vars
    makeDroppable,
    // eslint-disable-next-line no-unused-vars
    renderGuestList,
    // eslint-disable-next-line no-unused-vars
    addDragVisualFeedback,
    // eslint-disable-next-line no-unused-vars
    removeDragVisualFeedback,
    // eslint-disable-next-line no-unused-vars
    addDropZoneHighlight,
    // eslint-disable-next-line no-unused-vars
    removeDropZoneHighlight,
    setCurrentDragData,
    getCurrentDragData,
    // eslint-disable-next-line no-unused-vars
    initializeDragAndDrop,
    handleSeatDrop
} = dragDrop;

class DragDropTestRunner {
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
        console.log('🧪 Testing dragDrop.js functionality...\n');
        
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

const runner = new DragDropTestRunner();

// Test drag data management
runner.test('setCurrentDragData stores drag information', function() {
    const mockData = { guestName: 'Alice', element: { id: 'mock-element' } };
    setCurrentDragData(mockData);
    
    const retrieved = getCurrentDragData();
    runner.assertEquals(retrieved.guestName, 'Alice');
    runner.assertNotNull(retrieved.element);
});

runner.test('getCurrentDragData returns null when cleared', function() {
    setCurrentDragData({ guestName: 'Bob', element: {} });
    setCurrentDragData(null);
    
    const retrieved = getCurrentDragData();
    runner.assertEquals(retrieved, null);
});

runner.test('drag data persists across multiple calls', function() {
    const data1 = { guestName: 'Charlie', element: { className: 'test' } };
    setCurrentDragData(data1);
    
    const retrieved1 = getCurrentDragData();
    const retrieved2 = getCurrentDragData();
    
    runner.assertEquals(retrieved1.guestName, retrieved2.guestName);
    runner.assertEquals(retrieved1, retrieved2);
});

// Test default drop handler
runner.test('handleSeatDrop function exists and handles basic call', function() {
    try {
        handleSeatDrop('Alice', 'seat-1');
        runner.assertTrue(true, 'Should handle drop without errors');
    } catch (error) {
        runner.assertTrue(false, `Drop handler failed: ${error.message}`);
    }
});

runner.test('handleSeatDrop accepts different guest names and seat IDs', function() {
    const testCases = [
        { guest: 'Alice', seat: 'seat-1' },
        { guest: 'Bob Johnson', seat: 'seat-15' },
        { guest: 'Charlie O\'Brien', seat: 'corner-seat-A' }
    ];
    
    testCases.forEach(testCase => {
        try {
            handleSeatDrop(testCase.guest, testCase.seat);
            runner.assertTrue(true, `Should handle ${testCase.guest} -> ${testCase.seat}`);
        } catch (error) {
            runner.assertTrue(false, `Failed for ${testCase.guest}: ${error.message}`);
        }
    });
});

// Test module structure
runner.test('dragDrop module exports all required functions', function() {
    const requiredFunctions = [
        'makeDraggable',
        'makeDroppable', 
        'renderGuestList',
        'addDragVisualFeedback',
        'removeDragVisualFeedback',
        'addDropZoneHighlight',
        'removeDropZoneHighlight',
        'setCurrentDragData',
        'getCurrentDragData',
        'initializeDragAndDrop',
        'handleSeatDrop'
    ];
    
    requiredFunctions.forEach(funcName => {
        runner.assertTrue(typeof dragDrop[funcName] === 'function', `Should export ${funcName} function`);
    });
});

runner.test('drag and drop state management is consistent', function() {
    // Clear any existing state first
    setCurrentDragData(null);
    
    // Test state transitions
    runner.assertEquals(getCurrentDragData(), null, 'Should start with null state');
    
    setCurrentDragData({ guestName: 'Test', element: {} });
    runner.assertNotNull(getCurrentDragData(), 'Should store data');
    
    setCurrentDragData(null);
    runner.assertEquals(getCurrentDragData(), null, 'Should clear data');
});

runner.test('drag data contains expected properties', function() {
    const testData = {
        guestName: 'Diana',
        element: { tagName: 'DIV', className: 'guest-item' }
    };
    
    setCurrentDragData(testData);
    const retrieved = getCurrentDragData();
    
    runner.assertTrue('guestName' in retrieved, 'Should have guestName property');
    runner.assertTrue('element' in retrieved, 'Should have element property');
    runner.assertEquals(retrieved.guestName, 'Diana', 'Should preserve guest name');
});

runner.test('concurrent drag operations handle state correctly', function() {
    // Simulate rapid state changes
    setCurrentDragData({ guestName: 'User1', element: {} });
    setCurrentDragData({ guestName: 'User2', element: {} });
    setCurrentDragData({ guestName: 'User3', element: {} });
    
    const final = getCurrentDragData();
    runner.assertEquals(final.guestName, 'User3', 'Should use latest drag data');
    
    setCurrentDragData(null);
    runner.assertEquals(getCurrentDragData(), null, 'Should clear properly after sequence');
});

// Run all tests
runner.runAll();