import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/auth';

// Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import TextbooksPage from './pages/TextbooksPage';
import ExplainPage from './pages/ExplainPage';
import SolvePage from './pages/SolvePage';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';

// Components
import Navigation from './components/Navigation';
import PrivateRoute from './components/PrivateRoute';

function App() {
  const { isAuthenticated } = useAuthStore();

  return (
    <Router>
      {isAuthenticated && <Navigation />}
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route
          path="/"
          element={
            <PrivateRoute>
              <DashboardPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/textbooks"
          element={
            <PrivateRoute>
              <TextbooksPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/explain"
          element={
            <PrivateRoute>
              <ExplainPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/solve"
          element={
            <PrivateRoute>
              <SolvePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <ProfilePage />
            </PrivateRoute>
          }
        />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;
