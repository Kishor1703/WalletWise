import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Transactions from './components/Transaction'; 
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/transactions" element={<Transactions />} />
      </Routes>
      <ToastContainer />
    </Router>
    
  );
};

export default App;
