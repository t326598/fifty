import HomePage from "@/components/HomePage.vue";
import MemberDetail from "@/components/MemberDetail.vue";
import { createRouter, createWebHistory } from "vue-router";

const routes = [
    { path: '/', name: 'HomePage', component:HomePage},
    { path: '/member/:id', name: 'MemberDetail', component: MemberDetail,  props: true  }
]

const router = createRouter({
    history: createWebHistory(),
    routes
  })
  
  export default router  