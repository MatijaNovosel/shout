import { ROUTE_NAMES } from "./routeNames";
import Index from "src/pages/Index.vue";
import PrivateChat from "src/pages/PrivateChat.vue";
import Error404 from "src/pages/Error404.vue";

const routes = [
  { path: "/", name: ROUTE_NAMES.INDEX, component: Index },
  {
    path: "/private-chat/:id",
    name: ROUTE_NAMES.PRIVATE_CHAT,
    component: PrivateChat
  },
  {
    path: "/group-chat/:id",
    name: ROUTE_NAMES.GROUP_CHAT,
    component: PrivateChat
  },
  {
    path: "/self-chat/:id",
    name: ROUTE_NAMES.SELF_CHAT,
    component: PrivateChat
  },
  {
    path: "/:catchAll(.*)*",
    component: Error404
  }
];

export default routes;
