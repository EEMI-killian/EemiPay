<script lang="ts" setup>
import Header from '@/components/Header.vue';
import Footer from '@/components/Footer.vue';
import { onMounted, onUnmounted, ref, computed } from 'vue';
import { useUserStore } from '@/stores/SchemaUser';
import { getUserInfo } from '@/pool/pool';
import Currency from '@/components/Currency.vue';

const userStore = useUserStore();
const pollingInterval = ref<number | null>(null);

const userData = computed(() => userStore.user);


const totalRevenue = computed(() => {
    if (!userData.value?.merchant?.transactions) return 0;
    
    const totalCents = userData.value.merchant.transactions
        .filter(t => t.operations.some(op => op.status === 'COMPLETED'))
        .reduce((sum, t) => sum + t.amount, 0);
    

    return totalCents / 100;
});

const totalTransactions = computed(() => {
    return userData.value?.merchant?.transactions?.length || 0;
});

const averageTransaction = computed(() => {
    if (!userData.value?.merchant?.transactions) return 0;
    
    const completedTransactions = userData.value.merchant.transactions
        .filter(t => t.operations.some(op => op.status === 'COMPLETED'));
    
    if (completedTransactions.length === 0) return 0;
    
    const totalCents = completedTransactions.reduce((sum, t) => sum + t.amount, 0);

    return (totalCents / 100) / completedTransactions.length;
});

const successRate = computed(() => {
    if (totalTransactions.value === 0 || !userData.value?.merchant?.transactions) return 0;
    
    const successfulTransactions = userData.value.merchant.transactions
        .filter(t => t.operations.some(op => op.status === 'COMPLETED')).length;
    
    return Math.round((successfulTransactions / totalTransactions.value) * 100);
});


const formatCurrency = (amount: number): string => {

    const currency = userData.value?.merchant?.currency || 'EUR';
    
    let locale: string;
    
    switch(currency) {
        case 'USD':
            locale = 'en-US';
            break;
        case 'GBP':
            locale = 'en-GB';
            break;
        case 'EUR':
        default:
            locale = 'fr-FR';
            break;
    }
    
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(amount);
};


async function updateUserData() {
    try {
        const userInfo = await getUserInfo();
        if (userInfo) {
            userStore.setUser(userInfo);
        } else {
            console.error('Failed to fetch user info');
        }
    } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
    }
}

onMounted(async () => {

    await updateUserData();
    

    pollingInterval.value = window.setInterval(updateUserData, 1000);
});

onUnmounted(() => {
    if (pollingInterval.value) {
        clearInterval(pollingInterval.value);
    }
});
</script>

<template>
  <Header />
  <div class="container">
    <h1 v-if="userData?.merchant?.companyName">{{ userData.merchant.companyName }}</h1>
    <h1 v-else>Dashboard</h1>
    
    <div class="stats-grid">
        <div class="stat-card">
            <Currency />
        </div>
        <div class="stat-card">
            <div class="stat-icon">💰</div>
            <div class="stat-value">{{ formatCurrency(totalRevenue) }}</div>
            <div class="stat-label">Revenus Total</div>
        </div>

        <div class="stat-card">
            <div class="stat-icon">📊</div>
            <div class="stat-value">{{ totalTransactions }}</div>
            <div class="stat-label">Transactions</div>
        </div>

        <div class="stat-card">
            <div class="stat-icon">💳</div>
            <div class="stat-value">{{ formatCurrency(averageTransaction) }}</div>
            <div class="stat-label">Transaction Moyenne</div>
        </div>

        <div class="stat-card">
            <div class="stat-icon">✅</div>
            <div class="stat-value">{{ successRate }}%</div>
            <div class="stat-label">Taux de Réussite</div>
        </div>
    </div>
  </div>
  <Footer />
</template>

<style scoped>
.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 40px 20px;
}

h1 {
    text-align: center;
    margin-bottom: 40px;
    color: #34495e;
    font-weight: 300;
    font-size: 2.5rem;
}

.stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 30px;
}

.stat-card {
    background: white;
    border-radius: 12px;
    padding: 30px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
    transition: all 0.3s ease;
    text-align: center;
}

.stat-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.12);
}

.stat-icon {
    font-size: 3rem;
    margin-bottom: 20px;
}

.stat-value {
    font-size: 2.5rem;
    font-weight: 700;
    color: #2c3e50;
    margin-bottom: 10px;
}

.stat-label {
    font-size: 1rem;
    color: #7f8c8d;
    text-transform: uppercase;
    letter-spacing: 1px;
}

/* Couleurs pour chaque carte */
.stat-card:nth-child(1) .stat-icon { color: #3498db; }
.stat-card:nth-child(2) .stat-icon { color: #2ecc71; }
.stat-card:nth-child(3) .stat-icon { color: #f39c12; }
.stat-card:nth-child(4) .stat-icon { color: #e74c3c; }

.loading {
    text-align: center;
    padding: 100px;
    color: #7f8c8d;
}

@media (max-width: 768px) {
    .stats-grid {
        grid-template-columns: 1fr;
    }
    
    h1 {
        font-size: 2rem;
    }
}
</style>