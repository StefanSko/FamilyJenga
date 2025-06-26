// ABOUTME: Validation functions for table configuration and guest list inputs
// ABOUTME: Provides real-time validation with detailed error messages and constraints checking

function validateTableInputs(top, right, bottom, left) {
    const errors = [];
    const inputs = [
        { value: top, name: 'Top seats' },
        { value: right, name: 'Right seats' },
        { value: bottom, name: 'Bottom seats' },
        { value: left, name: 'Left seats' }
    ];
    
    // Check each input is a valid positive integer
    for (const input of inputs) {
        const { value, name } = input;
        
        // Check if it's a number
        if (typeof value !== 'number') {
            errors.push(`${name} must be a number`);
            continue;
        }
        
        // Check if it's negative
        if (value < 0) {
            errors.push(`${name} must be 0 or greater`);
            continue;
        }
        
        // Check if it's an integer
        if (!Number.isInteger(value)) {
            errors.push(`${name} must be a whole number`);
            continue;
        }
    }
    
    // If we have input errors, don't check total
    if (errors.length > 0) {
        return {
            isValid: false,
            errors,
            total: 0
        };
    }
    
    const total = top + right + bottom + left;
    
    // Check total doesn't exceed 50 seats
    if (total > 50) {
        errors.push(`Total seats (${total}) cannot exceed 50`);
    }
    
    return {
        isValid: errors.length === 0,
        errors,
        total
    };
}

function validateGuestCount(guestCount, seatCount) {
    if (guestCount === seatCount) {
        return {
            isValid: true,
            errors: []
        };
    }
    
    let errorMessage;
    if (guestCount < seatCount) {
        errorMessage = `You have ${guestCount} guests but ${seatCount} seats. Add ${seatCount - guestCount} more guests or reduce seats.`;
    } else {
        errorMessage = `You have ${guestCount} guests but only ${seatCount} seats. Remove ${guestCount - seatCount} guests or add more seats.`;
    }
    
    return {
        isValid: false,
        errors: [errorMessage]
    };
}

function findDuplicateGuests(guests) {
    const duplicates = [];
    const seen = new Set();
    const lowerCaseGuests = guests.map(guest => guest.toLowerCase());
    
    for (const guest of lowerCaseGuests) {
        if (seen.has(guest) && !duplicates.includes(guest)) {
            duplicates.push(guest);
        }
        seen.add(guest);
    }
    
    return duplicates;
}

// Export functions for Node.js environment if available
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        validateTableInputs,
        validateGuestCount,
        findDuplicateGuests
    };
}