// This is the MAIN CONTROLLER of your app
// It manages which page to show (login vs home) and user authentication

import React, { useState, useEffect } from 'react';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import './styles/retro.css';

function App() {
  // STATE: stores current user info (null = not logged in)
  const [user, setUser] = useState(null);
  
  // STATE: tracks if app is checking for saved login
  const [loading, setLoading] = useState(true);

  // EFFECT: On app load, check if user was previously logged in
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser)); // Restore user from browser memory
    }
    setLoading(false); // Done checking
  }, []); // Empty array = run once on mount

  // FUNCTION: Save user to state and browser storage
  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  // FUNCTION: Remove user from state and storage
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  // Show loading screen while checking authentication
  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  // CONDITIONAL RENDERING: Show login page if no user, otherwise home page
  return (
    <div className="App">
      {!user ? (
        <LoginPage onLogin={handleLogin} />
      ) : (
        <HomePage user={user} onLogout={handleLogout} />
      )}
    </div>
  );
}

export default App;
