
document.addEventListener('DOMContentLoaded', () => {
    // Ensure records are loaded
    const records = loadRecords();

    // Update Dashboard Stats
    updateDashboardStats(records);
});

/**
 * Main function to update all dashboard statistics
 * @param {Array} records 
 */
function updateDashboardStats(records) {
    const totalRecords = calculateTotalRecords(records);
    const totalAmount = calculateTotalAmount(records);
    const topCategory = calculateTopCategory(records);
    const trendData = calculateLast7DaysTrend(records);

    // Render Stats
    document.getElementById('total-records-display').textContent = totalRecords;
    document.getElementById('total-amount-display').textContent = formatCurrency(totalAmount);
    document.getElementById('top-category-display').textContent = topCategory;

    // Render Chart
    renderTrendChart(trendData);

    // Render Recent Activity
    renderRecentActivity(records);
}

/**
 * Calculate Total Records
 * @param {Array} records 
 * @returns {number}
 */
function calculateTotalRecords(records) {
    return records.length;
}

/**
 * Calculate Total Net Amount
 * @param {Array} records 
 * @returns {number}
 */
function calculateTotalAmount(records) {
    return records.reduce((total, record) => {
        if (record.type === 'income') {
            return total + record.amount;
        } else {
            return total - record.amount;
        }
    }, 0);
}

/**
 * Calculate Top Category
 * @param {Array} records 
 * @returns {string}
 */
function calculateTopCategory(records) {
    if (records.length === 0) return 'N/A';

    const categoryCounts = {};
    records.forEach(record => {
        const cat = record.category;
        categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
    });

    let topCat = '';
    let maxCount = 0;

    for (const [cat, count] of Object.entries(categoryCounts)) {
        if (count > maxCount) {
            maxCount = count;
            topCat = cat;
        }
    }

    return topCat;
}

/**
 * Calculate Last 7 Days Spending Trend
 * @param {Array} records 
 * @returns {Array} Array of objects { day, amount }
 */
function calculateLast7DaysTrend(records) {
    const trend = [];
    const today = new Date();

    // Create an array solely for the last 7 days
    for (let i = 6; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        const dateString = d.toISOString().split('T')[0];

        // Filter records for this day and sum expenses
        // Note: The requirement says "total spendings", so typically just expenses.
        // But "amount" usually implies net. Let's stick to "Spendings" (Expenses).
        const daySpendings = records
            .filter(r => r.date === dateString && r.type !== 'income')
            .reduce((sum, r) => sum + r.amount, 0);

        trend.push({
            day: d.toLocaleDateString('en-US', { weekday: 'short' }), // Mon, Tue...
            amount: daySpendings,
            fullDate: dateString
        });
    }
    return trend;
}

/**
 * Render the Trend Chart
 * @param {Array} trendData 
 */
function renderTrendChart(trendData) {
    const chartContainer = document.getElementById('trend-chart-container');
    if (!chartContainer) return;

    chartContainer.innerHTML = ''; // Clear existing

    // Find max value to scale the bars
    const maxAmount = Math.max(...trendData.map(d => d.amount));

    trendData.forEach(data => {
        // Calculate percentage height, default to minimal if 0 to show the bar exists
        let heightPercent = 0;
        if (maxAmount > 0) {
            heightPercent = (data.amount / maxAmount) * 100;
        }

        // HTML Structure for a bar
        const barHtml = `
            <div class="chart-bar-column">
                <div class="chart-bar-value">$${data.amount.toFixed(0)}</div>
                <div class="chart-bar-track-vertical">
                    <div class="chart-bar-fill-vertical" style="height: ${heightPercent}%;"></div>
                </div>
                <div class="chart-label-bottom">${data.day}</div>
            </div>
        `;

        chartContainer.insertAdjacentHTML('beforeend', barHtml);
    });
}

/**
 * Render Recent Activity
 * @param {Array} records 
 */
function renderRecentActivity(records) {
    const activityList = document.querySelector('.activity-list');
    if (!activityList) return;

    activityList.innerHTML = ''; // Clear current

    // Sort by date (newest first) and take top 5
    // Note: 'date' in records is 'YYYY-MM-DD'. If we had timestamps it would be better, 
    // but we'll stick to reverse order relative to input or simple date sort.
    // Assuming records appended chronologically, we can just reverse, but let's be safe and sort by date.
    // However, since there is no time, multiple records on same day might shuffle. 
    // Best effort: Date desc, then original index desc (stable sort workaround not needed if we trust Date).

    const recentRecords = [...records]
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5);

    if (recentRecords.length === 0) {
        activityList.innerHTML = '<li class="activity-item" style="justify-content:center; color:var(--text-secondary);">No recent activity</li>';
        return;
    }

    recentRecords.forEach(record => {
        const isIncome = record.type === 'income';
        const amountClass = isIncome ? 'positive' : 'negative';
        const amountPrefix = isIncome ? '+' : '-';

        // Format Date to "Today, [Time]" or "Yesterday" or "Date"
        // Since we don't store time, we'll just show the date nicely.
        const dateObj = new Date(record.date);
        const dateStr = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

        // Basic Icon mapping based on category
        const catLower = record.category.toLowerCase();

        const itemHtml = `
            <li class="activity-item">
                <div class="icon-box ${catLower}"></div>
                <div class="details">
                    <span class="title">${record.description}</span>
                    <span class="date">${dateStr}</span>
                </div>
                <span class="amount ${amountClass}">${amountPrefix}$${record.amount.toFixed(2)}</span>
            </li>
        `;

        activityList.insertAdjacentHTML('beforeend', itemHtml);
    });
}

/**
 * Helper to format currency
 * @param {number} amount 
 * @returns {string}
 */
function formatCurrency(amount) {
    return (amount < 0 ? '-' : '') + '$' + Math.abs(amount).toFixed(2);
}
