// ABOUTME: ESLint configuration for the dinner seating application
// ABOUTME: Enforces code quality, consistency, and catches potential errors

module.exports = {
    env: {
        browser: true,
        es2021: true,
        node: true
    },
    extends: [
        'eslint:recommended'
    ],
    parserOptions: {
        ecmaVersion: 12,
        sourceType: 'module'
    },
    rules: {
        // Code quality
        'no-console': 'off', // We use console for debugging
        'no-unused-vars': 'error',
        'no-undef': 'error',
        'no-redeclare': 'error',
        
        // Style consistency
        'indent': ['error', 4],
        'quotes': ['error', 'single'],
        'semi': ['error', 'always'],
        'comma-dangle': ['error', 'never'],
        'space-before-function-paren': ['error', 'never'],
        'brace-style': ['error', '1tbs'],
        
        // Modern JavaScript
        'prefer-const': 'error',
        'no-var': 'error',
        'arrow-spacing': 'error',
        
        // Potential errors
        'no-implicit-coercion': 'error',
        'no-throw-literal': 'error',
        'no-unmodified-loop-condition': 'error'
    },
    globals: {
        // Browser globals
        'document': 'readonly',
        'window': 'readonly',
        'console': 'readonly',
        
        // Test framework globals
        'TestFramework': 'readonly',
        
        // Our model functions
        'createTableConfig': 'readonly',
        'createSeat': 'readonly',
        'parseGuestList': 'readonly',
        'validateGuestList': 'readonly',
        'createFixedAssignment': 'readonly',
        'createAdjacencyConstraint': 'readonly',
        'createSeatingArrangement': 'readonly',
        
        // Validation functions
        'validateTableInputs': 'readonly',
        'validateGuestCount': 'readonly',
        'findDuplicateGuests': 'readonly',
        
        // Table renderer functions
        'calculateSeatPositions': 'readonly',
        'renderTable': 'readonly',
        'updateSeatDisplay': 'readonly',
        
        // App functions
        'initializeApp': 'readonly',
        'initializeTableConfigurationUI': 'readonly',
        'setDefaultTableConfiguration': 'readonly',
        'handleTableInputChange': 'readonly',
        'updateTotalSeatsDisplay': 'readonly',
        'showValidationErrors': 'readonly',
        'clearValidationErrors': 'readonly',
        'clearInputErrorStates': 'readonly',
        'renderTableVisualization': 'readonly',
        'clearTableVisualization': 'readonly',
        'showTableRenderError': 'readonly',
        
        // Guest list functions
        'initializeGuestListUI': 'readonly',
        'handleGuestListChange': 'readonly',
        'parseAndValidateGuestList': 'readonly',
        'validateGuestSeatCount': 'readonly',
        'validateGuestListWithTable': 'readonly',
        'updateGuestCountDisplay': 'readonly',
        'showGuestValidationErrors': 'readonly',
        'clearGuestValidationErrors': 'readonly',
        'updateGuestListValidationState': 'readonly',
        
        // Drag and drop functions
        'makeDraggable': 'readonly',
        'makeDroppable': 'readonly',
        'renderGuestList': 'readonly',
        'addDragVisualFeedback': 'readonly',
        'removeDragVisualFeedback': 'readonly',
        'addDropZoneHighlight': 'readonly',
        'removeDropZoneHighlight': 'readonly',
        'setCurrentDragData': 'readonly',
        'getCurrentDragData': 'readonly',
        'initializeDragAndDrop': 'readonly',
        'handleSeatDrop': 'readonly',
        'initializeDragDropUI': 'readonly',
        'renderDraggableGuestList': 'readonly',
        'setupDragDropEventHandlers': 'readonly',
        
        // Fixed assignment functions  
        'FixedAssignmentManager': 'readonly',
        'validateFixedAssignment': 'readonly',
        'handleRemoveAssignment': 'readonly',
        'addRemoveButton': 'readonly',
        'removeRemoveButton': 'readonly'
    }
};