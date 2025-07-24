<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import axios from 'axios'

interface AnalyticsData {
  numberOfTransactions: number
  amountOfTransactions: number
  numberOfMerchants: number
  numberOfUsers: number
  numberOfOperations: number
}

const analyticsData = ref<AnalyticsData>({
  numberOfTransactions: 0,
  amountOfTransactions: 0,
  numberOfMerchants: 0,
  numberOfUsers: 0,
  numberOfOperations: 0,
})

const loading = ref(true)
const error = ref('')

const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('fr-FR').format(num)
}

const formatCurrency = (amount: number): string => {
  // Convertir les centimes en euros
  const amountInEuros = amount / 100
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(amountInEuros)
}
onMounted(() => {
  axios
    .get('http://localhost:3051/analytics', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token_eemiPay')}`,
      },
    })
    .then((response) => {
      console.log('Analytics response:', response.data)
      // Vérifier la structure de la réponse
      if (response.data && response.data.data) {
        analyticsData.value = response.data.data
      } else if (response.data) {
        // Si les données sont directement dans response.data
        analyticsData.value = response.data
      }
      loading.value = false
    })
})
</script>

<template>
  <Header />
  <div class="analytics-container">
    <h1 class="analytics-title">Tableau de Bord</h1>

    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Chargement des données...</p>
    </div>

    <div v-else-if="error" class="error-state">
      <p>{{ error }}</p>
    </div>

    <div v-else class="analytics-grid">
      <div class="stat-card transactions">
        <div class="stat-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 9h18m-9 9V9m-7 0V5a1 1 0 011-1h14a1 1 0 011 1v4" />
          </svg>
        </div>
        <div class="stat-content">
          <h3>Transactions</h3>
          <p class="stat-value">{{ formatNumber(analyticsData.numberOfTransactions) }}</p>
          <span class="stat-label">Total des transactions</span>
        </div>
      </div>

      <div class="stat-card amount">
        <div class="stat-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 100 7h5a3.5 3.5 0 110 7H6" />
          </svg>
        </div>
        <div class="stat-content">
          <h3>Montant Total</h3>
          <p class="stat-value">{{ formatCurrency(analyticsData.amountOfTransactions) }}</p>
          <span class="stat-label">Volume des transactions</span>
        </div>
      </div>

      <div class="stat-card merchants">
        <div class="stat-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path
              d="M3 21h18M3 7v1a3 3 0 006 0V7m0 1a3 3 0 006 0V7m0 1a3 3 0 006 0V7H3l2-4h14l2 4M5 21V10.85M19 21V10.85"
            />
          </svg>
        </div>
        <div class="stat-content">
          <h3>Marchands</h3>
          <p class="stat-value">{{ formatNumber(analyticsData.numberOfMerchants) }}</p>
          <span class="stat-label">Marchands actifs</span>
        </div>
      </div>

      <div class="stat-card users">
        <div class="stat-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path
              d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 7a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"
            />
          </svg>
        </div>
        <div class="stat-content">
          <h3>Utilisateurs</h3>
          <p class="stat-value">{{ formatNumber(analyticsData.numberOfUsers) }}</p>
          <span class="stat-label">Utilisateurs inscrits</span>
        </div>
      </div>

      <div class="stat-card operations">
        <div class="stat-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 20V10M6 20V4M18 20v-4" />
          </svg>
        </div>
        <div class="stat-content">
          <h3>Opérations</h3>
          <p class="stat-value">{{ formatNumber(analyticsData.numberOfOperations) }}</p>
          <span class="stat-label">Total des opérations</span>
        </div>
      </div>
    </div>
  </div>
  <Footer />
</template>

<style scoped>
.analytics-container {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.analytics-title {
  font-size: 2rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 2rem;
  letter-spacing: -0.02em;
}

.loading-state,
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  color: #666;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #f3f4f6;
  border-top: 3px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.analytics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

.stat-card {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow:
    0 1px 3px rgba(0, 0, 0, 0.1),
    0 1px 2px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  position: relative;
  overflow: hidden;
}

.stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  transition: opacity 0.3s ease;
  opacity: 0;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow:
    0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.stat-card:hover::before {
  opacity: 1;
}

.transactions::before {
  background: linear-gradient(90deg, #3b82f6, #60a5fa);
}
.amount::before {
  background: linear-gradient(90deg, #10b981, #34d399);
}
.merchants::before {
  background: linear-gradient(90deg, #f59e0b, #fbbf24);
}
.users::before {
  background: linear-gradient(90deg, #8b5cf6, #a78bfa);
}
.operations::before {
  background: linear-gradient(90deg, #ef4444, #f87171);
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-icon svg {
  width: 24px;
  height: 24px;
}

.transactions .stat-icon {
  background: #eff6ff;
  color: #3b82f6;
}

.amount .stat-icon {
  background: #f0fdf4;
  color: #10b981;
}

.merchants .stat-icon {
  background: #fffbeb;
  color: #f59e0b;
}

.users .stat-icon {
  background: #f5f3ff;
  color: #8b5cf6;
}

.operations .stat-icon {
  background: #fef2f2;
  color: #ef4444;
}

.stat-content {
  flex: 1;
}

.stat-content h3 {
  font-size: 0.875rem;
  font-weight: 500;
  color: #6b7280;
  margin: 0 0 0.5rem 0;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 0.25rem 0;
  line-height: 1.2;
  letter-spacing: -0.02em;
}

.stat-label {
  font-size: 0.75rem;
  color: #9ca3af;
  display: block;
}

@media (max-width: 768px) {
  .analytics-container {
    padding: 1rem;
  }

  .analytics-title {
    font-size: 1.5rem;
  }

  .analytics-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .stat-value {
    font-size: 1.5rem;
  }
}

@media (prefers-color-scheme: dark) {
  .analytics-container {
    background: #0f0f0f;
  }

  .analytics-title {
    color: #f5f5f5;
  }

  .stat-card {
    background: #1a1a1a;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  }

  .stat-content h3 {
    color: #9ca3af;
  }

  .stat-value {
    color: #f5f5f5;
  }

  .stat-label {
    color: #6b7280;
  }

  .transactions .stat-icon {
    background: #1e3a5f;
  }

  .amount .stat-icon {
    background: #14532d;
  }

  .merchants .stat-icon {
    background: #451a03;
  }

  .users .stat-icon {
    background: #2e1065;
  }

  .operations .stat-icon {
    background: #450a0a;
  }
}
</style>
