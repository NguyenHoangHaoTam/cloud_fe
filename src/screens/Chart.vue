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

      <h2 class="subtitle">Biểu đồ công việc</h2>

      <!-- Điều khiển view -->
      <div class="view-container" style="display:flex;align-items:center;gap:10px;margin-bottom:20px;">
        <button class="btn-small" @click="prevRange">◀</button>

        <!-- ▼▼  DROPDOWN MỚI  ▼▼ -->
        <div style="margin:10px 0;">
          <select v-model="viewBy" @change="fetchStats" style="padding:6px;">
            <option value="week">Theo tuần</option>
            <option value="month">Theo tháng</option>
          </select>
        </div>
        <!-- ▲▲  DROPDOWN MỚI  ▲▲ -->

        <button class="btn-small" @click="nextRange">▶</button>
        <span style="margin-left:10px;font-weight:bold;">{{ rangeLabel }}</span>
      </div>

      <div class="content">
        <div class="chart-container" style="background:white;border-radius:8px;padding:20px;">
          <canvas ref="chartCanvas"></canvas>
        </div>

        <div class="legend" style="margin-top:15px;text-align:center;">
          <div style="display:inline-flex;gap:20px;align-items:center;">
            <div style="display:flex;align-items:center;gap:5px;">
              <div style="width:20px;height:20px;background:#28a745;border-radius:3px;"></div>
              <span>Hoàn thành đúng hạn</span>
            </div>
            <div style="display:flex;align-items:center;gap:5px;">
              <div style="width:20px;height:20px;background:#dc3545;border-radius:3px;"></div>
              <span>Quá hạn</span>
            </div>
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
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import api from '../services/api'
import Chart from 'chart.js/auto'
import dayjs from 'dayjs'

const router = useRouter()
const user = JSON.parse(localStorage.getItem('user') || '{}')

const viewBy = ref('week') // 'week' hoặc 'month'
const currentDate = ref(dayjs())
const rangeLabel = ref('')
const chartCanvas = ref(null)
let chartInstance = null

const fetchStats = async () => {
  const params = {
    mode: viewBy.value,
    date: currentDate.value.format('YYYY-MM-DD')
  }
  if (user && user.id) params.user_id = user.id

  const res = await api.get('/tasks/stats', { params })
  rangeLabel.value = res.data.range || ''
  const labels = res.data.data.map(d => d.label)
  const onTime = res.data.data.map(d => d.on_time || 0)
  const overdue = res.data.data.map(d => d.overdue || 0)
  drawChart(labels, onTime, overdue)
}

const drawChart = (labels, onTime, overdue) => {
  if (chartInstance) chartInstance.destroy()
  chartInstance = new Chart(chartCanvas.value, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        { label: 'Đúng hạn', data: onTime, backgroundColor: '#28a745' },
        { label: 'Quá hạn', data: overdue, backgroundColor: '#dc3545' }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: { y: { beginAtZero: true, ticks: { stepSize: 1, precision: 0 } } }
    }
  })
}

const prevRange = () => {
  currentDate.value = viewBy.value === 'month'
    ? currentDate.value.subtract(1, 'month')
    : currentDate.value.subtract(1, 'week')
  fetchStats()
}
const nextRange = () => {
  currentDate.value = viewBy.value === 'month'
    ? currentDate.value.add(1, 'month')
    : currentDate.value.add(1, 'week')
  fetchStats()
}

const logout = () => { localStorage.clear(); router.push('/') }
const goProfile = () => router.push('/profile')

onMounted(async () => {
  await nextTick()
  fetchStats()
})
onBeforeUnmount(() => chartInstance?.destroy())
</script>
