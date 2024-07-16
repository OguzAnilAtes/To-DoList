import React, { useState } from 'react';
import axios from 'axios';
import getUserCredentials from '../models/model';
import { useNavigate } from 'react-router-dom';
import './Login.css';  // Import the CSS file for styling

const Login = ({ setToken }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const credentials = getUserCredentials(username, password);
    try {
      const response = await axios.post('https://localhost:7144/account/login', credentials);
      console.log("response", response.data);
      const token  = response.data;
      localStorage.setItem('jwtToken', token);
      setToken(token);
      navigate('/notes');
    } catch (error) {
      console.error('Invalid login attempt:', error);
      alert('Invalid login attempt');
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Username:</label>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button type="submit" className="btn-primary">Login</button>
      </form>
      <button onClick={() => navigate('/register')} className="btn-secondary">Register</button>
    </div>
  );
};

export default Login;
