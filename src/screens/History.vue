<template>
  <div class="screen">
    <div class="box">
      <!-- TOPBAR -->
      <div class="topbar">
        <h1 class="title">TASK MANAGER</h1>
        <img src="/logo.png" alt="logo" class="logo-small" />
        <div class="actions">
          <button class="btn-small" @click="goProfile">👤<br>Profile</button>
          <div class="welcome">
            <p>Chào mừng<br /><b>{{ user?.name }}</b></p>
          </div>
          <button class="btn-small danger" @click="logout">➜]<br>Logout</button>
        </div>
      </div>

      <!-- CONTENT -->
      <h2 class="subtitle">Đã hoàn thành</h2>

      <!-- Bộ lọc -->
      <div style="margin:10px 0;">
        <select v-model="filter" style="padding:6px;">
          <option value="all">Tất cả</option>
          <option value="ontime">Đúng hạn</option>
          <option value="overdue">Quá hạn</option>
        </select>
      </div>

      <div class="content">
        <div v-if="filteredTasks.length === 0" class="empty">
          Không có công việc nào
        </div>

        <div
          v-for="task in filteredTasks"
          :key="task.id"
          :class="['task-item', 'done', { overdue: task.isOverdue }]"
        >
          <div class="task-info">
            <b>{{ task.title }}</b>
            <p>{{ task.description }}</p>
            <p>Deadline: {{ task.deadline }}</p>
            <p>Hoàn thành: {{ task.updated_at }}</p>
          </div>
        </div>
      </div>

      <!-- BOTTOMBAR -->
      <div class="bottombar">
        <button class="nav-btn" @click="$router.push('/main')">Trang chủ</button>
        <button class="nav-btn" @click="$router.push('/chart')">Thống kê</button>
        <button class="nav-btn" @click="$router.push('/history')">Lịch sử</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '../services/api'
import { useRouter } from 'vue-router'
import dayjs from 'dayjs'

const router = useRouter()
const tasks = ref([])
const filter = ref('all')
const user = JSON.parse(localStorage.getItem('user') || '{}')

const fetchTasks = async () => {
  const res = await api.get('/tasks')
  tasks.value = res.data
    .filter(t => t.status) // chỉ task đã hoàn thành
    .map(t => ({
      ...t,
      isOverdue:
        t.deadline &&
        dayjs(t.updated_at).isAfter(dayjs(t.deadline)) // hoàn thành nhưng quá hạn
    }))
}

const filteredTasks = computed(() => {
  if (filter.value === 'ontime') return tasks.value.filter(t => !t.isOverdue)
  if (filter.value === 'overdue') return tasks.value.filter(t => t.isOverdue)
  return tasks.value
})

const logout = () => {
  localStorage.clear()
  router.push('/')
}

const goProfile = () => router.push('/profile')

onMounted(fetchTasks)
</script>

