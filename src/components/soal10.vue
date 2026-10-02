<template>
  <div class="min-h-screen bg-gradient-to-t from-green-400 to-white py-12 px-6 sm:px-8 lg:px-12">
    <!-- Indikator Total Poin Maksimal -->
    <div class="fixed bottom-6 right-6 bg-green-600 text-white px-4 py-3 rounded-lg shadow-lg z-40">
      <div class="text-sm font-medium">Maksimal Poin</div>
      <div class="text-2xl font-bold">40</div>
    </div>
    
    <div class="max-w-2xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden mt-20">
      <div class="p-8 space-y-6">
        <h1 class="text-3xl font-bold text-gray-900 mb-6">
          Data 10: Sebagai Demonstrator/Guru/Nara Sumber Bersertifikat
        </h1>

        <!-- Success/Error Messages -->
        <div v-if="successMessage" class="p-4 bg-green-100 text-green-700 rounded-md">
          {{ successMessage }}
        </div>
        <div v-if="errorMessage" class="p-4 bg-red-100 text-red-700 rounded-md">
          {{ errorMessage }}
        </div>

        <div class="space-y-4">
          <div class="flex flex-col space-y-4">
            <div v-for="(field, index) in certificateFields" :key="index">
              <hr v-if="['ipbi_online1', 'non_ipbi_offline1', 'non_ipbi_online1', 'international_offline1', 'international_online1', 'host_moderator1'].includes(field.key)" 
                class="border-t border-gray-300 my-4">
              
              <div class="flex flex-col gap-2 p-2 bg-gray-50 rounded-md hover:bg-gray-100 transition-all duration-200">
                <label :for="field.key" 
                  :class="[
                    'text-sm font-medium',
                    savedFiles[field.key] ? 'text-green-600' : 'text-gray-700'
                  ]">
                  {{ field.label }}
                </label>

                <div class="flex items-center gap-2">
                  <div v-if="savedFiles[field.key]" class="flex items-center gap-2">
                    <div class="text-green-600 flex items-center gap-1 text-xs">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Tersimpan</span>
                    </div>
                    <button @click="viewFile(field.key)" class="view-file-button">
                      Lihat File
                    </button>
                  </div>

                  <div v-else class="relative">
                    <input type="file" :id="field.key" accept=".pdf,image/*"
                      @change="handleFileUpload($event, field.key)"
                      class="hidden-file-input" />
                    <label :for="field.key" class="upload-button">
                      {{ uploadedFiles[field.key] ? truncateFileName(uploadedFiles[field.key].name) : 'Upload' }}
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 sm:justify-between items-center mt-6">
            <router-link to="/soal-9" 
              class="uniform-button bg-gray-500 text-white hover:bg-gray-600"
              @click.prevent="handleNavigation('/soal-9')">
              Kembali
            </router-link>

            <button type="button" @click="deleteAllFiles"
              v-if="Object.keys(savedFiles).length > 0"
              :disabled="loading"
              class="uniform-button bg-red-600 text-white hover:bg-red-700">
              Hapus
              <span v-if="loading" class="spinner ml-2"></span>
            </button>
            
            <router-link to="/soal-11" 
              class="uniform-button bg-blue-600 text-white hover:bg-blue-700"
              @click.prevent="handleNavigation('/soal-11')">
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
            <router-link
              v-for="n in 17" 
              :key="n"
              :to="`/soal-${n}`"
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
import { useRoute, useRouter } from 'vue-router';
import { useDialog } from '@/composables/useDialog';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const { showAlert } = useDialog();
const uploadedFiles = ref({});
const savedFiles = ref({});
const successMessage = ref('');
const errorMessage = ref('');
const loading = ref(false);

const certificateFields = [
  { key: 'ipbi_offline1', label: 'a. Dalam acara IPBI Offline (1) (5 poin)' },
  { key: 'ipbi_offline2', label: 'Dalam acara IPBI Offline (2) (5 poin)' },
  { key: 'ipbi_offline3', label: 'Dalam acara IPBI Offline (3) (5 poin)' },
  { key: 'ipbi_online1', label: 'b. Dalam acara IPBI Online (1) (3 poin)' },
  { key: 'ipbi_online2', label: 'Dalam acara IPBI Online (2) (3 poin)' },
  { key: 'ipbi_online3', label: 'Dalam acara IPBI Online (3) (3 poin)' },
  { key: 'non_ipbi_offline1', label: 'c. Dalam Acara non IPBI (floristry) offline (1) (5 poin)' },
  { key: 'non_ipbi_offline2', label: 'Dalam Acara non IPBI (floristry) offline (2) (5 poin)' },
  { key: 'non_ipbi_offline3', label: 'Dalam Acara non IPBI (floristry) offline (3) (5 poin)' },
  { key: 'non_ipbi_online1', label: 'd. Dalam Acara non IPBI (floristry) online (1) (3 poin)' },
  { key: 'non_ipbi_online2', label: 'Dalam Acara non IPBI (floristry) online (2) (3 poin)' },
  { key: 'non_ipbi_online3', label: 'Dalam Acara non IPBI (floristry) online (3) (3 poin)' },
  { key: 'international_offline1', label: 'e. Dalam acara Internasional offline (berbahasa asing) (1) (10 poin)' },
  { key: 'international_offline2', label: 'Dalam acara Internasional offline (berbahasa asing) (2) (10 poin)' },
  { key: 'international_online1', label: 'f. Dalam acara Internasional online (berbahasa asing) (1) (5 poin)' },
  { key: 'international_online2', label: 'Dalam acara Internasional online (berbahasa asing) (2) (5 poin)' },
  { key: 'host_moderator1', label: 'g. Host/Moderator Acara online/offline (1) (1 poin)' },
  { key: 'host_moderator2', label: 'Host/Moderator Acara online/offline (2) (1 poin)' },
  { key: 'host_moderator3', label: 'Host/Moderator Acara online/offline (3) (1 poin)' },
  { key: 'host_moderator4', label: 'Host/Moderator Acara online/offline (4) (1 poin)' },
  { key: 'host_moderator5', label: 'Host/Moderator Acara online/offline (5) (1 poin)' },
];

// Extract current question number from route
const currentQuestionNumber = computed(() => {
  const match = route.path.match(/\/soal-(\d+)/);
  return match ? parseInt(match[1]) : 10;
});

onMounted(async () => {
  await fetchAnswer();
});

const fetchAnswer = async () => {
  try {
    loading.value = true;
    const response = await axios.get('/api/soal10', {
      headers: { Authorization: `Bearer ${authStore.accessToken}` }
    });
    
    savedFiles.value = response.data.data || {};
  } catch (error) {
    errorMessage.value = 'Gagal memuat data: ' + (error.response?.data?.message || error.message);
  } finally {
    loading.value = false;
  }
};

const handleFileUpload = (event, field) => {
  const file = event.target.files[0];
  if (file) {
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/gif', 'image/bmp', 'image/webp'];
    const maxSize = 2 * 1024 * 1024; // 2MB
    if (allowedTypes.includes(file.type) && file.size <= maxSize) {
      uploadedFiles.value[field] = file;
      errorMessage.value = '';
    } else {
      errorMessage.value = 'File harus berupa PDF atau gambar (JPG, PNG, GIF, BMP, WEBP) dan maksimum 2MB';
      event.target.value = ''; // Reset input
    }
  }
};

const saveOrUpdateFiles = async () => {
  try {
    if (Object.keys(uploadedFiles.value).length === 0) return;

    loading.value = true;
    successMessage.value = '';
    errorMessage.value = '';

    const formData = new FormData();
    Object.keys(uploadedFiles.value).forEach((key) => {
      if (uploadedFiles.value[key]) {
        formData.append(key, uploadedFiles.value[key]);
      }
    });

    const endpoint = Object.keys(savedFiles.value).length > 0 
      ? '/api/update10'
      : '/api/soal10';

    const response = await axios.post(endpoint, formData, {
      headers: { 
        Authorization: `Bearer ${authStore.accessToken}`,
        'Content-Type': 'multipart/form-data'
      }
    });

    successMessage.value = response.data.message;
    uploadedFiles.value = {};
    await fetchAnswer();
    setTimeout(() => successMessage.value = '', 3000);
  } catch (error) {
    errorMessage.value = 'Gagal menyimpan data: ' + (error.response?.data?.message || error.message);
  } finally {
    loading.value = false;
  }
};

const deleteAllFiles = async () => {
  if (!confirm('Apakah Anda yakin ingin menghapus semua file nomor 10?')) return;
  
  try {
    loading.value = true;
    await axios.delete('/api/soal10', {
      headers: { Authorization: `Bearer ${authStore.accessToken}` }
    });
    
    savedFiles.value = {};
    uploadedFiles.value = {};
    successMessage.value = 'Semua file berhasil dihapus';
    setTimeout(() => successMessage.value = '', 3000);
  } catch (error) {
    errorMessage.value = 'Gagal menghapus file: ' + (error.response?.data?.message || error.message);
  } finally {
    loading.value = false;
  }
};

const handleNavigation = async (path) => {
  await saveOrUpdateFiles();
  router.push(path);
};

const truncateFileName = (name) => {
  return name.length > 15 ? `${name.substring(0, 12)}...` : name;
};

const viewFile = async (fieldName) => {
  try {
    const url = `/api/admin/soal/10/${authStore.user.id}/file/${fieldName}`;
    const response = await axios.get(url, {
      responseType: 'blob',
      headers: {
        Authorization: `Bearer ${authStore.accessToken}`,
      },
    });

    const contentType = response.headers['content-type'];
    const blob = new Blob([response.data], { type: contentType });
    const blobUrl = window.URL.createObjectURL(blob);

    if (contentType.includes('image')) {
      const imgWindow = window.open('', '_blank');
      imgWindow.document.write(`
        <html>
          <body style="margin: 0; display: flex; justify-content: center; align-items: center; height: 100vh; background: #f0f0f0;">
            <img src="${blobUrl}" style="max-width: 100%; max-height: 100%; object-fit: contain;" />
          </body>
        </html>
      `);
    } else if (contentType.includes('pdf')) {
      window.open(blobUrl, '_blank');
    } else {
      await showAlert('Tipe file tidak didukung untuk ditampilkan.', 'Format Tidak Didukung');
    }

    setTimeout(() => window.URL.revokeObjectURL(blobUrl), 1000);
  } catch (error) {
    console.error('Error fetching file:', error.response || error);
    await showAlert('Gagal membuka file: ' + (error.response?.data?.message || 'File tidak ditemukan'), 'Error');
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

/* Hidden File Input dan Upload Button */
.hidden-file-input {
  position: absolute;
  width: 0;
  height: 0;
  opacity: 0;
}

.upload-button {
  display: inline-block;
  padding: 0.5rem 1rem;
  background: #ecfdf5;
  border: 2px solid #34d399;
  border-radius: 0.5rem;
  color: #2d6a4f;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 100px;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.upload-button:hover {
  background: #d1fae5;
  border-color: #2d6a4f;
  color: #1f4d36;
  transform: scale(1.05);
}

/* View File Button */
.view-file-button {
  display: inline-block;
  padding: 0.5rem 1rem;
  background: #e0f2fe;
  border: 2px solid #3b82f6;
  border-radius: 0.5rem;
  color: #1e3a8a;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
  white-space: nowrap;
}

.view-file-button:hover {
  background: #bfdbfe;
  border-color: #1e40af;
  color: #1e3a8a;
  transform: scale(1.05);
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

.uniform-button.bg-red-600 {
  background: linear-gradient(135deg, #ef4444, #dc2626);
}

.uniform-button.bg-blue-600 {
  background: linear-gradient(135deg, #1e3a8a, #3b82f6);
}

.uniform-button.bg-gray-500 {
  background: linear-gradient(135deg, #6b7280, #4b5563);
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