<script setup lang="ts">
import router from '@/router';
import axios from 'axios';
import { ref } from 'vue'


const email = ref('')
const password = ref('')
const errorMessage = ref('')

async function login() {
    try {
        const response = await axios.post('http://localhost:3051/loginAdmin', {
            email: email.value,
            password: password.value
        });
        
        localStorage.setItem('token_eemiPay', response.data.token);
        router.push('/'); 
    } catch (error: any) {
        email.value = '';
        password.value = '';
        
        if (error.response) {
            errorMessage.value = error.response.data.message || error.response.data.error ;
        } else {
            errorMessage.value = error.message ;
        }
    }
}

</script>

<template>
    <main class="login-container">
        <div class="login-form">
            <h1 class="login-title">Login Admin</h1>
            <input v-model="email" type="email" placeholder="Email" class="login-input" />
            <input v-model="password" type="password" placeholder="Password" class="login-input" />
            <button @click="login()" class="login-button">Login</button>
            <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
        </div>
    </main>
</template>

<style scoped>
.login-container {
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #f5f5f5;
}

.login-form {
    background: white;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 400px;
}

.login-title {
    text-align: center;
    margin-bottom: 2rem;
    color: #333;
}

.login-input {
    display: block;
    width: 100%;
    margin: 1rem 0;
    padding: 12px;
    font-size: 16px;
    border: 2px solid #ddd;
    border-radius: 4px;
    box-sizing: border-box;
    transition: border-color 0.3s;
}

.login-input:focus {
    outline: none;
    border-color: #4CAF50;
}

.login-button {
    display: block;
    width: 100%;
    margin: 1.5rem 0 1rem 0;
    padding: 12px;
    font-size: 16px;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
}

.login-button:hover {
    background-color: #45a049;
}

.error-message {
    color: #dc3545;
    text-align: center;
    margin-top: 1rem;
    font-size: 14px;
}
</style>

