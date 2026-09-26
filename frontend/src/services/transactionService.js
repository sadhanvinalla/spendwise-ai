import api from './api';

export function listTransactions() {
  return api.get('/transactions').then((res) => res.data);
}

export function createTransaction(payload) {
  return api.post('/transactions', payload).then((res) => res.data);
}

export function updateTransaction(id, payload) {
  return api.put(`/transactions/${id}`, payload).then((res) => res.data);
}

export function deleteTransaction(id) {
  return api.delete(`/transactions/${id}`).then((res) => res.data);
}
