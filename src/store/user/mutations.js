export default {
  SET_USER(state, data) {
    state.user = data;
  },
  CHANGE_PFP(state, url) {
    state.user.avatarUrl = url;
  }
};
