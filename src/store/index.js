import { store } from "quasar/wrappers";
import { createStore } from "vuex";

export default store(function () {
  const Store = createStore({
    modules: {},
    strict: process.env.DEBUGGING
  });
  return Store;
});
