import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Register.css';  // Import the CSS file for styling

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState(''); // State for success message
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      await axios.post('https://localhost:7144/account/register', {
        username,
        password
      });
      setMessage('User registered successfully!'); // Set success message
      // Clear the form after successful registration
      setUsername('');
      setPassword('');
      // Redirect to login page after a brief delay (optional)
      setTimeout(() => navigate('/login'), 1500);
    } catch (error) {
      console.error('There was an error registering!', error);
      setMessage('Registration failed. Please try again.'); // Set error message if needed
    }
  };

  return (
    <div className="register-container">
      <h2>Register</h2>
      {message && <p>{message}</p>} {/* Display success or error message */}
      <form onSubmit={handleRegister}>
        <div className="form-group">
          <label>Username:</label>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button type="submit" className="btn-primary">Register</button>
      </form>
    </div>
  );
};

export default Register;
