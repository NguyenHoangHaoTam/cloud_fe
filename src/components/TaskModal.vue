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

// --- KHÚC NÀY LÀ CỨU TINH CỦA NÍ NÈ ---
function save() {
  // Tạo một bản copy để không làm hỏng dữ liệu đang hiển thị trên ô input
  const dataToSave = { ...localTask };

  // Nếu có deadline, mình ép nó về định dạng YYYY-MM-DD HH:mm:ss
  if (dataToSave.deadline) {
    const d = new Date(dataToSave.deadline);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const seconds = String(d.getSeconds()).padStart(2, '0');

    // Ghi đè lại định dạng mà Laravel/SQL Server yêu thích
    dataToSave.deadline = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  emit('save', dataToSave);
}
// --------------------------------------
</script>
