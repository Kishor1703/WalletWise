import React from 'react';
import { Link } from 'react-router-dom';
import MyImage from '../assets/logo.png'

const Home = () => {
  return (
    <div>
      <img src={MyImage} alt="Description of the image" style={{ width: '300px', height: 'auto' }} />
      <h1>Welcome to the Personal Finance Manager</h1>
      <div>
        <Link to="/login">
          <button>Login</button>
        </Link>
        <Link to="/register">
          <button>Register</button>
        </Link>
      </div>
    </div>
  );
};

export default Home;
