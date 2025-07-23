import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/Home.vue'
import LoginView from '@/views/Login.vue'
import Merchant from '@/views/Merchant.vue'
import Merchants from '@/views/Merchants.vue'
import Transactions from '@/views/Transactions.vue'
import Transaction from '@/views/Transaction.vue'
import Profil  from '@/views/Profil.vue'

const routes = [
  { path: '/', component: HomeView , meta: { requireAuth: true } },
  { path: '/login', component: LoginView , meta: { public : true } },
  { path: '/merchant/:id', component: Merchant , meta: { requireAuth: true } },
  { path: '/merchants', component: Merchants , meta: { requireAuth: true } },
  { path: '/transactions', component: Transactions , meta: { requireAuth: true } },
  { path: '/transaction/:id', component: Transaction , meta: { requireAuth: true } },
  { path: '/profil', component: Profil , meta: { requireAuth: true } }
]
const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem('token_eemiPay') 
  if (to.meta.requireAuth && !isAuthenticated) {
    next({ path: '/login' })
  } else {
    next()
  }
})


export default router
