class StorageService {
  saveState(key, data) {
    sessionStorage.setItem(key, data);
  }

  getSavedState(key) {
    return sessionStorage.getItem(key);
  }

  removeSavedState(key) {
    sessionStorage.removeItem(key);
  }
}

export default new StorageService();
