<template>
  <div id="app">
    <!-- Navbar -->
    <nav 
      v-if="!hideNavAndFooter" 
      class="navbar bg-white shadow-lg transition-all duration-500 ease-in-out"
    >
      <div class="container mx-auto px-6 flex items-center justify-between">
        <!-- Logo -->
        <RouterLink 
          to="/" 
          class="logo-link flex items-center transition-all duration-300 ease-in-out hover:scale-105"
        >
          <img src="/src/assets/logoipbi.jpg" alt="Logo" class="h-12 w-auto">
          <span class="logo-text hidden lg:inline">Pemetaan Data Guru IPBI</span>
        </RouterLink>

        <!-- Hamburger Menu -->
        <button 
          @click.stop="toggleMenu" 
          class="lg:hidden text-3xl focus:outline-none transition-all duration-300 hover:text-emerald-600"
        >
          <span class="hamburger-icon">☰</span>
        </button>

        <!-- Desktop Menu -->
        <div class="hidden lg:flex items-center space-x-8">
          <!-- Admin Page Link (hanya untuk admin) -->
          <RouterLink 
            v-if="authStore.isUserAdmin" 
            to="/admin" 
            class="admin-link"
          >
            Admin Page
          </RouterLink>
          <RouterLink to="/" class="nav-link">Home</RouterLink>
          <RouterLink to="/uji-kompetensi" class="nav-link">Pemetaan Data</RouterLink>
          
          

          <!-- Auth Links -->
          <template v-if="!authStore.isLoggedIn">
            <RouterLink to="/login" class="nav-link">Login</RouterLink>
            <RouterLink to="/register" class="auth-button">Register</RouterLink>
          </template>
          <template v-else>
            <RouterLink to="/users" class="nav-link">Profile</RouterLink>
            <button @click="logout" class="auth-button logout">Logout</button>
          </template>

          <!-- Notification Bell -->
          <div class="relative notification-wrapper">
            <button 
              @click.stop="toggleNotifications" 
              class="nav-link notification-btn flex items-center focus:outline-none z-50"
            >
              <svg class="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 00-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
              </svg>
              <span v-if="unreadCount > 0" class="absolute top-0 right-0 w-2.5 h-2.5 bg-red-600 rounded-full"></span>
            </button>
            <!-- Notification Dropdown -->
            <div 
              v-if="notificationsOpen" 
              class="dropdown absolute right-0 mt-2 w-72 bg-white shadow-lg rounded-lg p-2 z-50 animate__animated animate__fadeInDown"
            >
              <RouterLink 
                to="/notifications" 
                class="dropdown-item flex items-center justify-between"
                @click="toggleNotifications"
              >
                <span>Lihat Semua Notifikasi</span>
                <span v-if="unreadCount > 0" class="text-xs text-white bg-red-600 px-2 py-1 rounded-full">{{ unreadCount }}</span>
              </RouterLink>
            </div>
          </div>
        </div>
      </div>

      <!-- Mobile Dropdown -->
      <div 
        v-if="menuOpen" 
        class="dropdown lg:hidden animate__animated animate__fadeInDown animate__faster"
      >
        <RouterLink to="/" class="dropdown-item" @click="toggleMenu">Home</RouterLink>
        <RouterLink to="/uji-kompetensi" class="dropdown-item" @click="toggleMenu">Pemetaan Data</RouterLink>
        <RouterLink to="/notifications" class="dropdown-item" @click="toggleMenu">Notifikasi</RouterLink>
        <RouterLink to="/users" class="dropdown-item" v-if="authStore.isLoggedIn" @click="toggleMenu">Profile</RouterLink>
        <!-- Admin Page di Mobile Dropdown -->
        <RouterLink 
          v-if="authStore.isUserAdmin" 
          to="/admin" 
          class="dropdown-item admin-dropdown-item" 
          @click="toggleMenu"
        >
          Admin Page
        </RouterLink>
        <RouterLink to="/login" class="dropdown-item" v-if="!authStore.isLoggedIn" @click="toggleMenu">Login</RouterLink>
        <RouterLink to="/register" class="dropdown-item" v-if="!authStore.isLoggedIn" @click="toggleMenu">Register</RouterLink>
        <button v-if="authStore.isLoggedIn" @click="logout" class="dropdown-item logout">Logout</button>
      </div>
    </nav>

    <!-- Main Content -->
    <div class="content-wrapper">
      <RouterView />
    </div>

    <!-- Dialog Popup for Messages -->
    <DialogPopup 
      v-model:visible="showDialog" 
      :title="dialogTitle" 
      :message="dialogMessage"
      @confirm="showDialog = false"
    />

    <!-- Global Dialog Popup -->
    <DialogPopup 
      v-model:visible="globalDialogState.visible" 
      :title="globalDialogState.title" 
      :message="globalDialogState.message"
      :show-cancel="globalDialogState.showCancel"
      @confirm="handleGlobalDialogConfirm"
      @cancel="handleGlobalDialogCancel"
    />

    <!-- Footer -->
    <footer 
      v-if="!hideNavAndFooter" 
      class="footer bg-gradient-to-r from-emerald-900 to-teal-800 text-white shadow-lg transition-all duration-500 ease-in-out"
    >
      <div class="container mx-auto px-6 py-8">
        <div class="flex flex-col md:flex-row justify-between items-center">
          <p class="text-sm mb-4 md:mb-0">© 2025 Ikatan Perangkai Bunga Indonesia. All rights reserved.</p>
          <div class="flex space-x-6">
            <a href="#" class="footer-link">Privacy Policy</a>
            <a href="#" class="footer-link">Terms of Service</a>
            <a href="#" class="footer-link">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { useAuthStore } from "@/stores/auth";
import { useRouter, useRoute } from "vue-router";
import { computed, ref, onMounted, onUnmounted, watch } from "vue";
import axios from 'axios';
import DialogPopup from '@/components/DialogPopup.vue';
import { dialogState as globalDialogState } from '@/composables/useDialog';

const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();

const showDialog = ref(false);
const dialogTitle = ref('Pemberitahuan');
const dialogMessage = ref('');

const handleGlobalDialogConfirm = () => {
  if (globalDialogState.value.onConfirm) {
    globalDialogState.value.onConfirm();
  }
  globalDialogState.value.visible = false;
};

const handleGlobalDialogCancel = () => {
  if (globalDialogState.value.onCancel) {
    globalDialogState.value.onCancel();
  }
  globalDialogState.value.visible = false;
};

const hideNavAndFooter = computed(() => {
  const authRoutes = ["/login", "/register", "/forgot-password", "/reset-password"];
  const adminRoutes = [route.path.startsWith("/admin")];
  return authRoutes.includes(route.path) || adminRoutes.some(condition => condition);
});

const menuOpen = ref(false);
const notificationsOpen = ref(false);
const notifications = ref([]);
const unreadCount = ref(0);

const toggleMenu = () => {
  menuOpen.value = !menuOpen.value;
  if (notificationsOpen.value) notificationsOpen.value = false;
};

const toggleNotifications = () => {
  console.log('Notification button clicked');
  notificationsOpen.value = !notificationsOpen.value;
  if (menuOpen.value) menuOpen.value = false;
};

const closeMenu = (event) => {
  if (!event.target.closest(".dropdown") && !event.target.closest(".hamburger-icon") && !event.target.closest(".notification-btn")) {
    menuOpen.value = false;
    notificationsOpen.value = false;
  }
};

const fetchNotifications = async () => {
  if (!authStore.isLoggedIn || !authStore.accessToken) return;

  try {
    const response = await axios.get('/api/notifications', {
      headers: { Authorization: `Bearer ${authStore.accessToken}` },
    });
    notifications.value = response.data.data || [];
    unreadCount.value = notifications.value.filter(n => !n.read_at).length;
  } catch (error) {
    console.error('Error fetching notifications:', error.response || error);
  }
};

// Watch route query untuk menampilkan dialog
watch(() => route.query.message, (message) => {
  if (message) {
    dialogTitle.value = route.name === 'login' ? 'Login Required' : 'Akses Ditolak';
    dialogMessage.value = message;
    showDialog.value = true;
    // Hapus query parameter setelah ditampilkan
    const newQuery = { ...route.query };
    delete newQuery.message;
    router.replace({ query: newQuery });
  }
});

onMounted(() => {
  document.addEventListener("click", closeMenu);
  fetchNotifications();
  
  // Check for message in query on mount
  if (route.query.message) {
    dialogTitle.value = route.name === 'login' ? 'Login Required' : 'Akses Ditolak';
    dialogMessage.value = route.query.message;
    showDialog.value = true;
  }
});

onUnmounted(() => {
  document.removeEventListener("click", closeMenu);
});

const logout = () => {
  authStore.logout();
  router.push({ name: "home" });
  menuOpen.value = false;
  notificationsOpen.value = false;
};
</script>

<style scoped>
@import 'animate.css/animate.min.css';

#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.content-wrapper {
  flex-grow: 1;
}

.navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  padding: 1rem 0;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
}

.logo-link {
  display: flex;
  align-items: center;
}

.logo-text {
  color: #2d6a4f;
  font-weight: 600;
  font-size: 1.25rem;
  margin-left: 1rem;
}

.nav-link {
  color: #2d6a4f;
  font-weight: 500;
  font-size: 1.1rem;
  position: relative;
  padding-bottom: 0.25rem;
  transition: all 0.3s ease;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 0;
  height: 2px;
  background: #34d399;
  transition: all 0.3s ease;
  transform: translateX(-50%);
}

.nav-link:hover {
  color: #34d399;
}

.nav-link:hover::after {
  width: 100%;
}

/* Admin Link untuk Desktop */
.admin-link {
  color: #1e3a8a; /* Warna biru tua */
  font-weight: 600;
  font-size: 1.1rem;
  position: relative;
  padding-bottom: 0.25rem;
  transition: all 0.3s ease;
}

.admin-link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 0;
  height: 2px;
  background: #3b82f6; /* Biru cerah */
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  transform: translateX(-50%);
}

.admin-link:hover {
  color: #3b82f6;
  transform: translateY(-2px);
}

.admin-link:hover::after {
  width: 100%;
}

.notification-btn {
  pointer-events: auto;
  padding: 0.5rem;
  cursor: pointer;
}

.notification-wrapper {
  position: relative;
  z-index: 1001;
}

.auth-button {
  padding: 0.5rem 1.5rem;
  border-radius: 9999px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.auth-button:not(.logout) {
  background: linear-gradient(135deg, #2d6a4f, #34d399);
  color: white;
}

.auth-button:not(.logout):hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(45, 106, 79, 0.2);
}

.logout {
  background: none;
  color: #ef4444;
}

.logout:hover {
  color: #dc2626;
}

.hamburger-icon {
  display: inline-block;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  font-size: 1.75rem;
  color: #2d6a4f;
}

.hamburger-icon:hover {
  transform: rotate(90deg) scale(1.1);
  color: #34d399;
}

.dropdown {
  position: absolute;
  top: 100%;
  right: 1.5rem;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 1rem;
  box-shadow: 0 15px 35px rgba(45, 106, 79, 0.15);
  padding: 1rem;
  width: 220px;
  z-index: 200;
  backdrop-filter: blur(8px);
  transform-origin: top right;
  animation: slideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes slideIn {
  0% {
    opacity: 0;
    transform: scale(0.9) translateY(-10px);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.dropdown-item {
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  color: #2d6a4f;
  font-weight: 500;
  border-radius: 0.5rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  margin: 0.25rem 0;
}

.dropdown-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(120deg, transparent, rgba(52, 211, 153, 0.2), transparent);
  transition: all 0.5s ease;
  z-index: -1;
}

.dropdown-item:hover::before {
  left: 100%;
}

.dropdown-item:hover {
  transform: translateX(8px);
  color: #34d399;
  background: rgba(240, 253, 244, 0.5);
  box-shadow: 0 4px 15px rgba(52, 211, 153, 0.2);
}

/* Admin Link untuk Mobile Dropdown */
.admin-dropdown-item {
  color: #1e3a8a;
  font-weight: 600;
}

.admin-dropdown-item::before {
  background: linear-gradient(120deg, transparent, rgba(59, 130, 246, 0.2), transparent);
}

.admin-dropdown-item:hover {
  color: #3b82f6;
  background: rgba(219, 234, 254, 0.5);
  box-shadow: 0 4px 15px rgba(59, 130, 246, 0.2);
  transform: translateX(8px);
}

.dropdown-item.logout {
  color: #ef4444;
}

.dropdown-item.logout:hover {
  color: #dc2626;
  background: rgba(254, 242, 242, 0.5);
  box-shadow: 0 4px 15px rgba(239, 68, 68, 0.2);
}

.footer {
  background: linear-gradient(135deg, #1f4d2b, #2d6a4f);
}

.footer-link {
  color: #d4f4dd;
  font-size: 0.9rem;
  position: relative;
  padding-bottom: 0.25rem;
  transition: all 0.3s ease;
}

.footer-link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 0;
  height: 1px;
  background: #34d399;
  transition: all 0.3s ease;
  transform: translateX(-50%);
}

.footer-link:hover {
  color: #34d399;
}

.footer-link:hover::after {
  width: 100%;
}

.animate__animated.animate__fadeInDown {
  --animate-duration: 0.4s;
}

@media (max-width: 1024px) {
  .logo-text {
    display: none;
  }
}

@media (max-width: 768px) {
  .dropdown {
    width: 200px;
    right: 1rem;
  }
}
</style>