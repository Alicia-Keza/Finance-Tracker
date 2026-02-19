const STORAGE_KEY = 'financeRecords';
const SETTINGS_KEY = 'financeSettings';

export function loadRecords() {
    const storedData = localStorage.getItem(STORAGE_KEY);
    return storedData ? JSON.parse(storedData) : [];
}

export function saveRecords(records) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

export function addRecord(record) {
    const records = loadRecords();
    records.push(record);
    saveRecords(records);
}

export function updateRecord(id, updatedData) {
    const records = loadRecords();
    const index = records.findIndex(r => r.id === id);
    if (index !== -1) {
        records[index] = { ...records[index], ...updatedData };
        saveRecords(records);
    }
}

export function deleteRecord(id) {
    const records = loadRecords();
    const newRecords = records.filter(r => r.id !== id);
    saveRecords(newRecords);
}

export function loadSettings() {
    const stored = localStorage.getItem(SETTINGS_KEY);
    return stored ? JSON.parse(stored) : { theme: 'dark', currency: 'USD', budgetCap: 1500 };
}

export function saveSettings(settings) {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}
