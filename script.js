// DOM element selection
const calenderElement = document.querySelector("#calender");
const entryBoxElement = document.querySelector("#entry-box");
const clearButtonElement = document.querySelector("#leave-clear");
const submitButtonElement = document.querySelector("#leave-submit");
const leaveButtonsElement = document.querySelector(".leave-buttons");
const reasonContentElement = document.querySelector("#reason-content");

// Data initialization
let Meal_LeaveArray = JSON.parse(localStorage.getItem("MealLeave")) || [];
let mealLeaveCounter = parseInt(localStorage.getItem("MEAL_LEAVE_COUNTER")) || 0;

// Radio button options
const radioContent = ["Call_issue", "Cooking", "Casually", "Collage", "Biryani", "Other"];

/**
 * Creates and displays a leave entry in the UI
 * @param {Object} leave - The leave entry data
 * @param {number} index - Index in the array for delete functionality
 */
const createEntry = (leave, index) => {
    const { serial_no, reason, date, time_of_day } = leave;

    // Create elements for each property
    const element_SERIAL = document.createElement("div");
    element_SERIAL.classList.add("leave-serial", "USER_ENTRY");
    element_SERIAL.innerText = serial_no;

    const element_REASON = document.createElement("div");
    element_REASON.classList.add("leave-reason", "USER_ENTRY");
    element_REASON.innerText = reason;

    const element_DATE = document.createElement("div");
    element_DATE.classList.add("leave-date", "USER_ENTRY");
    element_DATE.innerText = date;

    const element_TIME_OF_DAY = document.createElement("div");
    element_TIME_OF_DAY.classList.add("leave-time-of-day", "USER_ENTRY");
    element_TIME_OF_DAY.innerText = time_of_day;

    const deleteButton = document.createElement("div");
    deleteButton.classList.add("leave-delete-button");
    deleteButton.innerText = "X";
    
    // Store the array index on the delete button
    deleteButton.dataset.index = index;
    deleteButton.addEventListener("click", handleDeleteEvent);

    // Create wrapper and add all elements
    const wrapperDiv = document.createElement("div");
    wrapperDiv.classList.add("user-leave-entry");
    wrapperDiv.appendChild(element_SERIAL);
    wrapperDiv.appendChild(element_REASON);
    wrapperDiv.appendChild(element_DATE);
    wrapperDiv.appendChild(element_TIME_OF_DAY);
    wrapperDiv.appendChild(deleteButton);

    reasonContentElement.appendChild(wrapperDiv);
};

/**
 * Refresh all entries in the UI from the data array
 */
const refreshEntries = () => {
    reasonContentElement.innerHTML = "";
    
    // Update serial numbers to match array indices
    Meal_LeaveArray.forEach((entry, index) => {
        entry.serial_no = index + 1;
        createEntry(entry, index);
    });
    
    // Update local storage
    localStorage.setItem("MealLeave", JSON.stringify(Meal_LeaveArray));
    
    // Update counter to match highest serial number or 0 if empty
    mealLeaveCounter = Meal_LeaveArray.length > 0 ? 
        Math.max(...Meal_LeaveArray.map(entry => entry.serial_no)) : 0;
    localStorage.setItem("MEAL_LEAVE_COUNTER", mealLeaveCounter);
};

/**
 * Handle delete button click
 */
const handleDeleteEvent = (event) => {
    const indexToDelete = parseInt(event.target.dataset.index);
    
    // Remove from array
    Meal_LeaveArray.splice(indexToDelete, 1);
    
    // Refresh display
    refreshEntries();
};

/**
 * Create radio buttons for reasons
 */
const createRadioButtons = () => {
    // Check if container already exists to prevent duplicates
    if (document.getElementById("radio-button-container")) {
        return;
    }
    
    const radioButtonContainerElement = document.createElement("div");
    radioButtonContainerElement.id = "radio-button-container";
    
    // Create radio buttons for each reason
    for (let i = 0; i < radioContent.length; i++) {
        const reasonRadioElement = document.createElement("input");
        reasonRadioElement.type = "radio";
        reasonRadioElement.name = "leave-reason";
        reasonRadioElement.value = radioContent[i];
        reasonRadioElement.setAttribute("id", `radio-${i}`);

        const reasonRadioLabelElement = document.createElement("label");
        reasonRadioLabelElement.setAttribute("for", `radio-${i}`);
        reasonRadioLabelElement.innerText = radioContent[i];
        reasonRadioLabelElement.style.cssText = "margin-right: 5px";

        const reasonWrapperElement = document.createElement("div");
        reasonWrapperElement.classList.add("radio-wrapper");
        reasonWrapperElement.appendChild(reasonRadioLabelElement);
        reasonWrapperElement.appendChild(reasonRadioElement);
        
        radioButtonContainerElement.appendChild(reasonWrapperElement);
    }
    
    entryBoxElement.insertBefore(radioButtonContainerElement, leaveButtonsElement);
};

/**
 * Reset all data and UI
 */
const resetValues = () => {
    Meal_LeaveArray = [];
    mealLeaveCounter = 0;
    reasonContentElement.innerHTML = "";
    
    // Clear only relevant items from localStorage
    localStorage.removeItem("MealLeave");
    localStorage.removeItem("MEAL_LEAVE_COUNTER");
};

// Initialize by displaying existing entries
const initializeApp = () => {
    // Display existing entries
    Meal_LeaveArray.forEach((element, index) => {
        createEntry(element, index);
    });
    
    // Create radio buttons
    createRadioButtons();
};

// Submit button click handler
submitButtonElement.addEventListener("click", function() {
    const currentDate = calenderElement.value;
    const selectedTimeOfDay = document.querySelector("input[name='time-of-day']:checked")?.value;
    const reason = document.querySelector("input[name='leave-reason']:checked")?.value;
    
    // Validate inputs
    if (!currentDate || !selectedTimeOfDay || !reason) {
        alert("Fill the details correctly.");
        return;
    }
    
    // Increment counter
    mealLeaveCounter++;
    localStorage.setItem("MEAL_LEAVE_COUNTER", mealLeaveCounter);
    
    // Create new leave entry
    const newLeave = {
        serial_no: mealLeaveCounter,
        date: currentDate,
        reason: reason,
        time_of_day: selectedTimeOfDay
    };
    
    // Add to array and update storage
    Meal_LeaveArray.push(newLeave);
    localStorage.setItem("MealLeave", JSON.stringify(Meal_LeaveArray));
    
    // Add to UI
    createEntry(newLeave, Meal_LeaveArray.length - 1);
});

// Clear button click handler
clearButtonElement.addEventListener("click", function() {
    if(Meal_LeaveArray.length != 0) {
        let revalidateDeletion = confirm("Delete all Entries ??");
        if(revalidateDeletion) {
            resetValues();
        }
    } else {
        alert("No entries found to delete.");
    }
});

// Initialize the application
initializeApp();