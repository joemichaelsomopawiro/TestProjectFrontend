<template>
  <div class="min-h-screen bg-gradient-to-t from-green-400 to-white py-12 px-6 sm:px-8 lg:px-12">
    <!-- Indikator Total Poin Maksimal -->
    <div class="fixed bottom-6 right-6 bg-green-600 text-white px-4 py-3 rounded-lg shadow-lg z-40">
      <div class="text-sm font-medium">Maksimal Poin</div>
      <div class="text-2xl font-bold">25</div>
    </div>
    
    <div class="max-w-2xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden mt-20">
      <div class="p-8 space-y-6">
        <h1 class="text-3xl font-bold text-gray-900 mb-6">
          Data 3: Apakah anda memiliki kemampuan mengajar dalam bahasa asing?
        </h1>

        <div class="space-y-6">
          <!-- Bahasa Inggris Selection -->
          <div class="space-y-4">
            <label class="text-lg font-medium text-gray-900">Pilih kemampuan Bahasa Inggris:</label>
            <div class="space-y-2">
              <div class="flex items-center">
                <input type="radio" id="dasar" value="Dasar" v-model="inputData.bahasa_inggris" class="form-radio h-4 w-4 text-green-600">
                <label for="dasar" :class="['ml-2 text-sm font-medium', savedData.bahasa_inggris === 'Dasar' ? 'text-green-600' : 'text-gray-700']">
                  a. Bahasa Inggris Dasar (3 poin)
                </label>
              </div>
              <div class="flex items-center">
                <input type="radio" id="fasih" value="Fasih" v-model="inputData.bahasa_inggris" class="form-radio h-4 w-4 text-green-600">
                <label for="fasih" :class="['ml-2 text-sm font-medium', savedData.bahasa_inggris === 'Fasih' ? 'text-green-600' : 'text-gray-700']">
                  b. Bahasa Inggris Fasih (5 poin)
                </label>
              </div>
            </div>
            <div v-if="savedData.bahasa_inggris" class="text-green-600 text-sm mt-1 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <span>Tersimpan: {{ savedData.bahasa_inggris }}</span>
            </div>
          </div>

          <!-- Bahasa Asing Lain -->
          <div class="space-y-4">
            <label class="text-lg font-medium text-gray-900">c. Bahasa Asing lain (maksimal 4 bahasa, 5 poin per bahasa):</label>
            <div class="space-y-3">
              <div v-for="n in 4" :key="n" class="flex flex-col gap-2">
                <input type="text" :placeholder="`Masukkan bahasa asing ${n} (5 poin)`" v-model="inputData[`bahasa_lain${n}`]"
                  :class="['border rounded-md p-2 w-full focus:ring-2 focus:ring-green-500 focus:border-transparent', savedData[`bahasa_lain${n}`] ? 'border-green-500' : 'border-gray-300']">
                <div v-if="savedData[`bahasa_lain${n}`]" class="text-green-600 text-sm mt-1 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Tersimpan: {{ savedData[`bahasa_lain${n}`] }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Button Section -->
          <div class="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 justify-center items-center mt-6">
            <router-link to="/soal-2" 
              class="uniform-button bg-gray-500 text-white rounded-xl py-3 px-6 hover:bg-gray-600 transition-all duration-300 w-full sm:w-auto"
              @click.prevent="handleNavigation('/soal-2')">
              Kembali
            </router-link>
            <button v-if="hasExistingData" type="button" @click="deleteAnswer" 
              class="uniform-button bg-red-600 text-white rounded-xl py-3 px-6 hover:bg-red-700 transition-all duration-300 w-full sm:w-auto">
              Hapus
            </button>
            <router-link to="/soal-4" 
              class="uniform-button bg-blue-600 text-white rounded-xl py-3 px-6 hover:bg-blue-700 transition-all duration-300 w-full sm:w-auto"
              @click.prevent="handleNavigation('/soal-4')">
              Lanjut
            </router-link>
          </div>
        </div>

        <p class="text-red-500 text-sm text-center mt-4 opacity-50">
          *Data akan otomatis tersimpan saat berpindah halaman!
        </p>

        <!-- Question Navigation Bar -->
        <div class="mt-8 pt-6 border-t border-gray-200">
          <h3 class="text-lg font-medium text-gray-800 mb-4">Navigasi Soal</h3>
          <div class="flex flex-wrap gap-2">
            <router-link v-for="n in 17" :key="n" :to="`/soal-${n}`"
              class="w-10 h-10 flex items-center justify-center rounded-lg text-sm font-medium transition-all duration-200"
              :class="[currentQuestionNumber === n ? 'bg-green-600 text-white' : 'bg-gray-200 hover:bg-green-500 hover:text-white text-gray-700']">
              {{ n }}
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import { useAuthStore } from '@/stores/auth';
import { useRoute, useRouter } from 'vue-router';
import { useDialog } from '@/composables/useDialog';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const { showAlert } = useDialog();
const hasExistingData = ref(false);

const inputData = ref({
  bahasa_inggris: '',
  bahasa_lain1: '',
  bahasa_lain2: '',
  bahasa_lain3: '',
  bahasa_lain4: ''
});

const savedData = ref({
  bahasa_inggris: '',
  bahasa_lain1: '',
  bahasa_lain2: '',
  bahasa_lain3: '',
  bahasa_lain4: ''
});

const currentQuestionNumber = computed(() => {
  const match = route.path.match(/\/soal-(\d+)/);
  return match ? parseInt(match[1]) : 1;
});

onMounted(async () => {
  await fetchAnswer();
});

const fetchAnswer = async () => {
  try {
    const response = await axios.get('/api/soal3', {
      headers: { Authorization: `Bearer ${authStore.accessToken}` }
    });
    
    if (response.data && response.data.data) {
      savedData.value = {
        bahasa_inggris: response.data.data.bahasa_inggris || '',
        bahasa_lain1: response.data.data.bahasa_lain1 || '',
        bahasa_lain2: response.data.data.bahasa_lain2 || '',
        bahasa_lain3: response.data.data.bahasa_lain3 || '',
        bahasa_lain4: response.data.data.bahasa_lain4 || ''
      };
      inputData.value = { ...savedData.value };
      hasExistingData.value = Object.values(savedData.value).some(val => val !== '');
    }
  } catch (error) {
    console.error('Error fetching answer:', error.response?.data || error.message);
  }
};

const saveOrUpdateAnswer = async () => {
  try {
    // Cek apakah ada data yang diisi
    const hasInput = Object.values(inputData.value).some(val => val !== '');
    if (!hasInput) return;

    const endpoint = '/api/soal3';
    const method = hasExistingData.value ? 'put' : 'post';
    const response = await axios[method](endpoint, inputData.value, {
      headers: { Authorization: `Bearer ${authStore.accessToken}` }
    });
    
    savedData.value = { ...inputData.value };
    hasExistingData.value = true;
    console.log('Data saved/updated successfully:', response.data);
  } catch (error) {
    console.error('Failed to save/update answer:', error.response?.data || error.message);
    await showAlert('Gagal menyimpan data: ' + (error.response?.data?.message || error.message), 'Error');
  }
};

const deleteAnswer = async () => {
  try {
    await axios.delete('/api/soal3', {
      headers: { Authorization: `Bearer ${authStore.accessToken}` }
    });
    inputData.value = {
      bahasa_inggris: '',
      bahasa_lain1: '',
      bahasa_lain2: '',
      bahasa_lain3: '',
      bahasa_lain4: ''
    };
    savedData.value = { ...inputData.value };
    hasExistingData.value = false;
  } catch (error) {
    console.error('Failed to delete answer:', error.response?.data || error.message);
    await showAlert('Gagal menghapus data: ' + (error.response?.data?.message || error.message), 'Error');
  }
};

const handleNavigation = async (path) => {
  await saveOrUpdateAnswer();
  router.push(path);
};
</script>

<style scoped>
.min-h-screen {
  background: linear-gradient(to top, #2d6a4f, #f0fdf4);
  padding: 3rem 1.5rem;
  position: relative;
  overflow: hidden;
}

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

.text-3xl {
  font-size: 2.25rem;
  font-weight: 800;
  color: #1f4d2b;
  letter-spacing: -0.025em;
  background: linear-gradient(135deg, #2d6a4f, #34d399);
  -webkit-background-clip: text;
  background-clip: text;
}

.space-y-6 {
  padding: 0 1rem;
}

.text-lg {
  color: #2d6a4f;
  font-weight: 600;
  margin-bottom: 1rem;
  transition: color 0.3s ease;
}

.form-radio {
  appearance: none;
  border: 2px solid #34d399;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
}

.form-radio:checked {
  background-color: #34d399;
  border-color: #34d399;
}

.form-radio:hover:not(:disabled) {
  box-shadow: 0 0 10px rgba(52, 211, 153, 0.4);
}

label.text-sm {
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.3s ease;
}

label.text-green-600 {
  text-shadow: 0 2px 4px rgba(52, 211, 153, 0.2);
}

input[type="text"] {
  transition: all 0.3s ease;
}

input[type="text"]:hover:not(:disabled) {
  box-shadow: 0 0 10px rgba(52, 211, 153, 0.4);
}

.uniform-button {
  padding: 0.75rem 2rem;
  border-radius: 9999px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  min-width: 150px;
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

.uniform-button.bg-green-600:hover {
  background: linear-gradient(135deg, #1f4d36, #22c55e);
}

.uniform-button.bg-red-600:hover {
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

.border-t {
  border-color: rgba(45, 106, 79, 0.2);
}

.text-lg.font-medium {
  color: #2d6a4f;
}

.flex.flex-wrap {
  gap: 0.75rem;
}

.w-10.h-10 {
  background: #f0fdf4;
  color: #4a4a4a;
  font-weight: 600;
  border-radius: 0.75rem;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.bg-green-600.text-white {
  background: linear-gradient(135deg, #2d6a4f, #34d399);
}

.w-10.h-10:hover:not(.bg-green-600) {
  background: #34d399;
  color: white;
  transform: scale(1.1);
}

.w-10.h-10::after {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(52, 211, 153, 0.2) 0%, transparent 70%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.w-10.h-10:hover::after {
  opacity: 1;
}
</style>