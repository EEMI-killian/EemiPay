import { createMemoryHistory, createRouter } from 'vue-router'
import HomeView from '../views/Home.vue'
import LoginView from '../views/Login.vue'

const routes = [
  { path: '/', component: HomeView },
  { path: '/login', component: LoginView },
]

const router = createRouter({
  history: createMemoryHistory(),
  routes,
})

export default router
