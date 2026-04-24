<template>
  <div v-if="show" class="modal-overlay">
    <div class="modal">
      <h3>{{ mode === 'add' ? 'Thêm công việc' : 'Sửa công việc' }}</h3>
      <input v-model="localTask.title" placeholder="Tiêu đề" />
      <textarea v-model="localTask.description" placeholder="Mô tả"></textarea>
      
      <div class="field">
        <label>Deadline:</label>
        <input type="datetime-local" v-model="localTask.deadline" />
      </div>

      <div class="actions">
        <button class="btn-small success" @click="save">Lưu</button>
        <button class="btn-small danger" @click="$emit('close')">Đóng</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, watch } from 'vue'

const props = defineProps({
  show: Boolean,
  mode: String, // 'add' | 'edit'
  task: Object
})
const emit = defineEmits(['close', 'save'])

// Khởi tạo dữ liệu local cho modal
const localTask = reactive({ 
  title: '', 
  description: '', 
  deadline: '' 
})

// Theo dõi prop task để cập nhật dữ liệu khi mở modal (cho trường hợp Sửa)
watch(() => props.task, (val) => {
  if (val) {
    Object.assign(localTask, val)
  } else {
    // Reset nếu là thêm mới
    localTask.title = ''
    localTask.description = ''
    localTask.deadline = ''
  }
}, { immediate: true })

// Hàm xử lý khi nhấn Lưu
function save() {
  // 1. Tạo bản sao dữ liệu để không ảnh hưởng trực tiếp đến giao diện khi đang xử lý
  const dataToSave = { ...localTask };

  // 2. Kiểm tra và định dạng lại ngày tháng
  if (dataToSave.deadline) {
    const d = new Date(dataToSave.deadline);
    
    // Kiểm tra xem ngày tháng có hợp lệ không
    if (!isNaN(d.getTime())) {
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const hours = String(d.getHours()).padStart(2, '0');
      const minutes = String(d.getMinutes()).padStart(2, '0');
      const seconds = String(d.getSeconds()).padStart(2, '0');

      // Chuyển từ định dạng '2026-04-24T21:00' sang '2026-04-24 21:00:00'
      // Đây là định dạng ní đã test thành công trên Thunder Client
      dataToSave.deadline = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }
  }

  // 3. Gửi dữ liệu đã chuẩn hóa về file cha để gọi API
  emit('save', dataToSave);
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex; justify-content: center; align-items: center;
  z-index: 1000;
}
.modal {
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 90%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
input, textarea {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 100%;
}
.field {
  display: flex;
  flex-direction: column;
  gap: 5px;
}
.actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 10px;
}
.btn-small {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.success { background-color: #4caf50; color: white; }
.danger { background-color: #f44336; color: white; }
</style>
