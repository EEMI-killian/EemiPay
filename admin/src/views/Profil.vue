<script lang="ts" setup>
import Header from '@/components/Header.vue';
import Footer from '@/components/Footer.vue';
import { onMounted, ref } from 'vue';
import axios from 'axios';
import type { UserProfile } from '@/types/userProfil';

const user = ref<UserProfile | null>(null);
const errorMessage = ref('');


    async function getProfile() {
        try {
            const response = await axios.get('http://localhost:3051/user', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token_eemiPay')}`
                }
            });
            user.value = response.data;
        } catch (error: any) {
            errorMessage.value = error.message;
        }
    }
onMounted(() => {
    getProfile();
});
</script>

<template>
    <Header />
    <div>
        <h1>Mon Profil</h1>
        <div v-if="user" class="profile-info">
            <p><strong>Email:</strong> {{ user.email }}</p>
            <p><strong>Prénom:</strong> {{ user.firstName }}</p>
            <p><strong>Nom:</strong> {{ user.lastName }}</p>
            <p><strong>Créé le:</strong> {{ user.createdAt }}</p>
        </div>
        <div v-else-if="!errorMessage" class="loading">
            Chargement du profil...
        </div>
    </div>
    <Footer />
</template>