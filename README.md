# Student Finance Tracker

A financial management tool for students to track expenses, manage income, and visualize spending habits with a responsive interface.

## Quick Start

1. Clone the repository:
   ```bash
   git clone https://github.com/Alicia-Keza/Finance-Tracker.git
   ```
2. Open `index.html` in any modern web browser. 

## Key Features

- **Dashboard**: Summary of balance, total records, and top spending category.
- **Spending Trends**: Visual chart showing spending over the last 7 days.
- **Data Entry**: Dynamic categories for Income and Expense with real-time validation.
- **Record Management**: Live search, category filtering, and flexible sorting.
- **Customizable Preferences**: Dark/Light mode toggle, multi-currency support, and budget caps.
- **Data Portability**: Support for importing and exporting data as JSON files.

## Regex Catalog

| Field | Regex Pattern | Description |
| :--- | :--- | :--- |
| **Description** | `/^\S(?:.*\S)?$/` | Ensures field is non-empty and trimmed. |
| **Amount** | `/^(0\|[1-9]\d*)(\.\d{1,2})?$/` | Validates positive numbers (up to 2 decimals). |
| **Category** | `/^[A-Za-z]+(?:[ -][A-Za-z]+)*$/` | Alphabetical characters, spaces, and hyphens. |
| **Duplicates** | `/\b(\w+)\s+\1\b/i` | Detects repeated words in descriptions. |

## Keyboard and Accessibility

- **Semantic HTML**: Proper use of structure tags for screen readers.
- **ARIA Standards**: Real-time status updates and clear navigation labels.
- **Navigation**: Tab-based cycling with Enter/Space activation.
- **Contrast**: Meets standard accessibility contrast requirements in both modes.

## Testing

Open `tests.html` in your browser to run the validation test suite. This verifies regex logic for all input fields and common edge cases.

## Technologies Used

- HTML5 and CSS3
- Vanilla JavaScript
- LocalStorage API

---

**Developed by Keza Alicia**  
- **GitHub**: [Alicia-Keza](https://github.com/Alicia-Keza/Finance-Tracker)  
- **Email**: a.keza2@alustudent.com
