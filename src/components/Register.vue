<template>
  <div class="min-h-screen flex items-center justify-center bg-cover bg-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
    <!-- Background Image -->
    <div class="absolute inset-0 bg-cover bg-center z-0" style="background-image: url('src/assets/loginbackground.jpg')"></div>
    <!-- Decorative Elements -->
    <div class="flower-1"></div>
    <div class="flower-2"></div>
    <div class="flower-3"></div>

    <!-- Form Container -->
    <div class="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 relative z-10 transition-all duration-300 hover:shadow-3xl">
      <!-- Logo and Title -->
      <div class="flex items-center justify-center mb-8 animate__animated animate__fadeIn animate__delay-1s">
        <img src="/src/assets/logoipbi.jpg" alt="Logo" class="h-14 w-auto transition-all duration-300 hover:scale-105" />
        <h2 class="text-3xl font-bold text-emerald-700 ml-4">IPBI Register</h2>
      </div>

      <!-- Error Message -->
      <div v-if="errorMessage" class="mb-6 p-4 bg-red-50 rounded-lg animate__animated animate__shakeX">
        <p class="text-sm font-medium text-red-600">{{ errorMessage }}</p>
      </div>

      <!-- Register Account -->
      <form @submit.prevent="registerAccount" class="space-y-6 animate-slide-scale">
        <div class="group">
          <label for="nama" class="block text-sm font-semibold text-emerald-700 uppercase tracking-wide">Nama Lengkap</label>
          <input
            id="nama"
            type="text"
            v-model.trim="nama"
            required
            class="mt-2 block w-full rounded-lg border border-emerald-200 p-3 text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 group-hover:border-emerald-300"
            placeholder="Nama Lengkap"
          />
        </div>
        <div class="group">
          <label for="email" class="block text-sm font-semibold text-emerald-700 uppercase tracking-wide">Email</label>
          <input
            id="email"
            type="email"
            v-model.trim="email"
            required
            class="mt-2 block w-full rounded-lg border border-emerald-200 p-3 text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 group-hover:border-emerald-300"
            placeholder="Email"
          />
        </div>
        <div class="group">
          <label for="nomor" class="block text-sm font-semibold text-emerald-700 uppercase tracking-wide">Nomor HP</label>
          <input
            id="nomor"
            type="text"
            v-model.trim="nomor"
            required
            class="mt-2 block w-full rounded-lg border border-emerald-200 p-3 text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 group-hover:border-emerald-300"
            placeholder="Masukkan Nomor HP"
          />
        </div>
        <div class="group">
          <label for="password" class="block text-sm font-semibold text-emerald-700 uppercase tracking-wide">Password</label>
          <input
            id="password"
            type="password"
            v-model.trim="password"
            required
            class="mt-2 block w-full rounded-lg border border-emerald-200 p-3 text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 group-hover:border-emerald-300"
            placeholder="Buat Password (min. 8 karakter)"
          />
        </div>
        <div class="group">
          <label for="pekerjaan" class="block text-sm font-semibold text-emerald-700 uppercase tracking-wide">Pekerjaan</label>
          <input
            id="pekerjaan"
            type="text"
            v-model.trim="pekerjaan"
            class="mt-2 block w-full rounded-lg border border-emerald-200 p-3 text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 group-hover:border-emerald-300"
            placeholder="Pekerjaan"
          />
        </div>
        <div class="group">
          <label for="tanggal_lahir" class="block text-sm font-semibold text-emerald-700 uppercase tracking-wide">Tanggal Lahir</label>
          <input
            id="tanggal_lahir"
            type="date"
            v-model="tanggal_lahir"
            class="mt-2 block w-full rounded-lg border border-emerald-200 p-3 text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 group-hover:border-emerald-300"
          />
        </div>
        <div class="group">
          <label for="domisili" class="block text-sm font-semibold text-emerald-700 uppercase tracking-wide">Domisili</label>
          <input
            id="domisili"
            type="text"
            v-model.trim="domisili"
            class="mt-2 block w-full rounded-lg border border-emerald-200 p-3 text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 group-hover:border-emerald-300"
            placeholder="Domisili"
          />
        </div>
        <div class="group">
          <label for="informasi_ipbi" class="block text-sm font-semibold text-emerald-700 uppercase tracking-wide">Pengalaman di IPBI</label>
          <textarea
            id="informasi_ipbi"
            v-model.trim="informasi_ipbi"
            class="mt-2 block w-full rounded-lg border border-emerald-200 p-3 text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 group-hover:border-emerald-300"
            placeholder="Apa pengalaman anda di IPBI?"
            rows="3"
          ></textarea>
        </div>
        <div class="flex space-x-4">
          <button
            type="button"
            @click="goToLoginPage"
            class="w-full bg-gray-500 text-white py-3 px-6 rounded-full font-semibold hover:bg-gray-600 transition-all duration-300 hover:shadow-md hover:scale-[1.02]"
          >
            Batal
          </button>
          <button
            type="submit"
            class="w-full bg-emerald-600 text-white py-3 px-6 rounded-full font-semibold hover:bg-emerald-700 transition-all duration-300 hover:shadow-md hover:scale-[1.02]"
          >
            Daftar Akun
          </button>
        </div>
        <button
          type="button"
          @click="goToLoginPage"
          class="w-full text-emerald-700 py-3 px-6 rounded-full font-medium hover:text-emerald-800 hover:bg-emerald-50 transition-all duration-300"
        >
          Sudah punya akun? Login di sini
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import { useDialog } from "@/composables/useDialog";

const router = useRouter();
const { showAlert } = useDialog();

const errorMessage = ref(null);

// Data untuk registrasi
const nomor = ref("");
const nama = ref("");
const email = ref("");
const password = ref("");
const pekerjaan = ref("");
const tanggal_lahir = ref("");
const domisili = ref("");
const informasi_ipbi = ref("");

const goToLoginPage = () => {
  router.push({ name: "login" });
};

async function registerAccount() {
  try {
    const response = await axios.post("/api/register", {
      name: nama.value,
      email: email.value,
      password: password.value,
      NoHp: nomor.value, // Menggunakan nomor dari langkah OTP
      pekerjaan: pekerjaan.value || null,
      tanggal_lahir: tanggal_lahir.value || null,
      domisili: domisili.value || null,
      informasi_ipbi: informasi_ipbi.value || null,
      is_admin: false, // Default false untuk user biasa
      nilai: null, // Default null
      temporary_score: null, // Default null
      last_submission_date: null, // Default null
      is_verified: false, // Default false
      can_take_test: true, // Default true
      status: "active", // Default active
    });
    await showAlert(response.data.message || 'Akun berhasil didaftarkan', 'Registrasi Berhasil');
    router.push({ name: "login" });
  } catch (error) {
    errorMessage.value = error.response?.data?.message || "Gagal mendaftarkan akun";
    console.error("Registration error:", error.response?.data);
  }
}
</script>

<style scoped>
/* Decorative Flowers */
.flower-1, .flower-2, .flower-3 {
  @apply absolute w-72 h-72 rounded-full opacity-10;
  background: radial-gradient(circle, #34d399 0%, transparent 70%);
}

.flower-1 {
  top: -4rem;
  right: 15%;
  animation: float 7s ease-in-out infinite;
}

.flower-2 {
  bottom: 15%;
  left: -4rem;
  animation: float 8s ease-in-out infinite 1s;
}

.flower-3 {
  bottom: -4rem;
  right: 25%;
  animation: float 9s ease-in-out infinite 2s;
}

/* Custom Slide and Scale Animation */
@keyframes slideScale {
  0% {
    opacity: 0;
    transform: translateY(50px) scale(0.95);
    filter: blur(2px);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
    filter: blur(0);
  }
}

.animate-slide-scale {
  animation: slideScale 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

/* Animations for Background Flowers */
@keyframes float {
  0%, 100% { transform: translateY(0) scale(1); }
  50% { transform: translateY(-25px) scale(1.05); }
}

/* Shadow Enhancement */
.shadow-3xl {
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

/* Transitions */
.transition-all {
  transition: all 0.3s ease-in-out;
}

/* Animations Import */
@import url('https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css');

/* Styling untuk RouterLink di dalam tombol */
.nav-link {
  color: white;
  text-decoration: none;
  display: block;
  width: 100%;
  height: 100%;
}
</style>