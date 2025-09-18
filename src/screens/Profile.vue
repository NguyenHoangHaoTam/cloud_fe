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
    <div class="content">
      <h2 class="subtitle">Thông tin người dùng</h2>

     <div class="profile-card">
    <div style="background: white; padding: 12px; margin-bottom: 8px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); display: flex; align-items: center;">
      <span style="font-weight: bold; color: #333;">Name:</span>
      <span style="color: #666;">{{ user.name }}</span>
    </div>
    
    <div style="background: white; padding: 12px; margin-bottom: 8px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); display: flex; align-items: center;">
      <span style="font-weight: bold; color: #333;">Email:</span>
      <span style="color: #666;">{{ user.email }}</span>
    </div>
    
    <div style="background: white; padding: 12px; margin-bottom: 8px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); display: flex; align-items: center;">
      <span style="font-weight: bold; color: #333;">ID:</span>
      <span style="color: #666;">{{ user.id }}</span>
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
import { useRouter } from 'vue-router'

const router = useRouter() 
const user = JSON.parse(localStorage.getItem('user') || '{}')

const logout = () => {
  localStorage.clear()
  router.push('/')
}

const goProfile = () => router.push('/profile')
</script>
