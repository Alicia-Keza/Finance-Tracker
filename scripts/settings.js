
document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const themeToggle = document.getElementById('theme-toggle');
    const currencySelect = document.getElementById('currency');
    const budgetCapInput = document.getElementById('budget-cap');
    const exportBtn = document.querySelector('.btn-outline'); // Assuming first outline btn is Export based on HTML
    const importInput = document.querySelector('.file-upload input[type="file"]');
    const clearBtn = document.querySelector('.btn-danger');

    // Load current settings into UI
    loadCurrentSettings();

    // Event Listeners
    themeToggle.addEventListener('change', handleThemeChange);
    currencySelect.addEventListener('change', handleCurrencyChange);
    budgetCapInput.addEventListener('change', handleBudgetChange);

    // Export
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(btn => {
        if (btn.textContent.trim() === 'Export JSON') {
            btn.addEventListener('click', handleExport);
        }
        if (btn.textContent.trim() === 'Clear All Data') {
            btn.addEventListener('click', handleClearData);
        }
    });

    // Import
    importInput.addEventListener('change', handleImport);

    function loadCurrentSettings() {
        const settings = loadSettings(); // from app.js

        themeToggle.checked = settings.theme === 'dark';
        currencySelect.value = settings.currency;
        budgetCapInput.value = settings.budgetCap;
    }

    function handleThemeChange(e) {
        const settings = loadSettings();
        settings.theme = e.target.checked ? 'dark' : 'light';
        saveSettings(settings); // from app.js
        initTheme(); // Apply immediately
    }

    function handleCurrencyChange(e) {
        const settings = loadSettings();
        settings.currency = e.target.value;
        saveSettings(settings);
        showNotification('Currency updated.', 'success');
    }

    function handleBudgetChange(e) {
        const settings = loadSettings();
        settings.budgetCap = parseFloat(e.target.value);
        saveSettings(settings);
    }

    function handleExport() {
        const records = loadRecords(); // from app.js
        const dataStr = JSON.stringify(records, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `finance-data-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        showNotification('Data exported successfully!', 'success');
    }

    function handleImport(e) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function (event) {
            try {
                const importedRecords = JSON.parse(event.target.result);

                // Basic Validation: Check if array
                if (!Array.isArray(importedRecords)) {
                    throw new Error('Invalid format: Root must be an array.');
                }

              // Merge strategies:
                const currentRecords = loadRecords();
                const currentIds = new Set(currentRecords.map(r => r.id));

                let newCount = 0;
                importedRecords.forEach(record => {
                    // Basic record shape check
                    if (record.id && record.amount !== undefined && record.date) {
                        if (!currentIds.has(record.id)) {
                            currentRecords.push(record);
                            currentIds.add(record.id);
                            newCount++;
                        }
                    }
                });

                saveRecords(currentRecords);
                showNotification(`Imported ${newCount} new records.`, 'success');

                // Reset input
                e.target.value = '';
            } catch (err) {
                console.error(err);
                showNotification('Failed to import: ' + err.message, 'error');
            }
        };
        reader.readAsText(file);
    }

    function handleClearData() {
        if (confirm('Are you sure you want to clear ALL data? This cannot be undone.')) {
            localStorage.removeItem('financeRecords');
            showNotification('All data cleared.', 'error');
        }
    }
});
