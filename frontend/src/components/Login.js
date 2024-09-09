import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../App.css'; // Import your CSS file for styling

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false); // New loading state
  const navigate = useNavigate();

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/transactions');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true when starting the request
    try {
      const res = await axios.post(
        'https://wallet-wise-g6b2.vercel.app/api/auth/login', // Correct backend URL
        { username, password },
        { headers: { 'Content-Type': 'application/json' } } // Ensure proper headers
      );
      
      localStorage.setItem('token', res.data.token);  // Store token in localStorage
      console.log('Token saved:', localStorage.getItem('token'));  // Check if token is saved
      navigate('/transactions');  // Redirect to transactions page
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setErrorMessage('User does not exist. Please register.');
      } else if (error.response && error.response.status === 401) {
        setErrorMessage('Incorrect password. Please try again.');
      } else {
        setErrorMessage('Login error. Please try again.');
      }
    }
    finally {
      setLoading(false);  // Set loading to false after the request completes
    }
  };

  return (
    <div className="container">
      <h1>Welcome to WalletWise!</h1>
      <div className="form">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="input-field"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="input-field"
          />
          <button type="submit" className="button1" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <p className="register-link">
          No account? <a href="/register">Register here</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
