document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.querySelector('.records-table tbody');
    const sortSelect = document.getElementById('sort-select');
    const filterBtn = document.querySelector('.btn-filter');
    const searchInput = document.getElementById('search-input');

    function renderRecords(filterFn = null, sortFn = null) {
        let records = loadRecords();

        if (filterFn) {
            records = records.filter(filterFn);
        }

        if (sortFn) {
            records.sort(sortFn);
        } else {
            // Default sort by date desc
            records.sort((a, b) => new Date(b.date) - new Date(a.date));
        }

        tableBody.innerHTML = '';

        if (records.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="5" style="text-align: center;">No records found.</td></tr>';
            return;
        }

        records.forEach(record => {
            const row = document.createElement('tr');
            row.dataset.id = record.id;

            const amountClass = record.type === 'income' ? 'positive' : 'negative';
            const amountPrefix = record.type === 'income' ? '+' : '-';

            row.innerHTML = `
                <td data-label="Date" class="editable date-cell">${record.date}</td>
                <td data-label="Description" class="editable desc-cell">${record.description}</td>
                <td data-label="Category" class="editable cat-cell"><span class="badge ${record.category.toLowerCase()}">${record.category}</span></td>
                <td data-label="Amount" class="editable amount-cell ${amountClass}">${amountPrefix}$${record.amount.toFixed(2)}</td>
                <td data-label="Actions">
                    <button class="btn-icon edit" aria-label="Edit transaction">Edit</button>
                    <button class="btn-icon delete" aria-label="Delete transaction">Del</button>
                    <button class="btn-icon save" style="display:none;" aria-label="Save transaction">Save</button>
                    <button class="btn-icon cancel" style="display:none;" aria-label="Cancel edit">Cancel</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    }

    // Initial Render
    renderRecords();

    // Event Delegation for Edit/Delete
    tableBody.addEventListener('click', (e) => {
        const target = e.target;
        const row = target.closest('tr');
        if (!row) return;

        const id = row.dataset.id;

        if (target.classList.contains('delete')) {
            if (confirm('Are you sure you want to delete this record?')) {
                deleteRecord(id);
                renderRecords();
            }
        }

        if (target.classList.contains('edit')) {
            enterEditMode(row);
        }

        if (target.classList.contains('save')) {
            saveEdit(row, id);
        }

        if (target.classList.contains('cancel')) {
            renderRecords(); // Re-render to discard changes
        }
    });

    function enterEditMode(row) {
        const dateCell = row.querySelector('.date-cell');
        const descCell = row.querySelector('.desc-cell');
        const catCell = row.querySelector('.cat-cell');
        const amountCell = row.querySelector('.amount-cell');

        // Get current values
        const currentDate = dateCell.innerText;
        const currentDesc = descCell.innerText;
        const currentCat = catCell.innerText;
        // Amount needs parsing to remove +/$ and -/$
        const currentAmountRaw = amountCell.innerText.replace(/[^\d.]/g, ''); // keep digits and dot

        // Replace with inputs
        dateCell.innerHTML = `<input type="date" value="${currentDate}" class="edit-input date-input">`;
        descCell.innerHTML = `<input type="text" value="${currentDesc}" class="edit-input desc-input">`;

        // Category select
        catCell.innerHTML = `
            <select class="edit-input cat-input">
                <option value="food" ${currentCat === 'Food' ? 'selected' : ''}>Food</option>
                <option value="books" ${currentCat === 'Books' ? 'selected' : ''}>Books</option>
                <option value="transport" ${currentCat === 'Transport' ? 'selected' : ''}>Transport</option>
                <option value="entertainment" ${currentCat === 'Entertainment' ? 'selected' : ''}>Entertainment</option>
                <option value="fees" ${currentCat === 'Fees' ? 'selected' : ''}>Fees</option>
                <option value="other" ${currentCat === 'Other' ? 'selected' : ''}>Other</option>
                <option value="income" ${currentCat === 'Income' ? 'selected' : ''}>Income</option>
            </select>
        `;

        // Amount input
        amountCell.innerHTML = `<input type="number" value="${currentAmountRaw}" step="0.01" class="edit-input amount-input">`;

        // Toggle buttons
        row.querySelector('.edit').style.display = 'none';
        row.querySelector('.delete').style.display = 'none';
        row.querySelector('.save').style.display = 'inline-block';
        row.querySelector('.cancel').style.display = 'inline-block';
    }

    function saveEdit(row, id) {
        const newDate = row.querySelector('.date-input').value;
        const newDesc = row.querySelector('.desc-input').value;
        const newCat = row.querySelector('.cat-input').value;
        const newAmount = row.querySelector('.amount-input').value;

        // Validate
        let isValid = true;
        let errorMessage = "";

        if (!descriptionRegex.test(newDesc)) {
            isValid = false;
            errorMessage += "Description cannot be numbers only.\n";
        }
        if (!amountRegex.test(newAmount)) {
            isValid = false;
            errorMessage += "Invalid Amount.\n";
        }
        if (!categoryRegex.test(newCat)) {
            isValid = false;
            errorMessage += "Invalid Category.\n";
        }
        if (!newDate) {
            isValid = false;
            errorMessage += "Date is required.\n";
        }

        if (isValid) {
            // Update
            const updatedData = {
                date: newDate,
                description: newDesc,
                category: newCat,
                amount: parseFloat(newAmount),
                // Determine type based on category for simplicity or keep existing? 
                // If category is 'Income', type is 'income', else 'expense' usually.
                // For now let's just update type if category is income
                type: newCat.toLowerCase() === 'income' ? 'income' : 'expense'
            };

            updateRecord(id, updatedData);
            renderRecords();
            showNotification("Record updated successfully!", "success");
        } else {
            showNotification("Validation Failed:\n" + errorMessage, "error");
        }
    }

    // Filtering and sorting
    // We need to re-render whenever search, sort, or category filter changes.
    // Let's create a unified update function.
    const categorySelect = document.getElementById('category-filter');

    function updateView() {
        const sortValue = sortSelect.value;
        const searchTerm = searchInput.value.toLowerCase();
        const categoryValue = categorySelect.value;

        const filterFn = (record) => {
            const matchSearch = record.description.toLowerCase().includes(searchTerm) ||
                record.category.toLowerCase().includes(searchTerm);
            const matchCategory = categoryValue === 'all' || record.category.toLowerCase() === categoryValue.toLowerCase();

            return matchSearch && matchCategory;
        };

        const sortFn = (a, b) => {
            if (sortValue === 'date-desc') return new Date(b.date) - new Date(a.date);
            if (sortValue === 'date-asc') return new Date(a.date) - new Date(b.date);
            if (sortValue === 'amount-desc') return b.amount - a.amount;
            if (sortValue === 'amount-asc') return a.amount - b.amount;

            // New sort options
            if (sortValue === 'category-asc') return a.category.localeCompare(b.category);
            if (sortValue === 'category-desc') return b.category.localeCompare(a.category);

            return 0;
        };

        renderRecords(filterFn, sortFn);
    }

    // Event Listeners for Filters/Sort
    searchInput.addEventListener('input', updateView); // Live search
    sortSelect.addEventListener('change', updateView);
    categorySelect.addEventListener('change', updateView);
    if (filterBtn) filterBtn.style.display = 'none'; // Hide button as it's now live/reactive
});
