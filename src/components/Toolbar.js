// COMPONENT: Text formatting toolbar for the editor
// Provides buttons for bold, italic, headings, etc.

import React from 'react';

function Toolbar() {
  return (
    <div id="toolbar" className="toolbar">
      {/* Heading dropdown */}
      <select className="ql-header" defaultValue="">
        <option value="1">Heading 1</option>
        <option value="2">Heading 2</option>
        <option value="">Normal</option>
      </select>

      {/* Text formatting buttons */}
      <button className="ql-bold" title="Bold">B</button>
      <button className="ql-italic" title="Italic">I</button>
      <button className="ql-underline" title="Underline">U</button>
      <button className="ql-strike" title="Strikethrough">S</button>

      {/* Lists */}
      <button className="ql-list" value="ordered" title="Numbered List">1.</button>
      <button className="ql-list" value="bullet" title="Bullet List">•</button>

      {/* Alignment */}
      <button className="ql-align" value="" title="Align Left"></button>
      <button className="ql-align" value="center" title="Center"></button>
      <button className="ql-align" value="right" title="Align Right"></button>

      {/* Extras */}
      <button className="ql-link" title="Insert Link">🔗</button>
      <button className="ql-clean" title="Clear Formatting">✖</button>
    </div>
  );
}

export default Toolbar;
