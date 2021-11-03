import { ROUTE_NAMES } from "./routeNames";
import MainLayout from "src/layouts/MainLayout.vue";
import Login from "src/pages/Login.vue";
import Register from "src/pages/Register.vue";
import Home from "src/pages/Home.vue";
import Index from "src/pages/Index.vue";
import PrivateChat from "src/pages/PrivateChat.vue";
import GroupChat from "src/pages/GroupChat.vue";
import Error404 from "src/pages/Error404.vue";

const routes = [
  {
    path: "/",
    component: MainLayout,
    children: [
      {
        path: "login",
        name: ROUTE_NAMES.LOGIN,
        component: Login
      },
      {
        path: "register",
        name: ROUTE_NAMES.REGISTER,
        component: Register
      },
      {
        path: "",
        name: ROUTE_NAMES.HOME,
        meta: {
          authRequired: true
        },
        component: Home,
        children: [
          {
            path: "",
            name: ROUTE_NAMES.INDEX,
            component: Index
          },
          {
            path: "private-chat/:id",
            name: ROUTE_NAMES.PRIVATE_CHAT,
            component: PrivateChat
          },
          {
            path: "group-chat/:id",
            name: ROUTE_NAMES.GROUP_CHAT,
            component: GroupChat
          },
          {
            path: "self-chat/:id",
            name: ROUTE_NAMES.SELF_CHAT,
            component: PrivateChat
          }
        ]
      }
    ]
  },
  {
    path: "/:catchAll(.*)*",
    component: Error404
  }
];

export default routes;
