import {createRouter, createWebHistory} from "vue-router";

const routes = [
    {
        path: "/",
        name: "HomePage",
        component: () => import("@/pages/HomePage")
    },
    {
        path: "/user/:login",
        name: "UserPage",
        component: () => import("@/pages/UserPage")
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router;
