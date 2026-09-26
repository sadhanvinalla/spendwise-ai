import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AppShell from './components/AppShell';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Budget from './pages/Budget';
import './App.css';


function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <AppShell>
                  <Dashboard />
                </AppShell>
              </ProtectedRoute>
            }
          />
          <Route
            path="/transactions"
            element={
              <ProtectedRoute>
                <AppShell>
                  <Transactions />
                </AppShell>
              </ProtectedRoute>
            }
          />
          <Route
            path="/budget"
            element={
              <ProtectedRoute>
                <AppShell>
                  <Budget />
                </AppShell>
              </ProtectedRoute>
            }
          />
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
