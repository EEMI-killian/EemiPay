<script setup lang="ts">
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import axios from 'axios'
import { onMounted, ref } from 'vue'
import type { Merchant } from '@/types/merchant'

const merchants = ref<Merchant[]>([])
const errorMessage = ref('')
async function getAllMerchant() {
  try {
    const response: Merchant[] = await axios
      .get('http://localhost:3051/merchant', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token_eemiPay')}`,
        },
      })
      .then((res) => res.data)
    merchants.value = response
  } catch (error: any) {
    merchants.value = []
    if (error.response) {
      errorMessage.value = error.message
    }
  }
}

onMounted(() => {
  getAllMerchant()
})
</script>

<template>
  <Header />
  <main class="merchants-container">
    <div class="merchants-content">
      <h1 class="title">Mes Marchands</h1>

      <ul class="merchant-list">
        <li v-for="merchant in merchants" :key="merchant.id" class="merchant-item">
          <router-link :to="`/merchant/${merchant.id}`" class="merchant-link">
            <ul class="merchant-details">
              <li class="merchant-items">{{ merchant.companyName }}</li>
              <li class="merchant-items">
                {{ new Date(merchant.createdAt).toLocaleDateString() }}
              </li>
              <li v-if="merchant.isActive" class="merchant-items-active">Actif</li>
              <li v-else class="merchant-items-inactive">Inactif</li>
            </ul>
          </router-link>
        </li>
      </ul>
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
    </div>
  </main>
  <Footer />
</template>

<style scoped>
.merchants-container {
  padding: 20px;
}
.merchants-content {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
}
.title {
  text-align: center;
  font-size: 24px;
  margin-bottom: 20px;
}

.merchant-link {
  text-decoration: none;
  color: black;
}
.merchant-details {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.merchant-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.merchant-items-active {
  border-radius: 10px;
  padding: 1rem 2rem;
  background-color: #d4edda;
  color: green;
}
.merchant-items-inactive {
  border-radius: 10px;
  padding: 1rem 2rem;
  background-color: #f8d7da;
  color: red;
}
.merchant-item {
  padding: 12px 16px;
  border-bottom: 1px solid #eee;
}
.merchant-item:hover {
  background-color: #f5f5f5;
}
.error-message {
  color: red;
}
</style>
