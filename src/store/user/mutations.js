export default {
  SET_LOGGED_IN(state, value) {
    state.user.loggedIn = value;
  },
  SET_USER(state, data) {
    console.log(data);
    state.user.data = data;
  }
};
