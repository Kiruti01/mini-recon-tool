# 🧾 Mini Reconciliation Tool

A lightweight web application that helps operations and treasury teams reconcile financial transactions between internal systems and payment provider reports.

---

## 🚀 Live Demo

👉 [View Live App](https://your-deployment-link.com)  
_(Replace with your Netlify, Vercel, or GitHub Pages link)_

---

## 📦 Features

- Upload two CSV files:
  - **Internal System Export**
  - **Provider Statement**
- Reconcile transactions using `transaction_reference`
- Categorize transactions into:
  - ✅ Matched
  - ⚠️ Internal Only
  - ❌ Provider Only
- Detect mismatched `amount` or `status`
- Export each reconciliation result as CSV

---

## 📁 CSV Format Assumptions

Each CSV file is expected to have the following columns:

| Column                  | Type   | Description                                           |
| ----------------------- | ------ | ----------------------------------------------------- |
| `transaction_reference` | string | Unique transaction ID                                 |
| `amount`                | number | Amount of transaction                                 |
| `status`                | string | Status of the transaction (e.g., `success`, `failed`) |

---

## 🛠 How It Works

1. User uploads two CSVs via the UI.
2. The app parses both using `papaparse`.
3. Reconciliation is performed by matching `transaction_reference` across both datasets.
4. The output is categorized and rendered in three sections.
5. Users can export each result table to a CSV file via a single click.

---

## 🧪 Sample Reconciliation Logic

```js
if (internalRef === providerRef) {
  if (amount !== providerAmount || status !== providerStatus) {
    // Mark as Matched but with discrepancies
  }
} else {
  // Categorize as Internal Only or Provider Only
}

🛠 Tech Stack
Frontend: React

CSV Parsing: PapaParse

CSV Export: FileSaver.js

Styling: Inline CSS

🧱 Project Structure
bash
Copy
Edit
src/
├── App.jsx          # Main reconciliation logic + UI
├── index.js         # App entry point
├── ...              # Other CRA boilerplate
🚧 Future Improvements
Drag & drop CSV upload

Support Excel formats (.xlsx)

Save reconciliations in local storage or DB

Advanced mismatch filtering (e.g., by threshold)

Pagination for large files

📄 License
This project is for demonstration purposes as part of a technical assessment for Niobi Kenya Ltd.

## 👤 Author

**Michael Kiruti**
[GitHub](https://github.com/Kiruti01) • [LinkedIn](https://www.linkedin.com/in/michaelkiruti/)

```
