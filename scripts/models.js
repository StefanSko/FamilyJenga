// ABOUTME: Core data models and factory functions for the dinner seating application
// ABOUTME: Provides table configuration, seat positions, guest lists, and constraint objects

// Table Configuration Factory
function createTableConfig(topSeats, rightSeats, bottomSeats, leftSeats) {
    // Validate inputs are positive integers
    const seats = [topSeats, rightSeats, bottomSeats, leftSeats];
    const seatNames = ['topSeats', 'rightSeats', 'bottomSeats', 'leftSeats'];
    
    for (let i = 0; i < seats.length; i++) {
        const seat = seats[i];
        const name = seatNames[i];
        
        if (typeof seat !== 'number' || seat < 0) {
            throw new Error(`${name} must be a positive number`);
        }
        
        if (!Number.isInteger(seat)) {
            throw new Error(`${name} must be an integer`);
        }
    }
    
    const totalSeats = topSeats + rightSeats + bottomSeats + leftSeats;
    
    return {
        topSeats,
        rightSeats,
        bottomSeats,
        leftSeats,
        totalSeats
    };
}

// Seat Position Factory
function createSeat(id, side, position) {
    const validSides = ['top', 'right', 'bottom', 'left'];
    
    if (!validSides.includes(side)) {
        throw new Error(`Invalid side: ${side}. Must be one of: ${validSides.join(', ')}`);
    }
    
    return {
        id,
        side,
        position,
        getDisplayLabel() {
            const capitalizedSide = side.charAt(0).toUpperCase() + side.slice(1);
            return `${capitalizedSide}-${position + 1}`;
        }
    };
}

// Guest List Utilities
function parseGuestList(textInput) {
    if (typeof textInput !== 'string') {
        return [];
    }
    
    return textInput
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0);
}

function validateGuestList(guests) {
    const errors = [];
    
    // Check for empty names
    const emptyNames = guests.filter(guest => !guest || guest.trim() === '');
    if (emptyNames.length > 0) {
        errors.push('Guest names cannot be empty');
    }
    
    // Check for duplicates (case-insensitive)
    const lowerCaseGuests = guests.map(guest => guest.toLowerCase());
    const duplicates = [];
    const seen = new Set();
    
    for (const guest of lowerCaseGuests) {
        if (seen.has(guest) && !duplicates.includes(guest)) {
            duplicates.push(guest);
        }
        seen.add(guest);
    }
    
    if (duplicates.length > 0) {
        errors.push(`Duplicate guest names found: ${duplicates.join(', ')}`);
    }
    
    return {
        isValid: errors.length === 0,
        errors
    };
}

// Constraint Objects
function createFixedAssignment(guestName, seatId) {
    if (!guestName || typeof guestName !== 'string') {
        throw new Error('Guest name must be a non-empty string');
    }
    
    if (typeof seatId !== 'number' || seatId < 0) {
        throw new Error('Seat ID must be a positive number');
    }
    
    return {
        guestName,
        seatId
    };
}

function createAdjacencyConstraint(guestA, guestB) {
    if (!guestA || !guestB || typeof guestA !== 'string' || typeof guestB !== 'string') {
        throw new Error('Both guests must be non-empty strings');
    }
    
    if (guestA.toLowerCase() === guestB.toLowerCase()) {
        throw new Error('Guests must be different for adjacency constraint');
    }
    
    return {
        guestA,
        guestB
    };
}

// Seating Arrangement
function createSeatingArrangement() {
    return new Map();
}

// Fixed Assignment Manager Class
class FixedAssignmentManager {
    constructor() {
        this.assignments = {}; // seatId -> guestName
        this.guestToSeat = {}; // guestName -> seatId
    }
    
    addAssignment(guestName, seatId) {
        // Validate inputs
        if (!guestName || typeof guestName !== 'string' || guestName.trim() === '') {
            return {
                success: false,
                error: 'Guest name must be a non-empty string'
            };
        }
        
        if (!seatId || typeof seatId !== 'string' || seatId.trim() === '') {
            return {
                success: false,
                error: 'Seat ID must be a non-empty string'
            };
        }
        
        // Check if seat is already assigned
        if (this.assignments[seatId]) {
            return {
                success: false,
                error: `Seat ${seatId} is already assigned to ${this.assignments[seatId]}`
            };
        }
        
        // Check if guest is already assigned elsewhere
        if (this.guestToSeat[guestName]) {
            return {
                success: false,
                error: `Guest ${guestName} is already assigned to seat ${this.guestToSeat[guestName]}`
            };
        }
        
        // Add assignment
        this.assignments[seatId] = guestName;
        this.guestToSeat[guestName] = seatId;
        
        return {
            success: true,
            guestName: guestName,
            seatId: seatId
        };
    }
    
    removeAssignment(seatId) {
        // Check if seat has an assignment
        if (!this.assignments[seatId]) {
            return {
                success: false,
                error: `No assignment found for seat ${seatId}`
            };
        }
        
        const guestName = this.assignments[seatId];
        
        // Remove assignment
        delete this.assignments[seatId];
        delete this.guestToSeat[guestName];
        
        return {
            success: true,
            removedGuest: guestName,
            seatId: seatId
        };
    }
    
    getAssignment(seatId) {
        return this.assignments[seatId] || null;
    }
    
    getAllAssignments() {
        return { ...this.assignments }; // Return copy to prevent external modification
    }
    
    hasGuest(guestName) {
        return Boolean(this.guestToSeat[guestName]);
    }
    
    // Get seat for a guest (utility method)
    getSeatForGuest(guestName) {
        return this.guestToSeat[guestName] || null;
    }
    
    // Clear all assignments (utility method)
    clearAllAssignments() {
        this.assignments = {};
        this.guestToSeat = {};
    }
    
    // Get count of assignments (utility method)
    getAssignmentCount() {
        return Object.keys(this.assignments).length;
    }
}

// Export functions for Node.js environment if available
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        createTableConfig,
        createSeat,
        parseGuestList,
        validateGuestList,
        createFixedAssignment,
        createAdjacencyConstraint,
        createSeatingArrangement,
        FixedAssignmentManager
    };
}