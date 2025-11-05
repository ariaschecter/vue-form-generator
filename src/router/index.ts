import { createRouter, createWebHistory } from "vue-router";
import HomePage from "@/views/HomePage.vue";
import StoreGeneratorPage from "@/views/StoreGeneratorPage.vue";
import TypeGeneratorPage from "@/views/TypeGeneratorPage.vue";

const routes = [
  { path: "/", name: "home", component: HomePage },
  { path: "/store", name: "store", component: StoreGeneratorPage },
  { path: "/type", name: "type", component: TypeGeneratorPage },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
