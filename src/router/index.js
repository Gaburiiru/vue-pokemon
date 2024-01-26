import Vue from "vue";
import VueRouter from "vue-router";
import { auth } from "@/firebase";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home",
    component: () => import(/* webpackChunkName: "home" */ "../views/Home.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/login",
    name: "login",
    component: () =>
      import(/* webpackChunkName: "login" */ "../views/Login.vue"),
  },
  {
    path: "/default",
    name: "default",
    component: () =>
      import(/* webpackChunkName: "default" */ "../views/Default.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/shop",
    name: "shop",
    component: () => import(/* webpackChunkName: "shop" */ "../views/Shop.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/game",
    name: "game",
    component: () => import(/* webpackChunkName: "game" */ "../views/Game.vue"),
    meta: { requiresAuth: true },
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  const user = auth.currentUser;
  // Verificar si la ruta es reconocida y requiere autenticación
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!user) {
      next({ path: "/Login" });
    } else {
      next();
    }
  } else {
    next();
  }
  // Verificar si la ruta no es reconocida y el usuario está autenticado
  if (!to.matched.length && user) {
    next({ name: "default" });
  }
});

export default router;
