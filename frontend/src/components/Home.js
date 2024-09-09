import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../logo.png'; // Import the logo image

const Home = () => {
  return (
    <div style={styles.container}>
      <div style={styles.logoContainer}>
        <img src={logo} alt="Logo" style={styles.logo} />
      </div>
      <h1>Welcome to the Personal Finance Manager</h1>
      <div>
        <Link to="/login">
          <button style={styles.button}>Login</button>
        </Link>
        <Link to="/register">
          <button style={styles.button}>Register</button>
        </Link>
      </div>
    </div>
  );
};

// Add CSS styles here
const styles = {
  container: {
    textAlign: 'center',
    marginTop: '50px',
  },
  logoContainer: {
    marginBottom: '20px', // Adjust spacing below the logo
  },
  logo: {
    width: '150px', // Set logo size
    height: 'auto',
  },
  button: {
    margin: '10px',
    padding: '10px 20px',
    fontSize: '16px',
    cursor: 'pointer',
  },
};

export default Home;
