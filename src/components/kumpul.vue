<template>
  <div class="min-h-screen bg-gradient-to-t from-emerald-900 to-teal-300 py-12 px-6 sm:px-8 lg:px-12 relative overflow-hidden">
    <!-- Background Decorations -->
    <div class="absolute inset-0 pointer-events-none">
      <div class="circle circle-1 animate-float-slow"></div>
      <div class="circle circle-2 animate-float"></div>
      <div class="circle circle-3 animate-float-fast"></div>
    </div>

    <div class="max-w-5xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden mt-20 transform transition-all duration-500 hover:shadow-3xl">
      <div class="p-6 sm:p-10 space-y-12">
        <!-- Header -->
        <h1 class="text-3xl sm:text-4xl font-extrabold text-emerald-900 tracking-tight animate-slide-in">
          Status Pengerjaan Pemetaan Data Guru IPBI
        </h1>

        <!-- Status Soal -->
        <div v-if="overview" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <router-link
            v-for="(data, key) in overview"
            :key="key"
            :to="`/soal-${getSoalNumber(key)}`"
            class="relative group p-6 rounded-xl bg-gradient-to-br transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
            :class="{
              'from-green-100 to-green-200 border-green-400': data.completed,
              'from-red-100 to-red-200 border-red-400': !data.completed
            }"
          >
            <div class="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
            <div class="relative font-semibold text-lg text-gray-800">{{ data.title }}</div>
            <div class="relative flex justify-between mt-3 text-sm">
              <span 
                :class="{
                  'text-green-700': data.completed,
                  'text-red-700': !data.completed
                }" 
                class="font-medium animate-fade-in-up"
              >
                {{ data.completed ? 'Sudah Dikerjakan' : 'Belum Dikerjakan' }}
              </span>
              <span class="text-gray-700 font-medium">Nilai: {{ data.nilai ?? 'N/A' }}</span>
            </div>
            <div class="absolute inset-0 border-2 border-transparent group-hover:border-emerald-500 rounded-xl transition-all duration-300"></div>
          </router-link>
        </div>
        <div v-else class="text-center text-gray-600 animate-pulse">
          Memuat data... atau tidak ada data tersedia.
        </div>

        <!-- Daftar Soal yang Kosong -->
        <div class="space-y-4 animate-slide-in-up">
          <h2 class="text-xl sm:text-2xl font-bold text-gray-800">Data yang Belum Dijawab Sama Sekali</h2>
          <ul v-if="emptySoals.length > 0" class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <li v-for="soal in emptySoals" :key="soal" class="p-3 bg-red-50 rounded-lg text-gray-700 font-medium transform transition-all duration-300 hover:bg-red-100 hover:scale-102">
              <router-link :to="`/soal-${soal}`" class="block w-full h-full">
                Soal {{ soal }}
              </router-link>
            </li>
          </ul>
          <p v-else class="text-green-600 text-lg font-semibold animate-bounce-in">Semua Data telah dijawab!</p>
        </div>

        <!-- Potensi Nilai -->
        <div class="space-y-2 animate-slide-in-up">
          <h2 class="text-xl sm:text-2xl font-bold text-gray-800">Potensi Nilai</h2>
          <p class="text-lg sm:text-xl text-gray-700 font-semibold">
            <span class="text-2xl sm:text-3xl font-extrabold text-emerald-700 animate-pulse">{{ totalNilai }}</span> / 462
          </p>
        </div>

        <!-- Tombol Aksi -->
        <div class="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-6 sm:justify-between items-center mt-8">
          <router-link
            to="/soal-17"
            class="action-button bg-gradient-to-r from-gray-600 to-gray-800 text-white hover:from-gray-700 hover:to-gray-900"
          >
            Kembali
          </router-link>
          <button
            @click="confirmSubmit"
            class="action-button bg-gradient-to-r from-blue-600 to-teal-500 text-white hover:from-blue-700 hover:to-teal-600"
          >
            Kumpulkan
          </button>
        </div>
      </div>
    </div>

    <!-- Popup Konfirmasi -->
    <div v-if="showPopup" class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 animate-fade-in">
      <div class="bg-white rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl transform transition-all duration-300 scale-95 hover:scale-100">
        <h3 class="text-lg sm:text-xl font-bold text-gray-800 mb-4 animate-slide-in-down">Konfirmasi Pengumpulan</h3>
        <p class="text-gray-700 leading-relaxed animate-fade-in-up">
          Apakah Anda yakin? Jika anda mengumpulkan maka anda siap untuk diperiksa datanya. Apabila jawaban anda sudah diverfikasi oleh pihak IPBI anda tidak akan bisa mengakses Pemetaan Data ini lagi. Silahkan periksa ulang jawaban anda sehingga proses pemeriksaan berjalan dengan lancar!
          
        </p>
        <div class="flex justify-end space-x-4 mt-6">
          <button
            @click="showPopup = false"
            class="action-button bg-gradient-to-r from-gray-500 to-gray-600 text-white hover:from-gray-600 hover:to-gray-700"
          >
            Batal
          </button>
          <button
            @click="submitFinal"
            class="action-button bg-gradient-to-r from-blue-600 to-teal-500 text-white hover:from-blue-700 hover:to-teal-600"
          >
            Ya, Kumpulkan
          </button>
        </div>
      </div>
    </div>

    <!-- Popup Sukses -->
    <div v-if="showSuccess" class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 animate-fade-in">
      <div class="bg-white rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl transform transition-all duration-300 scale-95 hover:scale-100">
        <h3 class="text-lg sm:text-xl font-bold text-green-700 mb-4 animate-slide-in-down">Pengumpulan Berhasil!</h3>
        <p class="text-gray-700 leading-relaxed animate-fade-in-up">
          Ujian Anda telah berhasil dikumpulkan. Terima kasih atas kerja keras Anda!
        </p>
        <div class="flex justify-end mt-6">
          <button
            @click="closeSuccess"
            class="action-button bg-gradient-to-r from-green-600 to-emerald-500 text-white hover:from-green-700 hover:to-emerald-600"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();
const overview = ref(null);
const emptySoals = ref([]);
const totalNilai = ref(0);
const showPopup = ref(false);
const showSuccess = ref(false);

onMounted(async () => {
  await fetchSoalStatus();
});

const fetchSoalStatus = async () => {
  try {
    const response = await axios.get('/api/overview', {
      headers: { Authorization: `Bearer ${authStore.accessToken}` }
    });

    overview.value = response.data.data || {};
    totalNilai.value = response.data.total_nilai || 0;
    
    emptySoals.value = Object.keys(overview.value)
      .filter(key => !overview.value[key].completed)
      .map(key => getSoalNumber(key));
  } catch (error) {
    console.error('Error fetching soal status:', error.response ? error.response.data : error.message);
    overview.value = {};
    totalNilai.value = 0;
    emptySoals.value = [];
  }
};

// Fungsi untuk mendapatkan nomor soal dari kunci
const getSoalNumber = (key) => {
  if (key.includes('-')) {
    return parseInt(key.split('-')[1], 10);
  }
  return parseInt(key.replace('soal', ''), 10);
};

const confirmSubmit = () => {
  showPopup.value = true;
};

const submitFinal = async () => {
  try {
    await axios.post(
      '/api/submit-competency',
      { temporary_score: totalNilai.value },
      { headers: { Authorization: `Bearer ${authStore.accessToken}` } }
    );

    await axios.post(
      '/api/kumpul',
      {},
      { headers: { Authorization: `Bearer ${authStore.accessToken}` } }
    );

    showPopup.value = false;
    showSuccess.value = true;
  } catch (error) {
    console.error('Error submitting:', error.response ? error.response.data : error.message);
    showPopup.value = false;
  }
};

const closeSuccess = () => {
  showSuccess.value = false;
  router.push('/');
};
</script>

<style scoped>
/* Background and Container */
.min-h-screen {
  background: linear-gradient(to top, #065f46, #ccfbf1);
  padding: 3rem 1.5rem;
  position: relative;
  overflow: hidden;
}

.max-w-5xl {
  background: rgba(255, 255, 255, 1);
  border-radius: 1.5rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

/* Decorative Circles */
.circle {
  position: absolute;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(16, 185, 129, 0.3), transparent 70%);
  opacity: 0.15;
}
.circle-1 { width: 200px; height: 200px; top: 10%; left: -50px; }
.circle-2 { width: 150px; height: 150px; bottom: 20%; right: -30px; }
.circle-3 { width: 100px; height: 100px; top: 50%; left: 80%; }

/* Typography */
.text-4xl {
  font-size: 2.5rem;
  background: linear-gradient(135deg, #065f46, #10b981);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.text-2xl {
  font-size: 1.5rem;
  color: #064e3b;
}

/* Buttons */
.action-button {
  padding: 0.75rem 2rem;
  border-radius: 9999px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  min-width: 140px;
  text-align: center;
}

.action-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(120deg, transparent, rgba(255, 255, 255, 0.4), transparent);
  transition: all 0.6s ease;
}

.action-button:hover::before {
  left: 100%;
}

/* Animations */
.animate-float { animation: float 6s ease-in-out infinite; }
.animate-float-slow { animation: float 8s ease-in-out infinite; }
.animate-float-fast { animation: float 4s ease-in-out infinite; }
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}

.animate-slide-in { animation: slideIn 0.6s ease-out; }
@keyframes slideIn {
  from { opacity: 0; transform: translateX(-30px); }
  to { opacity: 1; transform: translateX(0); }
}

.animate-slide-in-up { animation: slideInUp 0.8s ease-out; }
@keyframes slideInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in { animation: fadeIn 0.5s ease-out; }
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.animate-fade-in-up { animation: fadeInUp 0.6s ease-out; }
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(15px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-bounce-in { animation: bounceIn 0.8s ease-out; }
@keyframes bounceIn {
  0% { opacity: 0; transform: scale(0.9); }
  60% { opacity: 1; transform: scale(1.05); }
  100% { transform: scale(1); }
}

.animate-pulse { animation: pulse 2s infinite; }
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

/* Responsive Adjustments */
@media (max-width: 640px) {
  .min-h-screen {
    padding: 2rem 1rem;
  }
  .max-w-5xl {
    margin-top: 1rem;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }
  .circle-1 { width: 100px; height: 100px; }
  .circle-2 { width: 80px; height: 80px; }
  .circle-3 { width: 60px; height: 60px; }
}
</style>