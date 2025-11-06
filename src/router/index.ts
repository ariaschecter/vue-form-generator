import { createRouter, createWebHistory } from "vue-router";
import HomePage from "@/views/HomePage.vue";
import StoreGeneratorPage from "@/views/StoreGeneratorPage.vue";
import TypeGeneratorPage from "@/views/TypeGeneratorPage.vue";
import FormGeneratorPage from "@/views/FormGeneratorPage.vue";
import FormMultiGenerator from "@/views/FormMultiGenerator.vue";

const routes = [
  { path: "/", name: "home", component: HomePage },
  { path: "/store", name: "store", component: StoreGeneratorPage },
  { path: "/type", name: "type", component: TypeGeneratorPage },
  { path: "/form", name: "form", component: FormGeneratorPage },
  { path: "/multi", name: "multi", component: FormMultiGenerator },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
