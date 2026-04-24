<template>
  <div class="screen">
    <div class="box">
      <div class="topbar">
        <h1 class="title">TASK MANAGER</h1>
        <img src="/logo.png" alt="logo" class="logo-small" v-if="hasLogo" />
        <div class="actions">
          <button class="btn-small" @click="goProfile">👤<br>Profile</button>
          <div class="welcome">
            <p>Chào mừng<br /><b>{{ user?.name }}</b></p>
          </div>
          <button class="btn-small danger" @click="logout">➜]<br>Logout</button>
        </div>
      </div>

      <h2 class="subtitle">Danh sách công việc</h2>

      <div style="margin:10px 0;text-align:center;">
        <select v-model="filter" style="padding:6px; border-radius: 4px;">
          <option value="az">A - Z</option>
          <option value="deadlineAsc">Deadline ↑</option>
          <option value="deadlineDesc">Deadline ↓</option>
        </select>
      </div>

      <div class="content">
        <div v-if="filteredTasks.length === 0" class="empty">Chưa có công việc nào</div>

        <div v-for="task in filteredTasks" :key="task.id" 
             class="task-item" :class="{overdue:isOverdue(task.deadline)}">
          <div class="task-info">
            <b>{{ task.title }}</b>
            <p>{{ task.description }}</p>
            <p class="deadline" v-if="task.deadline">
              Hạn: {{ formatDeadline(task.deadline) }}
            </p>
          </div>
          <div class="task-actions">
            <button class="btn-small success" @click="openConfirm(task,'done')">Xong</button>
            <button class="btn-small" @click="openEdit(task)" style="background-color: #ffd700;">Sửa</button>
            <button class="btn-small danger" @click="openConfirm(task,'delete')">Xóa</button>
          </div>
        </div>
      </div>

      <button class="btn add-btn" @click="openAdd">+ Thêm</button>

      <div class="bottombar">
        <button class="nav-btn" @click="$router.push('/main')">Trang chủ</button>
        <button class="nav-btn" @click="$router.push('/chart')">Thống kê</button>
        <button class="nav-btn" @click="$router.push('/history')">Lịch sử</button>
      </div>

      <TaskModal
        :show="showModal"
        :mode="modalMode"
        :task="currentTask"
        @close="closeModal"
        @save="saveTask"
      />
      <ConfirmModal
        :show="showConfirm"
        :message="confirmMessage"
        @close="closeConfirm"
        @confirm="handleConfirm"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '../services/api'
import { useRouter } from 'vue-router'
import TaskModal from '../components/TaskModal.vue'
import ConfirmModal from '../components/ConfirmModal.vue'

const router = useRouter()
const tasks = ref([])
const user = JSON.parse(localStorage.getItem('user') || '{}')
const filter = ref('az')
const hasLogo = ref(true)

const showModal = ref(false)
const modalMode = ref('add')
const currentTask = ref(null)

const showConfirm = ref(false)
const confirmAction = ref('')
const confirmTask = ref(null)
const confirmMessage = ref('')

function formatDeadline(d){
  if(!d) return ''
  return new Date(d).toLocaleString('vi-VN',{hour:'2-digit',minute:'2-digit',day:'2-digit',month:'2-digit'})
}

function isOverdue(deadline){
  if(!deadline) return false
  return new Date(deadline) < new Date()
}

// HÀM QUAN TRỌNG: Lấy task và lọc những cái CHƯA hoàn thành (!status)
const fetchTasks = async () => {
  try {
    const res = await api.get('/tasks')
    // Lọc những task có status là false, 0 hoặc null
    tasks.value = res.data.filter(t => !t.status || t.status === 0 || t.status === '0')
  } catch (error) {
    console.error("Lỗi khi lấy danh sách task:", error)
  }
}

const filteredTasks = computed(()=>{
  let arr = [...tasks.value]
  if(filter.value === 'az') arr.sort((a,b)=>a.title.localeCompare(b.title))
  if(filter.value === 'deadlineAsc') arr.sort((a,b)=> new Date(a.deadline||0)-new Date(b.deadline||0))
  if(filter.value === 'deadlineDesc') arr.sort((a,b)=> new Date(b.deadline||0)-new Date(a.deadline||0))
  return arr
})

function openAdd(){
  modalMode.value = 'add'
  currentTask.value = { title:'', description:'', deadline:'' }
  showModal.value = true
}

function openEdit(task){
  modalMode.value = 'edit'
  currentTask.value = { ...task }
  showModal.value = true
}

function closeModal(){ showModal.value = false }

// HÀM QUAN TRỌNG: Sửa logic lưu để ép status về 0 (chưa xong)
async function saveTask(taskData){
  try {
    if(modalMode.value==='add'){
      // Khi thêm mới, ép status = 0 để nó hiện ở Trang chủ
      await api.post('/tasks', { ...taskData, status: 0 })
    } else {
      await api.put(`/tasks/${currentTask.value.id}`, taskData)
    }
    await fetchTasks()
    showModal.value = false
  } catch (error) {
    alert("Không thể lưu công việc. Vui lòng kiểm tra lại!")
  }
}

function openConfirm(task,action){
  confirmTask.value = task
  confirmAction.value = action
  confirmMessage.value = action==='done'
    ? 'Xác nhận hoàn thành công việc này?'
    : 'Bạn có chắc muốn xóa công việc này?'
  showConfirm.value = true
}

function closeConfirm(){ showConfirm.value = false }

async function handleConfirm(){
  try {
    if(confirmAction.value==='delete'){
      await api.delete(`/tasks/${confirmTask.value.id}`)
    } else if(confirmAction.value==='done'){
      // Khi bấm Xong, cập nhật status = 1 (hoặc true)
      await api.put(`/tasks/${confirmTask.value.id}`, { status: 1 })
    }
    await fetchTasks()
  } catch (error) {
    console.error("Lỗi khi cập nhật trạng thái:", error)
  }
  showConfirm.value = false
}

function logout(){
  localStorage.clear()
  router.push('/')
}
function goProfile(){ router.push('/profile') }

onMounted(fetchTasks)
</script>

<style scoped>
/* Giữ nguyên phần CSS của ní nhé */
.task-item.overdue {
  border-left: 5px solid red;
  background-color: #fff0f0;
}
</style>
