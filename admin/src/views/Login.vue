<script setup lang="ts">
import router from '@/router';
import axios from 'axios';
import { ref } from 'vue'


const email = ref('')
const password = ref('')
const errorMessage = ref('')

async function login() {
    try {
        const response = await axios.post('http://localhost:3051/login', {
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
  <input v-model="email" type="email " placeholder="Email" class="login-input" />
  <input v-model="password" type="password" placeholder="Password" class="login-input" />
  <button @click="login()" class="login-button">Login</button>
  <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
</template>
