import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MyImage from '../assets/logo.png';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false); // New loading state
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true when starting the request
    try {
      // Mocked API request (replace with actual API call)
      const res = { data: { token: 'mockToken' } };
      localStorage.setItem('token', res.data.token); // Store token in localStorage
      navigate('/transactions'); // Redirect to transactions page
    } catch (error) {
      setErrorMessage('Login error. Please try again.');
    } finally {
      setLoading(false); // Set loading to false after the request completes
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-sm md:max-w-md bg-white p-8 rounded-xl shadow-lg">
        <div className="flex justify-center mb-6">
          <img
            src={MyImage}
            alt="WalletWise Logo"
            className="w-32 h-auto"
          />
        </div>
        <h1 className="text-xl md:text-2xl font-extrabold text-center text-gray-700 mb-4">
          Welcome to WalletWise!
        </h1>
        <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-6 text-center">
          Login
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full p-3 md:p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-3 md:p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full p-3 md:p-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        {errorMessage && (
          <p className="text-center text-red-500 mt-4">{errorMessage}</p>
        )}
        <div className="mt-6 text-center">
          <p className="text-gray-700">
            No account?{' '}
            <a href="/register" className="text-blue-500 hover:underline">
              Register here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
