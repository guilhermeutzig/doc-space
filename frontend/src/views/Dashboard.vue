<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const username = ref('John Doe')
const stats = ref([
  { label: 'Total Documents', value: '1,234', icon: '📄' },
  { label: 'Shared Files', value: '56', icon: '🔗' },
  { label: 'Storage Used', value: '789', icon: '💾' },
  { label: 'Team Members', value: '42', icon: '👥' },
])

const recentActivity = ref([
  {
    user: 'John Smith',
    action: 'edited the Q4 2023 report',
    time: '2h ago',
  },
  {
    user: 'Jane Doe',
    action: 'commented on Marketing proposal',
    time: '3h ago',
  },
  {
    user: 'Alex Wilson',
    action: 'created a new shared document',
    time: '5h ago',
  },
])

const logout = () => {
  authStore.logout()
}
</script>

<template>
  <main class="dashboard">
    <div class="dashboard-header">
      <h1>Dashboard</h1>
      <div class="user-profile">
        <span>C. Smith</span>
        <div class="avatar">CS</div>
      </div>
      <button @click="logout">Logout</button>
    </div>

    <div class="stats-grid">
      <div v-for="stat in stats" :key="stat.label" class="stat-card">
        <span class="stat-icon">{{ stat.icon }}</span>
        <div class="stat-content">
          <p class="stat-value">{{ stat.value }}</p>
          <h3>{{ stat.label }}</h3>
        </div>
      </div>
    </div>

    <div class="recent-activity">
      <h2>Recent Activity</h2>
      <div class="activity-list">
        <div v-for="(activity, index) in recentActivity" :key="index" class="activity-item">
          <div class="activity-avatar">
            {{ activity.user.charAt(0) }}
          </div>
          <div class="activity-content">
            <p>
              <strong>{{ activity.user }}</strong> {{ activity.action }}
            </p>
            <span class="activity-time">{{ activity.time }}</span>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.dashboard {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  background-color: #f8fafc;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.dashboard-header h1 {
  font-size: 1.5rem;
  color: #1e293b;
  font-weight: 600;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.avatar {
  width: 2.5rem;
  height: 2.5rem;
  background: #3b82f6;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background-color: white;
  padding: 1.5rem;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 1rem;
}

.stat-icon {
  font-size: 1.5rem;
}

.stat-content {
  display: flex;
  flex-direction: column;
}

.stat-card h3 {
  color: #64748b;
  font-size: 0.875rem;
  font-weight: 500;
  margin: 0;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

.recent-activity {
  background-color: white;
  padding: 1.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.recent-docs h2 {
  font-size: 1.25rem;
  color: #1e293b;
  margin-bottom: 1rem;
}

.empty-state {
  text-align: center;
  color: #64748b;
  padding: 2rem;
}
</style>
