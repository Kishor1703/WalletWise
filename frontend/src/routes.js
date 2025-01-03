import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Transactions from './components/Transactions';
import Login from './components/Login';
import Signup from './components/Signup';
import Reports from './components/Reports';
import Budget from './components/Budget';
import Notifications from './components/Notifications';

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Transactions />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/budget" element={<Budget />} />
        <Route path="/notifications" element={<Notifications />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
