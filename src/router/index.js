import { route } from "quasar/wrappers";
import { createRouter, createWebHistory } from "vue-router";
import routes from "./routes";
import { ROUTE_NAMES } from "./routeNames";
import firebase from "firebase";

export default route(() => {
  const router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,
    history: createWebHistory()
  });

  router.beforeEach(async (to, from, next) => {
    if (to.matched.some(record => record.meta.authRequired)) {
      const user = await firebase.getCurrentUser();
      if (user) {
        next();
      } else {
        next({
          name: ROUTE_NAMES.LOGIN
        });
      }
    } else {
      next();
    }
  });

  return router;
});
