export default {
  setChats({ commit }, val) {
    commit("SET_CHATS", val);
  },
  updateChatAvatar({ commit }, val) {
    commit("UPDATE_CHAT_AVATAR", val);
  }
};
