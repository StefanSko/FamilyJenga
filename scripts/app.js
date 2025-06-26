// ABOUTME: Main application entry point and controller for the dinner seating app
// ABOUTME: Handles DOM manipulation, event listeners, and coordinates between modules

console.log('Random Dinner Table Seating App loaded');

// Module-level variables
let currentTableConfig = null;
let currentGuestList = [];
let currentConstraints = [];
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
    
    // Event listeners will be set up here
    // Initial UI state will be configured here
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