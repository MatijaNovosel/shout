import { ROUTE_NAMES } from "./routeNames";

const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("src/pages/Index.vue") },
      {
        path: "private-chat/:id",
        name: ROUTE_NAMES.PRIVATE_CHAT,
        component: () => import("src/pages/PrivateChat.vue")
      },
      {
        path: "group-chat/:id",
        name: ROUTE_NAMES.GROUP_CHAT,
        component: () => import("src/pages/PrivateChat.vue")
      },
      {
        path: "self-chat/:id",
        name: ROUTE_NAMES.SELF_CHAT,
        component: () => import("src/pages/PrivateChat.vue")
      }
    ]
  },
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/Error404.vue")
  }
];

export default routes;
