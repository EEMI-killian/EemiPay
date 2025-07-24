<script setup lang="ts">
import Header from '@/components/Header.vue';
import Footer from '@/components/Footer.vue';
import { onMounted, ref } from 'vue';
import axios from 'axios';
import type { Merchant } from '@/types/merchant';
import { useRoute } from 'vue-router';
import router from '@/router';

const route = useRoute();
const merchant = ref<Merchant | null>(null);
const errorMessage = ref('');
const isLoading = ref(false);

async function getMerchantInfo() {
    isLoading.value = true;
    try {
        const response: Merchant = await axios.get(`http://localhost:3051/merchant/${route.params.id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token_eemiPay')}`
            }
        }).then(res => res.data);
        merchant.value = response;
        errorMessage.value = '';
    } catch (error: any) {
        if (error.response) {
            errorMessage.value = error.message;
        }
    } finally {
        isLoading.value = false;
    }
}

async function activateMerchant() {
    try {
        const response = await axios.post(`http://localhost:3051/merchant/${route.params.id}/activate`, {}, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token_eemiPay')}`
            }
        });
        console.log(response.data);
        await getMerchantInfo();
    } catch (error: any) {
        errorMessage.value = error.message;
    }
}

async function deleteMerchant() {
    if (confirm('Are you sure you want to delete this merchant? This action cannot be undone.')) {
        try {
            await axios.delete(`http://localhost:3051/merchant/${route.params.id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token_eemiPay')}`
                }
            });
            router.push('/merchants');
        } catch (error: any) {
            errorMessage.value = error.message;
        }
    }
}
onMounted(() => {
    getMerchantInfo();
});
</script>

<template>
    <Header />
    <main class="container">
        <div class="page-header">
            <h1 class="page-title">Merchant Details</h1>
            <div class="merchant-id">ID: <span class="highlight">{{ route.params.id }}</span></div>
        </div>


        <div v-if="errorMessage" class="error-message">
            {{ errorMessage }}
        </div>


        <div v-if="isLoading" class="loading">
            <div class="spinner"></div>
            <span>Loading merchant details...</span>
        </div>


        <div v-else-if="merchant" class="content">

            <div class="status-section">
                <div class="status-badge" :class="merchant.isActive ? 'active' : 'inactive'">
                    {{ merchant.isActive ? 'Active' : 'Inactive' }}
                </div>
            </div>


            <div class="info-card">
                <h2>Company Information</h2>
                <div class="info-grid">
                    <div class="info-item">
                        <span class="label">Company Name:</span>
                        <span class="value">{{ merchant.companyName }}</span>
                    </div>
                    <div class="info-item">
                        <span class="label">Contact Email:</span>
                        <span class="value">{{ merchant.contactEmail }}</span>
                    </div>
                    <div class="info-item">
                        <span class="label">Contact Phone:</span>
                        <span class="value">{{ merchant.contactPhone }}</span>
                    </div>
                    <div class="info-item">
                        <span class="label">Contact Name:</span>
                        <span class="value">{{ merchant.contactFirstName }}</span>
                    </div>
                    <div class="info-item">
                        <span class="label">Currency:</span>
                        <span class="value currency-badge">{{ merchant.currency }}</span>
                    </div>
                    <div class="info-item">
                        <span class="label">Created At:</span>
                        <span class="value">{{ new Date(merchant.createdAt).toLocaleDateString() }}</span>
                    </div>
                </div>
            </div>


            <div class="info-card">
                <h2>Financial Information</h2>
                <div class="info-grid">
                    <div class="info-item">
                        <span class="label">IBAN:</span>
                        <span class="value iban">{{ merchant.iban }}</span>
                    </div>
                    <div class="info-item">
                        <span class="label">Redirect URL:</span>
                        <span class="value">{{ merchant.redirectUrlConfirm }}</span>
                    </div>
                    <div class="info-item" v-if="merchant.kbisUrl">
                        <span class="label">KBIS Document:</span>
                        <a :href="merchant.kbisUrl" target="_blank" class="document-link">
                            View Document
                        </a>
                    </div>
                </div>
            </div>


            <div class="actions-section">
                <h2>Actions</h2>
                <div class="actions-grid">
                    <button 
                        v-if="!merchant.isActive" 
                        @click="activateMerchant" 
                        class="action-btn activate-btn"
                    >
                        Activate Merchant
                    </button>
                    <button 
                        @click="deleteMerchant" 
                        class="action-btn delete-btn"
                    >
                        Delete Merchant
                    </button>
                </div>
            </div>
        </div>


        <div v-else-if="!isLoading" class="empty-state">
            <div class="empty-icon">👤</div>
            <h3>Merchant not found</h3>
            <p>The requested merchant could not be found.</p>
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

.page-header {
    text-align: center;
    padding: 2rem;
    background-color: lightgray;
    color: #333;
    border-radius: 12px;
    margin-bottom: 2rem;
}

.page-title {
    margin: 0 0 1rem 0;
    font-size: 2rem;
    font-weight: 300;
}

.merchant-id {
    font-size: 1.1rem;
}

.highlight {
    font-weight: bold;
    background-color: rgba(255, 255, 255, 0.5);
    padding: 0.2rem 0.5rem;
    border-radius: 4px;
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

.content {
    display: flex;
    flex-direction: column;
    gap: 2rem;
}

.status-section {
    display: flex;
    justify-content: center;
}

.status-badge {
    padding: 0.5rem 1.5rem;
    border-radius: 25px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.status-badge.active {
    background-color: #d4edda;
    color: #155724;
}

.status-badge.inactive {
    background-color: #f8d7da;
    color: #721c24;
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
    border-bottom: 2px solid lightgray;
    padding-bottom: 0.5rem;
}

.info-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1rem;
}

.info-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem;
    background-color: #f8f9fa;
    border-radius: 8px;
}

.label {
    font-weight: 500;
    color: #6c757d;
}

.value {
    color: #495057;
    word-break: break-word;
}

.currency-badge {
    background-color: lightgray;
    color: #333;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    font-size: 0.85rem;
    font-weight: 500;
}

.iban {
    font-family: 'Courier New', monospace;
    font-weight: 600;
}

.document-link {
    color: #007bff;
    text-decoration: none;
    font-weight: 500;
}

.document-link:hover {
    text-decoration: underline;
}

.actions-section {
    background: white;
    border-radius: 12px;
    padding: 2rem;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.actions-section h2 {
    margin: 0 0 1.5rem 0;
    color: #333;
    font-size: 1.5rem;
    font-weight: 500;
    border-bottom: 2px solid lightgray;
    padding-bottom: 0.5rem;
}

.actions-grid {
    display: flex;
    gap: 1rem;
    justify-content: center;
}

.action-btn {
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
}

.activate-btn {
    background-color: #28a745;
    color: white;
}

.activate-btn:hover {
    background-color: #218838;
    transform: translateY(-2px);
}

.delete-btn {
    background-color: #dc3545;
    color: white;
}

.delete-btn:hover {
    background-color: #c82333;
    transform: translateY(-2px);
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
        font-size: 1.5rem;
    }
    
    .info-grid {
        grid-template-columns: 1fr;
    }
    
    .info-item {
        flex-direction: column;
        gap: 0.5rem;
        text-align: center;
    }
    
    .actions-grid {
        flex-direction: column;
    }
}
</style>