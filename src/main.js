import { createApp } from 'vue'
import { createPinia } from 'pinia'
import axios from 'axios';

import App from './App.vue'
import router from './router'
import { useDialog } from './composables/useDialog'

// Development: gunakan localhost backend
// Production: gunakan https://api.ipbipendataanguru.org
axios.defaults.baseURL = 'http://127.0.0.1:8000';

// Tidak perlu withCredentials karena menggunakan token authentication (bukan session)
// withCredentials hanya diperlukan jika menggunakan session-based auth dengan Sanctum
axios.defaults.withCredentials = false;

// Add interceptor untuk request
axios.interceptors.request.use(config => {
  // Jangan gunakan credentials untuk menghindari CORS issue
  // Karena kita menggunakan token authentication, tidak perlu credentials
  config.withCredentials = false;
  return config;
}, error => Promise.reject(error));

import "@fortawesome/fontawesome-free/css/all.min.css";


const app = createApp(App)

// Setup global dialog untuk Options API
const { showAlert, showConfirm } = useDialog();
app.config.globalProperties.$alert = showAlert;
app.config.globalProperties.$confirm = showConfirm;

// Setup global untuk Composition API
app.provide('$alert', showAlert);
app.provide('$confirm', showConfirm);

app.use(createPinia())
app.use(router)

app.mount('#app')
