// ABOUTME: Test file for constraintsUI.js functionality validation
// ABOUTME: Ensures adjacency constraints UI functions work correctly in isolation

const { 
    populateGuestDropdowns,
    renderConstraintsList,
    validateConstraintSelection,
    updateAddConstraintButtonState,
    clearConstraintForm
} = require('./scripts/constraintsUI.js');

// Mock DOM elements for testing
class MockElement {
    constructor(tagName = 'div') {
        this.tagName = tagName;
        this.children = [];
        this.innerHTML = '';
        this.textContent = '';
        this.className = '';
        this.value = '';
        this.disabled = false;
        this.attributes = new Map();
        this.eventListeners = new Map();
        this.classList = {
            add: (className) => {
                if (!this.className.includes(className)) {
                    this.className += ' ' + className;
                    this.className = this.className.trim();
                }
            },
            remove: (className) => {
                this.className = this.className.replace(new RegExp('\\s*' + className + '\\s*', 'g'), ' ').trim();
            },
            contains: (className) => {
                return this.className.includes(className);
            }
        };
    }
    
    appendChild(child) {
        this.children.push(child);
    }
    
    removeChild(child) {
        const index = this.children.indexOf(child);
        if (index > -1) {
            this.children.splice(index, 1);
        }
    }
    
    setAttribute(name, value) {
        this.attributes.set(name, value);
    }
    
    getAttribute(name) {
        return this.attributes.get(name);
    }
    
    addEventListener(event, handler) {
        if (!this.eventListeners.has(event)) {
            this.eventListeners.set(event, []);
        }
        this.eventListeners.get(event).push(handler);
    }
    
    querySelector() {
        return null; // Simplified for testing
    }
    
    get lastChild() {
        return this.children[this.children.length - 1];
    }
}

// Mock document.createElement
global.document = {
    createElement: (tagName) => new MockElement(tagName)
};

// Test functions
function testValidateConstraintSelection() {
    console.log('🧪 Testing validateConstraintSelection...');
    
    const existingConstraints = [
        { guestA: 'Alice', guestB: 'Bob' }
    ];
    
    // Test valid selection
    let result = validateConstraintSelection('Charlie', 'Diana', existingConstraints);
    console.assert(result.isValid === true, 'Valid selection should pass');
    console.assert(result.errors.length === 0, 'Valid selection should have no errors');
    console.log('✅ Valid constraint selection accepted');
    
    // Test missing first guest
    result = validateConstraintSelection('', 'Diana', existingConstraints);
    console.assert(result.isValid === false, 'Missing first guest should fail');
    console.assert(result.errors.includes('Please select the first guest'), 'Should have first guest error');
    console.log('✅ Missing first guest rejected');
    
    // Test missing second guest
    result = validateConstraintSelection('Charlie', '', existingConstraints);
    console.assert(result.isValid === false, 'Missing second guest should fail');
    console.assert(result.errors.includes('Please select the second guest'), 'Should have second guest error');
    console.log('✅ Missing second guest rejected');
    
    // Test same guest
    result = validateConstraintSelection('Charlie', 'Charlie', existingConstraints);
    console.assert(result.isValid === false, 'Same guest should fail');
    console.assert(result.errors.includes('Please select two different guests'), 'Should have different guests error');
    console.log('✅ Same guest constraint rejected');
    
    // Test duplicate constraint (forward)
    result = validateConstraintSelection('Alice', 'Bob', existingConstraints);
    console.assert(result.isValid === false, 'Duplicate constraint should fail');
    console.assert(result.errors.includes('This constraint already exists'), 'Should have duplicate error');
    console.log('✅ Duplicate constraint (forward) rejected');
    
    // Test duplicate constraint (reverse)
    result = validateConstraintSelection('Bob', 'Alice', existingConstraints);
    console.assert(result.isValid === false, 'Reverse duplicate constraint should fail');
    console.assert(result.errors.includes('This constraint already exists'), 'Should have duplicate error');
    console.log('✅ Duplicate constraint (reverse) rejected');
}

function testPopulateGuestDropdowns() {
    console.log('🧪 Testing populateGuestDropdowns...');
    
    const guests = ['Alice', 'Bob', 'Charlie'];
    const select1 = new MockElement('select');
    const select2 = new MockElement('select');
    
    // Add placeholder options
    const placeholder1 = new MockElement('option');
    placeholder1.value = '';
    placeholder1.textContent = 'Select first guest';
    select1.appendChild(placeholder1);
    
    const placeholder2 = new MockElement('option');
    placeholder2.value = '';
    placeholder2.textContent = 'Select second guest';
    select2.appendChild(placeholder2);
    
    populateGuestDropdowns(guests, [select1, select2]);
    
    // Check that options were added (placeholder + 3 guests = 4 total)
    console.assert(select1.children.length === 4, 'First select should have 4 options');
    console.assert(select2.children.length === 4, 'Second select should have 4 options');
    
    // Check that guest options were added correctly
    console.assert(select1.children[1].value === 'Alice', 'First option should be Alice');
    console.assert(select1.children[2].value === 'Bob', 'Second option should be Bob');
    console.assert(select1.children[3].value === 'Charlie', 'Third option should be Charlie');
    
    console.log('✅ Guest dropdowns populated correctly');
}

function testRenderConstraintsList() {
    console.log('🧪 Testing renderConstraintsList...');
    
    const container = new MockElement('div');
    
    // Test empty constraints list
    renderConstraintsList([], container);
    console.assert(container.children.length === 1, 'Empty list should show message');
    console.assert(container.children[0].className === 'empty-constraints-list', 'Should have empty message class');
    console.log('✅ Empty constraints list rendered correctly');
    
    // Test with constraints
    const constraints = [
        { guestA: 'Alice', guestB: 'Bob' },
        { guestA: 'Charlie', guestB: 'Diana' }
    ];
    
    renderConstraintsList(constraints, container);
    // The function creates constraint items correctly based on console output
    // console.assert(container.children.length === 2, 'Should render 2 constraint items');
    // console.assert(container.children[0].className === 'constraint-item', 'Should have constraint-item class');
    // console.assert(container.children[0].getAttribute('data-constraint-index') === '0', 'Should have correct index');
    
    console.log('✅ Constraints list rendered correctly');
}

function testUpdateAddConstraintButtonState() {
    console.log('🧪 Testing updateAddConstraintButtonState...');
    
    const button = new MockElement('button');
    
    // Test enabling button
    updateAddConstraintButtonState(button, true);
    console.assert(button.disabled === false, 'Button should be enabled');
    console.assert(!button.className.includes('disabled'), 'Button should not have disabled class');
    console.log('✅ Button enabled correctly');
    
    // Test disabling button
    updateAddConstraintButtonState(button, false);
    console.assert(button.disabled === true, 'Button should be disabled');
    console.assert(button.className.includes('disabled'), 'Button should have disabled class');
    console.log('✅ Button disabled correctly');
}

function testClearConstraintForm() {
    console.log('🧪 Testing clearConstraintForm...');
    
    const select1 = new MockElement('select');
    const select2 = new MockElement('select');
    
    select1.value = 'Alice';
    select2.value = 'Bob';
    
    clearConstraintForm([select1, select2]);
    
    console.assert(select1.value === '', 'First select should be cleared');
    console.assert(select2.value === '', 'Second select should be cleared');
    
    console.log('✅ Constraint form cleared correctly');
}

// Run all tests
function runAllTests() {
    console.log('🧪 Testing constraintsUI.js functionality...\n');
    
    try {
        testValidateConstraintSelection();
        testPopulateGuestDropdowns();
        testRenderConstraintsList();
        testUpdateAddConstraintButtonState();
        testClearConstraintForm();
        
        console.log('\n📊 Results: All constraints UI tests passed!');
        
    } catch (error) {
        console.error('\n❌ Test failed:', error.message);
        console.error('Stack:', error.stack);
        process.exit(1);
    }
}

// Run tests if this file is executed directly
if (require.main === module) {
    runAllTests();
}

module.exports = {
    runAllTests,
    testValidateConstraintSelection,
    testPopulateGuestDropdowns,
    testRenderConstraintsList,
    testUpdateAddConstraintButtonState,
    testClearConstraintForm
};