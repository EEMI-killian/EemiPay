<script setup lang="ts">
import axios from 'axios';
import { onMounted, ref } from 'vue';

const merchants = ref([]);
const errorMessage = ref('');
  async function getAllMerchant() {
      try {
          const response = await axios.get('http://localhost:3051/merchant', {
              headers: {
                  Authorization: `Bearer ${localStorage.getItem('token_eemiPay')}`
              }
          });
          console.log(response.data);
          merchants.value = response.data;
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
  <h1>Home</h1>
  <ul>
    <li v-for="merchant in merchants" :key="merchant.id">
      <router-link :to="`/merchant/${merchant.id}`">{{ merchant.id }}</router-link>
    </li>
  </ul>
  <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
</template>
