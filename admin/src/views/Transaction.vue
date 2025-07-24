<script lang="ts" setup>
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import type { Transaction } from '@/types/transaction'
import axios from 'axios'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const transaction = ref<Transaction | null>(null)
const errorMessage = ref('')

async function getTransaction() {
  try {
    const response: Transaction = await axios
      .get(`http://localhost:3051/transaction/${route.params.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token_eemiPay')}`,
        },
      })
      .then((res) => res.data)
    console.log(response)
    transaction.value = response
  } catch (error: any) {
    if (error.response) {
      errorMessage.value = error.message
    }
  }
}

onMounted(() => {
  getTransaction()
})
</script>

<template>
  <Header />
  <main class="container">
    <div v-if="errorMessage" class="error-message">
      {{ errorMessage }}
    </div>

    <div v-else-if="transaction" class="content">
      <div class="transaction-header">
        <h1 class="page-title">Transaction Details</h1>
        <div class="transaction-id">
          ID: <span class="highlight">{{ transaction.id }}</span>
        </div>
      </div>

      <div class="info-card">
        <h2>Transaction Information</h2>
        <div class="info-grid">
          <div class="info-item">
            <span class="label">Amount:</span>
            <span class="value">{{ transaction.amount }} {{ transaction.currency }}</span>
          </div>
          <div class="info-item">
            <span class="label">Created:</span>
            <span class="value">{{ new Date(transaction.createdAt).toLocaleDateString() }}</span>
          </div>
          <div class="info-item">
            <span class="label">Reference:</span>
            <span class="value">{{ transaction.externalRef }}</span>
          </div>
        </div>
      </div>

      <div class="operations-section">
        <h2>Associated Operations</h2>
        <div
          v-if="transaction.operations && transaction.operations.length > 0"
          class="operations-list"
        >
          <div
            v-for="operation in transaction.operations"
            :key="operation.id"
            class="operation-card"
          >
            <div class="operation-header">
              <span class="operation-id">Operation #{{ operation.id }}</span>
              <span class="status-badge" :class="operation.status.toLowerCase()">
                {{ operation.status }}
              </span>
            </div>
            <div class="operation-details">
              <div class="detail-row">
                <span class="label">Amount:</span>
                <span class="value">{{ operation.amount }} {{ operation.currency }}</span>
              </div>
              <div class="detail-row">
                <span class="label">Type:</span>
                <span class="value">{{ operation.type }}</span>
              </div>
              <div class="detail-row">
                <span class="label">Date:</span>
                <span class="value">{{ new Date(operation.createdAt) }}</span>
              </div>
              <div class="detail-row" v-if="operation.lastFourDigits">
                <span class="label">Card ending:</span>
                <span class="value">**** {{ operation.lastFourDigits }}</span>
              </div>
              <div class="detail-row" v-if="operation.customerPaymentMethodId">
                <span class="label">Payment Method ID:</span>
                <span class="value">{{ operation.customerPaymentMethodId }}</span>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="no-operations">No operations found for this transaction.</div>
      </div>
    </div>

    <div v-else class="loading">Loading transaction details...</div>
  </main>
  <Footer />
</template>

<style scoped>
.container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem 1rem;
  min-height: calc(100vh - 120px);
}

.error-message {
  background-color: #fee;
  color: #c33;
  padding: 1rem;
  border-radius: 8px;
  text-align: center;
  margin-bottom: 2rem;
}

.loading {
  text-align: center;
  padding: 3rem;
  color: #666;
  font-size: 1.1rem;
}

.content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.transaction-header {
  text-align: center;
  padding: 2rem;
  background-color: lightgray;
  color: white;
  border-radius: 12px;
}

.page-title {
  margin: 0 0 1rem 0;
  font-size: 2rem;
  font-weight: 300;
}

.transaction-id {
  font-size: 1.1rem;
  opacity: 0.9;
}

.highlight {
  font-weight: bold;
  background-color: rgba(255, 255, 255, 0.2);
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
}

.info-card {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.info-card h2 {
  margin: 0 0 1.5rem 0;
  color: #333;
  font-size: 1.5rem;
  font-weight: 500;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.info-item {
  display: flex;
  justify-content: space-between;
  padding: 0.75rem;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.operations-section {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.operations-section h2 {
  margin: 0 0 1.5rem 0;
  color: #333;
  font-size: 1.5rem;
  font-weight: 500;
}

.operations-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.operation-card {
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 1.5rem;
  transition: box-shadow 0.3s ease;
}

.operation-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.operation-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #e9ecef;
}

.operation-id {
  font-weight: 600;
  color: #495057;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
  text-transform: uppercase;
}

.status-badge.completed {
  background-color: #d4edda;
  color: #155724;
}

.status-badge.pending {
  background-color: #fff3cd;
  color: #856404;
}

.status-badge.failed {
  background-color: #f8d7da;
  color: #721c24;
}

.operation-details {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  padding: 0.25rem 0;
}

.label {
  font-weight: 500;
  color: #6c757d;
}

.value {
  color: #495057;
}

.no-operations {
  text-align: center;
  padding: 3rem;
  color: #6c757d;
  font-style: italic;
}

@media (max-width: 768px) {
  .container {
    padding: 1rem;
  }

  .page-title {
    font-size: 1.5rem;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

  .operation-header {
    flex-direction: column;
    gap: 0.5rem;
    align-items: flex-start;
  }

  .detail-row {
    flex-direction: column;
    gap: 0.25rem;
  }
}
</style>
