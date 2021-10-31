import { store } from "quasar/wrappers";
import { createStore } from "vuex";
import userModule from "./user/index";
import appModule from "./app/index";
import chatModule from "./chats/index";

export default store(() => {
  return createStore({
    modules: {
      user: userModule,
      app: appModule,
      chats: chatModule
    },
    strict: process.env.DEBUGGING
  });
});
