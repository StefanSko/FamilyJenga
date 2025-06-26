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
let currentAssignedGuests = [];
// eslint-disable-next-line no-unused-vars
let fixedAssignmentManager = null;
// eslint-disable-next-line no-unused-vars
let currentAdjacencyMap = null;

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing application...');
    
    // Application initialization code will go here
    initializeApp();
});

function initializeApp() {
    console.log('Application initialized successfully');
    
    // Initialize fixed assignment manager as required by Prompt 7
    // eslint-disable-next-line no-undef
    fixedAssignmentManager = new FixedAssignmentManager();
    
    // Initialize adjacency constraint manager as required by Prompt 10
    // eslint-disable-next-line no-undef
    adjacencyConstraintManager = new AdjacencyConstraintManager();
    
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

function clearGuestValidationErrors() {
    const errorContainer = document.getElementById('guest-validation-errors');
    if (errorContainer) {
        errorContainer.innerHTML = '';
    }
}

function updateGuestListValidationState(isValid) {
    const guestInput = document.getElementById('guest-list-input');
    if (guestInput) {
        if (isValid) {
            guestInput.classList.remove('error');
        } else {
            guestInput.classList.add('error');
        }
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
    // Validate the assignment using the validation function
    // eslint-disable-next-line no-undef
    const validation = validateFixedAssignment(guestName, seatId, currentGuestList, fixedAssignmentManager);
    
    if (!validation.isValid) {
        console.error('Assignment validation failed:', validation.error);
        // TODO: Show user-friendly error message
        return;
    }
    
    // Attempt to add assignment to manager
    const result = fixedAssignmentManager.addAssignment(guestName, seatId);
    
    if (!result.success) {
        console.error('Failed to add assignment:', result.error);
        // TODO: Show user-friendly error message
        return;
    }
    
    console.log('Successfully assigned guest', guestName, 'to seat', seatId);
    
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

