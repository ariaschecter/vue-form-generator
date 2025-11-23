import { createRouter, createWebHistory } from "vue-router";
import HomePage from "@/views/HomePage.vue";
import StoreGeneratorPage from "@/views/StoreGeneratorPage.vue";
import TypeGeneratorPage from "@/views/TypeGeneratorPage.vue";
import TableGeneratorPage from "@/views/TableGeneratorPage.vue";
import FormGeneratorPageV2 from "@/views/FormGeneratorPageV2.vue";
import SettingPage from "@/views/SettingPage.vue";

const routes = [
    { path: "/", name: "home", component: HomePage },
    { path: "/store", name: "store", component: StoreGeneratorPage },
    { path: "/type", name: "type", component: TypeGeneratorPage },
    { path: "/form-v2", name: "form-v2", component: FormGeneratorPageV2 },
    { path: "/table", name: "form", component: TableGeneratorPage },
    { path: "/setting", name: "setting", component: SettingPage },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
