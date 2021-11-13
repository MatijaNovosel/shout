import { store as StoreCallback } from "quasar/wrappers";
import { createStore } from "vuex";
import userModule from "./user/index";
import appModule from "./app/index";
import chatModule from "./chats/index";

const store = StoreCallback(() => {
  return createStore({
    modules: {
      user: userModule,
      app: appModule,
      chats: chatModule
    },
    strict: process.env.DEBUGGING
  });
});

export default store;
