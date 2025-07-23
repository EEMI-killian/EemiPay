<script lang="ts" setup>
import type { Operation } from '@/types/operation';
import axios from 'axios';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
const route = useRoute();

const operations = ref<Operation[] | null>(null);
const errorMessage = ref('');
  async function getOperations() {
      try {
          const response : Operation[] = await axios.get(`http://localhost:3051/transaction/${ route.params.id }`, {
              headers: {
                  Authorization: `Bearer ${localStorage.getItem('token_eemiPay')}`
              }
          }).then(res => res.data);
          operations.value = response;
        console.log(response);
      } catch (error: any) {
          if (error.response) {
              errorMessage.value = error.message ;
          }
      }
  }
onMounted(() => {
    getOperations();
});
</script>

<template>
    <Header />
    <div>
        <h1>Détails de la Transaction</h1>
        <ul>
            <li v-for="op in operations" :key="op.id">
                <p>ID: {{ op.id }}</p>
                <p>Montant: {{ op.amount }}</p>
                <p>Date: {{ op.createdAt }}</p>
                <p>Statut: {{ op.status }}</p>
                <p>Méthode de Paiement: {{ op.customerPaymentMethodId }}</p>
                <p>Derniers Chiffres de la Carte: {{ op.lastFourDigits }}</p>
                <p>Type de Carte: {{ op.merchantIban }}</p>
            </li>
        </ul>
    </div>
    <Footer />
</template>