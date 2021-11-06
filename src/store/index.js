import { store } from "quasar/wrappers";
import { createStore } from "vuex";
import userModule from "./user/index";
import appModule from "./app/index";
import chatModule from "./chats/index";
import VuexPersistence from "vuex-persist";

export default store(() => {
  const vuexLocal = new VuexPersistence({
    storage: window.localStorage
  });

  return createStore({
    modules: {
      user: userModule,
      app: appModule,
      chats: chatModule
    },
    strict: process.env.DEBUGGING,
    plugins: [vuexLocal.plugin]
  });
});
