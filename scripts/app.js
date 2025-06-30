// ABOUTME: Main application entry point and controller for the dinner seating app
// ABOUTME: Handles DOM manipulation, event listeners, and coordinates between modules

console.log('Random Dinner Table Seating App loaded');

// Module-level variables
// eslint-disable-next-line no-unused-vars
let currentTableConfig = null;
// eslint-disable-next-line no-unused-vars
let currentGuestList = [];
// eslint-disable-next-line no-unused-vars
let adjacencyConstraintManager = null;
// eslint-disable-next-line no-unused-vars
let currentSeatingArrangement = null;
// eslint-disable-next-line no-unused-vars
let currentSeatElements = null;
// eslint-disable-next-line no-unused-vars
let isImporting = false; // Flag to prevent clearing during import
// eslint-disable-next-line no-unused-vars
let currentAssignedGuests = [];
// eslint-disable-next-line no-unused-vars
let fixedAssignmentManager = null;
// eslint-disable-next-line no-unused-vars
let currentAdjacencyMap = null;
// eslint-disable-next-line no-unused-vars
let errorDisplay = null;

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing application...');
    
    // Application initialization code will go here
    initializeApp();
});

function initializeApp() {
    console.log('Application initialized successfully');
    
    // Initialize error display system as required by Prompt 13
    // eslint-disable-next-line no-undef
    errorDisplay = new ErrorDisplay();
    
    // Initialize fixed assignment manager as required by Prompt 7
    // eslint-disable-next-line no-undef
    fixedAssignmentManager = new FixedAssignmentManager();
    console.log('DEBUGGING: fixedAssignmentManager initialized:', Boolean(fixedAssignmentManager));
    console.log('DEBUGGING: fixedAssignmentManager type:', typeof fixedAssignmentManager);
    
    // Initialize adjacency constraint manager as required by Prompt 10
    // eslint-disable-next-line no-undef
    adjacencyConstraintManager = new AdjacencyConstraintManager();
    console.log('DEBUGGING: adjacencyConstraintManager initialized:', Boolean(adjacencyConstraintManager));
    
    // Add global debug function for troubleshooting
    window.debugAssignments = function() {
        console.log('=== ASSIGNMENT DEBUG INFO ===');
        console.log('fixedAssignmentManager exists:', Boolean(fixedAssignmentManager));
        if (fixedAssignmentManager) {
            const assignments = fixedAssignmentManager.getAllAssignments();
            console.log('Current assignments:', assignments);
            console.log('Assignment count:', fixedAssignmentManager.getAssignmentCount());
            console.log('Assignment keys:', Object.keys(assignments));
            console.log('Assignment values:', Object.values(assignments));
        }
        console.log('currentGuestList:', currentGuestList);
        console.log('currentAssignedGuests:', currentAssignedGuests);
        console.log('==============================');
    };
    console.log('💡 Debug tip: Type debugAssignments() in console to check assignment state');
    
    // Test models with sample data as required by Prompt 2
    testModels();
    
    // Initialize table configuration UI as required by Prompt 3
    initializeTableConfigurationUI();
    
    // Initialize guest list UI as required by Prompt 5
    initializeGuestListUI();
    
    // Initialize drag and drop functionality as required by Prompt 6
    initializeDragDropUI();
    
    // Initialize adjacency constraints UI as required by Prompt 8
    initializeConstraintsUI();
    
    // Initialize generate button as required by Prompt 12
    initializeGenerateButton();
    
    // Initialize action buttons (Clear All, Load Example) as required by Prompt 14
    initializeActionButtons();
    
    // Initialize keyboard shortcuts as required by Prompt 14
    initializeKeyboardShortcuts();
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
        // Test adjacency constraint manager
        adjacencyConstraintManager.addConstraint('Bob', 'Charlie');
        
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
            
            // Calculate and store adjacency map when table config changes
            calculateAndStoreAdjacencyMap();
            
            // Render the table whenever configuration changes
            renderTableVisualization();
        } catch (error) {
            console.error('Error creating table config:', error);
        }
    } else {
        // Show validation errors
        showValidationErrors(validation.errors);
        
        // Add error styling to inputs with issues
        setInputErrorStates(validation.errors);
        
        currentTableConfig = null;
        
        // Clear table visualization on invalid config
        clearTableVisualization();
    }
}

// Table Visualization Functions

function renderTableVisualization() {
    if (!currentTableConfig) {
        console.warn('No valid table configuration to render');
        return;
    }
    
    const tableDisplay = document.getElementById('table-display');
    if (!tableDisplay) {
        console.error('Table display element not found');
        return;
    }
    
    try {
        console.log('Rendering table visualization...');
        currentSeatElements = renderTable(currentTableConfig, tableDisplay);
        console.log('Table rendered successfully with', Object.keys(currentSeatElements).length, 'seats');
        
        // Set up drag and drop for the new seats
        setupDragDropEventHandlers();
    } catch (error) {
        console.error('Error rendering table:', error);
        showTableRenderError(error.message);
    }
}

function clearTableVisualization() {
    const tableDisplay = document.getElementById('table-display');
    if (tableDisplay) {
        tableDisplay.innerHTML = '';
    }
    currentSeatElements = null;
}

function showTableRenderError(errorMessage) {
    const tableDisplay = document.getElementById('table-display');
    if (tableDisplay) {
        tableDisplay.innerHTML = `
            <div class="table-error">
                <p>Unable to render table</p>
                <small>${errorMessage}</small>
            </div>
        `;
    }
}

// Guest List Management Functions

function initializeGuestListUI() {
    console.log('Initializing guest list UI...');
    
    const guestInput = document.getElementById('guest-list-input');
    if (guestInput) {
        guestInput.addEventListener('input', handleGuestListChange);
        guestInput.addEventListener('change', handleGuestListChange);
    }
    
    // Initialize with empty state
    updateGuestCountDisplay(0);
    clearGuestValidationErrors();
}

function handleGuestListChange() {
    const guestInput = document.getElementById('guest-list-input');
    if (!guestInput) {
        console.error('Guest list input element not found');
        return;
    }
    
    const inputText = guestInput.value;
    
    // Parse and validate guest list
    const guestResult = parseAndValidateGuestList(inputText);
    
    // Update guest count display
    updateGuestCountDisplay(guestResult.guests.length);
    
    // Clear previous validation state
    clearGuestValidationErrors();
    updateGuestListValidationState(true);
    
    if (guestResult.isValid) {
        // Store valid guest list
        currentGuestList = guestResult.guests;
        console.log('Updated guest list:', currentGuestList);
        
        // Only clear assignments and seats if not importing
        if (!isImporting) {
            console.log('Clearing assignments because guest list changed (not during import)');
            // Clear any existing assignments when guest list changes
            currentAssignedGuests = [];
            fixedAssignmentManager.clearAllAssignments();
            
            // Clear any seat displays
            if (currentSeatElements) {
                Object.values(currentSeatElements).forEach(seatElement => {
                    // eslint-disable-next-line no-undef
                    updateSeatDisplay(seatElement, null, false);
                });
            }
        } else {
            console.log('Skipping assignment clearing because we are importing');
        }
        
        // Update draggable guest list
        renderDraggableGuestList();
        
        // Update constraints UI with new guest list
        updateConstraintUI();
        
        // Validate against current table configuration
        if (currentTableConfig) {
            const countValidation = validateGuestSeatCount(guestResult.guests.length, currentTableConfig.totalSeats);
            if (!countValidation.isValid) {
                showGuestValidationErrors(countValidation.errors);
                updateGuestListValidationState(false);
            }
        }
    } else {
        // Show validation errors
        showGuestValidationErrors(guestResult.errors);
        updateGuestListValidationState(false);
        currentGuestList = [];
    }
}

function parseAndValidateGuestList(inputText) {
    // Parse guest list using existing model function
    const guests = parseGuestList(inputText);
    
    // Validate guest list using existing model function
    const validation = validateGuestList(guests);
    
    return {
        guests: guests,
        isValid: validation.isValid,
        errors: validation.errors
    };
}

function validateGuestSeatCount(guestCount, seatCount) {
    // Use existing validation function
    return validateGuestCount(guestCount, seatCount);
}

// eslint-disable-next-line no-unused-vars
function validateGuestListWithTable(guests, tableConfig) {
    if (!tableConfig) {
        return {
            isValid: false,
            errors: ['No table configuration available']
        };
    }
    
    const guestValidation = validateGuestList(guests);
    if (!guestValidation.isValid) {
        return guestValidation;
    }
    
    const countValidation = validateGuestCount(guests.length, tableConfig.totalSeats);
    return countValidation;
}

function updateGuestCountDisplay(count) {
    const countDisplay = document.getElementById('guest-count');
    if (countDisplay) {
        countDisplay.textContent = count.toString();
    }
}

function showGuestValidationErrors(errors) {
    const errorContainer = document.getElementById('guest-validation-errors');
    if (!errorContainer || !errorDisplay) {
        return;
    }
    
    // Clear previous errors
    errorDisplay.clearError(errorContainer);
    
    // Show each error with appropriate type and suggestions
    errors.forEach(error => {
        const errorType = determineErrorType(error);
        let enhancedMessage = error;
        
        // Add suggestions for common guest list errors
        if (error.includes('duplicate') || error.includes('Duplicate')) {
            // eslint-disable-next-line no-undef
            enhancedMessage = createDetailedErrorMessage(error, 'duplicate_guests');
        } else if (error.includes('too many') || error.includes('Too many')) {
            // eslint-disable-next-line no-undef
            enhancedMessage = createDetailedErrorMessage(error, 'guest_count_mismatch');
        }
        
        errorDisplay.showError(enhancedMessage, errorType, errorContainer);
    });
}

function clearGuestValidationErrors() {
    const errorContainer = document.getElementById('guest-validation-errors');
    if (errorContainer && errorDisplay) {
        errorDisplay.clearError(errorContainer);
    }
}

function updateGuestListValidationState(isValid) {
    const guestInput = document.getElementById('guest-list-input');
    if (guestInput) {
        // Remove all validation state classes
        guestInput.classList.remove('error', 'input-error', 'input-success', 'input-warning');
        
        // Add appropriate state class
        if (isValid) {
            guestInput.classList.add('input-success');
        } else {
            guestInput.classList.add('input-error');
        }
    }
}

function updateTotalSeatsDisplay(total) {
    const totalDisplay = document.getElementById('total-seats');
    if (totalDisplay) {
        totalDisplay.textContent = total.toString();
    }
}

// Enhanced Error Handling Functions (Prompt 13)

function showValidationErrors(errors) {
    const errorContainer = document.getElementById('table-validation-errors');
    if (!errorContainer || !errorDisplay) {
        return;
    }
    
    // Clear previous errors
    errorDisplay.clearError(errorContainer);
    
    // Show each error with appropriate type
    errors.forEach(error => {
        const errorType = determineErrorType(error);
        errorDisplay.showError(error, errorType, errorContainer);
    });
}

function clearValidationErrors() {
    const errorContainer = document.getElementById('table-validation-errors');
    if (errorContainer && errorDisplay) {
        errorDisplay.clearError(errorContainer);
    }
}

function determineErrorType(errorMessage) {
    // Determine error type based on message content
    if (errorMessage.includes('warning') || errorMessage.includes('may')) {
        return 'validation';
    }
    if (errorMessage.includes('required') || errorMessage.includes('must')) {
        return 'error';
    }
    return 'validation';
}

function clearInputErrorStates() {
    const seatInputIds = ['topSeats', 'rightSeats', 'bottomSeats', 'leftSeats'];
    
    seatInputIds.forEach(inputId => {
        const input = document.getElementById(inputId);
        if (input) {
            input.classList.remove('error', 'input-error', 'input-success', 'input-warning');
        }
    });
}

function setInputErrorStates(errors) {
    const seatInputIds = ['topSeats', 'rightSeats', 'bottomSeats', 'leftSeats'];
    
    seatInputIds.forEach(inputId => {
        const input = document.getElementById(inputId);
        if (input) {
            const hasError = errors.some(error => 
                error.toLowerCase().includes(inputId.toLowerCase().replace('seats', ''))
            );
            
            if (hasError) {
                input.classList.add('input-error');
            } else {
                input.classList.add('input-success');
            }
        }
    });
}

// Drag and Drop Functionality

function initializeDragDropUI() {
    console.log('Initializing drag and drop UI...');
    
    // Render initial empty guest list
    renderDraggableGuestList();
    
    // Set up drag and drop when guest list or table changes
    setupDragDropEventHandlers();
}

function renderDraggableGuestList() {
    const guestContainer = document.getElementById('guest-list-container');
    if (!guestContainer) {
        console.error('Guest list container not found');
        return;
    }
    
    if (!currentGuestList || currentGuestList.length === 0) {
        guestContainer.innerHTML = '<div class="empty-guest-list">No guests entered yet. Enter guest names above to begin.</div>';
        return;
    }
    
    // Use the drag and drop module to render the guest list
    // eslint-disable-next-line no-undef
    renderGuestList(currentGuestList, guestContainer, currentAssignedGuests);
    
    console.log('Rendered draggable guest list with', currentGuestList.length, 'guests');
}

function setupDragDropEventHandlers() {
    // Make seats droppable when table is rendered
    if (currentSeatElements) {
        Object.values(currentSeatElements).forEach(seatElement => {
            const seatId = seatElement.getAttribute('data-seat-id');
            if (seatId) {
                // eslint-disable-next-line no-undef
                makeDroppable(seatElement, seatId, handleSeatDrop);
            }
        });
        console.log('Made', Object.keys(currentSeatElements).length, 'seats droppable');
    }
}

function handleSeatDrop(guestName, seatId) {
    // DEBUGGING: Log assignment attempt
    console.log('=== SEAT ASSIGNMENT DEBUG ===');
    console.log('Attempting to assign guest:', guestName, 'to seat:', seatId);
    console.log('fixedAssignmentManager exists:', Boolean(fixedAssignmentManager));
    console.log('Current guest list:', currentGuestList);
    console.log('Current assigned guests:', currentAssignedGuests);
    
    // Validate the assignment using the validation function
    // eslint-disable-next-line no-undef
    const validation = validateFixedAssignment(guestName, seatId, currentGuestList, fixedAssignmentManager);
    console.log('Validation result:', validation);
    
    if (!validation.isValid) {
        console.error('Assignment validation failed:', validation.error);
        // TODO: Show user-friendly error message
        return;
    }
    
    // DEBUGGING: Log manager state before assignment
    if (fixedAssignmentManager) {
        console.log('Manager state before assignment:');
        console.log('- Current assignments:', fixedAssignmentManager.getAllAssignments());
        console.log('- Assignment count:', fixedAssignmentManager.getAssignmentCount());
    }
    
    // Attempt to add assignment to manager
    const result = fixedAssignmentManager.addAssignment(guestName, seatId);
    console.log('addAssignment result:', result);
    
    if (!result.success) {
        console.error('Failed to add assignment:', result.error);
        // TODO: Show user-friendly error message
        return;
    }
    
    // DEBUGGING: Log manager state after assignment
    console.log('Manager state after assignment:');
    console.log('- Current assignments:', fixedAssignmentManager.getAllAssignments());
    console.log('- Assignment count:', fixedAssignmentManager.getAssignmentCount());
    console.log('Successfully assigned guest', guestName, 'to seat', seatId);
    console.log('============================');
    
    // Update assigned guests list for drag and drop filtering
    currentAssignedGuests = Object.values(fixedAssignmentManager.getAllAssignments());
    
    // Update the seat display to show the assignment
    const seatElement = currentSeatElements[seatId];
    if (seatElement) {
        // eslint-disable-next-line no-undef
        updateSeatDisplay(seatElement, guestName, true);
    } else {
        console.error('Seat element not found for seat ID:', seatId);
    }
    
    // Update the draggable guest list
    renderDraggableGuestList();
}

// eslint-disable-next-line no-unused-vars
function handleRemoveAssignment(seatId) {
    console.log('Removing assignment for seat:', seatId);
    
    // Remove assignment from manager
    const result = fixedAssignmentManager.removeAssignment(seatId);
    
    if (!result.success) {
        console.error('Failed to remove assignment:', result.error);
        return;
    }
    
    console.log('Successfully removed guest', result.removedGuest, 'from seat', seatId);
    
    // Update assigned guests list for drag and drop filtering
    currentAssignedGuests = Object.values(fixedAssignmentManager.getAllAssignments());
    
    // Clear the seat display
    const seatElement = currentSeatElements[seatId];
    if (seatElement) {
        // eslint-disable-next-line no-undef
        updateSeatDisplay(seatElement, null, false);
    } else {
        console.error('Seat element not found for seat ID:', seatId);
    }
    
    // Update the draggable guest list to make the guest available again
    renderDraggableGuestList();
}

// Adjacency Constraints UI Functions

function initializeConstraintsUI() {
    console.log('Initializing constraints UI...');
    
    // Get UI elements
    const guestSelectA = document.getElementById('guest-select-a');
    const guestSelectB = document.getElementById('guest-select-b');
    const addConstraintBtn = document.getElementById('add-constraint-btn');
    const constraintsContainer = document.getElementById('constraints-list-container');
    
    if (!guestSelectA || !guestSelectB || !addConstraintBtn || !constraintsContainer) {
        console.error('Constraints UI elements not found');
        return;
    }
    
    // Clear any existing constraints
    adjacencyConstraintManager.clearAllConstraints();
    
    // Set up event listeners
    guestSelectA.addEventListener('change', validateAndUpdateConstraintForm);
    guestSelectB.addEventListener('change', validateAndUpdateConstraintForm);
    addConstraintBtn.addEventListener('click', handleAddConstraint);
    
    // Set up delegation for delete buttons
    constraintsContainer.addEventListener('click', handleDeleteConstraint);
    
    // Initial render
    updateConstraintUI();
    
    console.log('Constraints UI initialized');
}

function updateConstraintUI() {
    // Update dropdowns with current guest list
    const guestSelectA = document.getElementById('guest-select-a');
    const guestSelectB = document.getElementById('guest-select-b');
    
    if (guestSelectA && guestSelectB) {
        // eslint-disable-next-line no-undef
        populateGuestDropdowns(currentGuestList, [guestSelectA, guestSelectB]);
    }
    
    // Render constraints list
    const constraintsContainer = document.getElementById('constraints-list-container');
    if (constraintsContainer) {
        const constraints = adjacencyConstraintManager.getAllConstraints();
        // eslint-disable-next-line no-undef
        renderConstraintsList(constraints, constraintsContainer);
    }
    
    // Validate form state
    validateAndUpdateConstraintForm();
}

function validateAndUpdateConstraintForm() {
    const guestSelectA = document.getElementById('guest-select-a');
    const guestSelectB = document.getElementById('guest-select-b');
    const addConstraintBtn = document.getElementById('add-constraint-btn');
    
    if (!guestSelectA || !guestSelectB || !addConstraintBtn) {
        return;
    }
    
    const guestA = guestSelectA.value;
    const guestB = guestSelectB.value;
    
    // Validate selection
    const constraints = adjacencyConstraintManager.getAllConstraints();
    // eslint-disable-next-line no-undef
    const validation = validateConstraintSelection(guestA, guestB, constraints);
    
    // Update button state
    // eslint-disable-next-line no-undef
    updateAddConstraintButtonState(addConstraintBtn, validation.isValid);
    
    // Show validation errors if any
    if (!validation.isValid && (guestA || guestB)) {
        const constraintsSection = document.querySelector('.adjacency-constraints-section');
        // eslint-disable-next-line no-undef
        showConstraintValidationError(validation.errors[0], constraintsSection);
    }
}

function handleAddConstraint() {
    const guestSelectA = document.getElementById('guest-select-a');
    const guestSelectB = document.getElementById('guest-select-b');
    
    if (!guestSelectA || !guestSelectB) {
        return;
    }
    
    const guestA = guestSelectA.value;
    const guestB = guestSelectB.value;
    
    // Validate one more time
    const constraints = adjacencyConstraintManager.getAllConstraints();
    // eslint-disable-next-line no-undef
    const validation = validateConstraintSelection(guestA, guestB, constraints);
    
    if (!validation.isValid) {
        console.error('Cannot add constraint:', validation.errors);
        return;
    }
    
    // Add constraint using manager
    try {
        const result = adjacencyConstraintManager.addConstraint(guestA, guestB);
        
        if (!result.success) {
            console.error('Failed to add constraint:', result.error);
            const constraintsSection = document.querySelector('.adjacency-constraints-section');
            // eslint-disable-next-line no-undef
            showConstraintValidationError(result.error, constraintsSection);
            return;
        }
        
        console.log('Added constraint:', result.constraint);
        
        // Clear form
        // eslint-disable-next-line no-undef
        clearConstraintForm([guestSelectA, guestSelectB]);
        
        // Update UI
        updateConstraintUI();
        
        // Run constraint validation and show warnings/errors
        runConstraintValidation();
        
    } catch (error) {
        console.error('Error adding constraint:', error);
        const constraintsSection = document.querySelector('.adjacency-constraints-section');
        // eslint-disable-next-line no-undef
        showConstraintValidationError('Error adding constraint', constraintsSection);
    }
}

function handleDeleteConstraint(event) {
    // Check if the clicked element is a delete button
    if (!event.target.classList.contains('delete-constraint-btn')) {
        return;
    }
    
    const constraintIndex = parseInt(event.target.getAttribute('data-constraint-index'));
    
    const result = adjacencyConstraintManager.removeConstraint(constraintIndex);
    
    if (!result.success) {
        console.error('Failed to remove constraint:', result.error);
        return;
    }
    
    console.log('Removed constraint:', result.removedConstraint);
    
    // Update UI
    updateConstraintUI();
    
    // Run constraint validation after removal
    runConstraintValidation();
}

// Adjacency Map Management

function calculateAndStoreAdjacencyMap() {
    if (!currentTableConfig) {
        console.warn('No table configuration available for adjacency calculation');
        currentAdjacencyMap = null;
        return;
    }
    
    try {
        // eslint-disable-next-line no-undef
        currentAdjacencyMap = calculateAdjacencyMap(currentTableConfig);
        console.log('Calculated adjacency map for table:', currentAdjacencyMap);
        
        // Log some interesting adjacency information for debugging
        if (currentAdjacencyMap.size > 0) {
            console.log('Adjacency examples:');
            let count = 0;
            for (const [seatId, adjacentSeats] of currentAdjacencyMap) {
                console.log(`  Seat ${seatId}: adjacent to [${adjacentSeats.join(', ')}]`);
                count++;
                if (count >= 3) break; // Only show first 3 for brevity
            }
        }
        
    } catch (error) {
        console.error('Error calculating adjacency map:', error);
        currentAdjacencyMap = null;
    }
}

// Constraint Validation Integration

function runConstraintValidation() {
    if (!currentTableConfig || !currentAdjacencyMap || !adjacencyConstraintManager) {
        return;
    }
    
    try {
        const fixedAssignments = fixedAssignmentManager.getAllAssignments();
        const adjacencyConstraints = adjacencyConstraintManager.getAllConstraints();
        
        // eslint-disable-next-line no-undef
        const validationResult = validateAllConstraints(
            currentGuestList,
            currentTableConfig,
            fixedAssignments,
            adjacencyConstraints,
            currentAdjacencyMap
        );
        
        console.log('Constraint validation result:', validationResult);
        
        // Display validation results to user
        displayValidationResults(validationResult);
        
    } catch (error) {
        console.error('Error running constraint validation:', error);
    }
}

function displayValidationResults(validationResult) {
    // Clear any existing validation messages
    clearValidationMessages();
    
    if (!validationResult.isValid && validationResult.errors.length > 0) {
        showConstraintValidationErrors(validationResult.errors);
    }
    
    if (validationResult.warnings.length > 0) {
        showValidationWarnings(validationResult.warnings);
    }
    
    // Update generate button state based on validation
    updateGenerateButtonState(validationResult.isValid);
}

// UI Integration Functions (Prompt 12)

function initializeGenerateButton() {
    const generateBtn = document.querySelector('.generate-btn');
    if (generateBtn) {
        generateBtn.addEventListener('click', handleGenerateSeating);
    }
}

function handleGenerateSeating() {
    const logPrefix = '[GENERATION]';
    console.log(`${logPrefix} Generate seating button clicked`);
    
    try {
        // Clear previous status messages
        clearStatusMessages();
        
        // Use comprehensive validation summary
        if (!showValidationSummary()) {
            console.log(`${logPrefix} Validation failed - aborting generation`);
            return; // Validation summary will show the issues
        }
        
        // Auto-clear previous generated assignments (but keep fixed assignments and constraints)
        clearPreviousGeneratedAssignments();
        
        // Show loading state with timeout failsafe
        console.log(`${logPrefix} Starting generation process`);
        const spinnerStarted = setLoadingStateWithTimeout(true, 'generation-start', 30000);
        
        if (!spinnerStarted) {
            console.error(`${logPrefix} Failed to start spinner - aborting generation`);
            showGenerationError('Failed to initialize generation process. Please refresh the page and try again.', []);
            return;
        }
        
        // Get current state
        const guests = [...currentGuestList];
        const tableConfig = currentTableConfig;
        const fixedAssignments = fixedAssignmentManager.getAllAssignments();
        const adjacencyConstraints = adjacencyConstraintManager.getAllConstraints();
        const adjacencyMap = currentAdjacencyMap;
        
        console.log(`${logPrefix} Generating seating with:`, {
            guests: guests.length,
            totalSeats: tableConfig.totalSeats,
            fixedAssignments: Object.keys(fixedAssignments).length,
            adjacencyConstraints: adjacencyConstraints.length
        });
        
        // Validate inputs before calling generation algorithm
        if (guests.length === 0) {
            setLoadingState(false, 'generation-no-guests');
            showGenerationError('No guests available for seating generation.', []);
            return;
        }
        
        if (!tableConfig || tableConfig.totalSeats === 0) {
            setLoadingState(false, 'generation-no-table');
            showGenerationError('No table configuration available for seating generation.', []);
            return;
        }
        
        // Call generation algorithm with additional error handling
        let result;
        try {
            console.log(`${logPrefix} Calling generation algorithm`);
            // eslint-disable-next-line no-undef
            result = generateSeating(guests, tableConfig, fixedAssignments, adjacencyConstraints, adjacencyMap);
            console.log(`${logPrefix} Generation algorithm completed:`, result);
        } catch (generationError) {
            console.error(`${logPrefix} Generation algorithm threw error:`, generationError);
            setLoadingState(false, 'generation-algorithm-error');
            showGenerationError('Generation algorithm failed: ' + generationError.message, []);
            return;
        }
        
        // Validate result from generation algorithm
        if (!result) {
            console.error(`${logPrefix} Generation algorithm returned null/undefined result`);
            setLoadingState(false, 'generation-null-result');
            showGenerationError('Generation algorithm returned invalid result. Please try again.', []);
            return;
        }
        
        // Hide loading state - generation completed
        setLoadingState(false, 'generation-complete');
        
        if (result.success) {
            console.log(`${logPrefix} Generation successful`);
            // Display results
            displayGeneratedSeating(result.arrangement);
            showGenerationSuccess(result.arrangement);
        } else {
            console.log(`${logPrefix} Generation failed:`, result.error);
            // Display errors
            showGenerationError(result.error, result.unmetConstraints || []);
            
            // Show partial solution if available
            if (result.arrangement && result.arrangement.size > 0) {
                console.log(`${logPrefix} Displaying partial solution`);
                displayGeneratedSeating(result.arrangement);
            }
        }
        
    } catch (error) {
        console.error(`${logPrefix} Unexpected error during generation:`, error);
        
        // Ensure spinner is hidden on any error
        try {
            setLoadingState(false, 'generation-unexpected-error');
        } catch (spinnerError) {
            console.error(`${logPrefix} Failed to hide spinner after error:`, spinnerError);
            // Last resort - try direct DOM manipulation
            try {
                const spinner = document.getElementById('loading-spinner');
                if (spinner) {
                    spinner.classList.add('hidden');
                }
            } catch (domError) {
                console.error(`${logPrefix} Direct DOM manipulation failed:`, domError);
            }
        }
        
        showGenerationError('An unexpected error occurred during generation: ' + error.message, []);
    }
}

// Function removed - replaced by showValidationSummary

function displayGeneratedSeating(arrangement) {
    console.log('Displaying generated seating arrangement:', arrangement);
    
    if (!currentSeatElements) {
        console.error('No seat elements available for display');
        return;
    }
    
    // Note: clearPreviousGeneratedAssignments() is called earlier in handleGenerateSeating
    
    // Display each assignment
    for (const [seatId, guestName] of arrangement) {
        const seatElement = currentSeatElements[seatId];
        if (seatElement) {
            // Check if this is a fixed assignment
            const isFixed = fixedAssignmentManager.getAssignment(seatId) === guestName;
            
            if (!isFixed) {
                // Only update display for generated assignments (fixed ones are already shown)
                updateSeatDisplay(seatElement, guestName, false);
            }
        } else {
            console.warn('Seat element not found for seat ID:', seatId);
        }
    }
}

function clearPreviousGeneratedAssignments() {
    console.log('clearPreviousGeneratedAssignments called, currentSeatElements:', Boolean(currentSeatElements));
    
    if (!currentSeatElements) {
        console.log('No currentSeatElements, trying to find seats in DOM');
        // Fallback: find all seats in the current table display
        const tableContainer = document.getElementById('table-display');
        if (!tableContainer) {
            console.log('No table container found');
            return;
        }
        
        const allSeats = tableContainer.querySelectorAll('.seat-group');
        console.log('Found seats in DOM:', allSeats.length);
        
        allSeats.forEach(seatElement => {
            if (seatElement.classList.contains('generated-assignment')) {
                const seatId = seatElement.getAttribute('data-seat-id');
                // Clear the visual display completely
                updateSeatDisplay(seatElement, null, false);
                console.log('Cleared generated assignment from seat:', seatId);
            }
        });
        return;
    }
    
    console.log('Using currentSeatElements, count:', Object.keys(currentSeatElements).length);
    Object.values(currentSeatElements).forEach(seatElement => {
        console.log('Checking seat element:', seatElement.getAttribute('data-seat-id'), 'classes:', seatElement.className);
        // Only clear generated assignments, keep fixed ones
        if (seatElement.classList.contains('generated-assignment')) {
            const seatId = seatElement.getAttribute('data-seat-id');
            updateSeatDisplay(seatElement, null, false);
            console.log('Cleared generated assignment from seat:', seatId);
        }
    });
}

function showGenerationSuccess(arrangement) {
    const assignedGuests = Array.from(arrangement.values());
    const message = `Successfully seated ${assignedGuests.length} guests!`;
    
    showStatusMessage(message, 'success');
}

function showGenerationError(error, unmetConstraints) {
    console.log('Showing generation error:', error, unmetConstraints);
    
    let message = error;
    
    // Add constraint details if available
    if (unmetConstraints && unmetConstraints.length > 0) {
        message += '\n\nConstraint issues:';
        unmetConstraints.forEach(constraint => {
            message += `\n• ${constraint.reason}`;
        });
        
        message += '\n\nTry removing some constraints or changing fixed seat assignments.';
    }
    
    showStatusMessage(message, 'error');
}

// ABOUTME: Enhanced spinner state management with comprehensive error handling and debug logging
// ABOUTME: Includes failsafe mechanisms to prevent spinner from getting stuck in loading state

// Global state tracking for spinner management
let currentSpinnerState = false;
let spinnerTimeoutId = null;
const spinnerStateHistory = [];

function setLoadingState(isLoading, context = 'unknown') {
    const timestamp = new Date().toISOString();
    const logPrefix = '[SPINNER]';
    
    console.log(`${logPrefix} ${timestamp} Setting loading state to: ${isLoading} (context: ${context})`);
    
    // Track state history for debugging
    spinnerStateHistory.push({
        timestamp,
        isLoading,
        context,
        previousState: currentSpinnerState
    });
    
    // Keep only last 10 state changes
    if (spinnerStateHistory.length > 10) {
        spinnerStateHistory.shift();
    }
    
    const generateBtn = document.querySelector('.generate-btn');
    const loadingSpinner = document.getElementById('loading-spinner');
    
    // Validation - ensure DOM elements exist
    if (!loadingSpinner) {
        console.error(`${logPrefix} Loading spinner element not found in DOM`);
        return false;
    }
    
    try {
        // Update button state
        if (generateBtn) {
            generateBtn.disabled = isLoading;
            if (isLoading) {
                generateBtn.classList.add('loading');
                generateBtn.textContent = 'Generate Seating';
            } else {
                generateBtn.classList.remove('loading');
                generateBtn.textContent = 'Generate Seating';
            }
        } else {
            console.warn(`${logPrefix} Generate button not found in DOM`);
        }
        
        // Update spinner state
        if (isLoading) {
            loadingSpinner.classList.remove('hidden');
        } else {
            loadingSpinner.classList.add('hidden');
        }
        
        // Verify state was applied correctly
        const isVisible = !loadingSpinner.classList.contains('hidden');
        if (isVisible !== isLoading) {
            console.error(`${logPrefix} State mismatch! Expected: ${isLoading}, Actual: ${isVisible}`);
            // Attempt to fix the mismatch
            if (isLoading) {
                loadingSpinner.classList.remove('hidden');
            } else {
                loadingSpinner.classList.add('hidden');
            }
        }
        
        // Update global state tracking
        currentSpinnerState = isLoading;
        
        console.log(`${logPrefix} State successfully set to: ${isLoading}`);
        return true;
        
    } catch (error) {
        console.error(`${logPrefix} Error applying state change:`, error);
        // Defensive programming - try to hide spinner on error
        try {
            if (loadingSpinner) {
                loadingSpinner.classList.add('hidden');
            }
        } catch (recoveryError) {
            console.error(`${logPrefix} Recovery attempt failed:`, recoveryError);
        }
        return false;
    }
}

function setLoadingStateWithTimeout(isLoading, context = 'unknown', maxDuration = 30000) {
    const logPrefix = '[SPINNER-TIMEOUT]';
    
    console.log(`${logPrefix} Setting loading state with timeout: ${isLoading} (context: ${context}, maxDuration: ${maxDuration}ms)`);
    
    // Set the loading state
    const success = setLoadingState(isLoading, context);
    
    if (isLoading && success) {
        // Clear any existing timeout
        if (spinnerTimeoutId) {
            console.log(`${logPrefix} Clearing existing timeout`);
            clearTimeout(spinnerTimeoutId);
        }
        
        // Set failsafe timeout
        spinnerTimeoutId = setTimeout(() => {
            console.warn(`${logPrefix} Failsafe timeout triggered after ${maxDuration}ms - forcing spinner off`);
            setLoadingState(false, 'failsafe-timeout');
            spinnerTimeoutId = null;
            
            // Show user notification about timeout
            showStatusMessage('Generation took longer than expected and was stopped. Please try again.', 'warning');
        }, maxDuration);
        
        console.log(`${logPrefix} Failsafe timeout set for ${maxDuration}ms`);
    } else if (!isLoading) {
        // Clear timeout when manually stopping
        if (spinnerTimeoutId) {
            console.log(`${logPrefix} Clearing timeout on manual stop`);
            clearTimeout(spinnerTimeoutId);
            spinnerTimeoutId = null;
        }
    }
    
    return success;
}

// Function to validate current spinner state
function validateSpinnerState() {
    const logPrefix = '[SPINNER-VALIDATION]';
    const loadingSpinner = document.getElementById('loading-spinner');
    
    if (!loadingSpinner) {
        console.error(`${logPrefix} Spinner element not found`);
        return false;
    }
    
    const isVisible = !loadingSpinner.classList.contains('hidden');
    const stateMatch = isVisible === currentSpinnerState;
    
    console.log(`${logPrefix} Spinner validation - Expected: ${currentSpinnerState}, Actual: ${isVisible}, Match: ${stateMatch}`);
    
    if (!stateMatch) {
        console.warn(`${logPrefix} State mismatch detected! Attempting recovery...`);
        return setLoadingState(currentSpinnerState, 'validation-recovery');
    }
    
    return true;
}

// Function to reset spinner state in case of issues
// eslint-disable-next-line no-unused-vars
function resetSpinnerState() {
    const logPrefix = '[SPINNER-RESET]';
    console.log(`${logPrefix} Resetting spinner state`);
    
    // Clear any existing timeout
    if (spinnerTimeoutId) {
        clearTimeout(spinnerTimeoutId);
        spinnerTimeoutId = null;
    }
    
    // Force spinner off
    const success = setLoadingState(false, 'manual-reset');
    
    if (success) {
        console.log(`${logPrefix} Spinner state reset successfully`);
    } else {
        console.error(`${logPrefix} Failed to reset spinner state`);
    }
    
    return success;
}

// Function to get spinner state history for debugging
// eslint-disable-next-line no-unused-vars
function getSpinnerStateHistory() {
    return {
        currentState: currentSpinnerState,
        hasActiveTimeout: Boolean(spinnerTimeoutId),
        history: [...spinnerStateHistory]
    };
}

// Add page interaction listeners to detect stuck spinner
document.addEventListener('DOMContentLoaded', function() {
    // Ensure spinner is hidden on page load
    const loadingSpinner = document.getElementById('loading-spinner');
    if (loadingSpinner) {
        loadingSpinner.classList.add('hidden');
        console.log('[SPINNER] Ensured spinner is hidden on page load');
    }
    
    // Add click listener to detect user interactions that might indicate stuck spinner
    document.addEventListener('click', function() {
        // Only check if spinner is currently active
        if (currentSpinnerState) {
            // Allow 1 second for legitimate operations to complete
            setTimeout(() => {
                if (currentSpinnerState) {
                    console.warn('[SPINNER] Spinner still active after user interaction - validating state');
                    validateSpinnerState();
                }
            }, 1000);
        }
    });
});

function showStatusMessage(message, type) {
    const statusContainer = document.getElementById('status-messages');
    if (!statusContainer) {
        console.error('Status messages container not found');
        return;
    }
    
    const messageElement = document.createElement('div');
    messageElement.className = `status-message ${type}`;
    
    // Handle multiline messages
    const lines = message.split('\n');
    if (lines.length > 1) {
        messageElement.innerHTML = lines.map(line => {
            if (line.startsWith('•')) {
                return `<div class="constraint-details">${line}</div>`;
            }
            return line;
        }).join('<br>');
    } else {
        messageElement.textContent = message;
    }
    
    statusContainer.appendChild(messageElement);
    
    // Auto-dismiss success messages after 5 seconds
    if (type === 'success') {
        setTimeout(() => {
            if (messageElement.parentNode) {
                messageElement.remove();
            }
        }, 5000);
    }
}

function clearStatusMessages() {
    const statusContainer = document.getElementById('status-messages');
    if (statusContainer) {
        statusContainer.innerHTML = '';
    }
}

// Comprehensive Validation Summary (Prompt 13)

function showValidationSummary() {
    const validationResult = gatherAllValidationIssues();
    
    if (!validationResult.isValid) {
        // Show summary of all issues
        const summaryContainer = document.getElementById('status-messages');
        if (summaryContainer && errorDisplay) {
            const summaryMessage = formatValidationSummary(validationResult);
            errorDisplay.showError(summaryMessage, 'validation', summaryContainer);
        }
        
        return false; // Prevent generation
    }
    
    return true; // Allow generation
}

function gatherAllValidationIssues() {
    const issues = [];
    let hasErrors = false;
    
    // Check table configuration
    if (!currentTableConfig) {
        issues.push({ field: 'table', message: 'Table configuration is incomplete', type: 'error' });
        hasErrors = true;
    }
    
    // Check guest list
    if (!currentGuestList || currentGuestList.length === 0) {
        issues.push({ field: 'guests', message: 'Guest list is empty', type: 'error' });
        hasErrors = true;
    } else if (currentTableConfig && currentGuestList.length > currentTableConfig.totalSeats) {
        issues.push({ 
            field: 'guests', 
            message: `Too many guests (${currentGuestList.length}) for available seats (${currentTableConfig.totalSeats})`, 
            type: 'error' 
        });
        hasErrors = true;
    }
    
    // Check adjacency map
    if (!currentAdjacencyMap) {
        issues.push({ field: 'adjacency', message: 'Table adjacency data is missing', type: 'error' });
        hasErrors = true;
    }
    
    // Check constraint feasibility
    if (adjacencyConstraintManager && fixedAssignmentManager && currentAdjacencyMap) {
        try {
            const constraints = adjacencyConstraintManager.getAllConstraints();
            const fixed = fixedAssignmentManager.getAllAssignments();
            
            // eslint-disable-next-line no-undef
            const constraintValidation = validateAllConstraints(
                currentGuestList, 
                currentTableConfig, 
                fixed, 
                constraints, 
                currentAdjacencyMap
            );
            
            if (!constraintValidation.isValid) {
                constraintValidation.errors.forEach(error => {
                    issues.push({ field: 'constraints', message: error, type: 'error' });
                    hasErrors = true;
                });
            }
            
            constraintValidation.warnings.forEach(warning => {
                issues.push({ field: 'constraints', message: warning, type: 'validation' });
            });
            
        } catch (error) {
            issues.push({ field: 'constraints', message: 'Error validating constraints', type: 'error' });
            hasErrors = true;
        }
    }
    
    // eslint-disable-next-line no-undef
    return createErrorResult(!hasErrors, issues);
}

function formatValidationSummary(validationResult) {
    let message = 'Configuration Issues Found:\n\n';
    
    const errorsByField = {};
    validationResult.errors.forEach(error => {
        if (!errorsByField[error.field]) {
            errorsByField[error.field] = [];
        }
        errorsByField[error.field].push(error.message);
    });
    
    Object.entries(errorsByField).forEach(([field, messages]) => {
        message += `${field.charAt(0).toUpperCase() + field.slice(1)}:\n`;
        messages.forEach(msg => {
            message += `• ${msg}\n`;
        });
        message += '\n';
    });
    
    message += 'Please resolve these issues before generating seating arrangements.';
    
    return message;
}

function showConstraintValidationErrors(errors) {
    const constraintsSection = document.querySelector('.adjacency-constraints-section');
    if (!constraintsSection) return;
    
    // Create or update error container
    let errorContainer = constraintsSection.querySelector('.constraint-validation-errors');
    if (!errorContainer) {
        errorContainer = document.createElement('div');
        errorContainer.className = 'constraint-validation-errors';
        constraintsSection.appendChild(errorContainer);
    }
    
    errorContainer.innerHTML = '';
    errors.forEach(error => {
        const errorElement = document.createElement('div');
        errorElement.className = 'constraint-error-item';
        errorElement.textContent = error;
        errorContainer.appendChild(errorElement);
    });
}

function showValidationWarnings(warnings) {
    const constraintsSection = document.querySelector('.adjacency-constraints-section');
    if (!constraintsSection) return;
    
    // Create or update warning container
    let warningContainer = constraintsSection.querySelector('.constraint-validation-warnings');
    if (!warningContainer) {
        warningContainer = document.createElement('div');
        warningContainer.className = 'constraint-validation-warnings';
        constraintsSection.appendChild(warningContainer);
    }
    
    warningContainer.innerHTML = '';
    warnings.forEach(warning => {
        const warningElement = document.createElement('div');
        warningElement.className = 'constraint-warning-item';
        warningElement.textContent = warning;
        warningContainer.appendChild(warningElement);
    });
}

function clearValidationMessages() {
    const constraintsSection = document.querySelector('.adjacency-constraints-section');
    if (!constraintsSection) return;
    
    const errorContainer = constraintsSection.querySelector('.constraint-validation-errors');
    const warningContainer = constraintsSection.querySelector('.constraint-validation-warnings');
    
    if (errorContainer) {
        errorContainer.remove();
    }
    if (warningContainer) {
        warningContainer.remove();
    }
}

function updateGenerateButtonState(isValid) {
    const generateBtn = document.querySelector('.generate-btn');
    if (!generateBtn) return;
    
    if (isValid) {
        generateBtn.disabled = false;
        generateBtn.classList.remove('disabled');
        generateBtn.title = 'Generate seating arrangement';
    } else {
        generateBtn.disabled = true;
        generateBtn.classList.add('disabled');
        generateBtn.title = 'Cannot generate: constraint conflicts detected';
    }
}

// Helper function to wait for SVG rendering completion
function waitForSVGRenderComplete() {
    return new Promise(resolve => {
        const checkRender = () => {
            if (currentSeatElements && Object.keys(currentSeatElements).length > 0) {
                console.log('SVG render complete - currentSeatElements populated with', Object.keys(currentSeatElements).length, 'seats');
                resolve();
            } else {
                console.log('Waiting for SVG render completion...');
                setTimeout(checkRender, 10);
            }
        };
        checkRender();
    });
}

// Helper function to apply fixed assignment visuals
async function applyFixedAssignmentVisuals(fixedAssignments) {
    console.log('Applying fixed assignment visuals...');
    console.log('currentSeatElements available:', Boolean(currentSeatElements));
    if (currentSeatElements) {
        console.log('Available seat IDs:', Object.keys(currentSeatElements));
    }
    
    Object.entries(fixedAssignments).forEach(([seatId, guestName]) => {
        console.log(`Processing seat ${seatId}:`, {
            seatId: seatId,
            guestName: guestName,
            guestNameType: typeof guestName,
            guestNameValue: JSON.stringify(guestName)
        });
        
        if (currentSeatElements && currentSeatElements[seatId]) {
            console.log(`Found seat element for seat ${seatId}, calling updateSeatDisplay with:`, {
                seatElement: currentSeatElements[seatId],
                guestName: guestName,
                isFixed: true
            });
            updateSeatDisplay(currentSeatElements[seatId], guestName, true);
        } else {
            console.warn(`No seat element found for seat ${seatId}`);
        }
    });
}

// Clear All functionality
function handleClearAll() {
    console.log('Clear All button clicked');
    
    // Reset table configuration (using correct camelCase IDs) with defensive checks
    const topSeats = document.getElementById('topSeats');
    const rightSeats = document.getElementById('rightSeats');
    const bottomSeats = document.getElementById('bottomSeats');
    const leftSeats = document.getElementById('leftSeats');
    
    if (!topSeats || !rightSeats || !bottomSeats || !leftSeats) {
        console.error('Clear All: Cannot find seat input elements', {
            topSeats: Boolean(topSeats),
            rightSeats: Boolean(rightSeats), 
            bottomSeats: Boolean(bottomSeats),
            leftSeats: Boolean(leftSeats)
        });
        return;
    }
    
    topSeats.value = '2';
    rightSeats.value = '2';
    bottomSeats.value = '2';
    leftSeats.value = '2';
    
    // Trigger table configuration update
    [topSeats, rightSeats, bottomSeats, leftSeats].forEach(element => {
        element.dispatchEvent(new Event('input'));
    });
    
    // Clear guest list
    const guestListInput = document.getElementById('guest-list-input');
    if (guestListInput) {
        guestListInput.value = '';
        guestListInput.dispatchEvent(new Event('input'));
    } else {
        console.error('Clear All: Cannot find guest-list-input element');
    }
    
    // Clear all fixed assignments
    if (fixedAssignmentManager) {
        const allAssignments = fixedAssignmentManager.getAllAssignments();
        Object.entries(allAssignments).forEach(([seatId]) => {
            handleRemoveAssignment(seatId);
        });
    }
    
    // Clear all adjacency constraints
    if (adjacencyConstraintManager) {
        const allConstraints = adjacencyConstraintManager.getAllConstraints();
        for (let i = allConstraints.length - 1; i >= 0; i--) {
            adjacencyConstraintManager.removeConstraint(i);
        }
        // eslint-disable-next-line no-undef
        renderConstraintsList(adjacencyConstraintManager.getAllConstraints(), document.getElementById('constraints-list'));
    }
    
    // Clear any status messages
    const statusMessages = document.getElementById('status-messages');
    if (statusMessages) {
        statusMessages.innerHTML = '';
    }
    
    // Clear any error messages
    document.querySelectorAll('.validation-errors').forEach(container => {
        container.innerHTML = '';
    });
    
    // Show success message
    if (errorDisplay) {
        errorDisplay.showSuccess('All data cleared successfully', statusMessages);
    }
}

// Load Example functionality
function handleLoadExample() {
    console.log('Load Example button clicked');
    
    // Load the simple test data
    if (window.testSuite && window.testSuite.populateFormWithTestData) {
        window.testSuite.populateFormWithTestData('simple');
        
        // Show success message
        const statusMessages = document.getElementById('status-messages');
        if (errorDisplay) {
            errorDisplay.showSuccess('Example data loaded successfully', statusMessages);
        }
    }
}

// Export Configuration functionality
function handleExportConfig() {
    console.log('Export Config button clicked');
    
    try {
        // DEBUGGING: Log manager state before export
        console.log('=== EXPORT DEBUG INFORMATION ===');
        console.log('fixedAssignmentManager exists:', Boolean(fixedAssignmentManager));
        console.log('fixedAssignmentManager type:', typeof fixedAssignmentManager);
        
        if (fixedAssignmentManager) {
            const assignments = fixedAssignmentManager.getAllAssignments();
            console.log('getAllAssignments() result:', assignments);
            console.log('Assignment count:', fixedAssignmentManager.getAssignmentCount());
            console.log('Assignment object keys:', Object.keys(assignments));
            console.log('Assignment object values:', Object.values(assignments));
            
            // Log internal state for debugging
            console.log('Manager internal assignments:', fixedAssignmentManager.assignments);
            console.log('Manager internal guestToSeat:', fixedAssignmentManager.guestToSeat);
        } else {
            console.error('fixedAssignmentManager is null or undefined at export time!');
        }
        
        console.log('adjacencyConstraintManager exists:', Boolean(adjacencyConstraintManager));
        if (adjacencyConstraintManager) {
            console.log('Adjacency constraints count:', adjacencyConstraintManager.getAllConstraints().length);
        }
        console.log('================================');
        
        // Gather current configuration
        const config = {
            version: '1.0',
            timestamp: new Date().toISOString(),
            tableConfig: currentTableConfig,
            guestList: [...currentGuestList],
            fixedAssignments: fixedAssignmentManager ? fixedAssignmentManager.getAllAssignments() : {},
            adjacencyConstraints: adjacencyConstraintManager ? adjacencyConstraintManager.getAllConstraints() : []
        };
        
        // DEBUGGING: Log what we're about to export
        console.log('Configuration being exported:');
        console.log('- Table config:', config.tableConfig);
        console.log('- Guest list length:', config.guestList.length);
        console.log('- Fixed assignments:', config.fixedAssignments);
        console.log('- Adjacency constraints length:', config.adjacencyConstraints.length);
        
        // Add user warning if no assignments are being exported
        if (Object.keys(config.fixedAssignments).length === 0) {
            console.warn('⚠️  WARNING: No seat assignments found for export!');
            console.warn('This means either:');
            console.warn('1. No guests have been assigned to seats via drag & drop');
            console.warn('2. Assignments were created but lost due to guest list changes');
            console.warn('3. There is a bug in the assignment creation workflow');
            
            // Show user-friendly warning
            const statusMessages = document.getElementById('status-messages');
            if (errorDisplay) {
                errorDisplay.showWarning(
                    'Export Warning: No seat assignments found. Make sure you have assigned guests to seats using drag & drop before exporting.',
                    statusMessages
                );
            }
        }
        
        // Create downloadable file
        const dataStr = JSON.stringify(config, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        // Create download link
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `seating-config-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.json`;
        
        // Trigger download
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Show success message
        const statusMessages = document.getElementById('status-messages');
        if (errorDisplay) {
            errorDisplay.showSuccess('Configuration exported successfully', statusMessages);
        }
        
        console.log('Configuration exported:', config);
        
    } catch (error) {
        console.error('Export failed:', error);
        const statusMessages = document.getElementById('status-messages');
        if (errorDisplay) {
            errorDisplay.showError('Export failed: ' + error.message, statusMessages);
        }
    }
}

// Import Configuration functionality
function handleImportConfig(event) {
    console.log('Import Config file selected');
    
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = async function(e) {
        try {
            // Set import flag to prevent clearing of assignments during guest list update
            isImporting = true;
            console.log('Starting import - setting isImporting flag to true');
            
            const config = JSON.parse(e.target.result);
            
            // Validate config structure
            if (!config.version || !config.tableConfig || !config.guestList) {
                throw new Error('Invalid configuration file format');
            }
            
            console.log('Importing configuration:', config);
            
            // Apply table configuration
            if (config.tableConfig) {
                const { topSeats, rightSeats, bottomSeats, leftSeats } = config.tableConfig;
                
                console.log('Importing table config:', { topSeats, rightSeats, bottomSeats, leftSeats });
                
                const topSeatsInput = document.getElementById('topSeats');
                const rightSeatsInput = document.getElementById('rightSeats');
                const bottomSeatsInput = document.getElementById('bottomSeats');
                const leftSeatsInput = document.getElementById('leftSeats');
                
                if (topSeatsInput) {
                    topSeatsInput.value = topSeats || 0;
                    console.log('Set topSeats to:', topSeatsInput.value);
                }
                if (rightSeatsInput) {
                    rightSeatsInput.value = rightSeats || 0;
                    console.log('Set rightSeats to:', rightSeatsInput.value);
                }
                if (bottomSeatsInput) {
                    bottomSeatsInput.value = bottomSeats || 0;
                    console.log('Set bottomSeats to:', bottomSeatsInput.value);
                }
                if (leftSeatsInput) {
                    leftSeatsInput.value = leftSeats || 0;
                    console.log('Set leftSeats to:', leftSeatsInput.value);
                }
                
                // Trigger table update - use the main handler to ensure visual update
                console.log('Calling handleTableInputChange...');
                handleTableInputChange();
                console.log('Table rendering completed');
            }
            
            // Apply guest list FIRST - fixed assignments may depend on guest list
            if (config.guestList) {
                console.log('Importing guest list...');
                const guestListInput = document.getElementById('guest-list-input');
                if (guestListInput) {
                    guestListInput.value = config.guestList.join('\n');
                    guestListInput.dispatchEvent(new Event('input'));
                }
            }
            
            // Apply fixed assignments AFTER guest list and table are ready
            if (config.fixedAssignments !== undefined && fixedAssignmentManager && config.tableConfig) {
                console.log('Processing fixed assignments import...');
                console.log('Fixed assignments to import:', config.fixedAssignments);
                
                const assignmentEntries = Object.entries(config.fixedAssignments);
                console.log(`Found ${assignmentEntries.length} fixed assignments to import`);
                
                // Clear existing assignments first
                const existingAssignments = fixedAssignmentManager.getAllAssignments();
                console.log('Clearing existing assignments:', existingAssignments);
                Object.keys(existingAssignments).forEach(seatId => {
                    handleRemoveAssignment(seatId);
                });
                
                // Add imported assignments to data structures (if any)
                if (assignmentEntries.length > 0) {
                    assignmentEntries.forEach(([seatId, guestName]) => {
                        console.log(`Adding assignment: seat ${seatId} -> guest ${guestName}`);
                        fixedAssignmentManager.addAssignment(guestName, seatId);
                    });
                } else {
                    console.log('No fixed assignments to import (empty object)');
                }
                
                // Verify assignments were added correctly
                const verifyAssignments = fixedAssignmentManager.getAllAssignments();
                console.log('Assignments after import:', verifyAssignments);
                
                // Wait for SVG rendering to complete before applying visual updates
                console.log('Waiting for SVG rendering completion before applying visuals...');
                await waitForSVGRenderComplete();
                
                // Apply visual updates now that SVG is ready - use manager data to ensure consistency
                const currentAssignments = fixedAssignmentManager.getAllAssignments();
                console.log('Current assignments from manager for visual update:', currentAssignments);
                if (Object.keys(currentAssignments).length > 0) {
                    await applyFixedAssignmentVisuals(currentAssignments);
                } else {
                    console.log('No assignments to apply visually');
                }
            } else {
                console.log('Skipping fixed assignments import - missing requirements:', {
                    hasFixedAssignments: config.fixedAssignments !== undefined,
                    hasFixedAssignmentManager: Boolean(fixedAssignmentManager),
                    hasTableConfig: Boolean(config.tableConfig)
                });
            }
            
            // Apply adjacency constraints
            if (config.adjacencyConstraints && adjacencyConstraintManager) {
                // Clear existing constraints
                const existingConstraints = adjacencyConstraintManager.getAllConstraints();
                for (let i = existingConstraints.length - 1; i >= 0; i--) {
                    adjacencyConstraintManager.removeConstraint(i);
                }
                
                // Add imported constraints
                config.adjacencyConstraints.forEach(constraint => {
                    adjacencyConstraintManager.addConstraint(constraint.guestA, constraint.guestB);
                });
                
                // Update constraints UI
                // eslint-disable-next-line no-undef
                renderConstraintsList(adjacencyConstraintManager.getAllConstraints(), document.getElementById('constraints-list-container'));
            }
            
            // Show success message
            console.log('Import completed successfully!');
            const statusMessages = document.getElementById('status-messages');
            if (errorDisplay) {
                errorDisplay.showSuccess('Configuration imported successfully', statusMessages);
                console.log('Success message displayed');
            } else {
                console.warn('errorDisplay not available for success message');
            }
            
        } catch (error) {
            console.error('Import failed:', error);
            const statusMessages = document.getElementById('status-messages');
            if (errorDisplay) {
                errorDisplay.showError('Import failed: ' + error.message, statusMessages);
            }
        } finally {
            // Always clear the import flag
            isImporting = false;
            console.log('Import completed - setting isImporting flag to false');
        }
    };
    
    reader.readAsText(file);
    
    // Clear the file input so the same file can be selected again
    event.target.value = '';
}

// Initialize action buttons
function initializeActionButtons() {
    const clearAllBtn = document.getElementById('clear-all-btn');
    const exampleBtn = document.getElementById('example-btn');
    const exportBtn = document.getElementById('export-btn');
    const importBtn = document.getElementById('import-btn');
    const importFileInput = document.getElementById('import-file-input');
    
    if (clearAllBtn) {
        clearAllBtn.addEventListener('click', handleClearAll);
    }
    
    if (exampleBtn) {
        exampleBtn.addEventListener('click', handleLoadExample);
    }
    
    if (exportBtn) {
        exportBtn.addEventListener('click', handleExportConfig);
    }
    
    if (importBtn) {
        importBtn.addEventListener('click', () => {
            importFileInput.click();
        });
    }
    
    if (importFileInput) {
        importFileInput.addEventListener('change', handleImportConfig);
    }
}

// Keyboard shortcuts
function initializeKeyboardShortcuts() {
    document.addEventListener('keydown', function(event) {
        // Ctrl+G or Cmd+G to generate seating
        if ((event.ctrlKey || event.metaKey) && event.key === 'g') {
            event.preventDefault();
            const generateBtn = document.querySelector('.generate-btn');
            if (generateBtn && !generateBtn.disabled) {
                generateBtn.click();
            }
        }
        
        // Ctrl+E or Cmd+E to load example
        if ((event.ctrlKey || event.metaKey) && event.key === 'e') {
            event.preventDefault();
            const exampleBtn = document.getElementById('example-btn');
            if (exampleBtn) {
                exampleBtn.click();
            }
        }
        
        // Ctrl+Shift+C or Cmd+Shift+C to clear all
        if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'C') {
            event.preventDefault();
            const clearAllBtn = document.getElementById('clear-all-btn');
            if (clearAllBtn) {
                clearAllBtn.click();
            }
        }
    });
}

