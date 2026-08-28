export function validateTransaction(input, categories) {
  const errors = {};
  const amount = Number(input.amount);
  if (!String(input.title || '').trim()) errors.title = 'Title is required.';
  if (!Number.isFinite(amount) || amount <= 0) errors.amount = 'Enter an amount greater than 0.';
  if (!['income', 'expense'].includes(input.type)) errors.type = 'Choose income or expense.';
  if (!input.category || !categories.includes(input.category)) errors.category = 'Choose a valid category.';
  if (!/^\d{4}-\d{2}-\d{2}$/.test(input.date || '')) errors.date = 'Choose a valid date.';
  return errors;
}
