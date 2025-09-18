<template>
  <div v-if="show" class="modal-overlay">
    <div class="modal">
      <p>{{ message }}</p>
      <div class="actions">
        <button class="btn-small success" @click="$emit('confirm')" style="float: left; margin-left: 5px;">Xác nhận</button>
        <button class="btn-small danger" @click="$emit('close')" style="float: right; margin-right: 5px;">Hủy</button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  show: Boolean,
  message: String
})
defineEmits(['confirm','close'])
</script>
