<script setup lang="ts">
import Header from '@/components/Header.vue';
import Footer from '@/components/Footer.vue';
import axios from 'axios';
import { onMounted, ref } from 'vue';
import type { Transaction } from '@/types/transaction';
const transactions = ref<Transaction[] | null>(null);
    const errorMessage = ref('');
      async function getAllTransactions() {
          try {
              const response : Transaction[] = await axios.get('http://localhost:3051/transaction', {
                  headers: {
                      Authorization: `Bearer ${localStorage.getItem('token_eemiPay')}`
                  }
              }).then(res => res.data);
              console.log(response);
              transactions.value = response;
          } catch (error: any) {
              transactions.value = [];
              if (error.response) {
                  errorMessage.value = error.message ;
              }
          }
      }

    const searchQuery = ref('');
    async function searchTransactions() {
        try {
            const response: Transaction[] = await axios.get(`http://localhost:3051/transaction/company/${searchQuery.value}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token_eemiPay')}`
                }
            }).then(res => res.data);
            console.log(response);
            transactions.value = response;
            errorMessage.value = '';
        } catch (error: any) {
            if (error.response) {
                errorMessage.value = error.message;
            }
            console.error( error);
            transactions.value = [];
        }
        
      
       
    }
    onMounted(() => {
        getAllTransactions();
    });
</script>

<template>
      <Header />
  <div>
    <h1>Mes Transactions</h1>
      <div>
        <input type="text" v-model="searchQuery" placeholder="Rechercher une transaction..." />
        <button @click="searchTransactions">Rechercher</button>
      </div>
        <ul>
      <li v-for="transaction in transactions" :key="transaction.id">
        <router-link :to="`/transaction/${transaction.id}`">{{ transaction.id }}</router-link>
        <p>Montant: {{ transaction.amount }}</p>
        <p>Date: {{ transaction.createdAt }}</p>
        <p>Statut: {{ transaction.currency }}</p>
      </li>
    </ul>
    <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
  </div>
  <Footer />
</template>
