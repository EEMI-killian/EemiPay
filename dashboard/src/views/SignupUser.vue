<script lang="ts" setup>
import { ref } from 'vue';
import axios from 'axios';  
import router from '@/router';

const formData = ref({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
});

function submitForm() {
    axios.post('http://localhost:3051/user', formData.value)
        .then(response => {
           router.push('/signup-merchant');
        })
        .catch(error => {
            console.error('Error registering user:', error);
        });
}
</script>

<template>
    <div class="signup-container">
        <h1 class="signup-title">Signup Merchant</h1>
        <form @submit.prevent="submitForm" class="signup-form">
            <div class="form-group">
                <label for="firstName" class="form-label">First:</label>
                <input 
                    type="text" 
                    id="firstName" 
                    v-model="formData.firstName" 
                    class="form-input"
                    required 
                />
            </div>
            <div class="form-group">
                <label for="lastName" class="form-label">Last:</label>
                <input 
                    type="text" 
                    id="lastName" 
                    v-model="formData.lastName" 
                    class="form-input"
                    required 
                />
            </div>
            <div class="form-group">
                <label for="email" class="form-label">Email:</label>
                <input 
                    type="email" 
                    id="email" 
                    v-model="formData.email" 
                    class="form-input"
                    required 
                />
            </div>
            <div class="form-group">
                <label for="password" class="form-label">Password:</label>
                <input 
                    type="password" 
                    id="password" 
                    v-model="formData.password" 
                    class="form-input"
                    required 
                />
            </div>
            <button type="submit" class="submit-button">Sign Up</button>
        </form>
    </div>
</template>

<style scoped>
.signup-container {
  max-width: 400px;
  margin: 50px auto;
  padding: 40px;
  background: #ffffff;
  border-radius: 10px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  animation: fadeInUp 0.5s ease-out;
}

.signup-title {
  text-align: center;
  color: #333;
  margin-bottom: 30px;
  font-size: 28px;
  font-weight: 600;
}

.signup-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  color: #555;
  font-weight: 500;
  font-size: 14px;
  letter-spacing: 0.3px;
}

.form-input {
  padding: 12px 16px;
  border: 2px solid #e1e4e8;
  border-radius: 6px;
  font-size: 16px;
  transition: all 0.3s ease;
  background-color: #fafbfc;
}

.form-input:focus {
  outline: none;
  border-color: #0366d6;
  background-color: #ffffff;
  box-shadow: 0 0 0 3px rgba(3, 102, 214, 0.1);
}

.form-input:hover {
  border-color: #d1d5da;
}

.submit-button {
  margin-top: 10px;
  padding: 14px 20px;
  background-color: #0366d6;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  letter-spacing: 0.5px;
}

.submit-button:hover {
  background-color: #0256c7;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(3, 102, 214, 0.3);
}

.submit-button:active {
  transform: translateY(0);
  box-shadow: 0 2px 6px rgba(3, 102, 214, 0.3);
}

/* Responsive design */
@media (max-width: 480px) {
  .signup-container {
    margin: 20px;
    padding: 30px 20px;
  }
  
  .signup-title {
    font-size: 24px;
  }
}

/* Animation d'entrée */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}


.error-message {
  color: #d73a49;
  font-size: 14px;
  margin-top: 5px;
}


.login-link {
  text-align: center;
  margin-top: 20px;
  color: #666;
  font-size: 14px;
}

.login-link a {
  color: #0366d6;
  text-decoration: none;
  font-weight: 500;
}

.login-link a:hover {
  text-decoration: underline;
}
</style>