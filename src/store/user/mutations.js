import StorageService from "src/services/storage";
import firebase from "firebase";

export default {
  SET_USER(state, data) {
    if (data) {
      StorageService.saveState("user", JSON.stringify({ ...data }));
      state.user = { ...data };
    } else {
      StorageService.removeSavedState("user");
      state.user = null;
    }
  },
  async LOG_OUT(state) {
    StorageService.removeSavedState("user");
    state.user = null;
    await firebase.auth().signOut();
  },
  RESPOND_TO_INVITE(state, inviteId) {
    state.user.invites = state.user.invites.filter((inv) => inv.id !== inviteId);
  }
};
