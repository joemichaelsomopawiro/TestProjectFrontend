<template>
  <div class="min-h-screen bg-gradient-to-t from-green-400 to-white py-12 px-6 sm:px-8 lg:px-12">
    <!-- Indikator Total Poin Maksimal -->
    <div class="fixed bottom-6 right-6 bg-green-600 text-white px-4 py-3 rounded-lg shadow-lg z-40">
      <div class="text-sm font-medium">Maksimal Poin</div>
      <div class="text-2xl font-bold">10</div>
    </div>
    
    <div class="max-w-2xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden mt-20">
      <div class="p-8 space-y-6">
        <h1 class="text-3xl font-bold text-gray-900 mb-6">
          Data 14: Kemampuan Mengajar Secara Online
        </h1>

        <!-- Success/Error Messages -->
        <div v-if="successMessage" class="p-4 bg-green-100 text-green-700 rounded-md">
          {{ successMessage }}
        </div>
        <div v-if="errorMessage" class="p-4 bg-red-100 text-red-700 rounded-md">
          {{ errorMessage }}
        </div>

        <form class="space-y-4">
          <div class="flex flex-col space-y-4">
            <div class="flex flex-col gap-2 p-2 bg-gray-50 rounded-md hover:bg-gray-100 transition-all duration-200">
              <label class="text-sm font-medium text-gray-700">
                Pilih Kemampuan Anda:
              </label>
              <select v-model="selectedNgajar" class="border p-2 rounded-md w-full sm:w-2/3 form-radio">
                <option value="" disabled>Pilih kemampuan</option>
                <option value="sendiri">a. Mampu mengajar online seorang diri (10 poin)</option>
                <option value="team">b. Mampu mengajar online dengan bantuan tim (8 poin)</option>
              </select>

              <!-- Show saved status -->
              <div v-if="savedNgajar" class="text-green-600 flex items-center gap-2 mt-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Kemampuan tersimpan: {{ savedNgajar === 'sendiri' ? 'Mengajar sendiri' : 'Dengan tim' }}</span>
              </div>
            </div>
          </div>

          <div class="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 sm:justify-between items-center mt-6">
            <router-link to="/soal-13" 
              @click="saveBeforeNavigation"
              class="uniform-button bg-gray-500 text-white hover:bg-gray-600">
              Kembali
            </router-link>
            
            <button type="button" @click="deleteData"
              v-if="savedNgajar"
              :disabled="loading"
              class="uniform-button bg-red-600 text-white hover:bg-red-700">
              Hapus
              <span v-if="loading" class="spinner ml-2"></span>
            </button>

            <router-link to="/soal-15" 
              @click="saveBeforeNavigation"
              class="uniform-button bg-blue-600 text-white hover:bg-blue-700">
              Lanjut
            </router-link>
          </div>
        </form>
        <p class="text-red-500 text-sm text-center mt-4 opacity-50">
          *Data akan otomatis tersimpan saat berpindah halaman!
        </p>

        <!-- Question Navigation Bar -->
        <div class="mt-8 pt-6 border-t border-gray-200">
          <h3 class="text-lg font-medium text-gray-800 mb-4">Navigasi Soal</h3>
          <div class="flex flex-wrap gap-2">
            <router-link
              v-for="n in 17" 
              :key="n"
              :to="`/soal-${n}`"
              @click="saveBeforeNavigation"
              class="w-10 h-10 flex items-center justify-center rounded-lg text-sm font-medium transition-all duration-200"
              :class="[
                currentQuestionNumber === n 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-200 hover:bg-green-500 hover:text-white text-gray-700'
              ]"
            >
              {{ n }}
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import { useAuthStore } from '@/stores/auth';
import { useRoute } from 'vue-router';

const route = useRoute();
const authStore = useAuthStore();
const selectedNgajar = ref('');
const savedNgajar = ref('');
const successMessage = ref('');
const errorMessage = ref('');
const loading = ref(false);

const currentQuestionNumber = computed(() => {
  const match = route.path.match(/\/soal-(\d+)/);
  return match ? parseInt(match[1]) : 14;
});

onMounted(async () => {
  await fetchAnswer();
});

const fetchAnswer = async () => {
  try {
    loading.value = true;
    const response = await axios.get('/api/soal14', {
      headers: { Authorization: `Bearer ${authStore.accessToken}` }
    });
    
    if (response.data && response.data.data && response.data.data.ngajar_online) {
      savedNgajar.value = response.data.data.ngajar_online;
      selectedNgajar.value = savedNgajar.value; // Sync with saved value
    } else {
      savedNgajar.value = '';
    }
  } catch (error) {
    errorMessage.value = 'Gagal memuat data: ' + (error.response?.data?.message || error.message);
  } finally {
    loading.value = false;
  }
};

const saveBeforeNavigation = async () => {
  if (!selectedNgajar.value || selectedNgajar.value === savedNgajar.value) return; // Tidak ada perubahan atau belum dipilih

  try {
    loading.value = true;
    successMessage.value = '';
    errorMessage.value = '';
    
    const payload = { ngajar_online: selectedNgajar.value };
    const endpoint = savedNgajar.value ? '/api/update14' : '/api/soal14';

    const response = await axios.post(endpoint, payload, {
      headers: { Authorization: `Bearer ${authStore.accessToken}` }
    });

    successMessage.value = response.data.message || 'Kemampuan berhasil disimpan';
    savedNgajar.value = selectedNgajar.value;
    setTimeout(() => successMessage.value = '', 3000);
  } catch (error) {
    errorMessage.value = 'Gagal menyimpan kemampuan: ' + (error.response?.data?.message || error.message);
  } finally {
    loading.value = false;
  }
};

const deleteData = async () => {
  if (!confirm('Apakah Anda yakin ingin menghapus data nomor 14?')) return;

  try {
    loading.value = true;
    await axios.delete('/api/soal14', {
      headers: { Authorization: `Bearer ${authStore.accessToken}` }
    });

    savedNgajar.value = '';
    selectedNgajar.value = '';
    successMessage.value = 'Data kemampuan berhasil dihapus';
    setTimeout(() => successMessage.value = '', 3000);
  } catch (error) {
    errorMessage.value = 'Gagal menghapus data: ' + (error.response?.data?.message || error.message);
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
/* Container Utama */
.min-h-screen {
  background: linear-gradient(to top, #2d6a4f, #f0fdf4);
  padding: 3rem 1.5rem;
  position: relative;
  overflow: hidden;
}

/* Card Container */
.max-w-2xl {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 1.5rem;
  box-shadow: 0 20px 40px rgba(45, 106, 79, 0.15);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

@media (min-width: 640px) {
  .max-w-2xl {
    backdrop-filter: blur(10px);
  }
}

.max-w-2xl:hover {
  transform: translateY(-10px);
  box-shadow: 0 25px 50px rgba(45, 106, 79, 0.25);
}

/* Heading */
.text-3xl {
  font-size: 2.25rem;
  font-weight: 800;
  color: #1f4d2b;
  letter-spacing: -0.025em;
  background: linear-gradient(135deg, #2d6a4f, #34d399);
  -webkit-background-clip: text;
  background-clip: text;
  animation: fadeInDown 0.5s ease-out;
}

/* Form Styling */
.space-y-4 {
  padding: 0 1rem;
}

/* Field Container */
.bg-gray-50 {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
}

/* Label */
.text-sm {
  font-size: 0.875rem;
  font-weight: 500;
  transition: color 0.3s ease;
  white-space: normal;
  word-break: break-word;
}

.text-green-600 {
  text-shadow: 0 1px 2px rgba(52, 211, 153, 0.2);
}

/* Select Input */
.form-radio {
  border: 2px solid #34d399;
  border-radius: 0.5rem;
  color: #2d6a4f;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  background: #ecfdf5;
}

.form-radio:hover:not(:disabled) {
  background: #d1fae5;
  border-color: #2d6a4f;
  box-shadow: 0 0 10px rgba(52, 211, 153, 0.4);
}

/* Uniform Button Styling */
.uniform-button {
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  font-weight: 600;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  width: 100px;
  text-align: center;
}

.uniform-button.bg-green-600 {
  background: linear-gradient(135deg, #2d6a4f, #34d399);
}

.uniform-button.bg-red-600 {
  background: linear-gradient(135deg, #ef4444, #dc2626);
}

.uniform-button.bg-blue-600 {
  background: linear-gradient(135deg, #1e3a8a, #3b82f6);
}

.uniform-button.bg-gray-500 {
  background: linear-gradient(135deg, #6b7280, #4b5563);
}

.uniform-button.bg-green-600:hover:not(:disabled) {
  background: linear-gradient(135deg, #1f4d36, #22c55e);
}

.uniform-button.bg-red-600:hover:not(:disabled) {
  background: linear-gradient(135deg, #dc2626, #b91c1c);
}

.uniform-button.bg-blue-600:hover {
  background: linear-gradient(135deg, #1e40af, #2563eb);
}

.uniform-button.bg-gray-500:hover {
  background: linear-gradient(135deg, #4b5563, #374151);
}

.uniform-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(120deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: all 0.6s ease;
}

.uniform-button:hover::before {
  left: 100%;
}

.uniform-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Spinner */
.spinner {
  border: 2px solid #f3f3f3;
  border-top: 2px solid #34d399;
  border-radius: 50%;
  width: 16px;
  height: 16px;
  animation: spin 1s linear infinite;
  display: inline-block;
}

/* Question Navigation */
.border-t {
  border-color: rgba(45, 106, 79, 0.2);
}

.text-lg.font-medium {
  color: #2d6a4f;
  animation: fadeInUp 0.5s ease-out 0.2s both;
}

.flex.flex-wrap {
  gap: 0.75rem;
}

/* Navigation Buttons */
.w-10.h-10 {
  background: #f0fdf4;
  color: #4a4a4a;
  font-weight: 600;
  border-radius: 0.75rem;
  transition: all 0.3s ease;
}

.bg-green-600.text-white {
  background: linear-gradient(135deg, #2d6a4f, #34d399);
}

.w-10.h-10:hover:not(.bg-green-600) {
  background: #34d399;
  color: white;
  transform: scale(1.1);
}

/* Animations */
@keyframes fadeInDown {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>