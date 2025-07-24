import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/Home.vue'
import LoginView from '../views/Login.vue'
import SignupView from '../views/SignupMerchant.vue'
import Transactions from '@/views/Transactions.vue'
import Transaction from '@/views/Transaction.vue'
import Profile from '@/views/Profile.vue'
import SignupUser from '@/views/SignupUser.vue'

const routes = [
  { path: '/', component: HomeView , meta: { requireAuth: true } },
  { path: '/login', component: LoginView , meta: { public: true } },
  { path: '/signup-merchant', component: SignupView , meta: {requireAuth: true } },
  { path: '/signup-user', component: SignupUser , meta: { public: true } },
  { path: '/transactions', component: Transactions , meta: { requireAuth: true } },
  { path: '/transaction/:id', component: Transaction , meta: { requireAuth: true } },
  { path: '/profile', component: Profile , meta: { requireAuth: true } },

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
