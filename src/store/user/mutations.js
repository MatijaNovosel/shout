import StorageService from "src/services/storage";

export default {
  SET_USER(state, data) {
    if (data) {
      StorageService.saveState("user", JSON.stringify({ ...data }));
      state.user = { ...data };
    } else {
      StorageService.removeSavedState("user");
      state.user = null;
    }
  }
};
