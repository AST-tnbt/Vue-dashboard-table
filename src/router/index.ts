import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router/auto';
import Home from '../pages/Home.vue';
import Import from '../pages/Import.vue';
import Export from '../pages/Export.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/import',
    name: 'Import',
    component: Import,
  },
  {
    path:'/export',
    name:'Export',
    component: Export,
  },

]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
