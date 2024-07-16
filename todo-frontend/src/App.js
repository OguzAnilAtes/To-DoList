import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Notes from './components/Notes';
import Register from './components/Register';
import './App.css';


function App() {
  const [token, setToken] = useState(localStorage.getItem('jwtToken'));

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login setToken={setToken} />} />
        <Route path="/notes" element={<Notes token={token} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Login setToken={setToken} />} />
      </Routes>
    </Router>
  );
}

export default App;
