// LOCAL STORAGE UTILITY: Save/load data to browser's local storage
// Used as backup when offline or API fails

// SAVE: Store data in browser
export function saveToLocal(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error('Local storage save failed:', err);
  }
}

// LOAD: Retrieve data from browser
export function loadFromLocal(key) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (err) {
    console.error('Local storage load failed:', err);
    return null;
  }
}

// REMOVE: Delete data from browser
export function removeFromLocal(key) {
  try {
    localStorage.removeItem(key);
  } catch (err) {
    console.error('Local storage remove failed:', err);
  }
}

// CLEAR: Delete all app data from browser
export function clearLocal() {
  try {
    localStorage.clear();
  } catch (err) {
    console.error('Local storage clear failed:', err);
  }
}
