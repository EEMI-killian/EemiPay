<script setup lang="ts">
async function createTransaction() {
  const response = await fetch('http://localhost:3051/transaction/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      merchantId: "merchant-6a4c7285-cae4-4f3f-b096-218c8df62b7f",
      externalRef: "user-1234567890",
      currency: "GBP",
      amount: 100008
    })
  });

  if (!response.ok) {
    throw new Error('Failed to create transaction');
  }

  const data = await response.json();
  window.location.href = data.paymentUrl;
}
</script>
<template>
  <div>
    <h1>Cart</h1>
    <button @click="createTransaction()">
      Create Transaction
    </button>
  </div>
</template>