# Spend Lens

An open-source personal-finance demo adapted and deployed for Aayushi’s product portfolio.

## Attribution

Forked from [mrinamoto/expense-tracker-localstorage](https://github.com/mrinamoto/expense-tracker-localstorage), originally created by Mohammad Mrinmoy. Reused under the MIT licence; the original LICENSE is preserved.

## Changes in this adaptation

- Spend Lens branding and a visible attribution panel.
- INR as the initial display currency.
- UPI payment-method options and localised fictional demo records.
- Vercel deployment configuration for client-side routes.

Transaction management, budgets, analytics, CSV import/export, recurring templates, JSON backups, and reporting are functionality supplied by the upstream project. This adaptation does not claim those as original work.

## Run and deploy

Use Node.js, run `npm ci`, then `npm run dev`. Production build: `npm run build`; output: `dist`. Import this GitHub repository into Vercel using the Vite preset. No database, environment variables, or paid APIs are required.

## Data and limits

Records stay in the current browser’s localStorage. There is no bank connection, authentication, cloud backup, or cross-device sync. Clearing browser data removes records. Currency selection changes formatting, not exchange rates. Demo data is fictional. Recurring reminders run when the app is open.
