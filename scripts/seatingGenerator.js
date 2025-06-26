// ABOUTME: Core seating generation algorithm using backtracking with randomization
// ABOUTME: Generates valid random seating arrangements while respecting all constraints

function generateSeating(guests, tableConfig, fixedAssignments, adjacencyConstraints, adjacencyMap) {
    // Validate inputs
    if (!guests || !tableConfig || !fixedAssignments || !adjacencyConstraints || !adjacencyMap) {
        return {
            success: false,
            error: 'Invalid input: all parameters are required',
            arrangement: null,
            unmetConstraints: []
        };
    }

    // Handle empty guest list
    if (guests.length === 0) {
        return {
            success: true,
            arrangement: new Map(),
            unmetConstraints: []
        };
    }

    // Create initial state
    const allSeats = Array.from(adjacencyMap.keys());
    const availableSeats = allSeats.filter(seatId => !Object.prototype.hasOwnProperty.call(fixedAssignments, seatId));
    const unassignedGuests = guests.filter(guest => {
        // Check if guest is already in fixed assignments
        for (const [, assignedGuest] of Object.entries(fixedAssignments)) {
            if (assignedGuest === guest) {
                return false;
            }
        }
        return true;
    });

    // Start with fixed assignments in the arrangement
    const initialArrangement = new Map();
    for (const [seatId, guestName] of Object.entries(fixedAssignments)) {
        initialArrangement.set(seatId, guestName);
    }

    // Validate that fixed assignments don't violate adjacency constraints
    const fixedViolations = validateFixedAssignments(initialArrangement, adjacencyConstraints, adjacencyMap);
    if (fixedViolations.length > 0) {
        return {
            success: false,
            error: `Fixed assignments violate constraints: ${fixedViolations.join('; ')}`,
            arrangement: initialArrangement,
            unmetConstraints: fixedViolations.map(violation => ({
                constraint: { guestA: 'Unknown', guestB: 'Unknown' },
                reason: violation
            }))
        };
    }

    const state = {
        unassignedGuests: [...unassignedGuests],
        availableSeats: [...availableSeats],
        currentArrangement: initialArrangement,
        adjacencyConstraints: adjacencyConstraints,
        adjacencyMap: adjacencyMap
    };

    // Try to solve with backtracking
    const result = backtrackingSolver(state, 0, 10000); // Max 10000 iterations

    if (result.success) {
        return {
            success: true,
            arrangement: result.arrangement,
            unmetConstraints: []
        };
    } else {
        // Find which constraints couldn't be met
        const unmetConstraints = findUnmetConstraints(
            result.bestArrangement || initialArrangement, 
            adjacencyConstraints, 
            adjacencyMap
        );

        return {
            success: false,
            error: result.error || 'Could not find valid seating arrangement',
            arrangement: result.bestArrangement || initialArrangement,
            unmetConstraints: unmetConstraints
        };
    }
}

function backtrackingSolver(state, iteration, maxIterations) {
    // Check timeout protection
    if (iteration >= maxIterations) {
        return {
            success: false,
            error: 'Generation timeout - configuration may be too complex',
            bestArrangement: new Map(state.currentArrangement)
        };
    }

    // Base case: all guests assigned
    if (state.unassignedGuests.length === 0) {
        return {
            success: true,
            arrangement: new Map(state.currentArrangement)
        };
    }

    // Get next guest to place
    const guest = state.unassignedGuests[0];
    
    // Find valid seats for this guest
    const validSeats = findValidSeatsForGuest(guest, state, state.adjacencyMap);
    
    if (validSeats.length === 0) {
        // No valid placement - backtrack
        return {
            success: false,
            error: `No valid seats found for guest ${guest}`,
            bestArrangement: new Map(state.currentArrangement)
        };
    }

    // Shuffle valid seats for randomization
    const shuffledSeats = shuffleArray([...validSeats]);

    // Try each valid seat
    for (const seatId of shuffledSeats) {
        // Create new state with this placement
        const newState = {
            unassignedGuests: state.unassignedGuests.slice(1),
            availableSeats: state.availableSeats.filter(id => id !== seatId),
            currentArrangement: new Map(state.currentArrangement),
            adjacencyConstraints: state.adjacencyConstraints,
            adjacencyMap: state.adjacencyMap
        };
        
        newState.currentArrangement.set(seatId, guest);

        // Recursively try to place remaining guests
        const result = backtrackingSolver(newState, iteration + 1, maxIterations);
        
        if (result.success) {
            return result;
        }

        // Keep track of best partial solution
        if (!result.bestArrangement || 
            newState.currentArrangement.size > result.bestArrangement.size) {
            result.bestArrangement = new Map(newState.currentArrangement);
        }
    }

    // All placements failed - backtrack
    return {
        success: false,
        error: `Could not place guest ${guest}`,
        bestArrangement: new Map(state.currentArrangement)
    };
}

function findValidSeatsForGuest(guest, state, adjacencyMap) {
    const validSeats = [];

    for (const seatId of state.availableSeats) {
        if (isPlacementValid(guest, seatId, state.currentArrangement, state.adjacencyConstraints, adjacencyMap)) {
            validSeats.push(seatId);
        }
    }

    return validSeats;
}

function isPlacementValid(guest, seatId, currentArrangement, constraints, adjacencyMap) {
    // Check all adjacency constraints involving this guest
    for (const constraint of constraints) {
        const { guestA, guestB } = constraint;
        
        if (guestA === guest || guestB === guest) {
            const otherGuest = (guestA === guest) ? guestB : guestA;
            
            // Find where the other guest is placed (if at all)
            let otherGuestSeat = null;
            for (const [assignedSeatId, assignedGuest] of currentArrangement) {
                if (assignedGuest === otherGuest) {
                    otherGuestSeat = assignedSeatId;
                    break;
                }
            }

            // If other guest is already placed, check adjacency
            if (otherGuestSeat !== null) {
                const adjacentSeats = adjacencyMap.get(seatId) || [];
                if (!adjacentSeats.includes(otherGuestSeat)) {
                    return false; // Not adjacent - placement invalid
                }
            }
        }
    }

    return true; // All constraints satisfied
}

function shuffleArray(array) {
    // Fisher-Yates shuffle algorithm
    const shuffled = [...array];
    
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    
    return shuffled;
}

function validateFixedAssignments(arrangement, adjacencyConstraints, adjacencyMap) {
    const violations = [];

    for (const constraint of adjacencyConstraints) {
        const { guestA, guestB } = constraint;
        
        // Find seats for both guests
        let seatA = null;
        let seatB = null;
        
        for (const [seatId, guestName] of arrangement) {
            if (guestName === guestA) {
                seatA = seatId;
            }
            if (guestName === guestB) {
                seatB = seatId;
            }
        }

        // If both guests are placed, check if they are adjacent
        if (seatA && seatB) {
            const adjacentSeats = adjacencyMap.get(seatA) || [];
            if (!adjacentSeats.includes(seatB)) {
                violations.push(`${guestA} (seat ${seatA}) and ${guestB} (seat ${seatB}) must be adjacent but are not`);
            }
        }
    }

    return violations;
}

function findUnmetConstraints(arrangement, adjacencyConstraints, adjacencyMap) {
    const unmetConstraints = [];

    for (const constraint of adjacencyConstraints) {
        const { guestA, guestB } = constraint;
        
        // Find seats for both guests
        let seatA = null;
        let seatB = null;
        
        for (const [seatId, guestName] of arrangement) {
            if (guestName === guestA) {
                seatA = seatId;
            }
            if (guestName === guestB) {
                seatB = seatId;
            }
        }

        // If both guests are placed, check if they are adjacent
        if (seatA && seatB) {
            const adjacentSeats = adjacencyMap.get(seatA) || [];
            if (!adjacentSeats.includes(seatB)) {
                unmetConstraints.push({
                    constraint: constraint,
                    reason: `${guestA} (seat ${seatA}) and ${guestB} (seat ${seatB}) are not adjacent`
                });
            }
        } else if (!seatA && !seatB) {
            unmetConstraints.push({
                constraint: constraint,
                reason: `Neither ${guestA} nor ${guestB} are placed in the arrangement`
            });
        } else {
            const unplacedGuest = seatA ? guestB : guestA;
            unmetConstraints.push({
                constraint: constraint,
                reason: `${unplacedGuest} is not placed in the arrangement`
            });
        }
    }

    return unmetConstraints;
}

// Export functions for Node.js environment if available
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        generateSeating,
        backtrackingSolver,
        findValidSeatsForGuest,
        isPlacementValid,
        shuffleArray,
        validateFixedAssignments,
        findUnmetConstraints
    };
}