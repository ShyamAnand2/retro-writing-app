// MAIN PAGE: Writing interface with editor and document management
// Coordinates all components and manages document state

import React, { useState, useEffect } from 'react';
import Editor from '../components/Editor';
import DocumentList from '../components/DocumentList';
import RetroWindow from '../components/RetroWindow';
import { getDocuments, createDocument, updateDocument, deleteDocument } from '../utils/api';
import { saveToLocal, loadFromLocal } from '../utils/storage';

function HomePage({ user, onLogout }) {
  const [documents, setDocuments] = useState([]);
  const [activeDoc, setActiveDoc] = useState(null);
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('Untitled Document');
  const [isSaving, setIsSaving] = useState(false);

  // EFFECT: Load documents when page mounts
  useEffect(() => {
    loadDocuments();
  }, []);

  // EFFECT: Auto-save document every 3 seconds when content changes
  useEffect(() => {
    if (!activeDoc) return;

    const timer = setTimeout(() => {
      saveDocument();
    }, 3000);

    return () => clearTimeout(timer); // Cleanup timer on unmount
  }, [content, title]); // Re-run when content or title changes

  // FUNCTION: Fetch all documents from backend
  const loadDocuments = async () => {
    try {
      const docs = await getDocuments(user.token);
      setDocuments(docs);
      
      // Load first document if available
      if (docs.length > 0) {
        selectDocument(docs[0]);
      }
    } catch (err) {
      console.error('Failed to load documents:', err);
      // Fallback to local storage
      const localDocs = loadFromLocal('documents') || [];
      setDocuments(localDocs);
    }
  };

  // FUNCTION: Create a new blank document
  const handleCreateDocument = async () => {
    try {
      const newDoc = await createDocument(
        { title: 'Untitled Document', content: '' },
        user.token
      );
      setDocuments([newDoc, ...documents]);
      selectDocument(newDoc);
    } catch (err) {
      console.error('Failed to create document:', err);
    }
  };

  // FUNCTION: Switch to a different document
  const selectDocument = (doc) => {
    setActiveDoc(doc);
    setContent(doc.content || '');
    setTitle(doc.title || 'Untitled Document');
  };

  // FUNCTION: Save current document to backend
  const saveDocument = async () => {
    if (!activeDoc) return;
    
    setIsSaving(true);
    try {
      const updated = await updateDocument(
        activeDoc._id || activeDoc.id,
        { title, content },
        user.token
      );
      
      // Update document in list
      setDocuments(docs =>
        docs.map(doc =>
          (doc._id || doc.id) === (activeDoc._id || activeDoc.id) ? updated : doc
        )
      );
      
      // Also save to local storage as backup
      saveToLocal('documents', documents);
    } catch (err) {
      console.error('Save failed:', err);
    } finally {
      setIsSaving(false);
    }
  };

  // FUNCTION: Delete a document
  const handleDeleteDocument = async (docId) => {
    if (!window.confirm('Delete this document?')) return;

    try {
      await deleteDocument(docId, user.token);
      const remaining = documents.filter(d => (d._id || d.id) !== docId);
      setDocuments(remaining);
      
      // If deleted active doc, select first remaining doc
      if ((activeDoc._id || activeDoc.id) === docId) {
        if (remaining.length > 0) {
          selectDocument(remaining[0]);
        } else {
          setActiveDoc(null);
          setContent('');
          setTitle('Untitled Document');
        }
      }
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  return (
    <div className="home-page">
      {/* Sidebar with document list */}
      <aside className="sidebar">
        <div className="user-info">
          <span>👤 {user.username || user.email}</span>
          <button onClick={onLogout} className="btn-logout">Logout</button>
        </div>
        
        <DocumentList
          documents={documents}
          activeDocId={activeDoc?._id || activeDoc?.id}
          onSelect={selectDocument}
          onCreate={handleCreateDocument}
          onDelete={handleDeleteDocument}
        />
      </aside>

      {/* Main editor area */}
      <main className="main-content">
        <RetroWindow title={title}>
          <div className="document-header">
            <input
              type="text"
              className="title-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Document title..."
            />
            <span className="save-indicator">
              {isSaving ? '💾 Saving...' : '✓ Saved'}
            </span>
          </div>
          
          <Editor value={content} onChange={setContent} />
        </RetroWindow>
      </main>
    </div>
  );
}

export default HomePage;
