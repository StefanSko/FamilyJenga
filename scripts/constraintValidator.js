// ABOUTME: Validation engine to check if constraint configurations are theoretically satisfiable
// ABOUTME: Detects conflicts, impossible chains, and provides warnings before attempting generation

function validateAllConstraints(guests, tableConfig, fixedAssignments, adjacencyConstraints, adjacencyMap) {
    const result = {
        isValid: true,
        errors: [],
        warnings: []
    };
    
    // Handle null/undefined inputs
    if (!guests || !tableConfig || !fixedAssignments || !adjacencyConstraints || !adjacencyMap) {
        result.isValid = false;
        result.errors.push('Invalid input: all parameters are required');
        return result;
    }
    
    // Check basic guest count vs seat count
    if (guests.length > tableConfig.totalSeats) {
        result.isValid = false;
        result.errors.push(`Too many guests (${guests.length}) for available seats (${tableConfig.totalSeats})`);
        return result;
    }
    
    // Check if no guests
    if (guests.length === 0) {
        return result; // Valid but trivial case
    }
    
    // Check for fixed assignment conflicts
    const fixedConflicts = checkFixedAssignmentConflicts(fixedAssignments, adjacencyConstraints, adjacencyMap);
    if (fixedConflicts.length > 0) {
        result.isValid = false;
        result.errors.push(...fixedConflicts);
    }
    
    // Check if adjacency chains are possible
    const chainCheck = checkAdjacencyChainPossibility(adjacencyConstraints, tableConfig.totalSeats);
    if (!chainCheck.isPossible) {
        result.isValid = false;
        result.errors.push(chainCheck.reason);
    }
    
    // Generate warnings for complex configurations
    const constraintGroups = findConstraintGroups(adjacencyConstraints);
    
    // Warn if many constraints relative to table size
    if (adjacencyConstraints.length > tableConfig.totalSeats / 2) {
        result.warnings.push('Many adjacency constraints may make seating generation difficult');
    }
    
    // Warn about large constraint groups
    for (const group of constraintGroups) {
        if (group.length > Math.ceil(tableConfig.totalSeats / 2)) {
            result.warnings.push(`Large constraint group (${group.length} guests) may be difficult to seat together`);
        }
    }
    
    return result;
}

function checkFixedAssignmentConflicts(fixedAssignments, adjacencyConstraints, adjacencyMap) {
    const conflicts = [];
    
    if (!fixedAssignments || !adjacencyConstraints || !adjacencyMap) {
        return conflicts;
    }
    
    // Create reverse mapping of guest to seat for fixed assignments
    const guestToSeat = {};
    for (const [seatId, guestName] of Object.entries(fixedAssignments)) {
        guestToSeat[guestName] = seatId;
    }
    
    // Check each adjacency constraint against fixed assignments
    for (const constraint of adjacencyConstraints) {
        const { guestA, guestB } = constraint;
        
        const seatA = guestToSeat[guestA];
        const seatB = guestToSeat[guestB];
        
        // If both guests are fixed, check if they are adjacent
        if (seatA && seatB) {
            const adjacentSeats = adjacencyMap.get(seatA) || [];
            if (!adjacentSeats.includes(seatB)) {
                conflicts.push(
                    `Cannot seat ${guestA} next to ${guestB}: ${guestA} is fixed at seat ${seatA}, ` +
                    `${guestB} is fixed at seat ${seatB}, but these seats are not adjacent`
                );
            }
        }
    }
    
    return conflicts;
}

function checkAdjacencyChainPossibility(adjacencyConstraints, totalSeats) {
    if (!adjacencyConstraints || adjacencyConstraints.length === 0) {
        return { isPossible: true };
    }
    
    // Build adjacency requirement graph
    const requirementGraph = {};
    
    for (const constraint of adjacencyConstraints) {
        const { guestA, guestB } = constraint;
        
        if (!requirementGraph[guestA]) {
            requirementGraph[guestA] = [];
        }
        if (!requirementGraph[guestB]) {
            requirementGraph[guestB] = [];
        }
        
        requirementGraph[guestA].push(guestB);
        requirementGraph[guestB].push(guestA);
    }
    
    // Check if any guest has too many adjacency requirements
    const maxPossibleAdjacent = Math.min(3, totalSeats - 1); // Corner seats can have at most 2-3 adjacent
    
    for (const [guest, requirements] of Object.entries(requirementGraph)) {
        if (requirements.length > maxPossibleAdjacent) {
            return {
                isPossible: false,
                reason: `${guest} must be adjacent to ${requirements.length} guests, but maximum possible is ${maxPossibleAdjacent}`
            };
        }
    }
    
    // Check for very long chains that might be impossible
    const constraintGroups = findConstraintGroups(adjacencyConstraints);
    
    for (const group of constraintGroups) {
        if (group.length > totalSeats) {
            return {
                isPossible: false,
                reason: `Constraint group has ${group.length} guests but table only has ${totalSeats} seats`
            };
        }
        
        // Check if linear chain is too long for table perimeter
        if (isLinearChain(group, adjacencyConstraints)) {
            // For rectangular tables, max linear chain is roughly perimeter/2
            const maxLinearChain = Math.ceil(totalSeats * 0.6); // Conservative estimate
            if (group.length > maxLinearChain) {
                return {
                    isPossible: false,
                    reason: `Linear chain of ${group.length} guests is too long for table (max ~${maxLinearChain})`
                };
            }
        }
    }
    
    return { isPossible: true };
}

function isLinearChain(group, adjacencyConstraints) {
    // Build constraint graph for this group
    const graph = {};
    
    for (const guest of group) {
        graph[guest] = [];
    }
    
    for (const constraint of adjacencyConstraints) {
        const { guestA, guestB } = constraint;
        if (group.includes(guestA) && group.includes(guestB)) {
            graph[guestA].push(guestB);
            graph[guestB].push(guestA);
        }
    }
    
    // Count guests with exactly 1 or 2 connections
    let endPoints = 0; // guests with 1 connection (chain ends)
    let middlePoints = 0; // guests with 2 connections (chain middle)
    
    // eslint-disable-next-line no-unused-vars
    for (const [guest, connections] of Object.entries(graph)) {
        if (connections.length === 1) {
            endPoints++;
        } else if (connections.length === 2) {
            middlePoints++;
        } else if (connections.length > 2) {
            return false; // Not a linear chain - has branching
        }
    }
    
    // Linear chain should have exactly 2 endpoints and rest as middle points
    return endPoints === 2 && middlePoints === (group.length - 2);
}

function findConstraintGroups(adjacencyConstraints) {
    if (!adjacencyConstraints || adjacencyConstraints.length === 0) {
        return [];
    }
    
    // Build graph of all guests involved in constraints
    const graph = {};
    const allGuests = new Set();
    
    for (const constraint of adjacencyConstraints) {
        const { guestA, guestB } = constraint;
        
        allGuests.add(guestA);
        allGuests.add(guestB);
        
        if (!graph[guestA]) {
            graph[guestA] = [];
        }
        if (!graph[guestB]) {
            graph[guestB] = [];
        }
        
        graph[guestA].push(guestB);
        graph[guestB].push(guestA);
    }
    
    // Find connected components using DFS
    const visited = new Set();
    const groups = [];
    
    function dfs(guest, currentGroup) {
        if (visited.has(guest)) {
            return;
        }
        
        visited.add(guest);
        currentGroup.push(guest);
        
        const neighbors = graph[guest] || [];
        for (const neighbor of neighbors) {
            dfs(neighbor, currentGroup);
        }
    }
    
    for (const guest of allGuests) {
        if (!visited.has(guest)) {
            const group = [];
            dfs(guest, group);
            groups.push(group);
        }
    }
    
    return groups;
}

// Export functions for Node.js environment if available
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        validateAllConstraints,
        checkFixedAssignmentConflicts,
        checkAdjacencyChainPossibility,
        findConstraintGroups
    };
}