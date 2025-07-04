import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { useMealStore } from './store/mealStore';
import { useNotifications } from './hooks/useNotifications';
import { Layout } from './components/common/Layout';
import { AuthPage } from './pages/AuthPage';
import { Dashboard } from './pages/Dashboard';
import { AddMealForm } from './components/meals/AddMealForm';
import { Charts } from './components/analytics/Charts';
import { MealHistory } from './components/history/MealHistory';
import { Settings } from './components/settings/Settings';

function App() {
  const { isAuthenticated } = useAuthStore();
  const { initializeFoods } = useMealStore();
  
  useNotifications();

  useEffect(() => {
    initializeFoods();
  }, [initializeFoods]);

  if (!isAuthenticated) {
    return <AuthPage />;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="add-meal" element={<AddMealForm />} />
          <Route path="analytics" element={<Charts />} />
          <Route path="history" element={<MealHistory />} />
          <Route path="settings" element={<Settings />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;