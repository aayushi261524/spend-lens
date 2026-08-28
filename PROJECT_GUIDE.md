# Expense Tracker — Project Guide

This guide explains the project in simple, beginner-friendly language and can be used for a university demonstration or viva.

## 1. What Expense Tracker Does

Expense Tracker records personal income and expenses, calculates balances and monthly summaries, shows charts, tracks budgets, creates recurring templates, exports data, restores backups, and prints monthly reports.

## 2. Problem It Solves

People often forget where small expenses go. This project keeps a simple local history and converts transaction data into understandable totals, charts, category rankings, and budget progress.

## 3. Main Features

The main modules are Dashboard, Transactions, Analytics, Budget, Reports, and Settings. The project also includes theme switching, multiple currency display formats, CSV/JSON export, custom categories, demo data, and responsive mobile UI.

## 4. Technology Used

React handles the user interface and state-driven rendering. Vite provides the development/build environment. React Router switches between application pages. Recharts renders charts. Lucide React supplies icons. localStorage saves browser data.

## 5. Why React?

React makes it practical to split the application into reusable UI components. When transaction state changes, React automatically re-renders totals, lists, budgets, and charts that depend on the updated data.

## 6. Why Vite?

Vite gives a fast development server, simple project setup, hot module replacement, and an optimized production build with minimal configuration.

## 7. Why No Backend or Database Is Needed

The project requirement is frontend-only. The data volume is small enough for a portfolio/demo application, so browser localStorage is used instead of a server database.

## 8. What localStorage Is

`localStorage` is a browser API that stores string values under named keys. Data remains after a page refresh and after the browser is closed, until the user or browser clears it.

## 9. Limitations of localStorage

localStorage is browser-specific, not automatically synchronized, not a secure database for sensitive financial records, and has limited storage capacity. It also has no server-side authentication or backup.

## 10. Project Folder Structure

- `components/` — reusable UI blocks
- `context/` — shared application state and actions
- `data/` — default categories, currencies, and demo data
- `pages/` — route-level screens
- `utils/` — calculations, validation, storage, import/export helpers
- `styles.css` — global theme, responsive, and print styles

## 11. App.jsx Responsibility

`App.jsx` defines routes and mounts global UI such as the transaction modal, confirmation dialog, and toast notifications.

## 12. Main Component Responsibilities

`Layout.jsx` controls navigation and the header. `TransactionForm.jsx` validates and submits transaction data. `TransactionList.jsx` renders transactions. `Charts.jsx` contains financial chart components. `Feedback.jsx` contains custom toasts and confirmations.

## 13. Transaction Data Structure

A transaction contains an id, type, amount, category, title, note, date, paymentMethod, createdAt, and updatedAt. `type` is only `income` or `expense`, and amount must be a positive number.

## 14. How Income Is Added

The user opens the transaction form, selects Income, enters valid fields, and submits. `AppContext` creates a unique id and inserts the new transaction into state. React updates the UI, and a storage effect writes the new array to localStorage.

## 15. How Expenses Are Added

Expense creation follows the same flow as income but uses the expense category list. Expense totals and category charts automatically include the new transaction.

## 16. How Transactions Are Edited

Clicking Edit opens the same form with existing values. Saving maps through the transaction array and replaces only the matching id. The id remains unchanged, so a duplicate transaction is not created.

## 17. How Transactions Are Deleted

Delete opens a custom confirmation dialog. If confirmed, the matching transaction id is removed from state, then totals and charts recalculate.

## 18. Current Balance Formula

`Current Balance = All-Time Income − All-Time Expenses`.

The dashboard intentionally does not confuse current balance with only the selected month's result.

## 19. Monthly Income Calculation

Transactions are filtered by `YYYY-MM`. The amounts of transactions with `type === "income"` are added together.

## 20. Monthly Expense Calculation

After filtering by month, the amounts of transactions with `type === "expense"` are added together.

## 21. Savings Calculation

`Savings = Income − Expense` for the selected period.

## 22. Savings Rate

`Savings Rate = (Income − Expense) / Income × 100`.

If income is zero, the result is `N/A` to avoid invalid values such as `Infinity%` or `NaN%`.

## 23. Month-over-Month Comparison

The app compares the selected month with the previous month using:

`Change = (Current − Previous) / Previous × 100`

If the previous value is zero, the app displays “No comparison” rather than an infinite percentage.

## 24. Category Totals

Expense transactions are grouped by category. Each category amount is divided by total expense to calculate its percentage share.

## 25. Search Logic

The Transactions page converts the search text and searchable fields to lowercase. It checks title, category, note, and payment method with a case-insensitive `includes` comparison.

## 26. Filter Logic

Type, category, payment method, from-date, to-date, and search conditions are evaluated together. A transaction is shown only if it passes every active condition.

## 27. Budget System

The app stores an overall budget for each month. Spending is the selected month's total expenses. Remaining amount is `max(Budget − Spent, 0)`.

## 28. Category Budgets

Each month can also store separate budget values for Food, Transport, Entertainment, and other expense categories. Spending for each category is calculated from the same transaction data.

## 29. Chart Data Preparation

Utility functions group transaction values by month or category before Recharts receives the final arrays. Chart values are never manually hard-coded.

## 30. Income vs Expense Chart

Monthly grouped data contains separate `income` and `expense` totals. A bar chart compares them for multiple months.

## 31. Category Chart

Expense totals are grouped by category and passed to a donut chart. Only current selected-period transaction data is used.

## 32. Monthly Trend Chart

The trend chart groups dated transactions by month and draws income and expense lines across time.

## 33. Recurring Template System

A template stores type, amount, category, title, frequency, next due date, and optional payment method. Templates can be weekly, monthly, or yearly.

## 34. Why Recurring Transactions Are Not Automatic When the App Is Closed

A frontend-only browser application has no guaranteed background server process. Therefore the honest implementation checks due templates when the user opens the app and asks whether to add or skip the occurrence.

## 35. CSV Export

The application creates CSV text in memory, escapes quotes, prefixes UTF-8 BOM for compatibility, creates a `Blob`, creates a temporary object URL, and clicks a temporary download link.

## 36. JSON Backup

The backup contains data version, export time, transactions, categories, budgets, recurring templates, and settings.

## 37. Restore Process

The selected JSON file is parsed. The app checks that a transactions array exists and that each transaction has a valid id, type, and numeric amount before replacing state.

## 38. Print Report

The Reports page creates a report view. `@media print` hides navigation and application controls and formats the report for A4 printing. The browser's “Save as PDF” option creates the PDF without an external service.

## 39. Theme Logic

The theme is stored inside settings and also applied as `data-theme` on the root HTML element. CSS variables change surface, text, border, chart, positive, negative, and accent colors.

## 40. Currency Display

The project supports BDT, USD, EUR, GBP, and INR for formatting only. It does not perform currency conversion or call an exchange-rate API.

## 41. localStorage Keys

- `expenseTracker.transactions`
- `expenseTracker.categories`
- `expenseTracker.budgets`
- `expenseTracker.recurring`
- `expenseTracker.settings`
- `expenseTracker.theme`
- `expenseTracker.dataVersion`

## 42. Data Validation

A transaction must have a non-empty title, a positive finite number for amount, a valid transaction type, a category belonging to that type, and a machine-readable `YYYY-MM-DD` date.

## 43. Important React Hooks

- `useState` stores interactive state.
- `useEffect` synchronizes state to localStorage and handles global keyboard/theme side effects.
- `useMemo` avoids recalculating derived data unless its inputs change.
- `useCallback` keeps shared action functions stable.
- `useContext` exposes central app state and actions to components.

## 44. Responsive Design

Desktop uses a left sidebar and multi-column dashboard. Tablet reduces columns. Mobile uses a bottom navigation, floating add button, stacked cards, compact transaction cards, and a mobile sheet-style transaction form.

## 45. How to Add Another Category

Open Settings, enter a name under Expense Categories or Income Categories, and press Add. Custom categories persist in localStorage.

## 46. How to Change Default Currency

For a user, open Settings and choose a currency. For a developer, change `DEFAULT_SETTINGS.currency` in `src/data/defaults.js`.

## 47. How to Change Application Colors

Edit the CSS variables near the top of `src/styles.css`, especially `--accent`, `--positive`, `--negative`, `--bg`, and `--surface`. Separate values exist for dark mode.

## 48. How to Run the Project

```bash
npm install
npm run dev
```

Then open the local URL displayed by Vite.

## 49. How to Build the Project

```bash
npm run build
npm run preview
```

The production output is placed in `dist/`.

## 50. Common Errors and Solutions

**Port already in use:** close the other development server or let Vite choose another port.

**Old/broken local data:** use Settings → Reset All Data, or clear the project's localStorage keys in browser developer tools.

**Charts show no data:** add transactions or load the optional demo data.

**Print includes browser header/footer:** disable browser print headers/footers in the print dialog if a cleaner PDF is needed.

**Data disappeared:** check whether browser/site storage was cleared or a different browser/profile is being used.

## 51. Security and Privacy Limitations

This is not a banking system and must not claim production-grade financial security. localStorage can be accessed by JavaScript running on the same origin, so private or regulated financial records should use a secure authenticated backend in a production product.

## 52. Possible Future Backend Version

A future version could add authenticated accounts, a server API, PostgreSQL, encrypted secrets, cloud synchronization, background recurring jobs, audit logging, and secure multi-device backup.

# Viva Questions and Answers

## 1. What is localStorage?
A browser API for saving string data under key-value pairs that persist after page refresh.

## 2. Why did you not use a database?
The project is intentionally frontend-only, so localStorage provides enough persistence for a portfolio/demo use case.

## 3. How is current balance calculated?
All-time income minus all-time expenses.

## 4. How is monthly expense calculated?
Transactions are filtered by month, then expense amounts are summed.

## 5. How is monthly income calculated?
Transactions are filtered by month, then income amounts are summed.

## 6. What is the savings formula?
Income minus expense for the selected period.

## 7. What is the savings-rate formula?
`(Income - Expense) / Income × 100`.

## 8. What happens if income is zero?
The savings rate is shown as `N/A` to avoid division by zero.

## 9. How does filtering work?
The app evaluates search, type, category, payment, and date conditions together on the client side.

## 10. How do charts get their data?
Utility functions aggregate stored transactions by month or category, then pass the resulting arrays to Recharts.

## 11. Are chart values hard-coded?
No. Demo transactions are optional, but chart totals always come from current stored transaction data.

## 12. How does CSV export work?
The app builds CSV text, creates a Blob, creates a temporary object URL, and triggers a browser download.

## 13. How are commas and quotes handled in CSV?
Every cell is quoted and internal quote characters are doubled.

## 14. What happens after page refresh?
State initializes from localStorage, so saved data remains available.

## 15. What is useState?
A React hook for storing component or application state.

## 16. What is useEffect?
A React hook for running side effects such as saving state to localStorage or registering event listeners.

## 17. Why use useMemo?
It caches derived calculations until their dependencies change, which avoids unnecessary repeated work.

## 18. Why separate utility functions?
It prevents duplicated formulas, makes testing easier, and keeps UI components focused on rendering.

## 19. How do you prevent invalid amounts?
The form rejects empty, non-finite, zero, and negative values before saving.

## 20. How do you avoid duplicate transactions while editing?
Editing updates the existing transaction with the same id instead of inserting a new object.

## 21. How are categories managed?
Income and expense category lists are stored separately, and users can add, rename, or delete custom categories.

## 22. What happens if a used category is deleted?
Existing matching transactions are reassigned to `Other` before the category is removed.

## 23. How does the budget progress work?
`Spent / Budget × 100` is calculated from selected-month expenses.

## 24. Why are recurring transactions not created automatically in the background?
A frontend-only browser app has no reliable server scheduler while the app is closed.

## 25. How does JSON backup differ from CSV export?
CSV focuses on transaction rows; JSON also preserves categories, budgets, recurring templates, settings, and schema version.

## 26. What is the purpose of dataVersion?
It identifies the local schema version and makes future migrations or fallback handling possible.

## 27. What happens if localStorage JSON is malformed?
Safe parsing catches the error and returns a fallback value rather than crashing the application.

## 28. How is dark mode implemented?
A saved theme setting changes a `data-theme` attribute, and CSS variables provide separate dark-mode values.

## 29. Is changing currency a real conversion?
No. It changes display formatting only; no exchange-rate API is used.

## 30. What are the main limitations of this project?
No authentication, no cloud sync, no server backup, browser-specific data, limited storage, and no production-grade financial security.

## 31. Why is React Router used?
It gives clean separate pages for dashboard, transactions, analytics, budget, reports, and settings without requiring a backend.

## 32. How is the date stored?
Dates are stored as `YYYY-MM-DD`, which avoids accidental timezone shifts for date-only transaction records.

## 33. What accessibility features are included?
Semantic controls, visible focus styles, labels, aria-labels for icon buttons, custom dialogs, keyboard navigation, and text labels in addition to color states.

## 34. How is mobile UI different from desktop?
Mobile uses stacked content, bottom navigation, a floating add button, compact transaction cards, and a sheet-style transaction form.

## 35. Why is this suitable for a portfolio?
It demonstrates component architecture, persistent state, calculations, charts, responsive design, forms, validation, import/export, print styling, and honest frontend-only product constraints in one cohesive application.
