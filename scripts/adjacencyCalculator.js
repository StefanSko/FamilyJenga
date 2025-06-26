// ABOUTME: Mathematical logic for determining seat adjacency relationships around a rectangular table
// ABOUTME: Calculates table geometry, adjacency maps, and corner connections for constraint satisfaction

function calculateTableGeometry(tableConfig) {
    if (!tableConfig) {
        throw new Error('Table configuration is required');
    }
    
    const { topSeats, rightSeats, bottomSeats, leftSeats } = tableConfig;
    const geometry = new Map();
    
    // Table dimensions - use a reasonable size with margin for seats
    const tableWidth = 400;
    const tableHeight = 300;
    const seatRadius = 20;
    const margin = 50; // Extra margin to keep all coordinates positive
    
    let seatId = 1;
    
    // Top seats (left to right)
    for (let i = 0; i < topSeats; i++) {
        const x = margin + (tableWidth / (topSeats + 1)) * (i + 1);
        const y = margin; // Above the table
        geometry.set(seatId.toString(), {
            x: x,
            y: y,
            side: 'top',
            position: i
        });
        seatId++;
    }
    
    // Right seats (top to bottom)
    for (let i = 0; i < rightSeats; i++) {
        const x = margin + tableWidth + seatRadius; // Right of the table
        const y = margin + (tableHeight / (rightSeats + 1)) * (i + 1);
        geometry.set(seatId.toString(), {
            x: x,
            y: y,
            side: 'right',
            position: i
        });
        seatId++;
    }
    
    // Bottom seats (right to left)
    for (let i = 0; i < bottomSeats; i++) {
        const x = margin + tableWidth - (tableWidth / (bottomSeats + 1)) * (i + 1);
        const y = margin + tableHeight + seatRadius; // Below the table
        geometry.set(seatId.toString(), {
            x: x,
            y: y,
            side: 'bottom',
            position: i
        });
        seatId++;
    }
    
    // Left seats (bottom to top)
    for (let i = 0; i < leftSeats; i++) {
        const x = margin - seatRadius; // Left of the table
        const y = margin + tableHeight - (tableHeight / (leftSeats + 1)) * (i + 1);
        geometry.set(seatId.toString(), {
            x: x,
            y: y,
            side: 'left',
            position: i
        });
        seatId++;
    }
    
    return geometry;
}

function calculateAdjacencyMap(tableConfig) {
    if (!tableConfig) {
        throw new Error('Table configuration is required');
    }
    
    const geometry = calculateTableGeometry(tableConfig);
    const adjacencyMap = new Map();
    const { topSeats, rightSeats, bottomSeats, leftSeats } = tableConfig;
    
    // Initialize adjacency map
    for (const seatId of geometry.keys()) {
        adjacencyMap.set(seatId, []);
    }
    
    // Helper function to add bidirectional adjacency
    function addAdjacency(seat1, seat2) {
        if (adjacencyMap.has(seat1) && adjacencyMap.has(seat2)) {
            adjacencyMap.get(seat1).push(seat2);
            adjacencyMap.get(seat2).push(seat1);
        }
    }
    
    let currentSeatId = 1;
    
    // Top side adjacencies
    for (let i = 0; i < topSeats; i++) {
        const seatId = currentSeatId.toString();
        
        // Adjacent to next seat on same side
        if (i < topSeats - 1) {
            addAdjacency(seatId, (currentSeatId + 1).toString());
        }
        
        currentSeatId++;
    }
    
    // Right side adjacencies
    for (let i = 0; i < rightSeats; i++) {
        const seatId = currentSeatId.toString();
        
        // Adjacent to next seat on same side
        if (i < rightSeats - 1) {
            addAdjacency(seatId, (currentSeatId + 1).toString());
        }
        
        currentSeatId++;
    }
    
    // Bottom side adjacencies
    for (let i = 0; i < bottomSeats; i++) {
        const seatId = currentSeatId.toString();
        
        // Adjacent to next seat on same side
        if (i < bottomSeats - 1) {
            addAdjacency(seatId, (currentSeatId + 1).toString());
        }
        
        currentSeatId++;
    }
    
    // Left side adjacencies
    for (let i = 0; i < leftSeats; i++) {
        const seatId = currentSeatId.toString();
        
        // Adjacent to next seat on same side
        if (i < leftSeats - 1) {
            addAdjacency(seatId, (currentSeatId + 1).toString());
        }
        
        currentSeatId++;
    }
    
    // Add corner connections
    const cornerConnections = getCornerSeatConnections(tableConfig);
    for (const [seat1, seat2] of cornerConnections) {
        addAdjacency(seat1, seat2);
    }
    
    return adjacencyMap;
}

function getCornerSeatConnections(tableConfig) {
    const { topSeats, rightSeats, bottomSeats, leftSeats } = tableConfig;
    const connections = [];
    
    let seatId = 1;
    
    // Calculate seat ID ranges for each side
    const topStart = seatId;
    const topEnd = seatId + topSeats - 1;
    seatId += topSeats;
    
    const rightStart = seatId;
    const rightEnd = seatId + rightSeats - 1;
    seatId += rightSeats;
    
    const bottomStart = seatId;
    const bottomEnd = seatId + bottomSeats - 1;
    seatId += bottomSeats;
    
    const leftStart = seatId;
    const leftEnd = seatId + leftSeats - 1;
    
    // Top-Right corner: last top seat connects to first right seat
    if (topSeats > 0 && rightSeats > 0) {
        connections.push([topEnd.toString(), rightStart.toString()]);
    }
    
    // Right-Bottom corner: last right seat connects to first bottom seat
    if (rightSeats > 0 && bottomSeats > 0) {
        connections.push([rightEnd.toString(), bottomStart.toString()]);
    }
    
    // Bottom-Left corner: last bottom seat connects to first left seat
    if (bottomSeats > 0 && leftSeats > 0) {
        connections.push([bottomEnd.toString(), leftStart.toString()]);
    }
    
    // Left-Top corner: last left seat connects to first top seat
    if (leftSeats > 0 && topSeats > 0) {
        connections.push([leftEnd.toString(), topStart.toString()]);
    }
    
    return connections;
}

function areSeatsAdjacent(seatId1, seatId2, adjacencyMap) {
    if (!adjacencyMap || !adjacencyMap.has(seatId1)) {
        return false;
    }
    
    const adjacentSeats = adjacencyMap.get(seatId1);
    return adjacentSeats.includes(seatId2);
}

// Export functions for Node.js environment if available
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        calculateTableGeometry,
        calculateAdjacencyMap,
        areSeatsAdjacent,
        getCornerSeatConnections
    };
}