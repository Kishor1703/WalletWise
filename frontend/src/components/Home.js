import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../logo.png';

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <img src={logo} alt="Logo" className="w-32 mb-4" />
      <h1 className="text-3xl font-semibold mb-6">Welcome to the Personal Finance Manager</h1>
      <div>
        <Link to="/login">
          <button className="bg-blue-500 text-white rounded-lg px-6 py-2 mx-2 hover:bg-blue-600 transition duration-200">Login</button>
        </Link>
        <Link to="/register">
          <button className="bg-green-500 text-white rounded-lg px-6 py-2 mx-2 hover:bg-green-600 transition duration=200">Register</button>
        </Link>
      </div>
    </div>
  );
};

export default Home;
