import { createWebHistory, createRouter } from 'vue-router'
import Cancel from '@/views/Cancel.vue'
import Success from '@/views/Success.vue'
import Home from '@/Home.vue'




const routes = [
  { path: '/', component: Home },
  { path: '/cancel', component: Cancel },
  { path: '/success', component: Success },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router