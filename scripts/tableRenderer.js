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
    
    // Create defs for gradients
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    
    // Create gradient for table surface
    const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
    gradient.setAttribute('id', 'tableGradient');
    gradient.setAttribute('x1', '0%');
    gradient.setAttribute('y1', '0%');
    gradient.setAttribute('x2', '100%');
    gradient.setAttribute('y2', '100%');
    
    const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    stop1.setAttribute('offset', '0%');
    stop1.setAttribute('stop-color', '#A0522D');
    
    const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    stop2.setAttribute('offset', '50%');
    stop2.setAttribute('stop-color', '#8B4513');
    
    const stop3 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    stop3.setAttribute('offset', '100%');
    stop3.setAttribute('stop-color', '#654321');
    
    gradient.appendChild(stop1);
    gradient.appendChild(stop2);
    gradient.appendChild(stop3);
    defs.appendChild(gradient);
    svg.appendChild(defs);
    
    // Create table surface
    const tableRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    tableRect.setAttribute('x', '40');
    tableRect.setAttribute('y', '40');
    tableRect.setAttribute('width', '400');
    tableRect.setAttribute('height', '300');
    tableRect.setAttribute('rx', '10');
    tableRect.setAttribute('ry', '10');
    // Try gradient first, fallback to solid color
    tableRect.setAttribute('fill', 'url(#tableGradient)');
    tableRect.setAttribute('stroke', '#654321');
    tableRect.setAttribute('stroke-width', '3');
    tableRect.style.filter = 'drop-shadow(0 4px 12px rgba(0,0,0,0.25))';
    tableRect.className = 'table-surface';
    svg.appendChild(tableRect);
    
    // Fallback check: if gradient doesn't work, use solid color
    setTimeout(() => {
        const computedFill = window.getComputedStyle(tableRect).fill;
        if (computedFill === 'none' || computedFill === 'black' || computedFill === 'rgb(0, 0, 0)') {
            tableRect.setAttribute('fill', '#8B4513');
        }
    }, 100);
    
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
        seatCircle.setAttribute('fill', '#ecf0f1');
        seatCircle.setAttribute('stroke', '#34495e');
        seatCircle.setAttribute('stroke-width', '2');
        seatCircle.style.filter = 'drop-shadow(0 1px 2px rgba(0,0,0,0.1))';
        seatCircle.className = 'seat-circle';
        
        // Seat number text
        const seatText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        seatText.setAttribute('x', seatPos.x);
        seatText.setAttribute('y', seatPos.y + 5);
        seatText.setAttribute('text-anchor', 'middle');
        seatText.setAttribute('fill', '#2C3E50');
        seatText.setAttribute('font-family', '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif');
        seatText.setAttribute('font-size', '12');
        seatText.setAttribute('font-weight', '600');
        seatText.style.userSelect = 'none';
        seatText.style.pointerEvents = 'none';
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
    if (!seatElement) {
        console.error('updateSeatDisplay: seatElement is null');
        return;
    }
    
    // Find the seat number text element
    let seatText = seatElement.querySelector('.seat-number');
    
    if (!seatText) {
        const textElements = seatElement.querySelectorAll('text');
        if (textElements.length > 0) {
            seatText = textElements[0];
        }
    }
    
    if (!seatText) {
        console.error('updateSeatDisplay: No text element found in seat element');
        return;
    }
    
    // Remove any existing guest name label
    const existingNameLabel = seatElement.querySelector('.guest-name-label');
    if (existingNameLabel) {
        existingNameLabel.remove();
    }
    
    if (guestName) {
        // Keep seat number in circle for clarity and scalability
        const seatId = seatElement.getAttribute('data-seat-id');
        seatText.textContent = seatId;
        seatElement.classList.add('occupied');
        
        // Update seat appearance for occupied state
        const seatCircle = seatElement.querySelector('.seat-circle');
        if (seatCircle) {
            seatText.setAttribute('fill', 'white');
            
            // Dynamic font sizing based on seat count for scalability
            const totalSeats = getTotalSeatsFromTable(seatElement);
            const fontSize = totalSeats > 20 ? '10' : '12';
            seatText.setAttribute('font-size', fontSize);
            seatText.setAttribute('font-weight', '700');
            
            if (isFixed) {
                seatCircle.setAttribute('fill', '#2C3E50');
                seatCircle.setAttribute('stroke', '#1a252f');
                seatElement.classList.add('fixed-assignment');
                addRemoveButton(seatElement);
            } else {
                seatCircle.setAttribute('fill', '#27AE60');
                seatCircle.setAttribute('stroke', '#229954');
                seatElement.classList.add('generated-assignment');
                removeRemoveButton(seatElement);
            }
        }
        
        // Create guest name label positioned outside the circle
        addGuestNameLabel(seatElement, guestName, isFixed);
        
    } else {
        // Show seat number - reset to default state
        const seatId = seatElement.getAttribute('data-seat-id');
        seatText.textContent = seatId;
        seatText.setAttribute('fill', '#2C3E50');
        seatText.setAttribute('font-size', '12');
        seatText.setAttribute('font-weight', '600');
        
        // Reset seat circle to default
        const seatCircle = seatElement.querySelector('.seat-circle');
        if (seatCircle) {
            seatCircle.setAttribute('fill', '#ecf0f1');
            seatCircle.setAttribute('stroke', '#34495e');
        }
        
        seatElement.classList.remove('occupied', 'fixed-assignment', 'generated-assignment');
        removeRemoveButton(seatElement);
    }
}

// Helper function to get total seat count for dynamic scaling
function getTotalSeatsFromTable(seatElement) {
    const svg = seatElement.closest('svg');
    if (!svg) return 8; // Default fallback
    
    const allSeats = svg.querySelectorAll('.seat-group');
    return allSeats.length;
}

// Helper function to add guest name label with scalability features
function addGuestNameLabel(seatElement, guestName, isFixed) {
    const seatCircle = seatElement.querySelector('.seat-circle');
    if (!seatCircle) return;
    
    const cx = parseFloat(seatCircle.getAttribute('cx'));
    const cy = parseFloat(seatCircle.getAttribute('cy'));
    const seatSide = seatElement.getAttribute('data-side');
    const totalSeats = getTotalSeatsFromTable(seatElement);
    
    // Calculate label position with dynamic spacing for scalability
    const labelPosition = calculateLabelPosition(cx, cy, seatSide, totalSeats);
    
    // Truncate very long names for readability in larger tables
    const displayName = truncateNameForDisplay(guestName, totalSeats);
    
    // Create guest name label
    const nameLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    nameLabel.setAttribute('x', labelPosition.x);
    nameLabel.setAttribute('y', labelPosition.y);
    nameLabel.setAttribute('text-anchor', labelPosition.anchor);
    nameLabel.setAttribute('dominant-baseline', labelPosition.baseline);
    nameLabel.setAttribute('font-family', '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif');
    
    // Dynamic font sizing based on table size
    const fontSize = totalSeats > 30 ? '10' : totalSeats > 20 ? '11' : '12';
    nameLabel.setAttribute('font-size', fontSize);
    nameLabel.setAttribute('font-weight', '600');
    nameLabel.style.userSelect = 'none';
    nameLabel.style.pointerEvents = 'none';
    
    // Set color based on assignment type
    if (isFixed) {
        nameLabel.setAttribute('fill', '#2C3E50');
        nameLabel.setAttribute('font-weight', '700');
    } else {
        nameLabel.setAttribute('fill', '#27AE60');
        nameLabel.setAttribute('font-weight', '600');
    }
    
    nameLabel.className = 'guest-name-label';
    nameLabel.textContent = displayName;
    
    // Add title attribute for full name on hover (especially useful for truncated names)
    nameLabel.innerHTML = `<title>${guestName}</title>`;
    nameLabel.textContent = displayName;
    
    seatElement.appendChild(nameLabel);
}

// Helper function to truncate names intelligently for display
function truncateNameForDisplay(guestName, totalSeats) {
    if (totalSeats <= 20) {
        // For smaller tables, show full names
        return guestName;
    } else if (totalSeats <= 30) {
        // For medium tables, limit to 15 characters
        return guestName.length > 15 ? guestName.substring(0, 12) + '...' : guestName;
    } else {
        // For large tables, limit to 12 characters
        return guestName.length > 12 ? guestName.substring(0, 9) + '...' : guestName;
    }
}

// Helper function to calculate label position with dynamic spacing
function calculateLabelPosition(cx, cy, seatSide, totalSeats) {
    // Dynamic offset based on table size to prevent label collisions
    let offset;
    if (totalSeats > 30) {
        offset = 20; // Closer spacing for large tables
    } else if (totalSeats > 20) {
        offset = 22; // Medium spacing for medium tables
    } else {
        offset = 25; // Generous spacing for small tables
    }
    
    switch (seatSide) {
    case 'top':
        return {
            x: cx,
            y: cy - offset,
            anchor: 'middle',
            baseline: 'text-after-edge'
        };
    case 'bottom':
        return {
            x: cx,
            y: cy + offset,
            anchor: 'middle',
            baseline: 'text-before-edge'
        };
    case 'left':
        return {
            x: cx - offset,
            y: cy,
            anchor: 'end',
            baseline: 'central'
        };
    case 'right':
        return {
            x: cx + offset,
            y: cy,
            anchor: 'start',
            baseline: 'central'
        };
    default:
        return {
            x: cx,
            y: cy + offset,
            anchor: 'middle',
            baseline: 'text-before-edge'
        };
    }
}

// Helper functions for remove button functionality
function addRemoveButton(seatElement) {
    // Check if remove button already exists
    if (seatElement.querySelector('.remove-button')) {
        return;
    }
    
    const seatId = seatElement.getAttribute('data-seat-id');
    
    // Create remove button as SVG element
    const removeButton = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    removeButton.setAttribute('cx', '0'); // Will be positioned relative to seat
    removeButton.setAttribute('cy', '0');
    removeButton.setAttribute('r', '8');
    removeButton.classList.add('remove-button');
    removeButton.style.cursor = 'pointer';
    
    // Create X icon
    const removeIcon = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    removeIcon.setAttribute('x', '0');
    removeIcon.setAttribute('y', '4');
    removeIcon.setAttribute('text-anchor', 'middle');
    removeIcon.textContent = '×';
    removeIcon.classList.add('remove-icon');
    removeIcon.style.pointerEvents = 'none'; // Let clicks pass through to button
    
    // Position button relative to seat circle
    const seatCircle = seatElement.querySelector('.seat-circle, circle');
    if (seatCircle) {
        const cx = parseFloat(seatCircle.getAttribute('cx'));
        const cy = parseFloat(seatCircle.getAttribute('cy'));
        
        // Position button at top-right of seat circle
        removeButton.setAttribute('cx', cx + 12);
        removeButton.setAttribute('cy', cy - 12);
        removeIcon.setAttribute('x', cx + 12);
        removeIcon.setAttribute('y', cy - 8);
    }
    
    // Add click handler
    removeButton.addEventListener('click', function(event) {
        event.stopPropagation(); // Prevent seat click events
        
        // Call global remove handler if it exists
        if (typeof handleRemoveAssignment === 'function') {
            handleRemoveAssignment(seatId);
        } else {
            console.log('Remove assignment requested for seat:', seatId);
        }
    });
    
    // Add to seat element
    seatElement.appendChild(removeButton);
    seatElement.appendChild(removeIcon);
}

function removeRemoveButton(seatElement) {
    const removeButton = seatElement.querySelector('.remove-button');
    const removeIcon = seatElement.querySelector('.remove-icon');
    
    if (removeButton) {
        removeButton.remove();
    }
    if (removeIcon) {
        removeIcon.remove();
    }
}

// Export functions for Node.js environment if available
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        calculateSeatPositions,
        renderTable,
        updateSeatDisplay,
        addRemoveButton,
        removeRemoveButton
    };
}