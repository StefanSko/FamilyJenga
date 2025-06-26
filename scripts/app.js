// ABOUTME: Main application entry point and controller for the dinner seating app
// ABOUTME: Handles DOM manipulation, event listeners, and coordinates between modules

console.log('Random Dinner Table Seating App loaded');

// Module-level variables
// eslint-disable-next-line no-unused-vars
let currentTableConfig = null;
// eslint-disable-next-line no-unused-vars
let currentGuestList = [];
// eslint-disable-next-line no-unused-vars
let currentConstraints = [];
// eslint-disable-next-line no-unused-vars
let currentSeatingArrangement = null;

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing application...');
    
    // Application initialization code will go here
    initializeApp();
});

function initializeApp() {
    console.log('Application initialized successfully');
    
    // Test models with sample data as required by Prompt 2
    testModels();
    
    // Initialize table configuration UI as required by Prompt 3
    initializeTableConfigurationUI();
}

function testModels() {
    console.log('Testing core data models...');
    
    try {
        // Test table configuration
        const tableConfig = createTableConfig(2, 2, 2, 2);
        console.log('Table config created:', tableConfig);
        currentTableConfig = tableConfig;
        
        // Test seat positions
        const seat1 = createSeat(1, 'top', 0);
        const seat2 = createSeat(2, 'right', 1);
        console.log('Seat 1:', seat1, 'Display:', seat1.getDisplayLabel());
        console.log('Seat 2:', seat2, 'Display:', seat2.getDisplayLabel());
        
        // Test guest list utilities
        const sampleGuestText = 'Alice\nBob\nCharlie\nDiana';
        const guests = parseGuestList(sampleGuestText);
        console.log('Parsed guests:', guests);
        
        const validation = validateGuestList(guests);
        console.log('Guest validation:', validation);
        currentGuestList = guests;
        
        // Test constraint objects
        const fixedAssignment = createFixedAssignment('Alice', 1);
        console.log('Fixed assignment created:', fixedAssignment);
        
        const adjacencyConstraint = createAdjacencyConstraint('Bob', 'Charlie');
        console.log('Adjacency constraint created:', adjacencyConstraint);
        currentConstraints = [adjacencyConstraint];
        
        // Test seating arrangement
        const arrangement = createSeatingArrangement();
        arrangement.set(1, 'Alice');
        arrangement.set(2, 'Bob');
        console.log('Seating arrangement created with', arrangement.size, 'assignments');
        currentSeatingArrangement = arrangement;
        
        console.log('All model tests completed successfully!');
        
    } catch (error) {
        console.error('Model testing failed:', error);
    }
}

// Table Configuration UI Functions

function initializeTableConfigurationUI() {
    console.log('Initializing table configuration UI...');
    
    // Set up event listeners for all seat inputs
    const seatInputIds = ['topSeats', 'rightSeats', 'bottomSeats', 'leftSeats'];
    
    seatInputIds.forEach(inputId => {
        const input = document.getElementById(inputId);
        if (input) {
            input.addEventListener('input', handleTableInputChange);
            input.addEventListener('change', handleTableInputChange);
        }
    });
    
    // Initialize with current values (set defaults if needed)
    setDefaultTableConfiguration();
    
    // Trigger initial validation
    handleTableInputChange();
}

function setDefaultTableConfiguration() {
    const seatInputIds = ['topSeats', 'rightSeats', 'bottomSeats', 'leftSeats'];
    
    seatInputIds.forEach(inputId => {
        const input = document.getElementById(inputId);
        if (input && !input.value) {
            input.value = '2';
        }
    });
}

function handleTableInputChange() {
    const topInput = document.getElementById('topSeats');
    const rightInput = document.getElementById('rightSeats');
    const bottomInput = document.getElementById('bottomSeats');
    const leftInput = document.getElementById('leftSeats');
    
    if (!topInput || !rightInput || !bottomInput || !leftInput) {
        console.error('Table input elements not found');
        return;
    }
    
    // Parse input values
    const topSeats = parseInt(topInput.value) || 0;
    const rightSeats = parseInt(rightInput.value) || 0;
    const bottomSeats = parseInt(bottomInput.value) || 0;
    const leftSeats = parseInt(leftInput.value) || 0;
    
    // Validate inputs
    const validation = validateTableInputs(topSeats, rightSeats, bottomSeats, leftSeats);
    
    // Update total display
    updateTotalSeatsDisplay(validation.total);
    
    // Clear previous validation state
    clearValidationErrors();
    clearInputErrorStates();
    
    if (validation.isValid) {
        // Store valid configuration
        try {
            currentTableConfig = createTableConfig(topSeats, rightSeats, bottomSeats, leftSeats);
            console.log('Updated table configuration:', currentTableConfig);
        } catch (error) {
            console.error('Error creating table config:', error);
        }
    } else {
        // Show validation errors
        showValidationErrors(validation.errors);
        
        // Add error styling to inputs with issues
        if (validation.errors.some(error => error.includes('Top'))) {
            topInput.classList.add('error');
        }
        if (validation.errors.some(error => error.includes('Right'))) {
            rightInput.classList.add('error');
        }
        if (validation.errors.some(error => error.includes('Bottom'))) {
            bottomInput.classList.add('error');
        }
        if (validation.errors.some(error => error.includes('Left'))) {
            leftInput.classList.add('error');
        }
        
        currentTableConfig = null;
    }
}

function updateTotalSeatsDisplay(total) {
    const totalDisplay = document.getElementById('total-seats');
    if (totalDisplay) {
        totalDisplay.textContent = total.toString();
    }
}

function showValidationErrors(errors) {
    const errorContainer = document.getElementById('table-validation-errors');
    if (!errorContainer) {
        return;
    }
    
    errorContainer.innerHTML = '';
    
    errors.forEach(error => {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-item';
        errorDiv.textContent = error;
        errorContainer.appendChild(errorDiv);
    });
}

function clearValidationErrors() {
    const errorContainer = document.getElementById('table-validation-errors');
    if (errorContainer) {
        errorContainer.innerHTML = '';
    }
}

function clearInputErrorStates() {
    const seatInputIds = ['topSeats', 'rightSeats', 'bottomSeats', 'leftSeats'];
    
    seatInputIds.forEach(inputId => {
        const input = document.getElementById(inputId);
        if (input) {
            input.classList.remove('error');
        }
    });
}