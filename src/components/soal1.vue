<template>
  <div class="min-h-screen bg-gradient-to-t from-green-400 to-white py-12 px-6 sm:px-8 lg:px-12">
    <!-- Indikator Total Poin Maksimal -->
    <div class="fixed bottom-6 right-6 bg-green-600 text-white px-4 py-3 rounded-lg shadow-lg z-40">
      <div class="text-sm font-medium">Maksimal Poin</div>
      <div class="text-2xl font-bold">5</div>
    </div>
    
    <div class="max-w-2xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden mt-20">
      <div class="p-8 space-y-6">
        <h1 class="text-3xl font-bold text-gray-900 mb-6">Data 1: Pendidikan Formal Terakhir Anda</h1>

        <!-- Success Message -->
        <div v-if="successMessage" class="p-4 bg-green-100 text-green-700 rounded-md">
          {{ successMessage }}
        </div>

        <!-- Custom Popup -->
        <div v-if="showPopup" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div class="bg-white rounded-lg p-6 max-w-md w-full relative">
            <button @click="cancelNavigation" class="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h3 class="text-lg font-medium text-gray-900 mb-4">Peringatan</h3>
            <p class="text-gray-700 mb-4">{{ popupMessage }}</p>
            <div class="flex justify-end space-x-4">
              <button @click="cancelNavigation" class="uniform-button bg-gray-500 text-white hover:bg-gray-600">
                Tidak
              </button>
              <button @click="proceedNavigation" class="uniform-button bg-blue-600 text-white hover:bg-blue-700">
                Ya
              </button>
            </div>
          </div>
        </div>

        <form class="space-y-4">
          <div class="flex flex-col">
            <label class="text-lg font-medium text-gray-800">Pilih pendidikan terakhir Anda</label>
            <div class="space-y-3 mt-4">
              <div class="flex items-center">
                <input
                  type="radio"
                  id="smp-d3"
                  value="SMP-D3"
                  v-model="selectedAnswer"
                  class="form-radio h-5 w-5"
                  :disabled="isAnswerSaved"
                />
                <label
                  for="smp-d3"
                  class="ml-2 text-sm"
                  :class="{
                    'text-green-600 font-semibold': isAnswerSaved && selectedAnswer === 'SMP-D3',
                    'text-gray-700': !isAnswerSaved || selectedAnswer !== 'SMP-D3'
                  }"
                >
                  SMP - D3 (2 poin)
                </label>
              </div>
              <div class="flex items-center">
                <input
                  type="radio"
                  id="s1"
                  value="S1"
                  v-model="selectedAnswer"
                  class="form-radio h-5 w-5"
                  :disabled="isAnswerSaved"
                />
                <label
                  for="s1"
                  class="ml-2 text-sm"
                  :class="{
                    'text-green-600 font-semibold': isAnswerSaved && selectedAnswer === 'S1',
                    'text-gray-700': !isAnswerSaved || selectedAnswer !== 'S1'
                  }"
                >
                  S1 (4 poin)
                </label>
              </div>
              <div class="flex items-center">
                <input
                  type="radio"
                  id="s2_atau_lebih"
                  value="S2_atau_lebih"
                  v-model="selectedAnswer"
                  class="form-radio h-5 w-5"
                  :disabled="isAnswerSaved"
                />
                <label
                  for="s2_atau_lebih"
                  class="ml-2 text-sm"
                  :class="{
                    'text-green-600 font-semibold': isAnswerSaved && selectedAnswer === 'S2_atau_lebih',
                    'text-gray-700': !isAnswerSaved || selectedAnswer !== 'S2_atau_lebih'
                  }"
                >
                  S2 atau lebih (5 poin)
                </label>
              </div>
            </div>

            <!-- Input File Bukti (PDF atau Gambar) -->
            <div v-if="selectedAnswer && !isAnswerSaved" class="mt-6">
              <label for="tingkat_pendidikan_file" class="block text-sm font-medium text-gray-700 mb-2">
                Unggah Bukti Pendidikan (PDF, JPG, PNG, dll., maks 2MB)
                <span class="text-red-500">*</span>
              </label>
              <div
                class="relative border-2 border-dashed border-green-400 rounded-lg p-6 text-center bg-gray-50 hover:bg-green-50 transition-all duration-300"
                @dragover.prevent
                @drop.prevent="handleDrop"
              >
                <input
                  type="file"
                  id="tingkat_pendidikan_file"
                  accept=".pdf,image/*"
                  @change="handleFileUpload"
                  class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div v-if="!selectedFile" class="space-y-2">
                  <i class="fas fa-cloud-upload-alt text-green-600 text-3xl"></i>
                  <p class="text-gray-600 text-sm">
                    Seret dan lepaskan file di sini atau <span class="text-green-600 font-semibold">pilih file</span>
                  </p>
                  <p class="text-xs text-gray-500">Format: PDF, JPG, PNG, dll. (maks 2MB)</p>
                </div>
                <div v-else class="flex items-center justify-center space-x-2">
                  <i class="fas fa-file-alt text-green-600 text-xl"></i>
                  <span class="text-sm text-gray-700">{{ selectedFile.name }}</span>
                  <button
                    @click="clearFile"
                    class="text-red-500 hover:text-red-700 text-sm font-medium"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            </div>

            <!-- Tampilkan status file tersimpan -->
            <div v-if="isAnswerSaved" class="mt-4 flex items-center gap-2">
              <div class="text-green-600 flex items-center gap-1 text-xs">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Tersimpan</span>
              </div>
              <button type="button" @click="viewFile('tingkat_pendidikan_file')" class="view-file-button">
                Lihat File
              </button>
            </div>
          </div>

          <!-- Buttons -->
          <div class="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 sm:justify-between items-center mt-6">
            <button
              type="button"
              v-if="isAnswerSaved"
              @click="deleteAnswer"
              :disabled="loading"
              class="uniform-button bg-red-600 text-white hover:bg-red-700"
            >
              Hapus
              <span v-if="loading" class="spinner ml-2"></span>
            </button>
            <router-link
              to="/soal-2"
              @click.prevent="handleNavigation('/soal-2')"
              class="uniform-button bg-blue-600 text-white hover:bg-blue-700"
            >
              Lanjut
              <span v-if="loading" class="spinner ml-2"></span>
            </router-link>
          </div>
        </form>
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
              @click.prevent="handleNavigation(`/soal-${n}`)"
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
import 'animate.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const { showAlert, showConfirm } = useDialog();

const selectedAnswer = ref('');
const selectedFile = ref(null);
const isAnswerSaved = ref(false);
const successMessage = ref('');
const loading = ref(false);
const showPopup = ref(false);
const popupMessage = ref('');
const nextRoute = ref('');

const currentQuestionNumber = computed(() => {
  const match = route.path.match(/\/soal-(\d+)/);
  return match ? parseInt(match[1]) : 1;
});

onMounted(async () => {
  console.log('soal1.vue mounted, authStore:', {
    userId: authStore.user?.id,
    accessToken: authStore.accessToken ? 'Available' : 'Not available'
  });
  await fetchAnswer();
});

const fetchAnswer = async () => {
  try {
    loading.value = true;
    const response = await axios.get('/api/soal1', {
      headers: { Authorization: `Bearer ${authStore.accessToken}` },
    });
    if (response.data && response.data.tingkat_pendidikan) {
      selectedAnswer.value = response.data.tingkat_pendidikan;
      isAnswerSaved.value = true;
      console.log('Fetched answer:', response.data);
    }
  } catch (error) {
    console.error('Fetch error:', error);
  } finally {
    loading.value = false;
  }
};

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  validateAndSetFile(file);
};

const handleDrop = (event) => {
  const file = event.dataTransfer.files[0];
  validateAndSetFile(file);
};

const validateAndSetFile = async (file) => {
  const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/bmp', 'image/webp'];
  const maxSize = 2 * 1024 * 1024; // 2MB
  if (file && allowedTypes.includes(file.type) && file.size <= maxSize) {
    selectedFile.value = file;
    console.log('File selected:', file.name);
  } else {
    selectedFile.value = null;
    await showAlert('File harus berupa PDF atau gambar (JPG, PNG, dll.) dan maksimum 2MB', 'Format File Tidak Valid');
  }
};

const clearFile = () => {
  selectedFile.value = null;
  console.log('File cleared');
};

const saveAnswer = async () => {
  if (!selectedAnswer.value) {
    await showAlert('Pilih tingkat pendidikan terlebih dahulu!', 'Peringatan');
    return false;
  }
  if (!selectedFile.value && !isAnswerSaved.value) {
    await showAlert('Unggah bukti pendidikan terlebih dahulu!', 'Peringatan');
    return false;
  }

  try {
    loading.value = true;
    successMessage.value = '';

    const formData = new FormData();
    formData.append('tingkat_pendidikan', selectedAnswer.value);
    if (selectedFile.value) {
      formData.append('tingkat_pendidikan_file', selectedFile.value);
    }

    // Log data yang akan dikirim untuk debugging
    console.log('📤 Data yang akan dikirim:');
    console.log('  - tingkat_pendidikan:', selectedAnswer.value);
    console.log('  - tingkat_pendidikan_file:', selectedFile.value ? selectedFile.value.name : 'tidak ada');
    console.log('  - isAnswerSaved:', isAnswerSaved.value);

    const endpoint = isAnswerSaved.value ? '/api/update1' : '/api/soal1';
    console.log('📡 Endpoint:', endpoint);

    const response = await axios.post(endpoint, formData, {
      headers: {
        Authorization: `Bearer ${authStore.accessToken}`,
        'Content-Type': 'multipart/form-data',
      },
    });

    successMessage.value = response.data.message || 'Jawaban berhasil disimpan';
    isAnswerSaved.value = true;
    selectedFile.value = null;
    await fetchAnswer();
    setTimeout(() => successMessage.value = '', 3000);
    console.log('✅ Save successful:', response.data);
    return true;
  } catch (error) {
    console.error('❌ Save error:', error);
    console.error('❌ Error response:', error.response?.data);
    console.error('❌ Error status:', error.response?.status);
    
    // Tampilkan error yang lebih informatif
    let errorMessage = 'Gagal menyimpan data.';
    
    if (error.response?.status === 422) {
      // Validation error
      const errors = error.response.data?.errors || {};
      const errorMessages = [];
      
      // Extract validation errors
      Object.keys(errors).forEach(field => {
        if (Array.isArray(errors[field])) {
          errorMessages.push(`${field}: ${errors[field].join(', ')}`);
        } else {
          errorMessages.push(`${field}: ${errors[field]}`);
        }
      });
      
      if (errorMessages.length > 0) {
        errorMessage = 'Validasi gagal:\n' + errorMessages.join('\n');
      } else if (error.response.data?.message) {
        errorMessage = error.response.data.message;
      } else {
        errorMessage = 'Data yang dikirim tidak valid. Pastikan semua field diisi dengan benar.';
      }
    } else if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    await showAlert(errorMessage, 'Error Menyimpan Data');
    return false;
  } finally {
    loading.value = false;
  }
};

const deleteAnswer = async () => {
  const confirmed = await showConfirm('Apakah Anda yakin ingin menghapus jawaban?', 'Konfirmasi Hapus');
  if (!confirmed) return;

  try {
    loading.value = true;
    await axios.delete('/api/soal1', {
      headers: { Authorization: `Bearer ${authStore.accessToken}` },
    });
    selectedAnswer.value = '';
    selectedFile.value = null;
    isAnswerSaved.value = false;
    successMessage.value = 'Jawaban berhasil dihapus';
    setTimeout(() => successMessage.value = '', 3000);
    console.log('Answer deleted');
  } catch (error) {
    console.error('Delete error:', error);
  } finally {
    loading.value = false;
  }
};

const handleNavigation = async (path) => {
  nextRoute.value = path;
  if (selectedAnswer.value && selectedFile.value && !isAnswerSaved.value) {
    const result = await saveAnswer();
    if (!result) {
      popupMessage.value = 'Data belum tersimpan. Apakah Anda yakin ingin melanjutkan? Data yang belum disimpan akan hilang.';
      showPopup.value = true;
      return;
    }
  }
  router.push(path);
};

const cancelNavigation = () => {
  showPopup.value = false;
  nextRoute.value = '';
};

const proceedNavigation = () => {
  showPopup.value = false;
  if (nextRoute.value) {
    router.push(nextRoute.value);
  }
};

const viewFile = async (fieldName) => {
  console.log('viewFile called with fieldName:', fieldName);

  try {
    // Validasi authStore.user.id
    const userId = authStore.user?.id;
    console.log('User ID:', userId);
    if (!userId) {
      throw new Error('User ID tidak ditemukan di authStore');
    }
    if (!authStore.accessToken) {
      throw new Error('Access token tidak ditemukan');
    }

    // Gunakan nomor soal 1 untuk soal1.vue
    const soalNumber = 1;
    const url = `/api/admin/soal/${soalNumber}/${userId}/file/${fieldName}`;
    console.log('Fetching file from:', url);

    const response = await axios.get(url, {
      responseType: 'blob',
      headers: {
        Authorization: `Bearer ${authStore.accessToken}`,
      },
    });

    console.log('Response received:', {
      status: response.status,
      headers: response.headers,
      dataSize: response.data.size,
    });

    const contentType = response.headers['content-type'];
    console.log('Content-Type:', contentType);
    if (!contentType) {
      throw new Error('Content-Type tidak ditemukan di respons server');
    }

    const blob = new Blob([response.data], { type: contentType });
    const blobUrl = window.URL.createObjectURL(blob);
    console.log('Blob URL created:', blobUrl);

    if (contentType.includes('image')) {
      console.log('Processing image file');
      try {
        const imgWindow = window.open('', '_blank');
        console.log('window.open result:', imgWindow ? 'Success' : 'Failed');
        if (imgWindow) {
          imgWindow.document.write(`
            <html>
              <body style="margin: 0; display: flex; justify-content: center; align-items: center; height: 100vh; background: #f0f0f0;">
                <img src="${blobUrl}" style="max-width: 100%; max-height: 100%; object-fit: contain;" />
              </body>
            </html>
          `);
          imgWindow.document.close();
          console.log('Image written to new window');
        } else {
          console.warn('window.open failed, trying overlay');
          // Tampilkan overlay
          const container = document.createElement('div');
          container.style.display = 'flex';
          container.style.justifyContent = 'center';
          container.style.alignItems = 'center';
          container.style.position = 'fixed';
          container.style.top = '0';
          container.style.left = '0';
          container.style.width = '100%';
          container.style.height = '100%';
          container.style.background = 'rgba(0, 0, 0, 0.8)';
          container.style.zIndex = '1000';

          const img = document.createElement('img');
          img.src = blobUrl;
          img.style.maxWidth = '90%';
          img.style.maxHeight = '90vh';
          img.style.objectFit = 'contain';
          container.appendChild(img);

          document.body.appendChild(container);
          console.log('Overlay appended to document body');

          container.addEventListener('click', () => {
            console.log('Closing overlay');
            document.body.removeChild(container);
            window.URL.revokeObjectURL(blobUrl);
          });
        }
      } catch (windowError) {
        console.error('Error with window.open:', windowError);
        console.warn('Falling back to download');
        const downloadLink = document.createElement('a');
        downloadLink.href = blobUrl;
        downloadLink.download = 'tingkat_pendidikan_file.png';
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        console.log('Download triggered');
        setTimeout(() => window.URL.revokeObjectURL(blobUrl), 1000);
      }
    } else if (contentType.includes('pdf')) {
      console.log('Opening PDF in new tab');
      window.open(blobUrl, '_blank');
      setTimeout(() => window.URL.revokeObjectURL(blobUrl), 1000);
    } else {
      console.warn('Unsupported file type:', contentType);
      await showAlert('Tipe file tidak didukung untuk ditampilkan.', 'Format Tidak Didukung');
      window.URL.revokeObjectURL(blobUrl);
    }

    console.log('viewFile completed successfully');
  } catch (error) {
    console.error('viewFile error:', {
      message: error.message,
      stack: error.stack,
      response: error.response,
      status: error.response?.status,
    });
    await showAlert('Gagal membuka file: ' + (error.message || 'Terjadi kesalahan'), 'Error');
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

/* File Upload Area */
.border-dashed {
  border-color: #34d399;
  transition: all 0.3s ease;
}

.border-dashed:hover {
  border-color: #2d6a4f;
  background: #ecfdf5;
}

.border-dashed.dragover {
  background: #d1fae5;
  border-color: #2d6a4f;
}

/* Icons and Text */
.fa-cloud-upload-alt,
.fa-file-alt {
  transition: transform 0.3s ease;
}

.border-dashed:hover .fa-cloud-upload-alt {
  transform: scale(1.1);
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

.uniform-button.bg-blue-600:hover:not(:disabled) {
  background: linear-gradient(135deg, #1e40af, #2563eb);
}

.uniform-button.bg-gray-500:hover:not(:disabled) {
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