/**
 * Finance Tracker App Logic
 * Handles LocalStorage and Record Management
 */

// Regex Validation Constants
const descriptionRegex = /^(?!\d+$)[A-Za-z0-9 .,!?-]+$/;
const amountRegex = /^(0|[1-9]\d*)(\.\d{1,2})?$/;
const categoryRegex = /^[A-Za-z]+(?:[ -][A-Za-z]+)*$/;

// Storage Key
const STORAGE_KEY = 'financeRecords';

/**
 * Load records from LocalStorage
 * @returns {Array} List of record objects
 */
function loadRecords() {
    const storedData = localStorage.getItem(STORAGE_KEY);
    return storedData ? JSON.parse(storedData) : [];
}

/**
 * Save records to LocalStorage
 * @param {Array} records 
 */
function saveRecords(records) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

/**
 * Add a new record
 * @param {Object} record - { id, date, description, category, amount, type }
 */
function addRecord(record) {
    const records = loadRecords();
    records.push(record);
    saveRecords(records);
}

/**
 * Update an existing record
 * @param {string} id 
 * @param {Object} updatedData 
 */
function updateRecord(id, updatedData) {
    const records = loadRecords();
    const index = records.findIndex(r => r.id === id);
    if (index !== -1) {
        records[index] = { ...records[index], ...updatedData };
        saveRecords(records);
        return true;
    }
    return false;
}

/**
 * Delete a record
 * @param {string} id 
 */
function deleteRecord(id) {
    let records = loadRecords();
    records = records.filter(r => r.id !== id);
    saveRecords(records);
}

// Generate a unique ID
function generateId() {
    return '_' + Math.random().toString(36).substr(2, 9);
}

/**
 * Show a toast notification
 * @param {string} message 
 * @param {string} type - 'info', 'success', 'error'
 */
function showNotification(message, type = 'info') {
    // Create element
    const notification = document.createElement('div');
    notification.className = `notification-toast ${type}`;
    notification.textContent = message;

    // Append to body
    document.body.appendChild(notification);

    // Trigger animation
    requestAnimationFrame(() => {
        notification.classList.add('show');
    });

    // Remove after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        notification.addEventListener('transitionend', () => {
            notification.remove();
        });
    }, 3000);
}
