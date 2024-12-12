import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import logo from '../logo.png';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/transactions');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('https://wallet-wise-g6b2.vercel.app/api/auth/login', { username, password });
      localStorage.setItem('token', res.data.token);
      navigate('/transactions');
    } catch (error) {
      if (error.response) {
        if (error.response.status === 404) {
          setErrorMessage('User does not exist. Please register.');
        } else if (error.response.status === 401) {
          setErrorMessage('Incorrect password. Please try again.');
        } else {
          setErrorMessage('Login error. Please try again.');
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <img src={logo} alt="Logo" className="w-32 mb-4" />
      <h1 className="text-3xl font-semibold mb-4">Welcome to WalletWise!</h1>
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Login</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="border border-gray-300 rounded-lg p-2 mb-4 w-full"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="border border-gray-300 rounded-lg p-2 mb-4 w-full"
          />
          <button type="submit" className={`bg-blue-500 text-white rounded-lg p-2 w-full hover:bg-blue-600 transition duration-200 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        {errorMessage && <p className="text-red-500 mt-4">{errorMessage}</p>}
        <p className="mt-4 text-center">
          No account? <a href="/register" className="text-blue-500 hover:underline">Register here</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
