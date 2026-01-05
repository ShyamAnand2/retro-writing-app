// REUSABLE COMPONENT: Creates a retro Mac-style window wrapper
// Used to wrap content in that classic old-school computer look

import React from 'react';

function RetroWindow({ title, children, onClose }) {
  return (
    <div className="retro-window">
      {/* Title bar with classic 3 buttons */}
      <div className="window-header">
        <div className="window-buttons">
          <span className="btn-close" onClick={onClose}>●</span>
          <span className="btn-minimize">●</span>
          <span className="btn-maximize">●</span>
        </div>
        <div className="window-title">{title}</div>
      </div>
      
      {/* Main content area */}
      <div className="window-content">
        {children}
      </div>
    </div>
  );
}

export default RetroWindow;
