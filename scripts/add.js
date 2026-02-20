document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.transaction-form');
    const typeSelect = document.getElementById('type');
    const categorySelect = document.getElementById('category');

    // Category Definitions
    const CATEGORIES = {
        expense: [
            { value: 'food', label: 'Food' },
            { value: 'books', label: 'Books' },
            { value: 'transport', label: 'Transport' },
            { value: 'entertainment', label: 'Entertainment' },
            { value: 'utilities', label: 'Utilities' },
            { value: 'other', label: 'Other' }
        ],
        income: [
            { value: 'salary', label: 'Salary' },
            { value: 'gift', label: 'Gift' },
            { value: 'investment', label: 'Investment' },
            { value: 'scholarship', label: 'Scholarship' },
            { value: 'other', label: 'Other Incomes' }
        ]
    };

    /**
     * Update category options based on type
     * @param {string} type - 'income' or 'expense'
     */
    const updateCategoryOptions = (type) => {
        const options = CATEGORIES[type] || [];
        categorySelect.innerHTML = '';

        options.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat.value;
            option.textContent = cat.label;
            categorySelect.appendChild(option);
        });

        // Trigger validation reset for category
        validateField(categorySelect, categoryRegex, categoryMsg, 'category-error');
    };

    // Real-time Validation Function
    const validateField = (input, regex, errorMsg, errorId) => {
        const errorElement = document.getElementById(errorId);
        const value = input.value;
        let isValid = true;

        if (regex && !regex.test(value)) {
            isValid = false;
        } else if (!regex && !value) {
            // For date/required checks without regex
            isValid = false;
        }

        if (!isValid) {
            input.classList.add('invalid');
            input.classList.remove('valid');
            errorElement.textContent = errorMsg;
            errorElement.classList.add('show');
        } else {
            input.classList.remove('invalid');
            input.classList.add('valid');
            errorElement.classList.remove('show');
        }
        return isValid;
    };

    // Input elements
    const descInput = document.getElementById('desc');
    const amountInput = document.getElementById('amount');
    const categoryInput = document.getElementById('category');
    const dateInput = document.getElementById('date');

    const descMsg = "Description cannot be numbers only (alphanumeric and basic punctuation).";
    const amountMsg = "Invalid Amount (must be greater than 0).";
    const categoryMsg = "Invalid Category format.";
    const dateMsg = "Date is required.";

    // Initial population
    updateCategoryOptions(typeSelect.value);

    // Type change listener
    typeSelect.addEventListener('change', () => {
        updateCategoryOptions(typeSelect.value);
    });

    // Description listeners
    descInput.addEventListener('input', () => validateField(descInput, descriptionRegex, descMsg, 'desc-error'));
    descInput.addEventListener('blur', () => validateField(descInput, descriptionRegex, descMsg, 'desc-error'));

    // Amount listeners
    amountInput.addEventListener('input', () => validateField(amountInput, amountRegex, amountMsg, 'amount-error'));
    amountInput.addEventListener('blur', () => validateField(amountInput, amountRegex, amountMsg, 'amount-error'));

    // Category listeners
    categoryInput.addEventListener('change', () => validateField(categoryInput, categoryRegex, categoryMsg, 'category-error'));

    // Date listeners
    dateInput.addEventListener('change', () => validateField(dateInput, null, dateMsg, 'date-error'));
    dateInput.addEventListener('blur', () => validateField(dateInput, null, dateMsg, 'date-error'));


    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Trigger validaton on all fields
        const isDescValid = validateField(descInput, descriptionRegex, descMsg, 'desc-error');
        const isAmountValid = validateField(amountInput, amountRegex, amountMsg, 'amount-error');
        const isCategoryValid = validateField(categoryInput, categoryRegex, categoryMsg, 'category-error');
        const isDateValid = validateField(dateInput, null, dateMsg, 'date-error');

        const type = document.getElementById('type').value;

        // Validation Setup
        const errorContainer = document.getElementById('error-container');
        errorContainer.textContent = '';
        errorContainer.style.display = 'none';

        if (isDescValid && isAmountValid && isCategoryValid && isDateValid) {
            const newRecord = {
                id: generateId(),
                date: dateInput.value,
                description: descInput.value,
                category: categoryInput.value,
                amount: parseFloat(amountInput.value),
                type: type
            };

            addRecord(newRecord);
            // Show success message
            window.location.href = "records.html";
        } else {
            errorContainer.textContent = "Please fix the errors highlighted above.";
            errorContainer.style.display = 'block';
            showNotification("Please fix the errors in the form.", "error");
            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });
});
