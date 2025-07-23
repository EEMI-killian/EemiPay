<script setup lang="ts">
import Header from '@/components/Header.vue';
import Footer from '@/components/Footer.vue';
import { onMounted, ref } from 'vue';
import axios from 'axios';
import type { Merchant } from '@/types/merchant';
import { useRoute } from 'vue-router';
const route = useRoute()



const merchant = ref<Merchant | null>(null);
const errorMessage = ref('');
  async function getAllMerchant() {
      try {
          const response : Merchant = await axios.get(`http://localhost:3051/merchant/${ route.params.id }`, {
              headers: {
                  Authorization: `Bearer ${localStorage.getItem('token_eemiPay')}`
              }
          }).then(res => res.data);
          console.log(response);
          merchant.value = response;
      } catch (error: any) {
          if (error.response) {
              errorMessage.value = error.message ;
          }
      }
  }
onMounted(() => {
    getAllMerchant();
});

async function activateMerchant() {
    try {
        const response = await axios.post(`http://localhost:3051/merchant/${route.params.id}/activate`, {}, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token_eemiPay')}`
            }
        });
        console.log(response.data);
        await getAllMerchant();
    } catch (error: any) {
        errorMessage.value = error.message;
    }
}

</script>

<template>
    <Header />
        User {{ $route.params.id }}
        <ul>
        <li v-if="merchant">
            <p>ID: {{ merchant.id }}</p>
            <p>Name: {{ merchant.companyName }}</p>
            <p>Email: {{ merchant.contactEmail }}</p>
            <p>Phone: {{ merchant.contactPhone }}</p>
            <p>Address: {{ merchant.contactFirstName }}</p>
            <p>Redirect URL: {{ merchant.redirectUrlConfirm }}</p>
            <p>Created At: {{ merchant.createdAt }}</p>
            <p>Currency At: {{ merchant.currency }}</p>
            <p>Iban: {{ merchant.iban }}</p>
            <a :href="merchant.kbisUrl" target="_blank">Kbis </a>
        </li>
        <li v-if="merchant && !merchant.isActive">
            <button @click="activateMerchant">Activer</button>
        </li>
    
        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
        </ul>
    <Footer />
</template>  