// MAIN EDITOR COMPONENT: Uses react-quill for rich text editing
// Handles content changes and connects to custom toolbar

import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Toolbar from './Toolbar';
import '../styles/editor.css';

function Editor({ value, onChange }) {
  // CONFIGURATION: Tell Quill which toolbar to use and what formats to support
  const modules = {
    toolbar: {
      container: '#toolbar', // Use our custom Toolbar component
    },
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet',
    'align',
    'link',
  ];

  return (
    <div className="editor-container">
      {/* Custom toolbar rendered first */}
      <Toolbar />
      
      {/* Quill editor */}
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange} // Calls parent's function when text changes
        modules={modules}
        formats={formats}
        placeholder="Start writing your masterpiece..."
      />
    </div>
  );
}

export default Editor;
