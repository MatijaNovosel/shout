import { ROUTE_NAMES } from "./routeNames";

const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        name: ROUTE_NAMES.HOME,
        meta: {
          authRequired: true
        },
        component: () => import("src/pages/Home.vue"),
        children: [
          {
            path: "/",
            name: ROUTE_NAMES.INDEX,
            component: () => import("src/pages/Index.vue")
          },
          {
            path: "private-chat/:id",
            name: ROUTE_NAMES.PRIVATE_CHAT,
            component: () => import("src/pages/PrivateChat.vue")
          },
          {
            path: "group-chat/:id",
            name: ROUTE_NAMES.GROUP_CHAT,
            component: () => import("src/pages/GroupChat.vue")
          },
          {
            path: "self-chat/:id",
            name: ROUTE_NAMES.SELF_CHAT,
            component: () => import("src/pages/PrivateChat.vue")
          }
        ]
      }
    ]
  },
  {
    path: "/login",
    name: ROUTE_NAMES.LOGIN,
    component: () => import("pages/Login.vue")
  },
  {
    path: "/register",
    name: ROUTE_NAMES.REGISTER,
    component: () => import("pages/Register.vue")
  },
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/Error404.vue")
  }
];

export default routes;
