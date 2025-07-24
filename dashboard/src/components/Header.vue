<script setup lang="ts">
import router from '@/router';
import { ref, onMounted } from 'vue';

const isAuthenticated = ref(false);

function checkAuth() {
    isAuthenticated.value = !!localStorage.getItem('token_eemiPay');
}

function handleLogout() {
    localStorage.removeItem('token_eemiPay');
    isAuthenticated.value = false;
    router.push('/login');
}


onMounted(() => {
    checkAuth();
});


router.afterEach(() => {
    checkAuth();
});
</script>

<template>
    <nav class="navbar-container">
        <div class="navbar-content">
            <h1><RouterLink to="/">DashBoard EemiPay</RouterLink></h1>
            <ul class="navbar-links">
                <li v-if="isAuthenticated"><RouterLink to="/transactions">Mes Transactions</RouterLink></li>
                <li v-if="isAuthenticated"><RouterLink to="/profile">Mon Profil</RouterLink></li>
                <li v-if="isAuthenticated">
                    <button @click="handleLogout" class="logout-btn">Se déconnecter</button>
                </li>
                <li v-else>
                    <RouterLink to="/login">Se connecter</RouterLink>
                </li>
            </ul>
        </div>
    </nav>
</template>

<style scoped>
.navbar-container {
    background-color: lightgray;
    padding: 1rem 0;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.navbar-content {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 1rem;
}

.navbar-content h1 {
    margin: 0;
    font-size: 1.5rem;
}

.navbar-content h1 a {
    text-decoration: none;
    color: #333;
    font-weight: 600;
}

.navbar-links {
    display: flex;
    list-style: none;
    margin: 0;
    padding: 0;
    gap: 2rem;
    align-items: center;
}

.navbar-links a {
    text-decoration: none;
    color: #333;
    font-weight: 500;
    transition: color 0.3s;
}

.navbar-links a:hover {
    color: #666;
}

.navbar-links a.router-link-active {
    color: #007bff;
    font-weight: 600;
}

.logout-btn {
    background-color: #dc3545;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 500;
    transition: background-color 0.3s;
}

.logout-btn:hover {
    background-color: #c82333;
}

@media (max-width: 768px) {
    .navbar-content {
        flex-direction: column;
        gap: 1rem;
    }
    
    .navbar-links {
        flex-wrap: wrap;
        justify-content: center;
        gap: 1rem;
    }
}
</style>