export default {
  fetchUser({ commit }, user) {
    commit("SET_LOGGED_IN", user !== null);
    if (user) {
      commit("SET_USER", user);
    } else {
      commit("SET_USER", null);
    }
  }
};
