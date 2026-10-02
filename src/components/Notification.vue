<template>
  <div class="min-h-screen bg-gradient-to-br from-emerald-50 to-gray-100 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-5xl mx-auto">
      <!-- Header -->
      <h1 class="text-4xl md:text-5xl font-bold text-emerald-800 mb-12 text-center tracking-tight animate__animated animate__fadeInDown">
        <span class="relative">
          Notifikasi
          <span class="absolute -bottom-2 left-0 w-full h-1 bg-emerald-400 rounded-full transform scale-x-0 origin-center transition-transform duration-500 ease-out group-hover:scale-x-100"></span>
        </span>
      </h1>

      <!-- Loading State -->
      <div v-if="isLoading" class="text-center py-12">
        <div class="inline-flex items-center px-6 py-3 bg-emerald-100 rounded-full shadow-md animate__animated animate__pulse animate__infinite">
          <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-emerald-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span class="text-emerald-700 font-medium">Memuat notifikasi...</span>
        </div>
      </div>

      <!-- Error State -->
      <div v-if="error" class="mb-10 p-6 bg-red-50 rounded-2xl shadow-lg text-center transform transition-all duration-300 hover:shadow-xl">
        <p class="text-lg font-semibold text-red-600 animate__animated animate__shakeX">{{ error }}</p>
      </div>

      <!-- Notifications List -->
      <div v-if="!isLoading && !error" class="space-y-6">
        <div 
          v-for="notification in notifications" 
          :key="notification.id" 
          class="bg-white p-6 rounded-2xl shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer"
          :class="{ 'bg-emerald-50 border-l-4 border-emerald-500': !notification.read_at }"
        >
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <p class="text-lg font-semibold text-emerald-800 flex items-center">
                <span class="mr-2">Komentar dari {{ notification.admin_name }}</span>
                <span v-if="!notification.read_at" class="inline-block w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              </p>
              <p v-if="notification.soal_number" class="text-gray-600 mt-2 font-medium">
                <strong class="text-emerald-700">Soal</strong> {{ notification.soal_number }}
                <span v-if="notification.field_name" class="ml-1">• Bagian {{ notification.field_name }}</span>
              </p>
              <p v-else class="text-gray-600 mt-2 font-medium">
                <strong class="text-emerald-700">Status Verifikasi</strong>
              </p>
              <p class="text-gray-700 mt-3 leading-relaxed">{{ notification.comment }}</p>
              <div v-if="notification.deleted_files && notification.deleted_files.length > 0 && !notification.read_at" class="mt-3">
                <p class="text-gray-600 font-medium">File yang dihapus:</p>
                <ul class="list-disc list-inside text-gray-700">
                  <li v-for="file in notification.deleted_files" :key="file.field_name" class="mt-1 flex items-center justify-between">
                    <span>{{ file.field_name }} ({{ file.file_path.split('/').pop() }})</span>
                    <label class="ml-4 flex items-center cursor-pointer">
                      <input 
                        type="file" 
                        @change="uploadFile($event, notification.id, notification.soal_number, file.technical_field_name)" 
                        class="hidden" 
                        accept=".pdf,.jpg,.jpeg,.png" 
                      />
                      <span class="px-3 py-1 bg-emerald-600 text-white rounded-full text-sm font-medium hover:bg-emerald-700 transition-all duration-300">
                        Unggah Ulang
                      </span>
                    </label>
                  </li>
                </ul>
              </div>
              <div class="mt-4 flex items-center justify-between">
                <p class="text-sm text-gray-500 italic">
                  {{ formatDate(notification.created_at) }}
                </p>
                <div v-if="!notification.read_at && notification.soal_number">
                  <router-link
                    :to="`/soal-${notification.soal_number}`"
                    class="px-4 py-2 bg-emerald-600 text-white rounded-full text-sm font-medium hover:bg-emerald-700 transition-all duration-300"
                  >
                    Perbaiki Jawaban
                  </router-link>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- No Notifications -->
        <div v-if="notifications.length === 0" class="text-center py-12 bg-white rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl">
          <svg class="mx-auto h-16 w-16 text-emerald-400 animate__animated animate__fadeIn" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 00-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
          </svg>
          <p class="mt-4 text-gray-600 text-lg font-medium animate__animated animate__fadeIn animate__delay-1s">
            Tidak ada notifikasi saat ini.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useAuthStore } from '@/stores/auth';
import { useDialog } from '@/composables/useDialog';

const authStore = useAuthStore();
const { showAlert } = useDialog();
const notifications = ref([]);
const isLoading = ref(false);
const error = ref(null);

const fetchNotifications = async () => {
  isLoading.value = true;
  error.value = null;

  if (!authStore.accessToken) {
    error.value = 'Silakan login terlebih dahulu.';
    isLoading.value = false;
    return;
  }

  try {
    const response = await axios.get('/api/notifications', {
      headers: { Authorization: `Bearer ${authStore.accessToken}` },
    });
    notifications.value = response.data.data || [];
  } catch (err) {
    console.error('Error fetching notifications:', err.response || err);
    error.value = err.response?.data?.message || 'Gagal memuat notifikasi.';
  } finally {
    isLoading.value = false;
  }
};

const uploadFile = async (event, commentId, soalNumber, fieldName) => {
  const file = event.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append('file', file);
  formData.append('soal_number', soalNumber);
  formData.append('field_name', fieldName);

  try {
    await axios.post(`/api/notifications/${commentId}/upload`, formData, {
      headers: {
        Authorization: `Bearer ${authStore.accessToken}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    await fetchNotifications();
    await showAlert('File berhasil diunggah!', 'Berhasil');
  } catch (err) {
    console.error('Error uploading file:', err.response || err);
    error.value = err.response?.data?.message || 'Gagal mengunggah file.';
  }
};

const formatDate = (dateString) => {
  const options = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric', 
    hour: '2-digit', 
    minute: '2-digit' 
  };
  return new Date(dateString).toLocaleDateString('id-ID', options);
};

onMounted(() => {
  fetchNotifications();
});
</script>

<style scoped>
@import 'animate.css/animate.min.css';

@keyframes slideIn {
  0% { opacity: 0; transform: translateY(-20px); }
  100% { opacity: 1; transform: translateY(0); }
}

.animate__fadeInDown { animation-duration: 0.8s; }
.animate__pulse { animation-duration: 1.5s; }
.animate__shakeX { animation-duration: 0.5s; }

.group:hover .group-hover\:scale-x-100 {
  transform: scaleX(1);
}
</style>