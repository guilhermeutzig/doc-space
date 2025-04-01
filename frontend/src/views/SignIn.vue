<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useToast } from '@/composables/useToast'
import { Icon } from '@iconify/vue'

const router = useRouter()
const authStore = useAuthStore()
const toast = useToast()

const email = ref<string>('')
const password = ref<string>('')
const showPassword = ref<boolean>(false)
const rememberMe = ref<boolean>(false)
const loading = ref<boolean>(false)

function togglePassword() {
  showPassword.value = !showPassword.value
}

async function handleSubmit() {
  loading.value = true

  authStore
    .login({ email: email.value, password: password.value })
    .then(() => router.push('/dashboard'))
    .catch((error) => toast.error(error))
    .finally(() => {
      loading.value = false
    })
}
</script>

<template>
  <div class="signin-container">
    <div class="signin-card">
      <h1 class="title">DocSpace</h1>
      <p class="subtitle">Welcome back! Please enter your details</p>

      <form @submit.prevent="handleSubmit" class="form">
        <div class="form-group">
          <label for="email">Email</label>
          <input id="email" v-model="email" type="email" placeholder="Enter your email" required />
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <input
            id="password"
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            placeholder="Enter your password"
            required
          />
          <button
            type="button"
            class="password-toggle"
            @click="togglePassword"
            :aria-label="showPassword ? 'Hide password' : 'Show password'"
          >
            <Icon v-if="showPassword" icon="mdi:eye" width="20" />
            <Icon v-else icon="mdi:eye-off" width="20" />
          </button>
        </div>

        <div class="form-options">
          <label class="remember-me">
            <input type="checkbox" v-model="rememberMe" />
            <span>Remember me</span>
          </label>
          <router-link to="/forgot-password" class="forgot-password">
            Forgot password?
          </router-link>
        </div>

        <button type="submit" class="signin-button" :disabled="loading">
          {{ loading ? 'Signing in...' : 'Sign in' }}
        </button>
      </form>

      <p class="signup-link">
        Don't have an account?
        <router-link to="/signup">Sign up</router-link>
      </p>
    </div>
  </div>
</template>

<style scoped>
.signin-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f8fafc;
}

.signin-card {
  background: white;
  padding: 2.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

.title {
  text-align: center;
  font-size: 1.875rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.subtitle {
  text-align: center;
  color: #64748b;
  margin-bottom: 2rem;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  position: relative;
}

.form-group label {
  font-weight: 500;
  color: #1e293b;
}

.form-group input {
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  font-size: 1rem;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.remember-me {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #64748b;
}

.forgot-password {
  color: #3b82f6;
  text-decoration: none;
  font-weight: 500;
}

.signin-button {
  background-color: #3b82f6;
  color: white;
  padding: 0.75rem;
  border-radius: 0.375rem;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
}

.signin-button:hover {
  background-color: #2563eb;
}

.signin-button:disabled {
  background-color: #94a3b8;
  cursor: not-allowed;
}

.signup-link {
  text-align: center;
  margin-top: 1.5rem;
  color: #64748b;
}

.signup-link a {
  color: #3b82f6;
  text-decoration: none;
  font-weight: 500;
}

.password-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.password-input-wrapper input {
  width: 100%;
  padding: 0.75rem 1rem;
  padding-right: 2.5rem; /* Make room for the button */
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: #1a202c;
  background-color: #fff;
  transition: border-color 0.15s ease-in-out;
}

.password-input-wrapper input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.password-toggle {
  position: absolute;
  right: 0.75rem;
  padding: 0.25rem;
  bottom: 0.5rem;
  background: none;
  border: none;
  color: #64748b;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.15s ease-in-out;
}

.password-toggle:hover {
  color: #475569;
}

.password-toggle:focus {
  outline: none;
  color: #3b82f6;
}

/* Ensure the button doesn't submit the form */
.password-toggle[type='button'] {
  -webkit-appearance: none;
  appearance: none;
}
</style>
