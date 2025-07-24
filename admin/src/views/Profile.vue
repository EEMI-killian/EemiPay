<script lang="ts" setup>
import Header from '@/components/Header.vue';
import Footer from '@/components/Footer.vue';
import { onMounted, ref } from 'vue';
import axios from 'axios';
import type { UserProfile } from '@/types/userProfil';

const user = ref<UserProfile | null>(null);
const errorMessage = ref('');
const isLoading = ref(false);

async function getProfile() {
    isLoading.value = true;
    try {
        const response = await axios.get('http://localhost:3051/user', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token_eemiPay')}`
            }
        });
        user.value = response.data;
        errorMessage.value = '';
    } catch (error: any) {
        errorMessage.value = error.message;
    } finally {
        isLoading.value = false;
    }
}

function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

onMounted(() => {
    getProfile();
});
</script>

<template>
    <Header />
    <main class="container">
        <div class="page-header">
            <h1 class="page-title">My Profile</h1>
            <div class="profile-subtitle">Personal Information</div>
        </div>

        <div v-if="errorMessage" class="error-message">
            {{ errorMessage }}
        </div>

        <div v-if="isLoading" class="loading">
            <div class="spinner"></div>
            <span>Loading profile...</span>
        </div>

        <div v-else-if="user" class="content">

            <div class="profile-card">
                <div class="profile-header">
                    <div class="profile-avatar">
                        <span class="avatar-text">{{ user.firstName?.charAt(0) }}{{ user.lastName?.charAt(0) }}</span>
                    </div>
                    <div class="profile-name">
                        <h2>{{ user.firstName }} {{ user.lastName }}</h2>
                        <p class="profile-email">{{ user.email }}</p>
                    </div>
                </div>
            </div>


            <div class="info-card">
                <h2>Profile Details</h2>
                <div class="info-grid">
                    <div class="info-item">
                        <span class="label">First Name:</span>
                        <span class="value">{{ user.firstName }}</span>
                    </div>
                    <div class="info-item">
                        <span class="label">Last Name:</span>
                        <span class="value">{{ user.lastName }}</span>
                    </div>
                    <div class="info-item">
                        <span class="label">Email Address:</span>
                        <span class="value">{{ user.email }}</span>
                    </div>
                    <div class="info-item">
                        <span class="label">Account Created:</span>
                        <span class="value">{{ new Date(user.createdAt).toLocaleDateString() }}</span>
                    </div>
                </div>
            </div>


            <div class="stats-card">
                <h2>Account Statistics</h2>
                <div class="stats-grid">
                    <div class="stat-item">
                        <div class="stat-value">Active</div>
                        <div class="stat-label">Account Status</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value">{{ new Date().getFullYear() - new Date(user.createdAt).getFullYear() || '< 1' }}</div>
                        <div class="stat-label">Years with us</div>
                    </div>
                </div>
            </div>
        </div>

        <div v-else-if="!isLoading" class="empty-state">
            <div class="empty-icon">👤</div>
            <h3>Profile not found</h3>
            <p>Unable to load your profile information.</p>
        </div>
    </main>
    <Footer />
</template>

<style scoped>
.container {
    max-width: 800px;
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
    margin: 0 0 0.5rem 0;
    font-size: 2rem;
    font-weight: 300;
}

.profile-subtitle {
    font-size: 1rem;
    opacity: 0.8;
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

.profile-card {
    background: white;
    border-radius: 12px;
    padding: 2rem;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.profile-header {
    display: flex;
    align-items: center;
    gap: 2rem;
}

.profile-avatar {
    width: 80px;
    height: 80px;
    background-color: lightgray;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.avatar-text {
    font-size: 1.5rem;
    font-weight: 600;
    color: #333;
}

.profile-name h2 {
    margin: 0 0 0.5rem 0;
    font-size: 1.8rem;
    color: #333;
}

.profile-email {
    margin: 0;
    color: #6c757d;
    font-size: 1.1rem;
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
    font-weight: 500;
}

.stats-card {
    background: white;
    border-radius: 12px;
    padding: 2rem;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.stats-card h2 {
    margin: 0 0 1.5rem 0;
    color: #333;
    font-size: 1.5rem;
    font-weight: 500;
    border-bottom: 2px solid lightgray;
    padding-bottom: 0.5rem;
}

.stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1.5rem;
}

.stat-item {
    text-align: center;
    padding: 1.5rem;
    background-color: #f8f9fa;
    border-radius: 12px;
}

.stat-value {
    font-size: 2rem;
    font-weight: 600;
    color: #333;
    margin-bottom: 0.5rem;
}

.stat-label {
    color: #6c757d;
    font-size: 0.9rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
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
    
    .profile-header {
        flex-direction: column;
        text-align: center;
        gap: 1rem;
    }
    
    .info-grid {
        grid-template-columns: 1fr;
    }
    
    .info-item {
        flex-direction: column;
        gap: 0.5rem;
        text-align: center;
    }
    
    .stats-grid {
        grid-template-columns: 1fr;
    }
}
</style>