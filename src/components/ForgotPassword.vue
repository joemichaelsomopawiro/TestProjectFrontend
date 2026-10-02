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
      <form @submit.prevent="handleSubmit" class="space-y-6 animate__animated animate__fadeInUp animate__delay-2s">
        <div class="group">
          <label for="email" class="block text-sm font-semibold text-emerald-700 uppercase tracking-wide">Email</label>
          <input
            id="email"
            type="email"
            v-model="email"
            required
            class="mt-2 block w-full rounded-lg border border-emerald-200 p-3 text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 group-hover:border-emerald-300"
            placeholder="Enter your email"
            :disabled="loading"
          />
        </div>
        <div class="group">
          <label for="password" class="block text-sm font-semibold text-emerald-700 uppercase tracking-wide">New Password</label>
          <input
            id="password"
            type="password"
            v-model="password"
            required
            class="mt-2 block w-full rounded-lg border border-emerald-200 p-3 text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 group-hover:border-emerald-300"
            placeholder="New password"
            :disabled="loading"
          />
        </div>
        <div class="group">
          <label for="password_confirmation" class="block text-sm font-semibold text-emerald-700 uppercase tracking-wide">Confirm Password</label>
          <input
            id="password_confirmation"
            type="password"
            v-model="password_confirmation"
            required
            class="mt-2 block w-full rounded-lg border border-emerald-200 p-3 text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 group-hover:border-emerald-300"
            placeholder="Confirm password"
            :disabled="loading"
          />
        </div>
        <div>
          <button
            type="submit"
            class="w-full bg-emerald-600 text-white py-3 px-6 rounded-full font-semibold hover:bg-emerald-700 transition-all duration-300 hover:shadow-md hover:scale-[1.02]"
            :disabled="loading"
          >
            {{ loading ? "Resetting..." : "Reset Password" }}
          </button>
        </div>
        <button
          type="button"
          @click="$router.push('/login')"
          class="w-full text-emerald-700 py-3 px-6 rounded-full font-medium hover:text-emerald-800 hover:bg-emerald-50 transition-all duration-300"
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
      password: '',
      password_confirmation: '',
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
      this.loading = true;
      this.message = '';
      try {
        const response = await axios.post('/api/reset-password', {
          email: this.email,
          password: this.password,
          password_confirmation: this.password_confirmation
        });
        
        await this.showAlert(response.data.message || 'Password berhasil direset', 'Berhasil');
        this.message = response.data.message;
        this.status = true;

        setTimeout(() => {
          this.$router.push('/login');
        }, 2000);
      } catch (error) {
        const errorMsg = error.response?.data?.message || 'An error occurred';
        this.message = errorMsg;
        this.status = false;
        await this.showAlert(errorMsg, 'Error');
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