import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the SpendWise login page', () => {
  window.history.pushState({}, '', '/login');
  render(<App />);
  expect(screen.getByRole('heading', { name: /welcome back/i })).toBeInTheDocument();
  expect(screen.getByText(/log in to your spendwise account/i)).toBeInTheDocument();
});
