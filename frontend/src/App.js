import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Transactions from './components/Transaction'; // Assuming this component exists
import PrivateRoute from './components/PrivateRoute'; // Path to your PrivateRoute component
import Report from './components/Reports'; // Import the new Report component
import Profile from './components/Profile'; // Import the new Profile component

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/transactions"
          element={<PrivateRoute component={Transactions} />}
        />
        <Route
          path="/report"
          element={<PrivateRoute component={Report} />} // Add Route for Report
        />
        <Route
          path="/profile"
          element={<PrivateRoute component={Profile} />} // Add Route for Profile
        />
      </Routes>
    </Router>
  );
};

export default App;
