import { route } from "quasar/wrappers";
import { createRouter, createWebHistory } from "vue-router";
import routes from "./routes";
import firebase from "firebase";
import { ROUTE_NAMES } from "./routeNames";

export default route(() => {
  const router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,
    history: createWebHistory()
  });

  router.beforeEach((to, from, next) => {
    if (to.matched.some((record) => record.meta.authRequired)) {
      console.log(firebase.auth().currentUser);
      if (firebase.auth().currentUser) {
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
