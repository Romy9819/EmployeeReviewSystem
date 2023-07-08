import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import axios from 'axios';
import './Login.css'; 

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (event) => {
    event.preventDefault();
    // Perform login request
    axios.post('/login', { email, password })
      .then(response => {
        const { message, redirectTo } = response.data;
        console.log(message);
        navigate(redirectTo); // Redirect to the specified page
      })
      .catch(error => {
        console.error('Login error:', error);
      });
  };

  return (
    <div className="login-card"> {/* Add the login-card class */}
      <h1>Login Page</h1>
      <form onSubmit={handleLogin}>
        <label>
          Email:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <br />
        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <br />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
