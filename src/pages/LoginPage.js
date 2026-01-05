// PAGE COMPONENT: Handles user login and signup
// In real app, this would connect to your backend API

import React, { useState } from 'react';
import RetroWindow from '../components/RetroWindow';
import { login, signup } from '../utils/api';

function LoginPage({ onLogin }) {
  const [isSignup, setIsSignup] = useState(false); // Toggle between login/signup
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Handle input field changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload
    setError('');
    setLoading(true);

    try {
      let response;
      if (isSignup) {
        response = await signup(formData); // Call API signup function
      } else {
        response = await login({ 
          email: formData.email, 
          password: formData.password 
        });
      }

      // Success: save user and token
      onLogin({
        ...response.user,
        token: response.token
      });
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <RetroWindow title={isSignup ? 'Sign Up' : 'Login'}>
        <form onSubmit={handleSubmit} className="login-form">
          {isSignup && (
            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required={isSignup}
              />
            </div>
          )}

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength="6"
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Loading...' : (isSignup ? 'Sign Up' : 'Login')}
          </button>

          <p className="toggle-form">
            {isSignup ? 'Already have an account? ' : "Don't have an account? "}
            <span onClick={() => setIsSignup(!isSignup)}>
              {isSignup ? 'Login' : 'Sign Up'}
            </span>
          </p>
        </form>
      </RetroWindow>
    </div>
  );
}

export default LoginPage;
