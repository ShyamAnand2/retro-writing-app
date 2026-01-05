// COMPONENT: Shows list of all documents in sidebar
// Allows creating new docs, selecting docs, and deleting them

import React from 'react';

function DocumentList({ documents, activeDocId, onSelect, onCreate, onDelete }) {
  return (
    <div className="document-list">
      <div className="list-header">
        <h3>My Documents</h3>
        <button onClick={onCreate} className="btn-new-doc">+ New</button>
      </div>

      <div className="doc-items">
        {documents.length === 0 ? (
          <p className="empty-state">No documents yet. Create one!</p>
        ) : (
          documents.map((doc) => (
            <div
              key={doc._id || doc.id} // Unique key for React list rendering
              className={`doc-item ${activeDocId === doc._id || activeDocId === doc.id ? 'active' : ''}`}
              onClick={() => onSelect(doc)}
            >
              <div className="doc-info">
                <h4>{doc.title || 'Untitled'}</h4>
                <span className="doc-date">
                  {new Date(doc.updatedAt).toLocaleDateString()}
                </span>
              </div>
              <button
                className="btn-delete"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent selecting doc when deleting
                  onDelete(doc._id || doc.id);
                }}
              >
                🗑️
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default DocumentList;
