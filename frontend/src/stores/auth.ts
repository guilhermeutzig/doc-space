import { defineStore } from 'pinia'
import { ref, computed, inject } from 'vue'
import Cookies from 'js-cookie'
import axios from 'axios'
import router from '@/router'

interface User {
  id: string
  email: string
  name: string
}

interface LoginCredentials {
  email: string
  password: string
}

export const useAuthStore = defineStore('auth', () => {
  const accessToken = ref<string | null>(loadTokenFromCookies())
  const user = ref<User | null>(loadUserFromCookies())
  const loading = ref(false)

  const currentUser = computed(() => user.value)

  function loadUserFromCookies() {
    const savedUser = Cookies.get('user')
    return savedUser ? JSON.parse(savedUser) : null
  }

  function loadTokenFromCookies() {
    const savedToken = Cookies.get('accessToken')
    return savedToken ? savedToken : null
  }

  function saveAuthToCookies(cookiesUser: User, cookiesAccessToken: string) {
    Cookies.set('user', JSON.stringify(cookiesUser))
    Cookies.set('accessToken', cookiesAccessToken)
    user.value = cookiesUser
    accessToken.value = cookiesAccessToken
  }

  function clearAuthCookies() {
    Cookies.remove('user')
    Cookies.remove('accessToken')
    user.value = null
    accessToken.value = null
  }

  async function login({ email, password }: LoginCredentials) {
    loading.value = true

    return axios
      .post(`${import.meta.env.VITE_API_URL}/api/auth/signin`, {
        email,
        password,
      })
      .then((response) => {
        const token = response.headers['authorization']?.split(' ')[1]

        if (!token) {
          throw new Error('No token received from server')
        }

        accessToken.value = token
        user.value = response.data.user

        setupAxiosInterceptor()
        saveAuthToCookies(response.data.user, token)

        return response.data
      })
      .catch((err) => {
        clearAuthCookies()

        if (err.status === 401) {
          throw 'Invalid email/password combination.'
        }

        throw 'Something went wrong, please try again.'
      })
      .finally(() => {
        loading.value = false
      })
  }

  async function logout() {
    loading.value = true
    axios
      .delete(`${import.meta.env.VITE_API_URL}/api/auth/logout`)
      .then(() => {
        clearAuthCookies()
        removeAxiosInterceptor()
        router.push('/signin')
      })
      .catch((err: any) => {
        throw err.response?.data?.message || 'Logout failed'
      })
      .finally(() => {
        loading.value = false
      })
  }

  async function refreshToken() {
    axios
      .post(`${import.meta.env.VITE_API_URL}/api/auth/refresh-token`)
      .then((response) => {
        const token = response.headers['authorization']?.split(' ')[1]

        if (!token) {
          throw new Error('No token received from server')
        }

        accessToken.value = token

        return token
      })
      .catch(async (err: any) => {
        await logout()
        throw new Error('Session expired')
      })
  }

  let interceptorId: number

  function setupAxiosInterceptor() {
    interceptorId = axios.interceptors.response.use(
      (response) => {
        const newToken = response.headers['authorization']?.split(' ')[1]
        if (newToken) {
          accessToken.value = newToken
        }
        return response
      },
      async (error) => {
        if (error.response?.status === 401) {
          try {
            await refreshToken()

            const config = error.config
            config.headers['Authorization'] = `Bearer ${accessToken.value}`
            return axios(config)
          } catch (refreshError) {
            await logout()
            throw refreshError
          }
        }
        return Promise.reject(error)
      },
    )
  }

  function removeAxiosInterceptor() {
    axios.interceptors.response.eject(interceptorId)
  }

  return {
    accessToken,
    user,
    loading,
    currentUser,
    login,
    logout,
    refreshToken,
  }
})
