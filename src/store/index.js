import { store } from "quasar/wrappers";
import { createStore } from "vuex";
import userModule from "./user/index";

export default store(() => {
  return createStore({
    modules: {
      user: userModule
    },
    strict: process.env.DEBUGGING
  });
});
