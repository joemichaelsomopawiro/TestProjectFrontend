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
        <h2 class="text-3xl font-bold text-emerald-700 ml-4">IPBI Login</h2>
      </div>

      <!-- Error Message -->
      <div v-if="errorMessage" class="mb-6 p-4 bg-red-50 rounded-lg animate__animated animate__shakeX">
        <p class="text-sm font-medium text-red-600">{{ errorMessage }}</p>
      </div>

      <!-- Login Form -->
      <form @submit.prevent="onSubmit" class="space-y-6 animate__animated animate__fadeInUp animate__delay-2s">
        <!-- Email Input -->
        <div class="group">
          <label for="email-address" class="block text-sm font-semibold text-emerald-700 uppercase tracking-wide">Email</label>
          <input
            id="email-address"
            name="email"
            type="email"
            v-model="email"
            required
            class="mt-2 block w-full rounded-lg border border-emerald-200 p-3 text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 group-hover:border-emerald-300"
            placeholder="Enter your email"
          />
        </div>

        <!-- Password Input -->
        <div class="group">
          <label for="password" class="block text-sm font-semibold text-emerald-700 uppercase tracking-wide">Password</label>
          <div class="relative">
            <input
              id="password"
              name="password"
              :type="showPassword ? 'text' : 'password'"
              v-model="password"
              required
              class="mt-2 block w-full rounded-lg border border-emerald-200 p-3 pr-10 text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 group-hover:border-emerald-300"
              placeholder="Enter your password"
            />
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-emerald-600 transition-colors focus:outline-none"
              tabindex="-1"
            >
              <i v-if="showPassword" class="fas fa-eye-slash"></i>
              <i v-else class="fas fa-eye"></i>
            </button>
          </div>
        </div>

        <!-- Buttons -->
        <div class="space-y-4">
          <button
            type="submit"
            :disabled="isLoading"
            class="w-full bg-emerald-600 text-white py-3 px-6 rounded-full font-semibold hover:bg-emerald-700 transition-all duration-300 hover:shadow-md hover:scale-[1.02] disabled:bg-emerald-400"
          >
            {{ isLoading ? 'Logging in...' : 'Login' }}
          </button>
          <button
            @click="goToRegisterPage"
            class="w-full bg-teal-500 text-white py-3 px-6 rounded-full font-semibold hover:bg-teal-600 transition-all duration-300 hover:shadow-md hover:scale-[1.02]"
          >
            Register
          </button>
          <button
            @click="goToHomePage"
            class="w-full text-emerald-700 py-3 px-6 rounded-full font-medium hover:text-emerald-800 hover:bg-emerald-50 transition-all duration-300"
          >
            Back to Home
          </button>
          <button
            @click="goToForgotPasswordPage"
            class="w-full text-blue-600 py-3 px-6 rounded-full font-medium hover:text-blue-700 hover:bg-blue-50 transition-all duration-300"
          >
            Forgot Password?
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";

const router = useRouter();
const authStore = useAuthStore();

const email = ref("");
const password = ref("");
const errorMessage = ref(null);
const isLoading = ref(false);
const showPassword = ref(false);

const goToRegisterPage = () => {
  router.push({ name: "register" });
};

const goToHomePage = () => {
  router.push({ name: "home" });
};

const goToForgotPasswordPage = () => {
  router.push({ name: "forgot-password" });
};

async function onSubmit() {
  errorMessage.value = null;
  isLoading.value = true;

  try {
    // Skip CSRF cookie karena kita menggunakan token authentication
    // CSRF cookie hanya diperlukan untuk session-based authentication
    // Langsung ke login endpoint
    const response = await axios.post("/api/login", {
      email: email.value,
      password: password.value,
    });

    console.log("Login response:", response.data);

    if (response.data.access_token) {
      authStore.setAccessToken(response.data.access_token);
      authStore.setUser(response.data.user);
      localStorage.setItem('email', email.value);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      console.log("authStore after login:", {
        accessToken: authStore.accessToken,
        user: authStore.user,
        isAdmin: authStore.isAdmin,
      });

      if (authStore.isAdmin) {
        console.log("Redirecting to /admin");
        await router.push('/admin');
      } else {
        console.log("Redirecting to Home");
        await router.push('/');
      }
    } else {
      throw new Error("Invalid login response");
    }
  } catch (error) {
    if (error.response?.data?.errors?.email) {
      errorMessage.value = error.response.data.errors.email[0];
    } else {
      errorMessage.value = error.response?.data?.message || "Login failed. Please try again.";
    }
    console.error("Login error:", error);
  } finally {
    isLoading.value = false;
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