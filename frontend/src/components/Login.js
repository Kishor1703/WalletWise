import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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
      const res = await axios.post('https://wallet-wise-g6b2.vercel.app/api/auth/login', { username, password });
      localStorage.setItem('token', res.data.token);  // Store token in localStorage
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
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg">
        <h1 className="text-4xl font-extrabold text-center text-gray-700 mb-6">Welcome to WalletWise!</h1>
        
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Login</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full p-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {errorMessage && (
          <p className="text-center text-red-500 mt-4">{errorMessage}</p>
        )}

        <div className="mt-6 text-center">
          <p className="text-gray-700">No account? 
            <a href="/register" className="text-blue-500 hover:underline"> Register here</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
