import StorageService from "src/services/storage";

export default {
  SET_LOADING(state, val) {
    StorageService.saveState("loading", JSON.stringify(val));
    state.loading = val;
  }
};
