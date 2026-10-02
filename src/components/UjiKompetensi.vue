<template>
  <div class="min-h-screen bg-gradient-to-b from-emerald-100 to-emerald-300">
    <!-- Konten Utama -->
    <div class="max-w-6xl mx-auto p-8 bg-white rounded-2xl shadow-lg mt-24 transition-all duration-300 hover:shadow-xl relative overflow-hidden">
      <!-- Background Decorative Circles -->
      <div class="absolute inset-0 pointer-events-none">
        <div class="circle circle-1 animate-float-slow"></div>
        <div class="circle circle-2 animate-float"></div>
        <div class="circle circle-3 animate-float-fast"></div>
      </div>

      <h1 class="text-4xl md:text-5xl font-extrabold text-emerald-800 mb-10 text-center animate__animated animate__fadeInDown">
        Pemetaan Data Guru IPBI
      </h1>

      <div class="flex justify-center mb-12">
        <button
          @click="checkAvailabilityAndRedirect"
          :disabled="isChecking"
          class="px-10 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-full font-semibold text-lg hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
        >
          <span class="relative z-10">{{ isChecking ? 'Memeriksa...' : 'Mulai Pemetaan Data' }}</span>
          <span class="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
        </button>
      </div>

      <!-- Pesan Ketersediaan -->
      <div v-if="availabilityMessage" class="text-center mb-12 animate__animated animate__fadeIn">
        <div class="bg-gradient-to-r from-gray-50 to-emerald-50 p-6 rounded-xl shadow-md max-w-lg mx-auto">
          <p :class="canTakeTest ? 'text-emerald-600' : 'text-red-600'" class="font-semibold text-lg">
            {{ availabilityMessage }}
          </p>
        </div>
      </div>
    </div>

    <!-- Popup Video -->
    <div v-if="showPopup" class="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 animate__animated animate__fadeIn">
      <div class="bg-white rounded-xl p-6 w-full max-w-5xl mx-4 relative shadow-2xl transform transition-all duration-300 hover:shadow-3xl">
        <button
          @click="closePopup"
          class="absolute top-4 right-6 text-gray-600 hover:text-red-500 transition-colors animate__animated animate__bounceIn z-10"
        >
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <div class="relative w-full" style="padding-bottom: 56.25%;">
          <iframe
            ref="videoPlayer"
            class="absolute top-0 left-0 w-full h-full rounded-lg border border-emerald-200 shadow-sm"
            :src="videoSrc"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          ></iframe>
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
import { useDialog } from '@/composables/useDialog';

const authStore = useAuthStore();
const router = useRouter();
const { showAlert } = useDialog();
const isChecking = ref(false);
const canTakeTest = ref(null);
const availabilityMessage = ref('');
const showPopup = ref(true);
const videoPlayer = ref(null);
const isFullscreen = ref(false);
const videoSrc = ref('https://www.youtube.com/embed/3u8-eRqOTi8');

const checkAvailabilityAndRedirect = async () => {
  if (!authStore.accessToken) {
    console.log('Silakan login terlebih dahulu.');
    router.push('/login');
    return;
  }

  isChecking.value = true;
  try {
    const response = await axios.get('/api/check-availability', {
      headers: { Authorization: `Bearer ${authStore.accessToken}` },
    });

    const { can_take_test, message } = response.data;
    canTakeTest.value = can_take_test;
    availabilityMessage.value = message;

    if (can_take_test) {
      // User bisa ikut tes, redirect ke soal-1
      setTimeout(() => {
        router.push('/soal-1');
      }, 1500);
    } else {
      // User tidak bisa ikut tes lagi, tampilkan popup alert dengan pesan yang jelas
      const alertMessage = message || 
        'Anda tidak dapat mengikuti pemetaan data lagi karena nilai Anda sudah diverifikasi dan telah keluar.\n\n' +
        'Jika Anda sudah terverifikasi, Anda tidak dapat mengulang pemetaan data. Silakan hubungi administrator IPBI jika ada pertanyaan atau ingin melakukan perubahan.';
      
      await showAlert(
        alertMessage,
        'Tidak Dapat Mengikuti Pemetaan Data'
      );
    }
  } catch (error) {
    console.error('Gagal memeriksa ketersediaan:', error.response ? error.response.data : error.message);
    const errorMessage = error.response?.data?.message || 'Terjadi kesalahan. Silakan coba lagi nanti.';
    availabilityMessage.value = errorMessage;
    await showAlert(errorMessage, 'Error');
  } finally {
    isChecking.value = false;
  }
};

const closePopup = () => {
  showPopup.value = false;
  if (videoPlayer.value) {
    videoPlayer.value.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
  }
};

const toggleFullscreen = () => {
  if (videoPlayer.value) {
    if (!isFullscreen.value) {
      if (videoPlayer.value.requestFullscreen) {
        videoPlayer.value.requestFullscreen();
      } else if (videoPlayer.value.webkitRequestFullscreen) {
        videoPlayer.value.webkitRequestFullscreen();
      } else if (videoPlayer.value.msRequestFullscreen) {
        videoPlayer.value.msRequestFullscreen();
      }
      isFullscreen.value = true;
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
      isFullscreen.value = false;
    }
  }
};

onMounted(() => {
  if (!authStore.accessToken) {
    console.log('Silakan login terlebih dahulu.');
  }

  if (videoPlayer.value) {
    document.addEventListener('fullscreenchange', () => {
      isFullscreen.value = !!document.fullscreenElement;
    });
    document.addEventListener('webkitfullscreenchange', () => {
      isFullscreen.value = !!document.webkitFullscreenElement;
    });
    document.addEventListener('msfullscreenchange', () => {
      isFullscreen.value = !!document.msFullscreenElement;
    });
  }
});
</script>

<style scoped>
body {
  font-family: 'Inter', sans-serif;
  margin: 0;
  padding: 0;
}

.circle {
  position: absolute;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(16, 185, 129, 0.3), transparent 70%);
  opacity: 0.3;
}
.circle-1 { width: 180px; height: 180px; top: 5%; left: -60px; }
.circle-2 { width: 140px; height: 140px; bottom: 10%; right: -50px; }
.circle-3 { width: 100px; height: 100px; top: 60%; left: 90%; }

.animate-float { animation: float 6s ease-in-out infinite; }
.animate-float-slow { animation: float 8s ease-in-out infinite; }
.animate-float-fast { animation: float 4s ease-in-out infinite; }
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-25px); }
}

.animate__fadeInDown {
  animation: fadeInDown 0.8s ease-out;
}
@keyframes fadeInDown {
  0% { opacity: 0; transform: translateY(-20px); }
  100% { opacity: 1; transform: translateY(0); }
}

.animate__fadeIn {
  animation: fadeIn 0.5s ease-out;
}
@keyframes fadeIn {
  0% { opacity: 0; }
  100% { opacity: 1; }
}

.animate__bounceIn {
  animation: bounceIn 0.5s;
}
@keyframes bounceIn {
  0% { transform: scale(0); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
}

h1 {
  color: #064e3b;
  text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.15);
}

button {
  transition: all 0.3s ease-in-out;
}

/* Responsive Popup Styling */
@media (max-width: 640px) {
  .max-w-5xl {
    max-width: 90%;
  }
  .p-6 {
    padding: 1rem;
  }
  .px-6 {
    padding-left: 1rem;
    padding-right: 1rem;
  }
  .py-3 {
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
  }
  .mt-6 {
    margin-top: 1rem;
  }
  .top-4 {
    top: 1rem;
  }
  .right-6 {
    right: 1.5rem;
  }
}
</style>