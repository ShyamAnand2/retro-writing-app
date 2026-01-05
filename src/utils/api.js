// API UTILITY: All functions that communicate with the backend
// Centralizes API logic so components stay clean

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// HELPER: Generic fetch wrapper with error handling
async function apiCall(endpoint, options = {}) {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

// AUTH: User signup
export async function signup(userData) {
  return apiCall('/auth/signup', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
}

// AUTH: User login
export async function login(credentials) {
  return apiCall('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
}

// DOCUMENTS: Get all user documents
export async function getDocuments(token) {
  return apiCall('/documents', {
    headers: {
      Authorization: `Bearer ${token}`, // JWT token for authentication
    },
  });
}

// DOCUMENTS: Create new document
export async function createDocument(docData, token) {
  return apiCall('/documents', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(docData),
  });
}

// DOCUMENTS: Update existing document
export async function updateDocument(docId, updates, token) {
  return apiCall(`/documents/${docId}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updates),
  });
}

// DOCUMENTS: Delete document
export async function deleteDocument(docId, token) {
  return apiCall(`/documents/${docId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
