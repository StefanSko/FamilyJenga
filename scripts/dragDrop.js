// ABOUTME: Drag and drop functionality for guest-to-seat assignment interactions
// ABOUTME: Provides draggable guests, droppable seats, and visual feedback systems

// Module-level state for drag operations
let currentDragData = null;

function makeDraggable(element, guestName) {
    // Set draggable attribute
    element.draggable = true;
    element.setAttribute('draggable', 'true');
    
    // Store guest name in data attribute
    element.setAttribute('data-guest-name', guestName);
    
    // Add visual feedback class
    element.classList.add('draggable-guest');
    
    // Add dragstart event listener
    element.addEventListener('dragstart', function(event) {
        // Store guest name in dataTransfer
        event.dataTransfer.setData('text/guest-name', guestName);
        event.dataTransfer.effectAllowed = 'move';
        
        // Add visual feedback
        addDragVisualFeedback(element);
        
        // Store current drag data
        setCurrentDragData({
            guestName: guestName,
            element: element
        });
        
        console.log('Started dragging guest:', guestName);
    });
    
    // Add dragend event listener
    element.addEventListener('dragend', function() {
        // Remove visual feedback
        removeDragVisualFeedback(element);
        
        // Clear drag data
        setCurrentDragData(null);
        
        // Remove drag-over class from all drop zones
        const dropZones = document.querySelectorAll('.drag-over');
        dropZones.forEach(zone => removeDropZoneHighlight(zone));
        
        console.log('Finished dragging guest:', guestName);
    });
}

function makeDroppable(element, seatId, onDrop) {
    // Store seat ID in data attribute (only if not already set)
    if (!element.getAttribute('data-seat-id')) {
        element.setAttribute('data-seat-id', seatId);
    }
    
    // Add droppable class without removing existing classes
    element.classList.add('droppable-seat');
    
    // Add dragover event listener
    element.addEventListener('dragover', function(event) {
        event.preventDefault(); // Allow drop
        addDropZoneHighlight(element);
    });
    
    // Add dragleave event listener
    element.addEventListener('dragleave', function(event) {
        // Only remove highlight if we're actually leaving the element
        if (!element.contains(event.relatedTarget)) {
            removeDropZoneHighlight(element);
        }
    });
    
    // Add drop event listener
    element.addEventListener('drop', function(event) {
        event.preventDefault();
        
        // Get guest name from dataTransfer
        const guestName = event.dataTransfer.getData('text/guest-name');
        
        if (guestName) {
            console.log('Dropped guest', guestName, 'on seat', seatId);
            
            // Call the drop callback
            onDrop(guestName, seatId);
        }
        
        // Remove visual feedback
        removeDropZoneHighlight(element);
    });
}

function renderGuestList(guests, containerElement, assignedGuests = []) {
    // Clear existing content
    containerElement.innerHTML = '';
    
    // Filter out assigned guests
    const availableGuests = guests.filter(guest => !assignedGuests.includes(guest));
    
    if (availableGuests.length === 0) {
        const emptyMessage = document.createElement('div');
        emptyMessage.className = 'empty-guest-list';
        emptyMessage.textContent = 'All guests have been assigned';
        containerElement.appendChild(emptyMessage);
        return;
    }
    
    // Create draggable elements for each available guest
    availableGuests.forEach(guest => {
        const guestElement = document.createElement('div');
        guestElement.className = 'guest-item';
        guestElement.textContent = guest;
        
        // Make the guest draggable
        makeDraggable(guestElement, guest);
        
        containerElement.appendChild(guestElement);
    });
    
    console.log('Rendered guest list with', availableGuests.length, 'available guests');
}

// Visual feedback functions
function addDragVisualFeedback(element) {
    element.classList.add('dragging');
}

function removeDragVisualFeedback(element) {
    element.classList.remove('dragging');
}

function addDropZoneHighlight(element) {
    element.classList.add('drag-over');
}

function removeDropZoneHighlight(element) {
    element.classList.remove('drag-over');
}

// Drag data management
function setCurrentDragData(data) {
    currentDragData = data;
}

function getCurrentDragData() {
    return currentDragData;
}

// Initialize drag and drop for the entire application
function initializeDragAndDrop(guests, seatElements, onSeatDrop) {
    console.log('Initializing drag and drop system...');
    
    // Get guest list container
    const guestContainer = document.getElementById('guest-list-container');
    if (!guestContainer) {
        console.error('Guest list container not found');
        return;
    }
    
    // Render draggable guest list
    renderGuestList(guests, guestContainer);
    
    // Make all seat elements droppable
    if (seatElements) {
        Object.values(seatElements).forEach(seatElement => {
            const seatId = seatElement.getAttribute('data-seat-id');
            if (seatId) {
                makeDroppable(seatElement, seatId, onSeatDrop || handleSeatDrop);
            }
        });
    }
    
    console.log('Drag and drop system initialized');
}

// Default drop handler (can be overridden)
function handleSeatDrop(guestName, seatId) {
    console.log('Default drop handler:', guestName, '->', seatId);
    // This will be overridden by the main application
}

// Export functions for Node.js environment if available
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        makeDraggable,
        makeDroppable,
        renderGuestList,
        addDragVisualFeedback,
        removeDragVisualFeedback,
        addDropZoneHighlight,
        removeDropZoneHighlight,
        setCurrentDragData,
        getCurrentDragData,
        initializeDragAndDrop,
        handleSeatDrop
    };
}