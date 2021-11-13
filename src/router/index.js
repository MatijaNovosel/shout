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
    const user = firebase.auth().currentUser;
    if (to.matched.some((record) => record.meta.authRequired)) {
      if (user) {
        next();
      } else {
        next({
          name: ROUTE_NAMES.LOGIN
        });
      }
    } else {
      if (
        to.matched.some(
          (record) => record.name === ROUTE_NAMES.LOGIN || record.name === ROUTE_NAMES.REGISTER
        )
      ) {
        if (user) {
          next({
            name: ROUTE_NAMES.INDEX
          });
        } else {
          next();
        }
      } else {
        next();
      }
    }
  });

  return router;
});
