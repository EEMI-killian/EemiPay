import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { Product } from '@/types/product'

export const useCartStore = defineStore('cartUser', () => {
  const items = ref<Product[]>([])

  function addItem(product: Product) {
    items.value.push(product)
  }

  function removeItem(product: Product) {
  const index = items.value.findIndex(item => item.id === product.id);
  if (index !== -1) {
    items.value.splice(index, 1);
  }
}

 function clearCart() {
    items.value = []
  }

  const itemCount = computed(() => items.value.length)


  const totalPrice = computed(() => {
    return items.value.reduce((total, item) => total + item.price, 0)
  })

  return { items, addItem, removeItem, clearCart, itemCount, totalPrice }
})
