import { createWebHistory, createRouter } from 'vue-router'
import Cancel from '@/views/Cancel.vue'
import Success from '@/views/Success.vue'
import Cart from '@/views/Cart.vue'
import Home from '@/views/Home.vue'




const routes = [
  { path: '/', component: Home },
  { path: '/cancel', component: Cancel },
  { path: '/cart', component: Cart },
  { path: '/success', component: Success },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router