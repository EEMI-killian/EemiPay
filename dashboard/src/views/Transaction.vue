<script lang="ts" setup>
import Header from '@/components/Header.vue';
import Footer from '@/components/Footer.vue';
import { useUserStore } from '@/stores/SchemaUser';
import { useRoute } from 'vue-router';
import { computed, onMounted, onUnmounted, ref } from 'vue';
import axios from 'axios';
import { getUserInfo } from '@/pool/pool';

const route = useRoute();
const userStore = useUserStore();
const pollingInterval = ref<number | null>(null);
const refundAmounts = ref<Record<string, number>>({});

const transaction = computed(() => {
    const transactionId = route.params.id as string;
    return userStore.user?.merchant?.transactions?.find(
        tx => tx.transactionId === transactionId
    ) || null;
});

async function updateUserData() {
    try {
        const userInfo = await getUserInfo();
        if (userInfo) {
            userStore.setUser(userInfo);
        }
    } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
    }
}

async function refundTransaction(operationId: string, amount: number) {
    if (!transaction.value) return;
    
    try {
        await axios.post(`http://localhost:3051/transaction/refund/${transaction.value.transactionId}`, {
            amountToRefund: amount,
        }, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token_eemiPay')}`
            }
        });

        refundAmounts.value[operationId] = 0;
        await updateUserData();
        
    } catch (error) {
        console.error('Erreur lors du remboursement:', error);
        alert('Erreur lors du remboursement');
    }
}

function canRefund(operation: any) {
    return operation.type === 'CAPTURE' && operation.status === 'COMPLETED';
}

onMounted(async () => {
    await updateUserData();
    pollingInterval.value = setInterval(updateUserData, 1000);
});

onUnmounted(() => {
    if (pollingInterval.value) {
        clearInterval(pollingInterval.value);
    }
});
</script>

<template>
    <Header />
    <main class="container">
        <div v-if="transaction" class="content">
            <div class="transaction-header">
                <h1 class="page-title">Détails de la Transaction</h1>
                <div class="transaction-id">
                    ID: <span class="highlight">{{ transaction.transactionId }}</span>
                </div>
            </div>

            <div class="info-card">
                <h2>Informations de la Transaction</h2>
                <div class="info-grid">
                    <div class="info-item">
                        <span class="label">Montant:</span>
                        <span class="value">{{ transaction.amount / 100 }} {{ transaction.currency }}</span>
                    </div>
                    <div class="info-item">
                        <span class="label">Créée le:</span>
                        <span class="value">{{ new Date(transaction.createdAt).toLocaleDateString() }}</span>
                    </div>
                    <div class="info-item">
                        <span class="label">Référence:</span>
                        <span class="value">{{ transaction.externalRef }}</span>
                    </div>
                </div>
            </div>

            <div class="operations-section">
                <h2>Opérations Associées</h2>
                
                <div v-if="transaction.operations && transaction.operations.length > 0" class="operations-list">
                    <div v-for="operation in transaction.operations" :key="operation.operationId" class="operation-card">
                        <div class="operation-header">
                            <span class="operation-id">Opération #{{ operation.operationId.slice(-8) }}</span>
                            <span class="status-badge" :class="operation.status.toLowerCase()">
                                {{ operation.status }}
                            </span>
                        </div>
                        
                        <div class="operation-details">
                            <div class="detail-row">
                                <span class="label">Montant:</span>
                                <span class="value">{{ Number(operation.amount) / 100 }} {{ operation.currency }}</span>
                            </div>
                            <div class="detail-row">
                                <span class="label">Type:</span>
                                <span class="value">{{ operation.type }}</span>
                            </div>
                            <div class="detail-row">
                                <span class="label">Date:</span>
                                <span class="value">{{ new Date(operation.createdAt).toLocaleDateString() }}</span>
                            </div>
                            <div class="detail-row" v-if="operation.lastFourDigits">
                                <span class="label">Carte se terminant par:</span>
                                <span class="value">**** {{ operation.lastFourDigits }}</span>
                            </div>
                            <div class="detail-row" v-if="operation.customerPaymentMethodId">
                                <span class="label">ID Méthode de Paiement:</span>
                                <span class="value">{{ operation.customerPaymentMethodId }}</span>
                            </div>
                            
                            <div v-if="canRefund(operation)" class="refund-section">
                                <h4>Remboursement</h4>
                                <div class="refund-form">
                                    <label :for="`refundAmount-${operation.operationId}`">Montant à rembourser:</label>
                                    <div class="input-group">
                                        <input 
                                            type="number" 
                                            :id="`refundAmount-${operation.operationId}`"
                                            v-model="refundAmounts[operation.operationId]" 
                                            :placeholder="`Max: ${Number(operation.amount) / 100}`"
                                            :max="Number(operation.amount) / 100"
                                            min="0.01"
                                            step="0.01"
                                        />
                                        <span class="currency">{{ operation.currency }}</span>
                                        <button 
                                            type="button" 
                                            @click="refundTransaction(operation.operationId, refundAmounts[operation.operationId] * 100)"
                                            :disabled="!refundAmounts[operation.operationId] || refundAmounts[operation.operationId] <= 0"
                                            class="refund-btn"
                                        >
                                            Rembourser
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div v-else class="no-operations">
                    Aucune opération trouvée pour cette transaction.
                </div>
            </div>
        </div>

        <div v-else class="error-message">
            <h1>Transaction introuvable</h1>
            <p>La transaction avec l'ID "{{ route.params.id }}" n'existe pas.</p>
        </div>
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

.content {
    display: flex;
    flex-direction: column;
    gap: 2rem;
}

.transaction-header {
    text-align: center;
    padding: 2rem;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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

.info-card, .operations-section {
    background: white;
    border-radius: 12px;
    padding: 2rem;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.info-card h2, .operations-section h2 {
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

.refund-section {
    margin-top: 1rem;
    padding: 1rem;
    background: #fff5f5;
    border-radius: 8px;
    border: 2px dashed #dc3545;
}

.refund-section h4 {
    margin-bottom: 1rem;
    color: #dc3545;
}

.refund-form label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 600;
}

.input-group {
    display: flex;
    gap: 0.5rem;
    align-items: center;
}

.input-group input {
    flex: 1;
    padding: 0.5rem;
    border: 1px solid #ddd;
    border-radius: 4px;
}

.currency {
    font-weight: bold;
    color: #666;
}

.refund-btn {
    padding: 0.5rem 1rem;
    background-color: #dc3545;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: bold;
    transition: background-color 0.3s ease;
}

.refund-btn:hover:not(:disabled) {
    background-color: #c82333;
}

.refund-btn:disabled {
    background-color: #6c757d;
    cursor: not-allowed;
}

.no-operations {
    text-align: center;
    padding: 3rem;
    color: #6c757d;
    font-style: italic;
}

.error-message {
    background-color: #fee;
    color: #c33;
    padding: 2rem;
    border-radius: 8px;
    text-align: center;
}

.error-message h1 {
    margin-bottom: 1rem;
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
    
    .input-group {
        flex-direction: column;
        align-items: stretch;
    }
}
</style>