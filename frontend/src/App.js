import React from 'react';
import { BrowserRouter as Router, Route, Routes,} from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Transactions from './components/Transaction'; // Assuming you have this component

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/transactions" element={<Transactions />} />
      </Routes>
    </Router>
  );
};

export default App;
