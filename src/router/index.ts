import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import Layout from "@/view/layout/index.vue";

export const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Layout",
    component: Layout,
    redirect: "/home",
    meta: {
      title: "首页",
    },
    children: [
      {
        path: "/home",
        name: "Home",
        component: () => import("@/view/Home.vue"),
      },
    ],
  },
  {
    path: "/Login",
    name: "login",
    component: () => import("@/view/Login.vue"),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
