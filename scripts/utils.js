import { loadSettings } from './storage.js';

const CURRENCIES = {
    'USD': { symbol: '$', rate: 1.0 },
    'EUR': { symbol: '€', rate: 0.85 },
    'GBP': { symbol: '£', rate: 0.73 },
    'RWF': { symbol: 'FRW', rate: 1000 },
    'CAD': { symbol: 'C$', rate: 1.25 },
    'JPY': { symbol: '¥', rate: 110 }
};

export function formatCurrency(amount) {
    const settings = loadSettings();
    const currencyCode = settings.currency || 'USD';
    const currency = CURRENCIES[currencyCode] || CURRENCIES['USD'];

    // Simple conversion (mock rates)
    const convertedAmount = amount * currency.rate;

    // Format
    // Use Intl.NumberFormat for better locality support if desired, or simple string
    const val = Math.abs(convertedAmount).toFixed(2);
    return (convertedAmount < 0 ? '-' : '') + currency.symbol + val;
}

export function generateId() {
    return '_' + Math.random().toString(36).substr(2, 9);
}

export function showNotification(message, type = 'info') {
    // Create toast container if not exists
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 10000;
        `;
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;

    // Inline styles for toast
    toast.style.cssText = `
        background: ${type === 'error' ? '#FF1744' : type === 'success' ? '#00C853' : '#2979FF'};
        color: white;
        padding: 12px 24px;
        margin-top: 10px;
        border-radius: 4px;
        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.3s, transform 0.3s;
    `;

    container.appendChild(toast);

    // Animate in
    requestAnimationFrame(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateY(0)';
    });

    // Remove after 5s
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(20px)';
        setTimeout(() => toast.remove(), 300);
    }, 5000);
}
