/**
 * Validators Module
 * Centralizes regex patterns and validation logic.
 */

// User-defined Regex
export const descriptionRegex = /^\S(?:.*\S)?$/; // Non-empty, trimmed
export const amountRegex = /^(0|[1-9]\d*)(\.\d{1,2})?$/;
export const categoryRegex = /^[A-Za-z]+(?:[ -][A-Za-z]+)*$/;
export const currencyRegex = /^\S(?:.*\S)?$/; // Added as requested, though usage TBD

// Advanced Regex for Duplicate Words (kept features as requested previously, or should I remove?)
// The user prompt only specified the 4 regexes above. 
// "remember to use rejex validation using the regex.test function andn use the following regexes..."
// I will keep duplicateWordRegex as a bonus or distinct check if it doesn't conflict, 
// but the user might be strictly defining the rules. 
// However, add.js imports `duplicateWordRegex` so I MUST export it or update add.js.
// I'll keep it for now to avoid breaking add.js import, but maybe make it lenient or standard.
export const duplicateWordRegex = /\b(\w+)\s+\1\b/i;

export const validateField = (input, regex, errorMsg, errorId) => {
    let isValid = true;
    const value = input.value;
    const errorElement = document.getElementById(errorId);

    // If regex is provided, test it
    if (regex && !regex.test(value)) {
        isValid = false;
    }

    // Special handling for date (if regex is null, check required)
    if (!regex && input.hasAttribute('required') && !value) {
        isValid = false;
    }

    if (!isValid) {
        input.classList.add('invalid');
        input.classList.remove('valid');
        if (errorElement) {
            errorElement.textContent = errorMsg;
            errorElement.classList.add('show');
        }
    } else {
        input.classList.remove('invalid');
        input.classList.add('valid');
        if (errorElement) {
            errorElement.classList.remove('show');
            errorElement.textContent = '';
        }
    }
    return isValid;
};
