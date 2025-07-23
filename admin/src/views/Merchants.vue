<script setup lang="ts">
import Header from '@/components/Header.vue';
import Footer from '@/components/Footer.vue';
import axios from 'axios';
import { onMounted, ref } from 'vue';
import type { Merchant } from '@/types/merchant';


const merchants = ref<Merchant[]>([]);
const errorMessage = ref('');
  async function getAllMerchant() {
      try {
          const response : Merchant[] = await axios.get('http://localhost:3051/merchant', {
              headers: {
                  Authorization: `Bearer ${localStorage.getItem('token_eemiPay')}`
              }
          }).then(res => res.data);
          console.log(response);
          merchants.value = response;
      } catch (error: any) {
          merchants.value = [];
          if (error.response) {
              errorMessage.value = error.message ;
          }
      }
  }


onMounted(() => {
    getAllMerchant();
});
</script>

<template>
    <Header />
  <div>
    <h1>Mes Marchands</h1>
        <ul>
      <li v-for="merchant in merchants" :key="merchant.id">
        <router-link :to="`/merchant/${merchant.id}`">{{ merchant.id }}</router-link>
      </li>
    </ul>
    <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
  </div>
  <Footer />
</template>
