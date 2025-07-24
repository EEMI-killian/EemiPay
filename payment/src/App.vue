<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'

const cardNumber = ref('')
const expiryDate = ref('')
const cvv = ref('')
const cardHolderName = ref('')

async function pay() {
  const transactionId = new URLSearchParams(window.location.search).get('transactionId')

  try {
    console.log(
      {
        cardNumber: cardNumber.value,
        expiryDate: expiryDate.value,
        cvv: cvv.value,
        cardHolderName: cardHolderName.value,
      }
    )
    
    const paymentData = {
      cardNumber: cardNumber.value,
      expiryDate: expiryDate.value,
      cvv: cvv.value,
      cardHolderName: cardHolderName.value,
    }

    const response = await axios.post(
      `http://localhost:3051/transaction/capture/${transactionId}`, 
      paymentData,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
    
    window.location.href = 'http://localhost:5173/success'
    
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Payment error:', error.response?.data || error.message)
    } else {
      console.error('Unexpected error:', error)
    }
  }
}
</script>

<template>
  <main class="payment-container">
    <h1>Payment Form Powered by EemiPay</h1>
    <form @submit.prevent="pay()" class="payment-form">
      <input 
        type="text" 
        v-model="cardNumber" 
        placeholder="Card Number" 
        required
        class="form-input"
      />
      <input 
        type="text" 
        v-model="expiryDate" 
        placeholder="Expiry Date (MM/YY)" 
        required
        class="form-input"
      />
      <input 
        type="text" 
        v-model="cvv" 
        placeholder="CVV" 
        required
        class="form-input"
      />
      <input 
        type="text" 
        v-model="cardHolderName" 
        placeholder="Card Holder Name" 
        required
        class="form-input"
      />
      <button type="submit" class="btn">Pay Now</button>
    </form>
  </main>
</template>

<style scoped>
.payment-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 50px;
  padding: 20px;
}

h1 {
  text-align: center;
  color: #333;
  margin-bottom: 30px;
}

.payment-form {
  display: flex;
  flex-direction: column;
  max-width: 400px;
  width: 100%;
  gap: 15px;
  align-items: stretch;
}

.form-input {
  padding: 12px;
  border: 2px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  transition: border-color 0.3s;
}

.form-input:focus {
  outline: none;
  border-color: #007bff;
}

.btn {
  background-color: #28a745;
  color: white;
  border: none;
  padding: 15px;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  margin-top: 10px;
  transition: background-color 0.3s;
}

.btn:hover {
  background-color: #218838;
}
</style>