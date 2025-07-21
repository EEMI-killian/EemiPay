<script setup lang="ts">
import { ref } from 'vue'

const cardNumber = ref('')
const expiryDate = ref('')
const cvv = ref('')
const cardHolderName = ref('')

async function pay() {
  const transactionId = new URLSearchParams(window.location.search).get('transactionId')

  try {
    const response = await fetch(`http://localhost:3051/transaction/capture/${transactionId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        cardNumber: cardNumber.value,
        expiryDate: expiryDate.value,
        cvv: cvv.value,
        cardHolderName: cardHolderName.value,
      })
    })
    if (!response.ok) {
      console.error(response)
    } else {
      window.location.href = 'http://localhost:5173/success'
    }
  } catch (error) {
    console.error(error)
  }
}
</script>

<template>
  <div>
    <h1>Payment Form</h1>
    <form @submit.prevent="pay()">
      <input type="text" v-model="cardNumber" placeholder="Card Number" />
      <input type="text" v-model="expiryDate" placeholder="Expiry Date (MM/YY)" />
      <input type="text" v-model="cvv" placeholder="CVV" />
      <input type="text" v-model="cardHolderName" placeholder="Card Holder Name" />
      <button type="submit">Pay Now</button>
    </form>
  </div>
</template>
