# Random Dinner Table Seating App - Implementation Prompts

## Prompt 1: Project Setup & Layout ✅ COMPLETED

Make sure the project is properly integrated with GitHub and the config of git is:
user: StefanSko
mail: Stefan.sko@gmail.com

Create the initial HTML structure and CSS layout for a dinner table seating app. The page should have:

1. An index.html file with:
   - A header with the app title "Random Dinner Table Seating"
   - A two-column layout using CSS Grid
   - Left column (30% width) for configuration panel
   - Right column (70% width) for visual table display
   - Sections in left column for: Table Setup, Guest List, Constraints, and Generate button
   - A div with id="table-display" in the right column

2. A styles/main.css file with:
   - CSS Grid layout for the two-column design
   - Basic styling for forms and sections
   - Responsive design that works on screens 1024px and wider
   - Clean, modern appearance with good spacing

3. A scripts/app.js file with:
   - A simple console.log to verify it's loaded
   - DOMContentLoaded event listener as entry point

Include semantic HTML5 elements and ensure accessibility with proper labels. Use a color scheme with a light background and clear visual hierarchy.

Write complete, working code with no placeholders. Include all necessary HTML boilerplate.

## Prompt 2: Core Data Models ✅ COMPLETED

Building on the previous HTML/CSS foundation, create the core data models and utility functions in JavaScript.

Create a new file scripts/models.js with:

1. Table configuration object factory:
   - Function createTableConfig(topSeats, rightSeats, bottomSeats, leftSeats)
   - Validates all inputs are positive integers
   - Returns object with seat counts and calculated total

2. Seat position object factory:
   - Function createSeat(id, side, position)
   - side must be one of: "top", "right", "bottom", "left"
   - Include method to generate display label (e.g., "Top-1")

3. Guest list utilities:
   - Function parseGuestList(textInput) that splits by newlines
   - Function validateGuestList(guests) that checks for duplicates and empty names
   - Return validation result object with isValid and errors array

4. Constraint objects:
   - Function createFixedAssignment(guestName, seatId)
   - Function createAdjacencyConstraint(guestA, guestB)

5. Seating arrangement:
   - Function createSeatingArrangement() that returns an empty Map (seatId -> guestName)

Update scripts/app.js to import and test these models with sample data. Log the results to console to verify everything works.

Include comprehensive input validation and error messages. Use modern JavaScript (ES6+) features appropriately.

## Prompt 3: Table Configuration UI ✅ COMPLETED

Enhance the table configuration section with working inputs and validation.

Update index.html:
1. In the Table Setup section, add:
   - Four number inputs for topSeats, rightSeats, bottomSeats, leftSeats
   - Labels for each input
   - Min value of 0, max value of 20 for each
   - A span to show total seats
   - A div for validation errors

Update scripts/app.js:
1. Import the table model from models.js
2. Add event listeners for all four seat inputs
3. On input change:
   - Validate the values using the model
   - Update the total seats display
   - Show any validation errors
   - Store the valid configuration in a module-level variable
4. Initialize with default values (2 seats per side)

Create scripts/validation.js:
1. Function validateTableInputs(top, right, bottom, left):
   - Check all are valid positive integers
   - Check total doesn't exceed 50 seats
   - Return {isValid, errors[], total}

Style the inputs nicely in main.css with:
- Consistent width and spacing
- Error state styling (red border/text)
- Clear visual feedback for the total

The UI should update in real-time as users type, with immediate validation feedback.

## Prompt 4: Table Visualization Engine

Create a visual representation of the dinner table based on the configuration.

Create scripts/tableRenderer.js with:

1. Function renderTable(tableConfig, containerElement):
   - Clear any existing content
   - Create an SVG or HTML/CSS representation of a rectangular table
   - Position seats around the perimeter
   - Number seats sequentially clockwise from top-left
   - Return an object mapping seatId to DOM element

2. Function calculateSeatPositions(tableConfig):
   - Determine x,y coordinates for each seat
   - Space seats evenly on each side
   - Return array of {seatId, side, position, x, y}

3. Seat rendering:
   - Each seat should be a clickable rectangle or circle
   - Display seat number clearly
   - Add data attributes for seatId and side
   - Size seats appropriately for the table

Update scripts/app.js:
1. Import the tableRenderer
2. Call renderTable whenever table configuration changes
3. Store the rendered seat elements for later use

Update main.css:
1. Style the table display area
2. Style individual seats (empty state)
3. Add hover effects for seats
4. Ensure the table scales nicely within its container

The table should dynamically resize and reposition seats based on the configuration, always fitting within the display area.

## Prompt 5: Guest List Management

Implement the guest list input with parsing and validation.

Update index.html:
1. In the Guest List section add:
   - A textarea for entering guest names (one per line)
   - Placeholder text with instructions
   - A span showing "X guests entered"
   - A div for validation messages
   - Set textarea rows to 10

Update scripts/app.js:
1. Add event listener for textarea input/change
2. On change:
   - Parse the guest list using the model function
   - Validate against current table configuration
   - Update guest count display
   - Show validation errors (duplicates, count mismatch)
   - Store valid guest list in module variable

Enhance scripts/validation.js:
1. Function validateGuestCount(guestCount, seatCount):
   - Check if counts match exactly
   - Return appropriate error message

2. Function findDuplicateGuests(guests):
   - Case-insensitive duplicate checking
   - Return array of duplicate names

Update main.css:
1. Style the textarea nicely
2. Add visual indicators for valid/invalid states
3. Style the guest count display
4. Make validation messages clear but not intrusive

The guest list should provide real-time feedback as users type, clearly indicating when the list is valid for the current table configuration.

## Prompt 6: Drag and Drop Foundation

Implement drag and drop functionality for assigning guests to seats.

Create scripts/dragDrop.js with:

1. Function makeDraggable(element, guestName):
   - Set draggable="true"
   - Add dragstart event handler
   - Store guestName in dataTransfer
   - Add visual feedback during drag

2. Function makeDroppable(element, seatId, onDrop):
   - Add dragover event (preventDefault)
   - Add drop event handler
   - Add visual feedback for valid drop zones
   - Call onDrop callback with (guestName, seatId)

Update scripts/app.js:
1. Function renderGuestList():
   - Create a scrollable list of guests in the constraints section
   - Make each guest name draggable
   - Add visual styling for guest items

2. After table renders:
   - Make each seat a drop target
   - Add visual feedback when hovering with a guest

3. Create temporary drop handler that logs the action

Update index.html:
1. Add a div for the draggable guest list in constraints section
2. Add instructional text about drag and drop

Update main.css:
1. Style draggable guest items (pills or cards)
2. Add drag state styling (opacity, cursor)
3. Add drop zone highlighting
4. Style the guest list container with scroll if needed

Test that guests can be dragged from the list and dropped on seats with clear visual feedback throughout the process.

## Prompt 7: Fixed Assignment Logic

Implement the logic for storing and displaying fixed seat assignments.

Update scripts/models.js:
1. Add FixedAssignmentManager class:
   - Method addAssignment(guestName, seatId)
   - Method removeAssignment(seatId)
   - Method getAssignment(seatId)
   - Method getAllAssignments()
   - Method hasGuest(guestName)
   - Validation to prevent double-booking

Update scripts/tableRenderer.js:
1. Function updateSeatDisplay(seatElement, guestName, isFixed):
   - Show guest name in seat
   - Add visual distinction for fixed vs generated assignments
   - Add remove button/icon for fixed assignments

Update scripts/app.js:
1. Create instance of FixedAssignmentManager
2. Implement handleSeatDrop(guestName, seatId):
   - Validate guest exists in guest list
   - Check if guest already assigned elsewhere
   - Add assignment to manager
   - Update seat visual display
   - Update draggable guest list (show assigned state)

3. Implement handleRemoveAssignment(seatId):
   - Remove from manager
   - Clear seat display
   - Update guest list (make available again)

Update scripts/validation.js:
1. Function validateFixedAssignment(guestName, seatId, guestList, assignmentManager):
   - Check guest exists
   - Check seat exists
   - Check no conflicts
   - Return {isValid, error}

Update main.css:
1. Style fixed assignments differently (e.g., blue background)
2. Style the remove button/icon
3. Add visual feedback for already-assigned guests in the list

The system should now support dragging guests to seats, showing assignments visually, and removing them by clicking.

## Prompt 8: Adjacency Constraint UI

Create the user interface for adding adjacency constraints between guests.

Update index.html:
1. In the Constraints section, add after the guest list:
   - Heading "Adjacency Requirements"
   - Two select dropdowns for choosing guests
   - "Add Constraint" button
   - Div for displaying current constraints
   - Help text explaining adjacency

Create scripts/constraintsUI.js:
1. Function populateGuestDropdowns(guests, selectElements):
   - Clear and populate both dropdowns with guest names
   - Add empty "Select guest" option first
   - Disable already-selected guest in opposite dropdown

2. Function renderConstraintsList(constraints, containerElement):
   - Display each constraint as "Guest A must sit near Guest B"
   - Add delete button for each constraint
   - Clear container before rendering

Update scripts/app.js:
1. Function updateConstraintUI():
   - Called when guest list changes
   - Populate dropdowns with current guests
   - Disable add button if invalid selection

2. Add event listeners:
   - Dropdown changes (validate selection)
   - Add constraint button click
   - Delete constraint buttons
   - For now, just log the actions

3. Initialize constraints array in module scope

Update main.css:
1. Style the constraint form nicely
2. Style individual constraint items
3. Add delete button styling (small X icon)
4. Make constraints list scrollable if needed
5. Add spacing between constraint items

The UI should allow selecting two different guests and adding multiple constraints, with the ability to delete them individually.

## Prompt 9: Seat Adjacency Calculator

Implement the mathematical logic for determining which seats are adjacent to each other.

Create scripts/adjacencyCalculator.js:

1. Function calculateTableGeometry(tableConfig):
   - Calculate the actual x,y coordinates for each seat
   - Assume rectangular table with seats evenly spaced
   - Return map of seatId to {x, y, side, position}

2. Function calculateAdjacencyMap(tableConfig):
   - For each seat, determine all adjacent seats
   - Adjacent = sharing edge or corner (diagonal)
   - Handle corner seats specially (connect across corner)
   - Return Map where key is seatId, value is array of adjacent seatIds

3. Function areSeatsAdjacent(seatId1, seatId2, adjacencyMap):
   - Simple lookup function
   - Returns boolean

4. Helper function getCornerSeatConnections(tableConfig):
   - Special logic for seats at table corners
   - Top-right corner connects top and right sides
   - etc. for all four corners

Create test file to verify adjacency logic:
- Create scripts/adjacencyTest.js with test cases
- Test 2x2 table (8 seats total)
- Verify corner connections work
- Test larger tables

Update scripts/app.js:
1. Import adjacency calculator
2. Calculate and store adjacency map when table config changes
3. Log the map for debugging

The adjacency map should correctly identify all neighboring seats, including diagonal/corner adjacencies, which is crucial for the constraint satisfaction algorithm.

## Prompt 10: Constraint Validation Engine

Create the validation engine to check if all constraints can be satisfied.

Create scripts/constraintValidator.js:

1. Function validateAllConstraints(guests, tableConfig, fixedAssignments, adjacencyConstraints, adjacencyMap):
   - Check if total configuration is theoretically satisfiable
   - Return {isValid, errors[], warnings[]}

2. Function checkFixedAssignmentConflicts(fixedAssignments, adjacencyConstraints, adjacencyMap):
   - If two guests must be adjacent but are fixed far apart
   - Return specific conflict descriptions

3. Function checkAdjacencyChainPossibility(adjacencyConstraints, totalSeats):
   - Check if adjacency requirements create impossible chains
   - Example: 5 guests must all be adjacent in a line (impossible in small table)

4. Function findConstraintGroups(adjacencyConstraints):
   - Group guests that must sit together
   - Identify connected components in adjacency graph
   - Return array of guest groups

Update scripts/models.js:
1. Add AdjacencyConstraintManager class:
   - addConstraint(guestA, guestB)
   - removeConstraint(index)
   - getAllConstraints()
   - hasConstraint(guestA, guestB)
   - Prevent duplicate constraints

Update scripts/app.js:
1. Create instance of AdjacencyConstraintManager
2. Wire up the constraint UI to use the manager
3. Implement full add/remove constraint logic
4. Call validation when constraints change
5. Display validation warnings/errors

This validation will help users understand if their constraints are impossible before attempting generation.

## Prompt 11: Random Generation Algorithm

Implement the core seating generation algorithm using backtracking with randomization.

Create scripts/seatingGenerator.js:

1. Function generateSeating(guests, tableConfig, fixedAssignments, adjacencyConstraints, adjacencyMap):
   - Main entry point
   - Return {success, arrangement, unmetConstraints}

2. Function backtrackingSolver(state):
   - Recursive backtracking implementation
   - State includes: unassignedGuests, currentArrangement, constraints
   - Try random valid placements
   - Backtrack on failure

3. Function findValidSeatsForGuest(guest, state, adjacencyMap):
   - Get available seats
   - Filter by adjacency constraints
   - Consider already-placed adjacent guests
   - Return array of valid seatIds

4. Function isPlacementValid(guest, seatId, currentArrangement, constraints, adjacencyMap):
   - Check all adjacency constraints
   - Both positive (must be adjacent) and implied negative
   - Return boolean

5. Function shuffleArray(array):
   - Fisher-Yates shuffle for randomization
   - Ensures different valid arrangements each run

Add timeout protection:
- Maximum iterations before giving up
- Return best partial solution if no complete solution

Create scripts/generatorTest.js:
- Test with simple cases
- Test with impossible constraints
- Verify randomization works

The algorithm should efficiently find valid random seating arrangements while respecting all constraints.

## Prompt 12: UI Integration

Wire up the generate button to run the algorithm and display results.

Update scripts/app.js:

1. Function handleGenerateSeating():
   - Validate all inputs first
   - Show loading state
   - Call generation algorithm
   - Display results or errors
   - Update table visualization

2. Function displayGeneratedSeating(arrangement):
   - Clear previous generated seats (keep fixed)
   - Add each guest to their assigned seat
   - Use different visual style than fixed assignments

3. Function showGenerationError(error, partialSolution):
   - Display user-friendly error message
   - Show which constraints couldn't be satisfied
   - Optionally show partial solution
   - Suggest fixes (remove constraints, change fixed seats)

4. Add loading states:
   - Disable generate button during processing
   - Show spinner or progress indicator
   - Ensure UI remains responsive

Update index.html:
1. Add generate button in the configuration panel
2. Add status message area below button
3. Add loading spinner element (hidden by default)

Update scripts/tableRenderer.js:
1. updateSeatDisplay() modifications:
   - Accept third parameter for assignment type
   - Different styling for fixed vs generated

Update main.css:
1. Style generate button (primary action)
2. Style loading states
3. Style generated assignments (e.g., green background)
4. Add status message styling (success/error)

The generate button should provide immediate feedback and clearly show the results of the generation attempt.

## Prompt 13: Error Handling System

Implement comprehensive error handling and user feedback throughout the application.

Create scripts/errorHandler.js:

1. Class ErrorDisplay:
   - Method showError(message, type, targetElement)
   - Method clearError(targetElement)
   - Method showSuccess(message, targetElement)
   - Auto-dismiss success messages after 3 seconds

2. Error type styling:
   - 'validation': Yellow/warning style
   - 'error': Red/error style
   - 'success': Green/success style
   - 'info': Blue/info style

3. Function formatConstraintError(constraint, reason):
   - Human-readable constraint failure messages
   - "Cannot seat Alice next to Bob: Bob is fixed at seat 5, too far from available seats"

Update all validation functions to use consistent error format:
- {isValid, errors: [{field, message, type}]}

Update scripts/app.js:
1. Create ErrorDisplay instance
2. Add error handling to all user actions:
   - Table configuration changes
   - Guest list changes
   - Constraint additions
   - Seat assignments
   - Generation attempts

3. Function showValidationSummary():
   - Before generation, show all current issues
   - Prevent generation if critical errors exist

Update main.css:
1. Style error message containers
2. Add animation for message appearance/disappearance
3. Icons for different message types
4. Ensure messages don't disrupt layout

The application should gracefully handle all edge cases and provide clear, actionable feedback to users.

## Prompt 14: Visual Polish & Testing

Add final visual polish and comprehensive testing to complete the application.

Visual Enhancements:

Update main.css with:
1. Professional color scheme:
   - Primary: Deep blue (#2C3E50)
   - Success: Green (#27AE60)
   - Error: Red (#E74C3C)
   - Background: Light gray (#F8F9FA)

2. Improved table visualization:
   - Add subtle shadow to table
   - Gradient or textured table surface
   - Better seat styling (3D appearance)
   - Smooth animations for seat updates

3. Responsive refinements:
   - Ensure minimum 1024px width works well
   - Adjust font sizes for readability
   - Proper spacing on all screen sizes

4. Micro-interactions:
   - Smooth transitions for all state changes
   - Hover effects on interactive elements
   - Drag preview styling
   - Button press effects

Create scripts/testSuite.js with:
1. Test data sets:
   - Simple 8-person dinner
   - Complex 20-person with many constraints
   - Edge cases (1 person, max capacity)
   - Impossible constraint combinations

2. Automated tests:
   - Function to load test data
   - Run generation multiple times
   - Verify constraint satisfaction
   - Check performance (<2 seconds)

3. UI test helpers:
   - Function to populate form with test data
   - Function to verify visual state
   - Function to check error messages

Final integration tasks in app.js:
1. Add keyboard shortcuts (Ctrl+G to generate)
2. Add "Clear All" button for fresh start
3. Add "Example" button to load sample data
4. Ensure all features work together smoothly

Polish the user experience to feel professional and production-ready, with smooth interactions and helpful guidance throughout.