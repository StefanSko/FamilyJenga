// ABOUTME: Table visualization rendering engine for the dinner seating application
// ABOUTME: Creates SVG/HTML representations of tables with positioned seats and interactive elements

function calculateSeatPositions(tableConfig) {
    const { topSeats, rightSeats, bottomSeats, leftSeats } = tableConfig;
    const positions = [];
    
    // Table dimensions (will be scaled to fit container)
    const tableWidth = 400;
    const tableHeight = 300;
    const seatSize = 30;
    const margin = 40;
    
    let currentSeatId = 1;
    
    // Top seats (left to right)
    if (topSeats > 0) {
        const spacing = topSeats > 1 ? tableWidth / (topSeats - 1) : 0;
        for (let i = 0; i < topSeats; i++) {
            const x = topSeats > 1 ? i * spacing : tableWidth / 2;
            const y = margin - seatSize / 2;
            
            positions.push({
                seatId: currentSeatId++,
                side: 'top',
                position: i,
                x: x + margin,
                y: y
            });
        }
    }
    
    // Right seats (top to bottom)
    if (rightSeats > 0) {
        const spacing = rightSeats > 1 ? tableHeight / (rightSeats - 1) : 0;
        for (let i = 0; i < rightSeats; i++) {
            const x = margin + tableWidth + seatSize / 2;
            const y = rightSeats > 1 ? i * spacing : tableHeight / 2;
            
            positions.push({
                seatId: currentSeatId++,
                side: 'right',
                position: i,
                x: x,
                y: y + margin
            });
        }
    }
    
    // Bottom seats (right to left)
    if (bottomSeats > 0) {
        const spacing = bottomSeats > 1 ? tableWidth / (bottomSeats - 1) : 0;
        for (let i = 0; i < bottomSeats; i++) {
            const x = bottomSeats > 1 ? (bottomSeats - 1 - i) * spacing : tableWidth / 2;
            const y = margin + tableHeight + seatSize / 2;
            
            positions.push({
                seatId: currentSeatId++,
                side: 'bottom',
                position: i,
                x: x + margin,
                y: y
            });
        }
    }
    
    // Left seats (bottom to top)
    if (leftSeats > 0) {
        const spacing = leftSeats > 1 ? tableHeight / (leftSeats - 1) : 0;
        for (let i = 0; i < leftSeats; i++) {
            const x = margin - seatSize / 2;
            const y = leftSeats > 1 ? (leftSeats - 1 - i) * spacing : tableHeight / 2;
            
            positions.push({
                seatId: currentSeatId++,
                side: 'left',
                position: i,
                x: x,
                y: y + margin
            });
        }
    }
    
    return positions;
}

function renderTable(tableConfig, containerElement) {
    // Clear existing content
    containerElement.innerHTML = '';
    
    // Calculate seat positions
    const seatPositions = calculateSeatPositions(tableConfig);
    
    // Create SVG container
    const svgContainer = document.createElement('div');
    svgContainer.className = 'table-svg-container';
    
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');
    svg.setAttribute('viewBox', '0 0 520 420');
    svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
    svg.className = 'table-svg';
    
    // Create table surface
    const tableRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    tableRect.setAttribute('x', '40');
    tableRect.setAttribute('y', '40');
    tableRect.setAttribute('width', '400');
    tableRect.setAttribute('height', '300');
    tableRect.setAttribute('rx', '10');
    tableRect.className = 'table-surface';
    svg.appendChild(tableRect);
    
    // Store seat elements for return
    const seatElements = {};
    
    // Create seats
    seatPositions.forEach(seatPos => {
        const seatGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        seatGroup.className = 'seat-group';
        seatGroup.setAttribute('data-seat-id', seatPos.seatId);
        seatGroup.setAttribute('data-side', seatPos.side);
        seatGroup.style.cursor = 'pointer';
        
        // Seat circle
        const seatCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        seatCircle.setAttribute('cx', seatPos.x);
        seatCircle.setAttribute('cy', seatPos.y);
        seatCircle.setAttribute('r', '15');
        seatCircle.className = 'seat-circle';
        
        // Seat number text
        const seatText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        seatText.setAttribute('x', seatPos.x);
        seatText.setAttribute('y', seatPos.y + 5);
        seatText.setAttribute('text-anchor', 'middle');
        seatText.className = 'seat-number';
        seatText.textContent = seatPos.seatId;
        
        seatGroup.appendChild(seatCircle);
        seatGroup.appendChild(seatText);
        svg.appendChild(seatGroup);
        
        // Store in return object
        seatElements[seatPos.seatId] = seatGroup;
    });
    
    svgContainer.appendChild(svg);
    containerElement.appendChild(svgContainer);
    
    return seatElements;
}

// Function to update seat display (for later use with assignments)
function updateSeatDisplay(seatElement, guestName, isFixed) {
    if (!seatElement) return;
    
    const seatText = seatElement.querySelector('.seat-number');
    
    if (guestName) {
        // Show guest name
        seatText.textContent = guestName;
        seatElement.classList.add('occupied');
        
        if (isFixed) {
            seatElement.classList.add('fixed-assignment');
        } else {
            seatElement.classList.add('generated-assignment');
        }
    } else {
        // Show seat number
        const seatId = seatElement.getAttribute('data-seat-id');
        seatText.textContent = seatId;
        seatElement.classList.remove('occupied', 'fixed-assignment', 'generated-assignment');
    }
}

// Export functions for Node.js environment if available
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        calculateSeatPositions,
        renderTable,
        updateSeatDisplay
    };
}