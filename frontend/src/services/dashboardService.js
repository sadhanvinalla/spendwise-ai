import api from './api';

export function getDashboard(month) {
  return api.get('/dashboard', { params: { month } }).then((res) => res.data);
}
