export default {
  fetchUser({ commit }, user) {
    if (user) {
      commit("SET_USER", user);
    } else {
      commit("SET_USER", null);
    }
  },
  logOut({ commit }) {
    commit("LOG_OUT");
  }
};
