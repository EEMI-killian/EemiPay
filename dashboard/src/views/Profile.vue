<script lang="ts" setup>
import { onMounted, onUnmounted, ref, computed, watch } from 'vue';
import Header from '@/components/Header.vue';
import Footer from '@/components/Footer.vue';
import type { Credential } from '@/types/Credential';
import axios from 'axios';
import { useUserStore } from '@/stores/SchemaUser';
import { getUserInfo } from '@/pool/pool';

const credentials = ref<Credential[]>([]);
const userStore = useUserStore();
const newCredential = ref<Credential>({
  appId: '',
  appSecret: ''
});


const pollingInterval = ref<number | null>(null);
const isLoading = ref(false);

const merchantInfo = computed(() => userStore.user?.merchant);




async function updateUserData() {
    if (isLoading.value) return; 
    
    try {
        isLoading.value = true;
        const userInfo = await getUserInfo();
        if (userInfo) {
            userStore.setUser(userInfo);
        } else {
            console.error('Failed to fetch user info');
        }
    } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
    } finally {
        isLoading.value = false;
    }
}

function getCredentials() {
    const merchantId = userStore.user?.merchant?.merchantId;
    
    if (!merchantId) {
        console.error('Merchant ID is not available');
        return;
    }

    axios.get(`http://localhost:3051/credential/${merchantId}`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token_eemiPay')}`
        }
    }).then((response) => {
        credentials.value = response.data;
    }).catch((error) => {
        if (error.response && error.response.status === 404) {
            credentials.value = [];
        } 
    });
}


function rotateCredential(appId: string) {
    const merchantId = userStore.user?.merchant?.merchantId;
    
    if (!merchantId) {
        console.error('Merchant ID is not available');
        return;
    }

    axios.post('http://localhost:3051/credential/rotate', {
        merchantId: merchantId,
        appId: appId
    }, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token_eemiPay')}`
        }
    }).then((response) => {
   
        const index = credentials.value.findIndex(cred => cred.appId === appId);
        if (index !== -1) {
            credentials.value[index] = response.data;
        }
        console.log('Credential rotated:', response.data);
    }).catch((error) => {
        console.error('Error rotating credential:', error);
    });  
}


function deleteCredential(appId: string) {
    const merchantId = userStore.user?.merchant?.merchantId;
    
    if (!merchantId) {
        console.error('Merchant ID is not available');
        return;
    }

    axios.delete('http://localhost:3051/credential', {
        data: {
            merchantId: merchantId,
            appId: appId
        },
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token_eemiPay')}`
        }
    }).then(() => {

        credentials.value = credentials.value.filter(cred => cred.appId !== appId);
        console.log('Credential deleted:', appId);
    }).catch((error) => {
        console.error('Error deleting credential:', error);
    });
}


function generateCredential() {
    const merchantId = userStore.user?.merchant?.merchantId;
    
    if (!merchantId) {
        console.error('Merchant ID is not available');
        return;
    }

    axios.post('http://localhost:3051/credential', {
        merchantId: merchantId,
    }, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token_eemiPay')}`
        }
    }).then((response) => {
        // Ajouter le nouveau credential à la liste existante
        credentials.value.push(response.data);
        newCredential.value = response.data;
        console.log('New credential generated:', response.data);
    }).catch((error) => {
        console.error('Error generating credential:', error);
    });  
}

// Nettoyer le polling à la destruction du composant
onUnmounted(() => {
    if (pollingInterval.value) {
        clearInterval(pollingInterval.value);
        pollingInterval.value = null;
    }
});


watch(
    () => userStore.user?.merchant?.merchantId,
    (newMerchantId) => {
        if (newMerchantId) {
            getCredentials();
        }
    }
);


onMounted(async () => {
    // Chargement initial des données
    await updateUserData();
    
    // Démarrage du polling toutes les 5 secondes (plus raisonnable que 1 seconde)
    pollingInterval.value = setInterval(updateUserData, 5000);
    
    // Charger les credentials si merchantId est disponible
    if (userStore.user?.merchant?.merchantId) {
        getCredentials();
    }
    
});
</script>

<template>
  <Header />
  <div class="profile">
    <h1>User Profile</h1>
    
    <div class="section">
      <h2>Ma société</h2>
      <div v-if="merchantInfo" class="merchant-info">
        <p><strong>Nom de l'entreprise:</strong> {{ merchantInfo.companyName || 'N/A' }}</p>
        <p><strong>Contact:</strong> {{ merchantInfo.contactFirstName }} {{ merchantInfo.contactLastName }}</p>
        <p><strong>Email:</strong> {{ merchantInfo.contactEmail || 'N/A' }}</p>
        <p><strong>Téléphone:</strong> {{ merchantInfo.contactPhone || 'N/A' }}</p>
        <p><strong>Devise:</strong> {{ merchantInfo.currency || 'N/A' }}</p>
        <p><strong>IBAN:</strong> {{ merchantInfo.iban || 'N/A' }}</p>
        <p><strong>URL de confirmation:</strong> {{ merchantInfo.redirectionUrlConfirm || 'N/A' }}</p>
        <p><strong>URL d'annulation:</strong> {{ merchantInfo.redirectionUrlCancel || 'N/A' }}</p>
      </div>
      <div v-else class="loading">
        <p>Chargement des informations...</p>
      </div>
    </div>
    
    <div class="section">
      <h3>Mes Credentials</h3>
      <button 
        @click="generateCredential" 
        class="btn-generate"
        :disabled="!merchantInfo?.merchantId"
      >
        Générer une nouvelle credential
      </button>
      
      <div v-if="credentials && credentials.length > 0" class="credentials-list">
        <div v-for="credential in credentials" :key="credential.appId" class="credential-item">
          <div class="credential-info">
            <p><strong>App ID:</strong> <code>{{ credential.appId }}</code></p>
            <p><strong>App Secret:</strong> <code>{{ credential.appSecret }}</code></p>
          </div>
          <div class="credential-actions">
            <button 
              @click="rotateCredential(credential.appId)" 
              class="btn-rotate"
              :disabled="!merchantInfo?.merchantId"
            >
              Rotate
            </button>
            <button 
              @click="deleteCredential(credential.appId)" 
              class="btn-delete"
              :disabled="!merchantInfo?.merchantId"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
      
      <div v-else-if="merchantInfo?.merchantId" class="no-credentials">
        <p>Aucune credential disponible</p>
      </div>
      
      <div v-else class="loading">
        <p>Chargement des credentials...</p>
      </div>
    </div>
  </div>
  <Footer />
</template>

<style scoped>
.profile {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.profile h1 {
  color: #333;
  margin-bottom: 2rem;
  text-align: center;
}

.profile h2, .profile h3 {
  color: #555;
  margin-top: 2rem;
  margin-bottom: 1rem;
  border-bottom: 2px solid #eee;
  padding-bottom: 0.5rem;
}

.section {
  margin-bottom: 3rem;
}

.merchant-info p, .profile p {
  margin: 0.5rem 0;
  line-height: 1.6;
}

.loading {
  text-align: center;
  color: #666;
  font-style: italic;
}

.no-credentials {
  text-align: center;
  color: #666;
  margin: 2rem 0;
}

.btn-generate {
  background-color: #28a745;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  margin-bottom: 2rem;
  transition: background-color 0.2s;
}

.btn-generate:hover:not(:disabled) {
  background-color: #218838;
}

.btn-generate:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
}

.credentials-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.credential-item {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  border: 1px solid #dee2e6;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.credential-info {
  margin-bottom: 1rem;
}

.credential-info code {
  background-color: #e9ecef;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  font-size: 0.9em;
}

.credential-actions {
  display: flex;
  gap: 0.75rem;
}

.btn-rotate, .btn-delete {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s;
}

.btn-rotate {
  background-color: #007bff;
  color: white;
}

.btn-rotate:hover:not(:disabled) {
  background-color: #0056b3;
}

.btn-delete {
  background-color: #dc3545;
  color: white;
}

.btn-delete:hover:not(:disabled) {
  background-color: #c82333;
}

.btn-rotate:disabled, .btn-delete:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .profile {
    padding: 1rem;
  }
  
  .credential-actions {
    flex-direction: column;
  }
  
  .btn-rotate, .btn-delete {
    width: 100%;
  }
}
</style>