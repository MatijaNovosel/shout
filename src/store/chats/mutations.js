import StorageService from "src/services/storage";

export default {
  SET_CHATS(state, val) {
    StorageService.saveState("chats", JSON.stringify(val));
    state.chats = val;
  },
  UPDATE_CHAT_AVATAR(state, { groupId, url }) {
    //
  }
};
