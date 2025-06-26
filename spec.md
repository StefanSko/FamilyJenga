# Random Dinner Table Seating App - Developer Specification

## Project Overview

A local web application for randomly generating dinner table seating arrangements with configurable constraints. The app allows users to specify guests, table configuration, and seating constraints, then generates valid random seating arrangements.

### Target Scale
- 20-50 guests maximum
- Single rectangular table
- Single-session usage (no data persistence)

---

## Functional Requirements

### Core Features
1. **Table Configuration**: Visual rectangular table with configurable seat counts per side
2. **Guest Management**: Text-based guest list input
3. **Constraint System**: Fixed seat assignments and adjacency requirements
4. **Random Generation**: Algorithm to produce valid seating arrangements
5. **Visual Output**: Interactive table display showing final seating

### User Workflow
1. Configure table dimensions (seats per side)
2. Enter guest list
3. Set constraints (optional)
4. Generate random seating arrangement
5. View results and optionally generate new arrangements

---

## User Interface Specifications

### Layout Structure
**Single-page application** with all sections visible simultaneously:

```
┌─────────────────────────────────────────────────────────┐
│                    Page Header                          │
├─────────────────┬───────────────────────────────────────┤
│                 │                                       │
│   Configuration │           Visual Table               │
│   Panel         │           Display                     │
│                 │                                       │
│   - Table Setup │                                       │
│   - Guest List  │                                       │
│   - Constraints │                                       │
│   - Generate    │                                       │
│                 │                                       │
└─────────────────┴───────────────────────────────────────┘
```

### Configuration Panel Components

#### 1. Table Configuration
- **Four numeric inputs** for seat counts:
  - Top side seats
  - Right side seats  
  - Bottom side seats
  - Left side seats
- **Real-time validation** that values are positive integers
- **Visual update** of table representation when values change

#### 2. Guest List
- **Large text area** for guest names (one per line)
- **Real-time count** showing number of guests entered
- **Validation indicator** showing guest count vs. total seats

#### 3. Constraints Section

##### Fixed Seat Assignments
- **Guest list panel**: Scrollable list of all entered guests
- **Drag and drop functionality**: Drag guest names onto specific seats in visual table
- **Visual feedback**: Highlight drop zones, show assigned guests on seats
- **Remove assignments**: Click on assigned seat to remove guest

##### Adjacency Constraints  
- **Add constraint interface**:
  - Two dropdown menus to select guests
  - "Add Constraint" button
  - List of current constraints with delete option
- **Constraint definition**: Selected guests must sit in adjacent seats (including diagonal/corner adjacency)

#### 4. Generation Controls
- **Single "Generate Seating" button** that uses current configuration and constraints
- **Loading state** during generation process
- **Error/success feedback** area below button

### Visual Table Display

#### Table Representation
- **Rectangular layout** matching configured dimensions
- **Seat positions**: Clearly defined rectangles/circles for each seat
- **Seat labeling**: Sequential numbering (1, 2, 3...) or positional (Top-1, Top-2, etc.)
- **Guest display**: Names shown in assigned seats
- **Drag targets**: Visual indicators for available drop zones

#### Visual States
- **Empty seat**: Available for assignment
- **Fixed assignment**: Guest name shown, visually distinct (e.g., different color)
- **Generated assignment**: Guest name shown in regular style
- **Drop zone highlight**: When dragging guests for fixed assignments

---

## Technical Requirements

### Technology Stack
- **Frontend**: HTML5, CSS3, JavaScript (vanilla or modern framework)
- **Local hosting**: Simple web server for local development
- **No backend required**: All processing client-side
- **No external dependencies**: Core functionality should work offline

### Browser Compatibility
- Modern browsers supporting drag and drop API
- Chrome, Firefox, Safari, Edge (current versions)

### Performance Requirements
- **Generation time**: < 2 seconds for 50 guests
- **UI responsiveness**: Immediate feedback for all user interactions
- **Memory usage**: Reasonable for constraint solving algorithms

---

## Data Models

### Table Configuration
```javascript
{
  topSeats: number,      // Number of seats on top side
  rightSeats: number,    // Number of seats on right side  
  bottomSeats: number,   // Number of seats on bottom side
  leftSeats: number      // Number of seats on left side
}
```

### Guest List
```javascript
[
  "Guest Name 1",
  "Guest Name 2",
  // ... array of guest name strings
]
```

### Seat Position
```javascript
{
  id: number,           // Unique seat identifier (1, 2, 3...)
  side: string,         // "top", "right", "bottom", "left"
  position: number,     // Position on that side (0-indexed)
  coordinates: {x, y}   // Optional: for adjacency calculations
}
```

### Fixed Assignment
```javascript
{
  guestName: string,
  seatId: number
}
```

### Adjacency Constraint
```javascript
{
  guestA: string,
  guestB: string
}
```

### Seating Arrangement (Output)
```javascript
{
  seatId: number,
  guestName: string
}[]
```

---

## Algorithm Requirements

### Constraint Satisfaction Approach
1. **Input validation**: Verify guest count matches total seats
2. **Fixed assignments**: Place guests with fixed seat requirements
3. **Adjacency mapping**: Create adjacency graph for all seat positions
4. **Random assignment**: Use constraint satisfaction with backtracking
5. **Fallback handling**: If no complete solution exists, return best partial solution

### Adjacency Definition
Two seats are adjacent if they:
- Share a side edge (traditional adjacency)
- Share a corner point (diagonal adjacency)

### Seat Adjacency Mapping
```
Example 3x3 table layout:
┌─1─┬─2─┬─3─┐
├─8─┼───┼─4─┤  
└─7─┴─6─┴─5─┘

Adjacency relationships:
1: [2, 8]
2: [1, 3, 8, 4]  
3: [2, 4]
4: [3, 5, 6, 2]
// etc.
```

### Generation Algorithm Pseudocode
```
1. Validate inputs (guest count = seat count)
2. Create seat adjacency map
3. Apply fixed seat assignments
4. For remaining guests:
   a. Get available seats
   b. Filter by adjacency constraints
   c. Randomly select from valid options
   d. Backtrack if no valid options
5. If complete solution found: return arrangement
6. If no complete solution: return best partial + error message
```

---

## Validation Rules

### Table Configuration
- All seat counts must be positive integers
- At least one seat on at least one side
- Maximum total seats: 50

### Guest List
- No empty guest names
- No duplicate guest names (case-insensitive)
- Guest count must equal total seat count

### Constraints
- Fixed assignments: Guest must exist in guest list
- Fixed assignments: Seat must exist in table configuration
- Fixed assignments: No guest assigned to multiple seats
- Fixed assignments: No seat assigned to multiple guests
- Adjacency constraints: Both guests must exist in guest list
- Adjacency constraints: No duplicate constraints

---

## Error Handling

### Validation Errors
```javascript
{
  type: "validation",
  field: "guests|table|constraints",
  message: "Descriptive error message",
  details: {} // Additional context
}
```

### Generation Errors
```javascript
{
  type: "generation", 
  message: "Could not satisfy all constraints",
  partialSolution: SeatingArrangement[], // Best attempt
  unsatisfiedConstraints: string[]        // Which constraints failed
}
```

### User-Facing Error Messages
- **Guest count mismatch**: "Number of guests (X) must equal total seats (Y)"
- **Invalid constraints**: "Guest 'Name' specified in constraints but not in guest list"
- **Impossible constraints**: "Could not satisfy all constraints. Showing best possible arrangement."
- **Empty inputs**: "Please enter guest names and table configuration"

---

## Testing Plan

### Unit Tests
1. **Adjacency calculation**: Verify correct neighbor identification for all seat positions
2. **Constraint validation**: Test all validation rules with valid/invalid inputs
3. **Random generation**: Verify algorithm produces valid arrangements
4. **Fixed assignments**: Confirm fixed seats are respected in all generations

### Integration Tests  
1. **Full workflow**: Complete user journey from configuration to result
2. **Constraint combinations**: Multiple fixed assignments + adjacency constraints
3. **Edge cases**: Minimal/maximal configurations, impossible constraints
4. **UI interactions**: Drag and drop, form validation, button states

### User Acceptance Tests
1. **Simple scenario**: 8 guests, rectangular table, no constraints
2. **Fixed seats**: 12 guests with 2 fixed assignments
3. **Adjacency**: 16 guests with 3 adjacency constraints  
4. **Complex**: 20 guests with both fixed and adjacency constraints
5. **Error cases**: Invalid inputs, impossible constraints

### Test Data Sets
```javascript
// Simple valid case
{
  table: {top: 2, right: 2, bottom: 2, left: 2},
  guests: ["Alice", "Bob", "Carol", "David", "Eve", "Frank", "Grace", "Henry"],
  constraints: {
    fixed: [],
    adjacency: []
  }
}

// Complex valid case  
{
  table: {top: 3, right: 2, bottom: 3, left: 2},
  guests: ["Person1", "Person2", ...], // 10 guests
  constraints: {
    fixed: [{guestName: "Person1", seatId: 1}],
    adjacency: [{guestA: "Person2", guestB: "Person3"}]
  }
}

// Invalid case
{
  table: {top: 2, right: 2, bottom: 2, left: 2},
  guests: ["Alice", "Bob", "Carol"], // Only 3 guests for 8 seats
  constraints: {
    fixed: [{guestName: "David", seatId: 1}], // David not in guest list
    adjacency: []
  }
}
```

---

## Implementation Notes

### Phase 1 (MVP)
- Basic table configuration with numeric inputs
- Text area guest input
- Simple drag and drop for fixed assignments
- Dropdown-based adjacency constraints
- Basic random generation algorithm
- Visual table display

### Phase 2 (Enhancements)
- Improved visual design
- Better drag and drop UX
- Performance optimizations
- Additional constraint types
- Export functionality

### Development Considerations
- **Seat numbering strategy**: Choose consistent numbering (clockwise from top-left recommended)
- **Drag and drop library**: Consider using HTML5 native API or lightweight library
- **Constraint solver**: Implement backtracking algorithm with reasonable timeout
- **Visual feedback**: Ensure all user actions have immediate visual response
- **Mobile considerations**: While not primary target, ensure basic mobile usability

### Code Organization
```
src/
├── index.html              # Main application page
├── styles/
│   ├── main.css           # Core application styles
│   └── table.css          # Table-specific styling
├── scripts/
│   ├── app.js             # Main application logic
│   ├── tableConfig.js     # Table configuration handling
│   ├── constraints.js     # Constraint management
│   ├── algorithm.js       # Seating generation algorithm
│   ├── validation.js      # Input validation functions
│   └── ui.js              # UI interaction handlers
└── assets/
    └── icons/             # UI icons and graphics
```

This specification provides complete requirements for implementing the random dinner table seating application. The developer can begin implementation immediately with clear guidance on functionality, technical approach, and quality assurance.