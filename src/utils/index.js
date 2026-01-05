// This is the ROOT file that connects React to your HTML
// It renders the entire app into the <div id="root"> in public/index.html

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // Global styles (optional)
import App from './App';

// Get the root DOM element from public/index.html
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the App component inside root
// StrictMode helps catch bugs during development
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
