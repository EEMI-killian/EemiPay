<script setup lang="ts">
import { useCartStore } from '@/stores/cart';
const cart = useCartStore();
</script>

<template>
<header class="navbar_container">
    <nav class="navbar">
      <h1><RouterLink to="/" class="link">Test Shop</RouterLink></h1>
      <ul>
        <li><RouterLink to="/cart" class="link">Cart ({{ cart.items.length }})</RouterLink></li>
      </ul>
    </nav>
  </header>
</template>

<style scoped>

.navbar_container {
  position: relative;
  top: 0;
  left: 0;
  background-color: lightgray;
  color: white;
}

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
}

.link {
  color: black;
}
</style>