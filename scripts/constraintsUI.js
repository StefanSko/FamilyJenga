// ABOUTME: User interface management for adjacency constraints between guests
// ABOUTME: Handles dropdown population, constraint rendering, and constraint list management

function populateGuestDropdowns(guests, selectElements) {
    if (!selectElements || selectElements.length === 0) {
        console.error('No select elements provided to populate');
        return;
    }
    
    // Clear and populate each dropdown
    selectElements.forEach(selectElement => {
        if (!selectElement) {
            console.error('Invalid select element provided');
            return;
        }
        
        // Clear existing options except the first one (placeholder)
        while (selectElement.children.length > 1) {
            selectElement.removeChild(selectElement.lastChild);
        }
        
        // Add guest options
        guests.forEach(guest => {
            const option = document.createElement('option');
            option.value = guest;
            option.textContent = guest;
            selectElement.appendChild(option);
        });
    });
    
    // Update dropdown interdependence (disable selected guest in other dropdown)
    updateDropdownInterdependence(selectElements);
    
    console.log('Populated guest dropdowns with', guests.length, 'guests');
}

function updateDropdownInterdependence(selectElements) {
    if (!selectElements || selectElements.length !== 2) {
        return;
    }
    
    const [selectA, selectB] = selectElements;
    
    // Function to update options based on other dropdown's selection
    function updateOptions(sourceSelect, targetSelect) {
        const selectedValue = sourceSelect.value;
        
        // Handle both browser and test environments
        const targetOptions = targetSelect.options ? Array.from(targetSelect.options) : targetSelect.children;
        
        // Enable all options in target dropdown first
        if (targetOptions) {
            Array.from(targetOptions).forEach(option => {
                if (option.disabled !== undefined) {
                    option.disabled = false;
                }
            });
        }
        
        // Disable the selected option in target dropdown (can't select same guest twice)
        if (selectedValue && targetOptions) {
            const optionToDisable = Array.from(targetOptions).find(
                option => option.value === selectedValue
            );
            if (optionToDisable) {
                optionToDisable.disabled = true;
                
                // If target currently has the same value selected, clear it
                if (targetSelect.value === selectedValue) {
                    targetSelect.value = '';
                }
            }
        }
    }
    
    // Add event listeners to both dropdowns
    selectA.addEventListener('change', () => updateOptions(selectA, selectB));
    selectB.addEventListener('change', () => updateOptions(selectB, selectA));
    
    // Apply initial state
    updateOptions(selectA, selectB);
    updateOptions(selectB, selectA);
}

function renderConstraintsList(constraints, containerElement) {
    if (!containerElement) {
        console.error('Container element not found for constraints list');
        return;
    }
    
    // Clear container
    containerElement.innerHTML = '';
    
    if (!constraints || constraints.length === 0) {
        const emptyMessage = document.createElement('div');
        emptyMessage.className = 'empty-constraints-list';
        emptyMessage.textContent = 'No adjacency constraints added yet.';
        containerElement.appendChild(emptyMessage);
        return;
    }
    
    // Create constraint items
    constraints.forEach((constraint, index) => {
        const constraintItem = document.createElement('div');
        constraintItem.className = 'constraint-item';
        constraintItem.setAttribute('data-constraint-index', index);
        
        const constraintText = document.createElement('span');
        constraintText.className = 'constraint-text';
        constraintText.textContent = `${constraint.guestA} must sit near ${constraint.guestB}`;
        
        const deleteButton = document.createElement('button');
        deleteButton.className = 'delete-constraint-btn';
        deleteButton.type = 'button';
        deleteButton.innerHTML = '×';
        deleteButton.title = 'Remove constraint';
        deleteButton.setAttribute('data-constraint-index', index);
        
        constraintItem.appendChild(constraintText);
        constraintItem.appendChild(deleteButton);
        containerElement.appendChild(constraintItem);
    });
    
    console.log('Rendered', constraints.length, 'constraint items');
}

function validateConstraintSelection(guestA, guestB, existingConstraints = []) {
    const errors = [];
    
    // Check if both guests are selected
    if (!guestA) {
        errors.push('Please select the first guest');
    }
    
    if (!guestB) {
        errors.push('Please select the second guest');
    }
    
    // Check if guests are different
    if (guestA && guestB && guestA === guestB) {
        errors.push('Please select two different guests');
    }
    
    // Check if constraint already exists (in either direction)
    if (guestA && guestB && existingConstraints.length > 0) {
        const isDuplicate = existingConstraints.some(constraint => 
            (constraint.guestA === guestA && constraint.guestB === guestB) ||
            (constraint.guestA === guestB && constraint.guestB === guestA)
        );
        
        if (isDuplicate) {
            errors.push('This constraint already exists');
        }
    }
    
    return {
        isValid: errors.length === 0,
        errors
    };
}

function updateAddConstraintButtonState(buttonElement, isValid) {
    if (!buttonElement) {
        return;
    }
    
    buttonElement.disabled = !isValid;
    
    // Handle classList for both browser and test environments
    if (buttonElement.classList) {
        if (isValid) {
            buttonElement.classList.remove('disabled');
        } else {
            buttonElement.classList.add('disabled');
        }
    } else {
        // Fallback for test environment
        if (isValid) {
            buttonElement.className = buttonElement.className.replace(/\s*disabled\s*/g, ' ').trim();
        } else {
            if (!buttonElement.className.includes('disabled')) {
                buttonElement.className += ' disabled';
            }
        }
    }
}

function clearConstraintForm(selectElements) {
    if (!selectElements) {
        return;
    }
    
    selectElements.forEach(selectElement => {
        if (selectElement) {
            selectElement.value = '';
        }
    });
    
    console.log('Cleared constraint form');
}

function showConstraintValidationError(message, containerElement) {
    if (!containerElement) {
        return;
    }
    
    // Clear any existing error messages
    const existingError = containerElement.querySelector('.constraint-validation-error');
    if (existingError) {
        existingError.remove();
    }
    
    if (message) {
        const errorElement = document.createElement('div');
        errorElement.className = 'constraint-validation-error';
        errorElement.textContent = message;
        
        // Insert error message after the constraint form
        const constraintForm = containerElement.querySelector('.constraint-form');
        if (constraintForm) {
            constraintForm.appendChild(errorElement);
        }
        
        // Auto-remove error after 3 seconds
        setTimeout(() => {
            if (errorElement && errorElement.parentNode) {
                errorElement.remove();
            }
        }, 3000);
    }
}

// Export functions for Node.js environment if available
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        populateGuestDropdowns,
        updateDropdownInterdependence,
        renderConstraintsList,
        validateConstraintSelection,
        updateAddConstraintButtonState,
        clearConstraintForm,
        showConstraintValidationError
    };
}