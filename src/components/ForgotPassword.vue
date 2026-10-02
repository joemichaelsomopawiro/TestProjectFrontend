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
        <h2 class="text-3xl font-bold text-emerald-700 ml-4">Reset Password</h2>
      </div>

      <!-- Message Display -->
      <div v-if="message" :class="['mb-6 p-4 rounded-lg animate__animated animate__fadeIn', status ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600']">
        <p class="text-sm font-medium">{{ message }}</p>
      </div>

      <!-- Forgot/Reset Password Form -->
      <form @submit.prevent="handleSubmit" class="space-y-5 animate__animated animate__fadeInUp animate__delay-2s">
        <div class="group">
          <label for="email" class="block text-sm font-semibold text-emerald-700 uppercase tracking-wide">
            Email / Nomor HP <span class="text-red-500">*</span>
          </label>
          <input
            id="email"
            type="text"
            v-model.trim="email"
            required
            class="mt-2 block w-full rounded-lg border border-emerald-200 p-3 text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 group-hover:border-emerald-300"
            placeholder="Masukkan email atau no. HP akun Anda"
            :disabled="loading"
          />
        </div>

        <div class="group">
          <label for="tanggal_lahir" class="block text-sm font-semibold text-emerald-700 uppercase tracking-wide">
            Tanggal Lahir Terdaftar <span class="text-red-500">*</span>
          </label>
          <input
            id="tanggal_lahir"
            type="date"
            v-model="tanggal_lahir"
            required
            class="mt-2 block w-full rounded-lg border border-emerald-200 p-3 text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 group-hover:border-emerald-300"
            :disabled="loading"
          />
          <p class="text-xs text-gray-500 mt-1">Gunakan tanggal lahir yang Anda daftarkan saat membuat akun.</p>
        </div>

        <div class="group">
          <label for="password" class="block text-sm font-semibold text-emerald-700 uppercase tracking-wide">
            Kata Sandi Baru <span class="text-red-500">*</span>
          </label>
          <div class="relative mt-2">
            <input
              id="password"
              :type="showPassword ? 'text' : 'password'"
              v-model="password"
              required
              class="block w-full rounded-lg border border-emerald-200 p-3 pr-10 text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 group-hover:border-emerald-300"
              placeholder="Minimal 8 karakter"
              :disabled="loading"
            />
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 text-gray-500 hover:text-emerald-700"
              tabindex="-1"
            >
              <span class="text-xs font-semibold">{{ showPassword ? 'Sembunyikan' : 'Lihat' }}</span>
            </button>
          </div>
        </div>

        <div class="group">
          <label for="password_confirmation" class="block text-sm font-semibold text-emerald-700 uppercase tracking-wide">
            Konfirmasi Kata Sandi Baru <span class="text-red-500">*</span>
          </label>
          <div class="relative mt-2">
            <input
              id="password_confirmation"
              :type="showConfirmPassword ? 'text' : 'password'"
              v-model="password_confirmation"
              required
              class="block w-full rounded-lg border border-emerald-200 p-3 pr-10 text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 group-hover:border-emerald-300"
              placeholder="Ulangi kata sandi baru"
              :disabled="loading"
            />
            <button
              type="button"
              @click="showConfirmPassword = !showConfirmPassword"
              class="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 text-gray-500 hover:text-emerald-700"
              tabindex="-1"
            >
              <span class="text-xs font-semibold">{{ showConfirmPassword ? 'Sembunyikan' : 'Lihat' }}</span>
            </button>
          </div>
        </div>

        <div class="pt-2">
          <button
            type="submit"
            class="w-full bg-emerald-600 text-white py-3 px-6 rounded-full font-semibold hover:bg-emerald-700 transition-all duration-300 hover:shadow-md hover:scale-[1.02]"
            :disabled="loading"
          >
            {{ loading ? "Memproses..." : "Simpan Kata Sandi Baru" }}
          </button>
        </div>

        <button
          type="button"
          @click="$router.push('/login')"
          class="w-full text-emerald-700 py-2 px-6 rounded-full font-medium hover:text-emerald-800 hover:bg-emerald-50 transition-all duration-300"
        >
          Kembali ke Login
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { useDialog } from '@/composables/useDialog';

export default {
  data() {
    return {
      email: '',
      tanggal_lahir: '',
      password: '',
      password_confirmation: '',
      showPassword: false,
      showConfirmPassword: false,
      loading: false,
      message: '',
      status: false
    }
  },
  setup() {
    const { showAlert } = useDialog();
    return { showAlert };
  },
  methods: {
    async handleSubmit() {
      if (!this.tanggal_lahir) {
        await this.showAlert('Mohon isi tanggal lahir Anda untuk verifikasi identitas.', 'Peringatan');
        return;
      }

      if (this.password !== this.password_confirmation) {
        await this.showAlert('Konfirmasi kata sandi baru tidak cocok.', 'Peringatan');
        return;
      }

      this.loading = true;
      this.message = '';
      try {
        const response = await axios.post('/api/reset-password', {
          email: this.email,
          tanggal_lahir: this.tanggal_lahir,
          password: this.password,
          password_confirmation: this.password_confirmation
        });
        
        await this.showAlert(response.data.message || 'Kata sandi berhasil diperbarui!', 'Berhasil');
        this.message = response.data.message;
        this.status = true;

        setTimeout(() => {
          this.$router.push('/login');
        }, 1500);
      } catch (error) {
        const errorMsg = error.response?.data?.message || 'Terjadi kesalahan. Silakan periksa kembali data Anda.';
        this.message = errorMsg;
        this.status = false;
        await this.showAlert(errorMsg, 'Gagal');
      } finally {
        this.loading = false;
      }
    }
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

/* Animations */
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
</style>