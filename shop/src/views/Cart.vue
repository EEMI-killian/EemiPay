<script setup lang="ts">
import Header from '@/components/Header.vue';
import Footer from '@/components/Footer.vue';
import { useCartStore } from '@/stores/cart';

const cart = useCartStore();


async function createTransaction() {
  const response = await fetch('http://localhost:3051/transaction/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      merchantId: "merchant-1534cb3a-01d9-4fa4-a52d-f0f721090345",
      externalRef: "user-random-random",
      currency: "GBP",
      amount: cart.totalPrice,
    })
  });

  if (!response.ok) {
    throw new Error('Failed to create transaction');
  }

  const data = await response.json();
  cart.clearCart();
  window.location.href = data.paymentUrl;
}


</script>

<template>
  <Header />
  <main>
    <h1 class="cart-title">My Cart</h1>
    <ul class="cart-items-list">
      <li v-for="(item, index) in cart.items" :key="index" class="cart-item-container">
        <img :src="item.imageUrl" alt="Product Image" class="cart-item-image"/>
        <div class="cart-item-details">
          <h3>{{ item.name }}</h3>
          <p class="price">{{ (item.price / 100).toFixed(2) }} GBP</p>
        </div>
        <button @click="cart.removeItem(item)" class="remove-btn">Remove</button>
      </li>
    </ul>
    
    <div class="cart-summary-container">
      <div class="cart-summary-card">
        <h2>Cart Summary</h2>
        <div class="cart-summary-item">
          <p class="price">Total : {{ (cart.totalPrice / 100).toFixed(2) }} GBP</p>
        </div>
        <div class="cart-summary-item">
          <button v-if="cart.items.length > 0" class="btn" @click="createTransaction()">
            Pay Now
          </button>
          <p v-else class="cart-empty-message">
            Cart is empty
          </p>
        </div>
      </div>
    </div>
  </main>
  <div class="footer-container">
  <Footer />
  </div>
</template>

<style scoped>
.cart-title {
  text-align: center;
  margin-top: 20px;
}

.cart-items-list {
  list-style-type: none;
  padding: 0;
  margin: 0 auto;
  max-width: 800px;
}

.cart-item-container {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  margin-bottom: 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
}

.cart-item-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
}

.cart-item-details {
  flex: 1;
}

.cart-item-details h3 {
  margin: 0 0 0.5rem 0;
}

.price {
  font-weight: bold;
  color: #2c5aa0;
  margin: 0;
}

.remove-btn {
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}

.remove-btn:hover {
  background-color: #c82333;
}

.cart-summary-container {
  max-width: 400px;
  margin: 2rem auto;
}

.cart-summary-card {
  margin-top: 10px;
  padding: 1.5rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f8f9fa;
}

.cart-summary-card h2 {
  margin-top: 0;
  text-align: center;
}

.cart-summary-item {
  margin-bottom: 1rem;
  text-align: center;
}

.btn {
  background-color: #28a745;
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1.1rem;
  width: 100%;
}

.btn:hover {
  background-color: #218838;
}

.cart-empty-message {
  color: #6c757d;
  font-style: italic;
  margin: 0;
}

.footer-container{
  position: sticky;
  bottom: 0;
  left: 0;
  right: 0;
}
</style>