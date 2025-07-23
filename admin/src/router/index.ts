import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/Home.vue'
import LoginView from '@/views/Login.vue'
import Merchant from '@/views/Merchant.vue'
import Merchants from '@/views/Merchants.vue'
import Transactions from '@/views/Transactions.vue'

const routes = [
  { path: '/', component: HomeView },
  { path: '/login', component: LoginView },
  { path: '/merchant/:id', component: Merchant },
  { path: '/merchants', component: Merchants },
  { path: '/transactions', component: Transactions }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
