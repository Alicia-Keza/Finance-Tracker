document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.transaction-form');

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

    // Attach listeners
    const descInput = document.getElementById('desc');
    const amountInput = document.getElementById('amount');
    const categoryInput = document.getElementById('category');
    const dateInput = document.getElementById('date');

    const descMsg = "Invalid Description (alphanumeric and basic punctuation only).";
    const amountMsg = "Invalid Amount (must be greater than 0).";
    const categoryMsg = "Invalid Category format.";
    const dateMsg = "Date is required.";

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
