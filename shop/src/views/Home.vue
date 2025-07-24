<script setup lang="ts" >
import type { Product } from '@/types/product';
import { ref } from 'vue';
import { useCartStore } from '@/stores/cart';
import Header from '@/components/Header.vue';
import Footer from '@/components/Footer.vue';

const cart = useCartStore();

const products = ref<Product[]>([
  { id: 1, name: 'Black t-shirt', imageUrl: 'https://forever-vacation.com/cdn/shop/files/japane.jpg?v=1686849629&width=1100', price: 3999 },
  { id: 2, name: 'Black Hoodie', imageUrl: 'https://forever-vacation.com/cdn/shop/products/web-hoodie-black.jpg?v=1657504381&width=1946', price: 5999 },
  { id: 3, name: 'Black Tote Bag', imageUrl: 'https://forever-vacation.com/cdn/shop/products/mockup-web-totebag.jpg?v=1653928588&width=990', price: 1999 },
  { id: 4, name: 'Black Puffer Jacket', imageUrl: 'https://forever-vacation.com/cdn/shop/products/web-puffer-black.jpg?v=1657504334', price: 7499 },
  { id: 5, name: '4 Black Hats', imageUrl: 'https://forever-vacation.com/cdn/shop/products/bundle-beanie-web.jpg?v=1670793223', price: 1799 },
  { id: 6, name: 'Black Balaclava', imageUrl: 'https://forever-vacation.com/cdn/shop/products/Sanstitre-2.jpg?v=1670797574', price: 999 },

]);

function addToCart(product: Product) {
  cart.addItem(product);
  console.log(cart.totalPrice);
}

</script>
<template>
  <Header />
  <main>
  <ul class="products-list">
   <li v-for="product in products" :key="product.id" class="product-card-container">
      <div class="product-card">
        <div class="product-image-container">
          <img :src="product.imageUrl" :alt="product.name" class="product-image"/>
        </div>
        <ul class="product-details">
           <li>
            <h3>{{ product.name }}</h3>
          </li>
          <li>
            <p class="price">
              {{ (product.price / 100).toFixed(2) }} £GBP
            </p>
          </li>
         
        </ul>
        <button class="button-add-to-cart" @click="addToCart(product)">Add to cart</button>
      </div>
   </li>
  </ul>
  </main>
  <Footer/>
</template>
<style scoped>
.products-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  list-style-type: none;
  padding: 0;
}

.product-card-container {
  flex: 0 0 calc(33.333% - 1rem); 
  padding: 1rem; 
  box-sizing: border-box;

}

.product-card {
  border: 1px solid #ccc;
  padding: 1rem ;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;

}
.product-image-container {
  width: 100%;
  height: 0;
  padding-bottom: 100%; 
  position: relative;
}
.product-image {
  width: auto;
  height: 380px;
  max-width: 100%;
}

.product-details {
 display: flex;
  flex-direction: column;
  align-items: center;  
  list-style-type: none;
}

.button-add-to-cart {
  background-color: darkgray;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  cursor: pointer;
  margin-top: 1rem;
  transition: background-color 0.3s ease;
}

.button-add-to-cart:hover {
  background-color: #0056b3;
}

</style>
