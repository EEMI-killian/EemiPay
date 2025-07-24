<script setup lang="ts">
import Header from '@/components/Header.vue';
import Footer from '@/components/Footer.vue';
import { ref, computed } from 'vue';
import axios from 'axios';

// Form data refs
const contactEmail = ref('');
const companyName = ref('');
const contactFirstName = ref('');
const contactLastName = ref('');
const contactPhone = ref('');
const redirectionUrlConfirm = ref('');
const redirectionUrlCancel = ref('');
const currency = ref('EUR');
const iban = ref('');
const kbisFile = ref<File | null>(null);

// UI state
const isLoading = ref(false);
const errorMessage = ref('');
const successMessage = ref('');

// Get token from localStorage
const token = computed(() => localStorage.getItem('token_eemiPay'));

async function signup() {
    // Reset messages
    errorMessage.value = '';
    successMessage.value = '';
    
    // Validation basique
    if (!contactEmail.value || !companyName.value || !contactFirstName.value || 
        !contactLastName.value || !contactPhone.value || !iban.value) {
        errorMessage.value = 'Veuillez remplir tous les champs obligatoires';
        return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(contactEmail.value)) {
        errorMessage.value = 'Veuillez entrer une adresse email valide';
        return;
    }
    
    if (!token.value) {
        errorMessage.value = 'Token d\'authentification manquant';
        return;
    }
    
    isLoading.value = true;
    
    try {
        // Créer FormData à chaque soumission
        const formData = new FormData();
        formData.append('contactEmail', contactEmail.value);
        formData.append('companyName', companyName.value);
        formData.append('contactFirstName', contactFirstName.value);
        formData.append('contactLastName', contactLastName.value);
        formData.append('contactPhone', contactPhone.value);
        formData.append('redirectionUrlConfirm', redirectionUrlConfirm.value || 'http://localhost:3000/success');
        formData.append('redirectionUrlCancel', redirectionUrlCancel.value || 'http://localhost:3000/cancel');
        formData.append('currency', currency.value);
        formData.append('iban', iban.value);
        
        if (kbisFile.value) {
            formData.append('kbisFile', kbisFile.value);
        }
        
        const response = await axios.post('http://localhost:3051/merchant', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${localStorage.getItem('token_eemiPay')}`
            }
        });
        
        console.log('Inscription réussie:', response.data);
        successMessage.value = 'Inscription réussie !';

        resetForm();
        
    } catch (error) {
        console.error('Erreur lors de l\'inscription:', error);
        if (axios.isAxiosError(error)) {
            errorMessage.value = error.response?.data?.message || 'Erreur lors de l\'inscription';
        } else {
            errorMessage.value = 'Une erreur inattendue s\'est produite';
        }
    } finally {
        isLoading.value = false;
    }
}

function handleFileUpload(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
        kbisFile.value = target.files[0];
        console.log('Fichier sélectionné:', target.files[0].name);
    }
}

function resetForm() {
    contactEmail.value = '';
    companyName.value = '';
    contactFirstName.value = '';
    contactLastName.value = '';
    contactPhone.value = '';
    redirectionUrlConfirm.value = '';
    redirectionUrlCancel.value = '';
    currency.value = 'EUR';
    iban.value = '';
    kbisFile.value = null;
    // Réinitialiser l'input file
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
}
</script>

<template>
    <div class="app-container">
        <Header />
        
        <main class="signup-container">
            <div class="signup-form-wrapper">
                <h1 class="signup-title">Inscription Marchand</h1>
                
                <!-- Messages d'erreur et de succès -->
                <div v-if="errorMessage" class="alert alert-error">
                    {{ errorMessage }}
                </div>
                
                <div v-if="successMessage" class="alert alert-success">
                    {{ successMessage }}
                </div>
                
                <form @submit.prevent="signup" class="signup-form">
                    <div class="form-group">
                        <label for="contactEmail">Email de contact *</label>
                        <input 
                            id="contactEmail"
                            v-model="contactEmail" 
                            type="email" 
                            class="signup-input" 
                            placeholder="exemple@email.com"
                            required
                        />
                    </div>
                    
                    <div class="form-group">
                        <label for="companyName">Nom de l'entreprise *</label>
                        <input 
                            id="companyName"
                            v-model="companyName" 
                            type="text" 
                            class="signup-input" 
                            placeholder="Nom de votre entreprise"
                            required
                        />
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="contactFirstName">Prénom *</label>
                            <input 
                                id="contactFirstName"
                                v-model="contactFirstName" 
                                type="text" 
                                class="signup-input" 
                                placeholder="Prénom"
                                required
                            />
                        </div>
                        
                        <div class="form-group">
                            <label for="contactLastName">Nom *</label>
                            <input 
                                id="contactLastName"
                                v-model="contactLastName" 
                                type="text" 
                                class="signup-input" 
                                placeholder="Nom"
                                required
                            />
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label for="contactPhone">Téléphone *</label>
                        <input 
                            id="contactPhone"
                            v-model="contactPhone" 
                            type="tel" 
                            class="signup-input" 
                            placeholder="+33 6 12 34 56 78"
                            required
                        />
                    </div>
                    
                    <div class="form-group">
                        <label for="redirectionUrlConfirm">URL de confirmation</label>
                        <input 
                            id="redirectionUrlConfirm"
                            v-model="redirectionUrlConfirm" 
                            type="url" 
                            class="signup-input" 
                            placeholder="https://votresite.com/success"
                        />
                    </div>
                    
                    <div class="form-group">
                        <label for="redirectionUrlCancel">URL d'annulation</label>
                        <input 
                            id="redirectionUrlCancel"
                            v-model="redirectionUrlCancel" 
                            type="url" 
                            class="signup-input" 
                            placeholder="https://votresite.com/cancel"
                        />
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="currency">Devise *</label>
                            <select 
                                id="currency"
                                v-model="currency" 
                                class="signup-input"
                                required
                            >
                                <option value="EUR">EUR - Euro</option>
                                <option value="USD">USD - Dollar US</option>
                                <option value="GBP">GBP - Livre Sterling</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label for="iban">IBAN *</label>
                            <input 
                                id="iban"
                                v-model="iban" 
                                type="text" 
                                placeholder="FR76 1234 5678 9012 3456 7890 123" 
                                class="signup-input"
                                required
                            />
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label for="kbisFile">Document Kbis</label>
                        <input 
                            id="kbisFile"
                            @change="handleFileUpload" 
                            type="file" 
                            class="signup-input file-input"
                            accept=".pdf,.jpg,.jpeg,.png"
                        />
                        <span v-if="kbisFile" class="file-name">
                            Fichier sélectionné: {{ kbisFile.name }}
                        </span>
                    </div>
                    
                    <button 
                        type="submit" 
                        class="signup-button"
                        :disabled="isLoading"
                    >
                        {{ isLoading ? 'Inscription en cours...' : 'S\'inscrire' }}
                    </button>
                </form>
            </div>
        </main>
        
        <Footer />
    </div>
</template>

<style scoped>
.app-container {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
}

.signup-container {
    flex: 1;
    padding: 2rem;
    background-color: #f5f5f5;
    display: flex;
    justify-content: center;
    align-items: center;
}

.signup-form-wrapper {
    background: white;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 600px;
}

.signup-title {
    text-align: center;
    color: #333;
    margin-bottom: 2rem;
    font-size: 2rem;
}

.signup-form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
}

label {
    font-weight: 500;
    color: #555;
    font-size: 0.9rem;
}

.signup-input {
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;
    transition: border-color 0.3s;
}

.signup-input:focus {
    outline: none;
    border-color: #4CAF50;
}

.file-input {
    padding: 0.5rem;
}

.file-name {
    font-size: 0.85rem;
    color: #666;
    margin-top: 0.25rem;
}

.signup-button {
    background-color: #4CAF50;
    color: white;
    padding: 1rem;
    border: none;
    border-radius: 4px;
    font-size: 1.1rem;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.3s;
    margin-top: 1rem;
}

.signup-button:hover:not(:disabled) {
    background-color: #45a049;
}

.signup-button:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
}

.alert {
    padding: 1rem;
    border-radius: 4px;
    margin-bottom: 1rem;
    text-align: center;
}

.alert-error {
    background-color: #ffebee;
    color: #c62828;
    border: 1px solid #ef5350;
}

.alert-success {
    background-color: #e8f5e9;
    color: #2e7d32;
    border: 1px solid #4caf50;
}

/* Responsive */
@media (max-width: 768px) {
    .form-row {
        grid-template-columns: 1fr;
    }
    
    .signup-form-wrapper {
        padding: 1.5rem;
    }
}
</style>