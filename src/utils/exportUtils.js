function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

const csvEscape = (value) => `"${String(value ?? '').replaceAll('"', '""')}"`;

export function exportCSV(transactions) {
  const header = ['Date', 'Type', 'Title', 'Category', 'Amount', 'Payment Method', 'Note'];
  const rows = transactions.map((tx) => [tx.date, tx.type, tx.title, tx.category, tx.amount, tx.paymentMethod, tx.note]);
  const csv = '\uFEFF' + [header, ...rows].map((row) => row.map(csvEscape).join(',')).join('\n');
  downloadBlob(new Blob([csv], { type: 'text/csv;charset=utf-8' }), `expense-tracker-${new Date().toISOString().slice(0, 10)}.csv`);
}

export function exportJSON(data) {
  downloadBlob(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }), `expense-tracker-backup-${new Date().toISOString().slice(0, 10)}.json`);
}

export function parseCSV(text) {
  const rows = [];
  let row = [], cell = '', quoted = false;
  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i];
    if (quoted) {
      if (ch === '"' && text[i + 1] === '"') { cell += '"'; i += 1; }
      else if (ch === '"') quoted = false;
      else cell += ch;
    } else if (ch === '"') quoted = true;
    else if (ch === ',') { row.push(cell); cell = ''; }
    else if (ch === '\n') { row.push(cell.replace(/\r$/, '')); rows.push(row); row = []; cell = ''; }
    else cell += ch;
  }
  row.push(cell.replace(/\r$/, ''));
  if (row.some((v) => v !== '')) rows.push(row);
  const [header, ...body] = rows;
  if (!header) return [];
  const keys = header.map((h) => h.replace(/^\uFEFF/, '').trim().toLowerCase());
  return body.map((values) => Object.fromEntries(keys.map((key, idx) => [key, values[idx] ?? ''])));
}
