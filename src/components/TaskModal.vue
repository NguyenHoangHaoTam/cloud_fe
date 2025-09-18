<template>
  <div v-if="show" class="modal-overlay">
    <div class="modal">
      <h3>{{ mode === 'add' ? 'Thêm công việc' : 'Sửa công việc' }}</h3>
      <input v-model="localTask.title" placeholder="Tiêu đề" />
      <textarea v-model="localTask.description" placeholder="Mô tả"></textarea>
      <label>Deadline:</label>
      <input type="datetime-local" v-model="localTask.deadline" />
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
const emit = defineEmits(['close','save'])

const localTask = reactive({ title:'', description:'', deadline:'' })

watch(() => props.task, (val)=>{
  if (val) Object.assign(localTask, val)
}, { immediate:true })

function save(){
  emit('save', { ...localTask })
}
</script>
