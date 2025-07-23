<script setup lang="ts">
import axios from 'axios';
import { onMounted, ref } from 'vue';

const transactions = ref([]);
const errorMessage = ref('');
  async function getAllTransaction() {
      try {
          const response = await axios.get('http://localhost:3051/documents', {
              headers: {
                  Authorization: `Bearer ${localStorage.getItem('token_eemiPay')}`
              }
          });
          transactions.value = response.data;
      } catch (error: any) {
          transactions.value = [];
          if (error.response) {
              errorMessage.value = error.message ;
          }
      }
  }


onMounted(() => {
    getAllTransaction();
});
</script>

<template>
  <h1>Home</h1>
  <ul>
    <li v-for="transaction in transactions" :key="transaction.id">
      <router-link :to="`/transaction/${transaction.id}`">{{ transaction.id }}</router-link>
    </li>
  </ul>
  <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
</template>
