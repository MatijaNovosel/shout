import { store } from "quasar/wrappers";
import { createStore } from "vuex";
import userModule from "./user/index";
import appModule from "./app/index";

export default store(() => {
  return createStore({
    modules: {
      user: userModule,
      app: appModule
    },
    strict: process.env.DEBUGGING
  });
});
