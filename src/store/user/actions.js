export default {
  fetchUser({ commit }, user) {
    if (user) {
      commit("SET_USER", user);
    } else {
      commit("SET_USER", null);
    }
  },
  changePfp({ commit }, url) {
    commit("CHANGE_PFP", url);
  }
};
