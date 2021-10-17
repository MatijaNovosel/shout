import { route } from "quasar/wrappers";
import {
  createRouter,
  createMemoryHistory,
  createWebHistory,
  createWebHashHistory
} from "vue-router";
import routes from "./routes";

export default route(() => {
  let createHistory = null;

  if (process.env.SERVER) {
    createHistory = createMemoryHistory;
  } else {
    if (process.env.VUE_ROUTER_MODE === "history") {
      createHistory = createWebHistory;
    } else {
      createHistory = createWebHashHistory;
    }
  }

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,
    sensitive: true,
    history: createWebHistory()
  });

  return Router;
});
