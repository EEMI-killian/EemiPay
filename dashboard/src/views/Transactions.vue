<script setup lang="ts">
import Header from '@/components/Header.vue';
import Footer from '@/components/Footer.vue';
import { useUserStore } from '@/stores/SchemaUser';

const userStore = useUserStore();

const transactions = userStore.user?.merchant?.transactions || [];


function formatAmount(amount: number, currency: string) {
    return `${(amount / 100).toFixed(2)} ${currency}`;
}

</script>

<template>
    <Header />
    <main class="container">
        <div class="page-header">
            <h1 class="page-title">My Transactions</h1>
        </div>

        <div v-if="transactions.length === 0" class="empty-state">
            <div class="empty-icon">📄</div>
            <h3>No transactions found</h3>
        </div>

            <div class="transaction-list">
                <router-link 
                    v-for="transaction in transactions" 
                    :key="transaction.transactionId.toString()" 
                    :to="`/transaction/${transaction.transactionId}`" 
                    class="transaction-item"
                >
                    <div class="transaction-cell id-column">
                        <span class="transaction-id">#{{ transaction.transactionId }}</span>
                    </div>
                    <div class="transaction-cell amount-column">
                        <span class="amount">{{ formatAmount(transaction.amount, transaction.currency) }}</span>
                    </div>
                    <div class="transaction-cell currency-column">
                        <span class="currency-badge">{{ transaction.currency }}</span>
                    </div>
                    <div class="transaction-cell date-column">
                        <span class="date">{{ new Date(transaction.createdAt).toLocaleDateString() }}</span>
                    </div>
                </router-link>
            </div>
    </main>
    <Footer />
</template>

<style scoped>
.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem 1rem;
    min-height: calc(100vh - 120px);
}

.page-header {
    text-align: center;
    margin-bottom: 3rem;
}

.page-title {
    font-size: 2.5rem;
    font-weight: 300;
    color: #333;
    margin: 0 0 2rem 0;
}

.search-section {
    display: flex;
    justify-content: center;
}

.search-bar {
    display: flex;
    gap: 0.5rem;
    background: white;
    padding: 0.5rem;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.search-input {
    padding: 0.75rem 1rem;
    border: 2px solid #e9ecef;
    border-radius: 8px;
    font-size: 1rem;
    min-width: 300px;
    transition: border-color 0.3s;
}

.search-input:focus {
    outline: none;
    border-color: #999;
}

.search-btn {
    padding: 0.75rem 1.5rem;
    background-color: lightgray;
    color: #333;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 500;
    transition: background-color 0.3s;
}

.search-btn:hover {
    background-color: #999;
    color: white;
}

.reset-btn {
    padding: 0.75rem 1rem;
    background: #6c757d;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.3s;
}

.reset-btn:hover {
    background: #5a6268;
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
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    padding: 3rem;
    color: #666;
}

.spinner {
    width: 40px;
    height: 40px;
    border: 4px solid #f3f3f3;
    border-top: 4px solid lightgray;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

.transactions-section {
    background: white;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.table-header {
    display: grid;
    grid-template-columns: 1fr 1.5fr 1fr 1.5fr;
    background-color: lightgray;
    color: #333;
    font-weight: 600;
    font-size: 0.9rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.header-cell {
    padding: 1rem;
    text-align: left;
}

.transaction-list {
    display: flex;
    flex-direction: column;
}

.transaction-item {
    display: grid;
    grid-template-columns: 1fr 1.5fr 1fr 1.5fr;
    text-decoration: none;
    color: inherit;
    border-bottom: 1px solid #e9ecef;
    transition: all 0.3s ease;
}

.transaction-item:hover {
    background-color: #f8f9fa;
    transform: translateX(4px);
    box-shadow: 4px 0 8px rgba(0, 0, 0, 0.1);
}

.transaction-item:last-child {
    border-bottom: none;
}

.transaction-cell {
    padding: 1.25rem 1rem;
    display: flex;
    align-items: center;
}

.transaction-id {
    font-family: 'Courier New', monospace;
    font-weight: 600;
    color: #495057;
}

.amount {
    font-weight: 600;
    font-size: 1.1rem;
    color: #28a745;
}

.currency-badge {
    background-color: #e9ecef;
    color: #495057;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    font-size: 0.85rem;
    font-weight: 500;
}

.date {
    color: #6c757d;
    font-size: 0.9rem;
}

.empty-state {
    text-align: center;
    padding: 4rem 2rem;
    color: #6c757d;
}

.empty-icon {
    font-size: 4rem;
    margin-bottom: 1rem;
}

.empty-state h3 {
    margin: 0 0 1rem 0;
    color: #495057;
}

.empty-state p {
    margin: 0;
    font-size: 1.1rem;
}

@media (max-width: 768px) {
    .page-title {
        font-size: 2rem;
    }
    
    .search-input {
        min-width: 200px;
    }
    
    .search-bar {
        flex-direction: column;
        width: 100%;
        max-width: 400px;
    }
    
    .table-header,
    .transaction-item {
        grid-template-columns: 1fr;
        text-align: center;
    }
    
    .transaction-item {
        border: 1px solid #e9ecef;
        border-radius: 8px;
        margin-bottom: 1rem;
        padding: 1rem;
    }
    
    .transaction-cell {
        padding: 0.5rem;
        justify-content: center;
    }
    
    .header-cell {
        display: none;
    }
}
</style>
