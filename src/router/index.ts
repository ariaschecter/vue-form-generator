import { createRouter, createWebHistory } from "vue-router";
import HomePage from "@/views/HomePage.vue";
import StoreGeneratorPage from "@/views/StoreGeneratorPage.vue";
import TypeGeneratorPage from "@/views/TypeGeneratorPage.vue";
import TableGeneratorPage from "@/views/TableGeneratorPage.vue";
import TableGeneratorPageV2 from "@/views/TableGeneratorPageV2.vue";
import FormGeneratorPageV1 from "@/views/FormGeneratorPageV1.vue";
import SettingPage from "@/views/SettingPage.vue";

const routes = [
    { path: "/", name: "home", component: HomePage },
    { path: "/store", name: "store", component: StoreGeneratorPage },
    { path: "/type", name: "type", component: TypeGeneratorPage },
    { path: "/form-v2", name: "form-v2", component: FormGeneratorPageV1 },
    { path: "/table-v1", name: "table-v1", component: TableGeneratorPage },
    { path: "/table-v2", name: "table-v2", component: TableGeneratorPageV2 },
    { path: "/setting", name: "setting", component: SettingPage },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
