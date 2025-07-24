<script lang="ts" setup>
import axios from 'axios';
import { ref, onMounted, computed } from 'vue';
import { useUserStore } from '@/stores/SchemaUser';

interface ExchangeRates {
  base: string;
  rates: {
    [key: string]: number;
  };
  timestamp: Date;
}

const userStore = useUserStore();
const userData = computed(() => userStore.user);

const exchangeRates = ref<ExchangeRates | null>(null);
const loading = ref(true);
const error = ref<string | null>(null);

// Déterminer la devise de base de l'utilisateur
const userCurrency = computed(() => userData.value?.merchant?.currency || 'EUR');

// Obtenir le taux de conversion vers EUR (pour l'affichage)
const conversionRate = computed(() => {
  if (!exchangeRates.value) return null;
  
  // Si la devise de l'utilisateur est EUR, afficher USD et GBP
  if (userCurrency.value === 'EUR') {
    return {
      USD: exchangeRates.value.rates.USD,
      GBP: exchangeRates.value.rates.GBP
    };
  }
  
  // Si la devise est USD ou GBP, afficher EUR et l'autre devise
  const rates: { [key: string]: number } = {
    EUR: 1 / exchangeRates.value.rates[userCurrency.value]
  };
  
  if (userCurrency.value === 'USD') {
    rates.GBP = exchangeRates.value.rates.GBP / exchangeRates.value.rates.USD;
  } else if (userCurrency.value === 'GBP') {
    rates.USD = exchangeRates.value.rates.USD / exchangeRates.value.rates.GBP;
  }
  
  return rates;
});

async function fetchFromAPI(): Promise<ExchangeRates> {
  try {
    const response = await axios.get(
      'https://api.exchangerate-api.com/v4/latest/EUR'
    );
    
    return {
      base: 'EUR',
      rates: {
        GBP: response.data.rates.GBP,
        USD: response.data.rates.USD,
        EUR: 1
      },
      timestamp: new Date()
    };
  } catch (error) {
    console.error('Erreur lors de la récupération via API:', error);
    throw error;
  }
}

onMounted(async () => {
  try {
    loading.value = true;
    exchangeRates.value = await fetchFromAPI();
    error.value = null;
  } catch (err) {
    error.value = 'Impossible de récupérer les taux';
    console.error(err);
  } finally {
    loading.value = false;
  }
});

// Formatter le montant avec le bon symbole
const formatRate = (rate: number, currency: string): string => {
  const symbols: { [key: string]: string } = {
    EUR: '€',
    USD: '$',
    GBP: '£'
  };
  
  return `${symbols[currency] || currency} ${rate.toFixed(4)}`;
};
</script>

<template>
  <div class="currency-widget">
    <div class="currency-header">
      <div class="currency-icon">💱</div>
      <div class="base-currency">{{ userCurrency }}</div>
    </div>
    
    <div v-if="loading" class="currency-loading">
      <div class="spinner"></div>
    </div>
    
    <div v-else-if="error" class="currency-error">
      {{ error }}
    </div>
    
    <div v-else-if="conversionRate" class="currency-rates">
      <div v-for="(rate, currency) in conversionRate" :key="currency" class="rate-item">
        <span class="rate-currency">{{ currency }}</span>
        <span class="rate-value">{{ formatRate(rate, currency.toLocaleString()) }}</span>
      </div>
    </div>
    
    <div v-if="exchangeRates" class="update-time">
      {{ exchangeRates.timestamp.toLocaleTimeString() }}
    </div>
  </div>
</template>

<style scoped>
.currency-widget {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.currency-header {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
}

.currency-icon {
  font-size: 3rem;
  margin-right: 15px;
}

.base-currency {
  font-size: 2.5rem;
  font-weight: 700;
  color: #3498db;
}

.currency-loading {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.currency-error {
  color: #e74c3c;
  text-align: center;
  padding: 20px;
}

.currency-rates {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.rate-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 20px;
  background: #f8f9fa;
  border-radius: 8px;
  transition: background 0.2s;
}

.rate-item:hover {
  background: #e9ecef;
}

.rate-currency {
  font-weight: 600;
  color: #495057;
  font-size: 1.2rem;
}

.rate-value {
  font-family: 'Courier New', monospace;
  font-size: 1.3rem;
  color: #2c3e50;
  font-weight: 500;
}

.update-time {
  text-align: center;
  color: #7f8c8d;
  font-size: 0.85rem;
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid #ecf0f1;
}
</style>