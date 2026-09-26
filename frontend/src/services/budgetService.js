import api from './api';

export function getBudgetStatus(month) {
  return api.get('/budgets/status', { params: { month } }).then((res) => res.data);
}

export function setBudget(month, limitAmount) {
  return api.post('/budgets', { month, limitAmount }).then((res) => res.data);
}
