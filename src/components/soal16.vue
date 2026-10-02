<template>
  <div class="min-h-screen bg-gradient-to-t from-green-400 to-white py-12 px-6 sm:px-8 lg:px-12">
    <!-- Indikator Total Poin Maksimal -->
    <div class="fixed bottom-6 right-6 bg-green-600 text-white px-4 py-3 rounded-lg shadow-lg z-40">
      <div class="text-sm font-medium">Maksimal Poin</div>
      <div class="text-2xl font-bold">20</div>
    </div>
    
    <div class="max-w-2xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden mt-20">
      <div class="p-8 space-y-6">
        <h1 class="text-3xl font-bold text-gray-900 mb-6">
          Data 16: Informasi Florist dan Proyek
        </h1>

        <!-- Success/Error Messages -->
        <div v-if="successMessage" class="p-4 bg-green-100 text-green-700 rounded-md">
          {{ successMessage }}
        </div>
        <div v-if="errorMessage" class="p-4 bg-red-100 text-red-700 rounded-md">
          {{ errorMessage }}
        </div>

        <form @submit.prevent="submitAnswer" class="space-y-6">
          <!-- Pilihan Section -->
          <div class="space-y-4">
            <h2 class="text-xl font-semibold text-gray-800">Pilih Kategori:</h2>
            <div class="flex flex-col gap-2">
              <button type="button" @click="toggleSection('A')" class="section-button">
                A. Aktif Merangkai Bunga di Florist (Staff/Owner) (10 poin)
              </button>
              <transition name="expand">
                <div v-if="activeSection === 'A'" class="section-content">
                  <div class="flex flex-col gap-2">
                    <label for="nama_florist" class="text-sm font-medium text-gray-700">a. Nama Florist *</label>
                    <input v-model="form.nama_florist" id="nama_florist" type="text" class="input-field" required />
                  </div>
                  <div class="flex flex-col gap-2">
                    <label for="d_alamat_florist" class="text-sm font-medium text-gray-700">b. Alamat Florist *</label>
                    <textarea v-model="form.d_alamat_florist" id="d_alamat_florist" class="input-field" required></textarea>
                  </div>
                  <div v-for="(field, index) in sectionAFields" :key="index" class="flex flex-col gap-2">
                    <label :for="field.key" :class="savedFiles[field.key] ? 'text-green-600' : 'text-gray-700'">
                      {{ field.label }}
                    </label>
                    <div class="flex items-center gap-2">
                      <div v-if="savedFiles[field.key]" class="flex items-center gap-2">
                        <div class="text-green-600 flex items-center gap-1 text-xs">
                          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                          </svg>
                          <span>Tersimpan</span>
                        </div>
                        <button @click="viewFile(field.key)" class="view-file-button">
                          Lihat File
                        </button>
                      </div>
                      <div v-else class="relative">
                        <input type="file" :id="field.key" accept=".pdf,image/*" @change="handleFileUpload($event, field.key)" class="hidden" />
                        <label :for="field.key" class="upload-button">
                          {{ uploadedFiles[field.key] ? truncateFileName(uploadedFiles[field.key].name) : 'Upload' }}
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </transition>

              <button type="button" @click="toggleSection('B')" class="section-button">
                B. Owner Florist Berbadan Hukum (10 poin)
              </button>
              <transition name="expand">
                <div v-if="activeSection === 'B'" class="section-content">
                  <div class="flex flex-col gap-2">
                    <label for="c_nama_florist" class="text-sm font-medium text-gray-700">a. Nama Florist *</label>
                    <input v-model="form.c_nama_florist" id="c_nama_florist" type="text" class="input-field" required />
                  </div>
                  <div class="flex flex-col gap-2">
                    <label for="b_alamat_florist" class="text-sm font-medium text-gray-700">b. Alamat Florist *</label>
                    <textarea v-model="form.b_alamat_florist" id="b_alamat_florist" class="input-field" required></textarea>
                  </div>
                  <div v-for="(field, index) in sectionBFields" :key="index" class="flex flex-col gap-2">
                    <label :for="field.key" :class="savedFiles[field.key] ? 'text-green-600' : 'text-gray-700'">
                      {{ field.label }}
                    </label>
                    <div class="flex items-center gap-2">
                      <div v-if="savedFiles[field.key]" class="flex items-center gap-2">
                        <div class="text-green-600 flex items-center gap-1 text-xs">
                          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                          </svg>
                          <span>Tersimpan</span>
                        </div>
                        <button @click="viewFile(field.key)" class="view-file-button">
                          Lihat File
                        </button>
                      </div>
                      <div v-else class="relative">
                        <input type="file" :id="field.key" accept=".pdf,image/*" @change="handleFileUpload($event, field.key)" class="hidden" />
                        <label :for="field.key" class="upload-button">
                          {{ uploadedFiles[field.key] ? truncateFileName(uploadedFiles[field.key].name) : 'Upload' }}
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </transition>

              <button type="button" @click="toggleSection('C')" class="section-button">
                C. Owner Florist Tidak Berbadan Hukum (5 poin)
              </button>
              <transition name="expand">
                <div v-if="activeSection === 'C'" class="section-content">
                  <div class="flex flex-col gap-2">
                    <label for="c2_nama_florist" class="text-sm font-medium text-gray-700">a. Nama Florist *</label>
                    <input v-model="form.c2_nama_florist" id="c2_nama_florist" type="text" class="input-field" required />
                  </div>
                  <div class="flex flex-col gap-2">
                    <label for="c2_alamat_florist" class="text-sm font-medium text-gray-700">b. Alamat Florist *</label>
                    <textarea v-model="form.c2_alamat_florist" id="c2_alamat_florist" class="input-field" required></textarea>
                  </div>
                  <div v-for="(field, index) in sectionCFields" :key="index" class="flex flex-col gap-2">
                    <label :for="field.key" :class="savedFiles[field.key] ? 'text-green-600' : 'text-gray-700'">
                      {{ field.label }}
                    </label>
                    <div class="flex items-center gap-2">
                      <div v-if="savedFiles[field.key]" class="flex items-center gap-2">
                        <div class="text-green-600 flex items-center gap-1 text-xs">
                          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                          </svg>
                          <span>Tersimpan</span>
                        </div>
                        <button @click="viewFile(field.key)" class="view-file-button">
                          Lihat File
                        </button>
                      </div>
                      <div v-else class="relative">
                        <input type="file" :id="field.key" accept=".pdf,image/*" @change="handleFileUpload($event, field.key)" class="hidden" />
                        <label :for="field.key" class="upload-button">
                          {{ uploadedFiles[field.key] ? truncateFileName(uploadedFiles[field.key].name) : 'Upload' }}
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </transition>

              <button type="button" @click="toggleSection('D')" class="section-button">
                D. Freelance Designer (5 poin)
              </button>
              <transition name="expand">
                <div v-if="activeSection === 'D'" class="section-content">
                  <div v-for="(project, index) in form.projects" :key="index" class="space-y-4">
                    <h3 class="text-lg font-medium text-gray-800">Proyek {{ index + 1 }}</h3>
                    <div class="flex flex-col gap-2">
                      <label :for="`pemberi_order_${index}`" class="text-sm font-medium text-gray-700">a. Pemberi Order *</label>
                      <input v-model="project.pemberi_order" :id="`pemberi_order_${index}`" type="text" class="input-field" required />
                    </div>
                    <div class="flex flex-col gap-2">
                      <label :for="`tempat_lokasi_${index}`" class="text-sm font-medium text-gray-700">b. Tempat/Lokasi *</label>
                      <input v-model="project.tempat_lokasi" :id="`tempat_lokasi_${index}`" type="text" class="input-field" required />
                    </div>
                    <div class="flex flex-col gap-2">
                      <label :for="`tanggal_tahun_${index}`" class="text-sm font-medium text-gray-700">c. Tanggal/Tahun *</label>
                      <input v-model="project.tanggal_tahun" :id="`tanggal_tahun_${index}`" type="text" class="input-field" required />
                    </div>
                    <div class="flex flex-col gap-2">
                      <label :for="`deskripsi_${index}`" class="text-sm font-medium text-gray-700">d. Deskripsi Proyek *</label>
                      <textarea v-model="project.deskripsi" :id="`deskripsi_${index}`" class="input-field" required></textarea>
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                      <div v-for="n in 4" :key="n" class="flex flex-col gap-2">
                        <label :for="sectionDFields[index * 4 + n - 1].key" :class="savedFiles[sectionDFields[index * 4 + n - 1].key] ? 'text-green-600' : 'text-gray-700'">
                          {{ sectionDFields[index * 4 + n - 1].label }} (Proyek {{ index + 1 }})
                        </label>
                        <div class="flex items-center gap-2">
                          <div v-if="savedFiles[sectionDFields[index * 4 + n - 1].key]" class="flex items-center gap-2">
                            <div class="text-green-600 flex items-center gap-1 text-xs">
                              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                              </svg>
                              <span>Tersimpan</span>
                            </div>
                            <button @click="viewFile(sectionDFields[index * 4 + n - 1].key)" class="view-file-button">
                              Lihat File
                            </button>
                          </div>
                          <div v-else class="relative">
                            <input type="file" :id="sectionDFields[index * 4 + n - 1].key" accept=".pdf,image/*" @change="handleFileUpload($event, sectionDFields[index * 4 + n - 1].key)" class="hidden" />
                            <label :for="sectionDFields[index * 4 + n - 1].key" class="upload-button">
                              {{ uploadedFiles[sectionDFields[index * 4 + n - 1].key] ? truncateFileName(uploadedFiles[sectionDFields[index * 4 + n - 1].key].name) : 'Upload' }}
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </transition>
            </div>
          </div>

          <!-- Buttons -->
          <div class="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 sm:justify-between items-center mt-6">
            <router-link to="/soal-15" class="uniform-button bg-gray-500 text-white hover:bg-gray-600">
              Kembali
            </router-link>
            <div class="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
              <button type="submit" :disabled="loading" class="uniform-button bg-green-600 text-white hover:bg-green-700">
                {{ submitButtonText }}
                <span v-if="loading" class="spinner ml-2"></span>
              </button>
              <button type="button" @click="deleteAll" :disabled="loading || Object.keys(savedFiles).length === 0" class="uniform-button bg-red-600 text-white hover:bg-red-700">
                Hapus
                <span v-if="loading" class="spinner ml-2"></span>
              </button>
            </div>
            <router-link to="/soal-17" class="uniform-button bg-blue-600 text-white hover:bg-blue-700">
              Lanjut
            </router-link>
          </div>
        </form>
        <p class="text-red-500 text-sm text-center mt-4 opacity-50">
          *Jangan lupa menekan simpan/tambah agar data tersimpan!
        </p>

        <!-- Navigation Bar -->
        <div class="mt-8 pt-6 border-t border-gray-200">
          <h3 class="text-lg font-medium text-gray-800 mb-4">Navigasi Soal</h3>
          <div class="flex flex-wrap gap-2">
            <router-link v-for="n in 17" :key="n" :to="`/soal-${n}`" class="w-10 h-10 flex items-center justify-center rounded-lg text-sm font-medium transition-all duration-200" :class="[currentQuestionNumber === n ? 'bg-green-600 text-white' : 'bg-gray-200 hover:bg-green-500 hover:text-white text-gray-700']">
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
import { useRoute } from 'vue-router';
import { useDialog } from '@/composables/useDialog';

const route = useRoute();
const authStore = useAuthStore();
const { showAlert } = useDialog();
const uploadedFiles = ref({});
const savedFiles = ref({});
const successMessage = ref('');
const errorMessage = ref('');
const loading = ref(false);
const activeSection = ref(null);
const form = ref({
  nama_florist: '',
  d_alamat_florist: '',
  c_nama_florist: '',
  b_alamat_florist: '',
  c2_nama_florist: '',
  c2_alamat_florist: '',
  projects: [
    { pemberi_order: '', tempat_lokasi: '', tanggal_tahun: '', deskripsi: '' },
    { pemberi_order: '', tempat_lokasi: '', tanggal_tahun: '', deskripsi: '' },
    { pemberi_order: '', tempat_lokasi: '', tanggal_tahun: '', deskripsi: '' }
  ]
});

const sectionAFields = [
  { key: 'a_foto_lokasi1', label: 'c. Foto Lokasi 1' }, { key: 'a_foto_lokasi2', label: 'c. Foto Lokasi 2' },
  { key: 'a_foto_lokasi3', label: 'c. Foto Lokasi 3' }, { key: 'a_foto_kegiatan1', label: 'd. Foto Kegiatan 1' },
  { key: 'a_foto_kegiatan2', label: 'd. Foto Kegiatan 2' }, { key: 'a_foto_kegiatan3', label: 'd. Foto Kegiatan 3' }
];

const sectionBFields = [
  { key: 'b_bukti_akta1', label: 'c. Foto Lokasi 1 / Bukti Akta 1' }, { key: 'b_bukti_akta2', label: 'c. Foto Lokasi 2 / Bukti Akta 2' },
  { key: 'b_bukti_akta3', label: 'c. Foto Lokasi 3 / Bukti Akta 3' }, { key: 'b_bukti_akta4', label: 'd. Foto Lokasi 4 / Bukti Akta 4' },
  { key: 'b_bukti_akta5', label: 'd. Foto Lokasi 5 / Bukti Akta 5' }, { key: 'b_bukti_akta6', label: 'd. Foto Lokasi 6 / Bukti Akta 6' }
];

const sectionCFields = [
  { key: 'c_foto_lokasi1', label: 'c. Foto Lokasi 1' }, { key: 'c_foto_lokasi2', label: 'c. Foto Lokasi 2' },
  { key: 'c_foto_lokasi3', label: 'c. Foto Lokasi 3' }, { key: 'c_foto_lokasi4', label: 'c. Foto Lokasi 4' },
  { key: 'c_foto_lokasi5', label: 'c. Foto Lokasi 5' }, { key: 'c_foto_lokasi6', label: 'c. Foto Lokasi 6' }
];

const sectionDFields = [
  { key: 'd_foto_lokasi1', label: 'e. Foto Lokasi 1' }, { key: 'd_foto_lokasi2', label: 'e. Foto Lokasi 2' },
  { key: 'd_foto_lokasi3', label: 'e. Foto Lokasi 3' }, { key: 'd_foto_lokasi4', label: 'e. Foto Lokasi 4' },
  { key: 'd_foto_lokasi5', label: 'e. Foto Lokasi 1' }, { key: 'd_foto_lokasi6', label: 'e. Foto Lokasi 2' },
  { key: 'd_foto_lokasi7', label: 'e. Foto Lokasi 3' }, { key: 'd_foto_lokasi8', label: 'e. Foto Lokasi 4' },
  { key: 'd_foto_lokasi9', label: 'e. Foto Lokasi 1' }, { key: 'd_foto_lokasi10', label: 'e. Foto Lokasi 2' },
  { key: 'd_foto_lokasi11', label: 'e. Foto Lokasi 3' }, { key: 'd_foto_lokasi12', label: 'e. Foto Lokasi 4' }
];

const currentQuestionNumber = computed(() => {
  const match = route.path.match(/\/soal-(\d+)/);
  return match ? parseInt(match[1]) : 16;
});

const submitButtonText = computed(() => {
  return Object.keys(savedFiles.value).length > 0 ? 'Perbarui' : 'Simpan';
});

onMounted(async () => {
  await fetchAnswer();
});

const toggleSection = (section) => {
  activeSection.value = activeSection.value === section ? null : section;
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
      event.target.value = '';
    }
  }
};

const submitAnswer = async () => {
  if (!activeSection.value) {
    errorMessage.value = 'Pilih kategori terlebih dahulu!';
    return;
  }

  switch (activeSection.value) {
    case 'A':
      if (!form.value.nama_florist.trim() || !form.value.d_alamat_florist.trim()) {
        errorMessage.value = 'Semua field teks di kategori A harus diisi!';
        return;
      }
      break;
    case 'B':
      if (!form.value.c_nama_florist.trim() || !form.value.b_alamat_florist.trim()) {
        errorMessage.value = 'Semua field teks di kategori B harus diisi!';
        return;
      }
      break;
    case 'C':
      if (!form.value.c2_nama_florist.trim() || !form.value.c2_alamat_florist.trim()) {
        errorMessage.value = 'Semua field teks di kategori C harus diisi!';
        return;
      }
      break;
    case 'D':
      const incompleteD = form.value.projects.some(project => 
        !project.pemberi_order.trim() || 
        !project.tempat_lokasi.trim() || 
        !project.tanggal_tahun.trim() || 
        !project.deskripsi.trim()
      );
      if (incompleteD) {
        errorMessage.value = 'Semua field teks proyek di kategori D harus diisi!';
        return;
      }
      break;
  }

  const sectionFields = {
    'A': sectionAFields.map(f => f.key),
    'B': sectionBFields.map(f => f.key),
    'C': sectionCFields.map(f => f.key),
    'D': sectionDFields.map(f => f.key),
  };

  const relevantFields = sectionFields[activeSection.value];
  let hasFiles = false;

  if (activeSection.value === 'D') {
    const projectFields = [
      relevantFields.slice(0, 4),
      relevantFields.slice(4, 8),
      relevantFields.slice(8, 12),
    ];

    for (let i = 0; i < projectFields.length; i++) {
      const projectHasFile = projectFields[i].some(field => 
        uploadedFiles.value[field] || savedFiles.value[field]
      );
      if (!projectHasFile) {
        errorMessage.value = `Minimal unggah satu foto untuk Proyek ${i + 1} di kategori D!`;
        return;
      }
      hasFiles = true;
    }
  } else {
    hasFiles = relevantFields.some(field => uploadedFiles.value[field] || savedFiles.value[field]);
    if (!hasFiles) {
      errorMessage.value = `Minimal unggah satu foto untuk kategori ${activeSection.value}!`;
      return;
    }
  }

  try {
    loading.value = true;
    successMessage.value = '';
    errorMessage.value = '';

    const formData = new FormData();
    formData.append('active_section', activeSection.value);

    switch (activeSection.value) {
      case 'A':
        formData.append('nama_florist', form.value.nama_florist.trim());
        formData.append('d_alamat_florist', form.value.d_alamat_florist.trim());
        break;
      case 'B':
        formData.append('c_nama_florist', form.value.c_nama_florist.trim());
        formData.append('b_alamat_florist', form.value.b_alamat_florist.trim());
        break;
      case 'C':
        formData.append('c2_nama_florist', form.value.c2_nama_florist.trim());
        formData.append('c2_alamat_florist', form.value.c2_alamat_florist.trim());
        break;
      case 'D':
        form.value.projects.forEach((project, index) => {
          const i = index + 1;
          formData.append(`d_pemberi_order${i}`, project.pemberi_order.trim());
          formData.append(`d_tempat_lokasi${i}`, project.tempat_lokasi.trim());
          formData.append(`d_tanggal_tahun${i}`, project.tanggal_tahun.trim());
          formData.append(`d_deskripsi${i}`, project.deskripsi.trim());
        });
        break;
    }

    Object.keys(uploadedFiles.value).forEach((key) => {
      if (uploadedFiles.value[key] && relevantFields.includes(key)) {
        formData.append(key, uploadedFiles.value[key]);
      }
    });

    const endpoint = Object.keys(savedFiles.value).length > 0 ? '/api/update16' : '/api/soal16';
    const response = await axios.post(endpoint, formData, {
      headers: {
        Authorization: `Bearer ${authStore.accessToken}`,
        'Content-Type': 'multipart/form-data'
      }
    });

    successMessage.value = response.data.message || 'Data berhasil disimpan';
    uploadedFiles.value = {};
    await fetchAnswer();
    setTimeout(() => successMessage.value = '', 3000);
  } catch (error) {
    errorMessage.value = 'Gagal menyimpan: ' + (error.response?.data?.message || error.message);
    console.error('Error detail:', error.response?.data);
  } finally {
    loading.value = false;
  }
};

const fetchAnswer = async () => {
  try {
    loading.value = true;
    const response = await axios.get('/api/soal16', {
      headers: { Authorization: `Bearer ${authStore.accessToken}` }
    });
    const data = response.data.data || {};
    savedFiles.value = {};

    form.value.nama_florist = data.nama_florist || '';
    form.value.d_alamat_florist = data.d_alamat_florist || '';
    form.value.c_nama_florist = data.c_nama_florist || '';
    form.value.b_alamat_florist = data.b_alamat_florist || '';
    form.value.c2_nama_florist = data.c2_nama_florist || '';
    form.value.c2_alamat_florist = data.c2_alamat_florist || '';

    form.value.projects = [
      {
        pemberi_order: data.d_pemberi_order1 || '',
        tempat_lokasi: data.d_tempat_lokasi1 || '',
        tanggal_tahun: data.d_tanggal_tahun1 || '',
        deskripsi: data.d_deskripsi1 || ''
      },
      {
        pemberi_order: data.d_pemberi_order2 || '',
        tempat_lokasi: data.d_tempat_lokasi2 || '',
        tanggal_tahun: data.d_tanggal_tahun2 || '',
        deskripsi: data.d_deskripsi2 || ''
      },
      {
        pemberi_order: data.d_pemberi_order3 || '',
        tempat_lokasi: data.d_tempat_lokasi3 || '',
        tanggal_tahun: data.d_tanggal_tahun3 || '',
        deskripsi: data.d_deskripsi3 || ''
      }
    ];

    sectionAFields.concat(sectionBFields, sectionCFields, sectionDFields).forEach(field => {
      if (data[field.key]) savedFiles.value[field.key] = data[field.key];
    });

    activeSection.value = data.active_section || null;
  } catch (error) {
    errorMessage.value = 'Gagal memuat data: ' + (error.response?.data?.message || error.message);
    console.error(error);
  } finally {
    loading.value = false;
  }
};

const deleteAll = async () => {
  if (!confirm('Apakah Anda yakin ingin menghapus semua data nomor 16?')) return;

  try {
    loading.value = true;
    successMessage.value = '';
    errorMessage.value = '';

    await axios.delete('/api/soal16', {
      headers: { Authorization: `Bearer ${authStore.accessToken}` }
    });

    form.value = {
      nama_florist: '',
      d_alamat_florist: '',
      c_nama_florist: '',
      b_alamat_florist: '',
      c2_nama_florist: '',
      c2_alamat_florist: '',
      projects: [
        { pemberi_order: '', tempat_lokasi: '', tanggal_tahun: '', deskripsi: '' },
        { pemberi_order: '', tempat_lokasi: '', tanggal_tahun: '', deskripsi: '' },
        { pemberi_order: '', tempat_lokasi: '', tanggal_tahun: '', deskripsi: '' }
      ]
    };
    uploadedFiles.value = {};
    savedFiles.value = {};
    activeSection.value = null;

    successMessage.value = 'Semua data berhasil dihapus!';
    setTimeout(() => successMessage.value = '', 3000);
  } catch (error) {
    errorMessage.value = 'Gagal menghapus data: ' + (error.response?.data?.message || error.message);
    console.error('Error detail:', error.response?.data);
  } finally {
    loading.value = false;
  }
};

const truncateFileName = (name) => {
  return name.length > 15 ? `${name.substring(0, 12)}...` : name;
};

const viewFile = async (fieldName) => {
  try {
    const url = `/api/admin/soal/16/${authStore.user.id}/file/${fieldName}`;
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

/* Section Buttons */
.section-button {
  text-align: left;
  padding: 0.75rem 1rem;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  font-weight: 500;
  color: #374151;
  transition: all 0.3s ease;
}

.section-button:hover {
  background: #d1fae5;
  border-color: #34d399;
  transform: scale(1.02);
}

/* Section Content */
.section-content {
  padding: 1rem;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
}

/* Expand Animation */
.expand-enter-active,
.expand-leave-active {
  transition: all 0.5s ease;
}

.expand-enter-from,
.expand-leave-to {
  opacity: 0;
  max-height: 0;
  transform: translateY(-10px);
}

.expand-enter-to,
.expand-leave-from {
  opacity: 1;
  max-height: 1000px; /* Adjust based on content size */
  transform: translateY(0);
}

/* Input Fields */
.input-field {
  padding: 0.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  transition: all 0.3s ease;
}

.input-field:focus {
  border-color: #34d399;
  box-shadow: 0 0 0 2px rgba(52, 211, 153, 0.2);
  outline: none;
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

/* Upload Button */
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

.uniform-button.bg-green-600 {
  background: linear-gradient(135deg, #2d6a4f, #34d399);
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

.uniform-button.bg-green-600:hover:not(:disabled) {
  background: linear-gradient(135deg, #1f4d36, #22c55e);
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

/* Spinners */
.spinner {
  border: 2px solid #f3f3f3;
  border-top: 2px solid #34d399;
  border-radius: 50%;
  width: 16px;
  height: 16px;
  animation: spin 1s linear infinite;
  display: inline-block;
}

/* Navigation Bar */
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