<template>
  <div class="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 relative overflow-hidden">
    <!-- Decorative Elements -->
    <div class="flower-1"></div>
    <div class="flower-2"></div>
    <div class="flower-3"></div>

    <!-- Main Content -->
    <div class="max-w-3xl mx-auto pt-24 pb-16 px-4 sm:px-6 lg:px-8 relative z-10 flex items-center justify-center min-h-[calc(100vh-6rem)]">
      <div class="bg-white rounded-3xl shadow-2xl overflow-hidden transition-all duration-300 hover:shadow-3xl w-full">
        <!-- Header -->
        <div class="bg-gradient-to-r from-emerald-600 to-teal-500 px-8 py-6">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-4">
              <!-- Profile Picture -->
              <div class="relative">
                <img 
                  v-if="profilePictureUrl" 
                  :src="profilePictureUrl" 
                  alt="Profile" 
                  class="w-16 h-16 rounded-full object-cover border-4 border-white/30 shadow-lg"
                  @error="handleImageError"
                />
                <div 
                  v-else 
                  class="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center border-4 border-white/30"
                >
                  <span class="text-2xl text-white">👤</span>
                </div>
                <!-- Upload Button Overlay -->
                <button
                  v-if="isEditing"
                  @click="triggerFileInput"
                  :disabled="isUploading"
                  class="absolute bottom-0 right-0 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full p-2 shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Upload Foto"
                >
                  <i v-if="!isUploading" class="fas fa-camera text-sm"></i>
                  <i v-else class="fas fa-spinner fa-spin text-sm"></i>
                </button>
                <!-- Hidden File Input -->
                <input
                  ref="fileInput"
                  type="file"
                  accept="image/jpeg,image/png,image/jpg,image/gif"
                  @change="handleFileSelect"
                  class="hidden"
                />
              </div>
              <h1 class="text-3xl font-bold text-white tracking-tight">Profile Settings</h1>
            </div>
            <button
              v-if="!isEditing"
              @click="startEditing"
              class="flex items-center space-x-2 bg-white/20 text-white px-5 py-2 rounded-full hover:bg-white/30 transition-all duration-300"
            >
              <span class="text-lg">✏️</span>
              <span class="font-medium">Edit Profile</span>
            </button>
          </div>
        </div>

        <div class="p-8">
          <!-- Loading State -->
          <div v-if="isLoading" class="text-center py-8">
            <p class="text-gray-600 text-lg">Loading profile...</p>
          </div>

          <!-- Display Mode -->
          <div v-else-if="!isEditing" class="space-y-8">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="bg-emerald-50 p-6 rounded-2xl transition-all duration-300 hover:bg-emerald-100 hover:shadow-lg">
                <p class="text-sm font-semibold text-emerald-700 uppercase tracking-wide">Name</p>
                <p class="mt-2 text-xl font-medium text-gray-900">{{ user?.name || 'Not set' }}</p>
              </div>
              <div class="bg-emerald-50 p-6 rounded-2xl transition-all duration-300 hover:bg-emerald-100 hover:shadow-lg">
                <p class="text-sm font-semibold text-emerald-700 uppercase tracking-wide">Email</p>
                <p class="mt-2 text-xl font-medium text-gray-900">{{ user?.email || 'Not set' }}</p>
              </div>
              <div class="bg-emerald-50 p-6 rounded-2xl transition-all duration-300 hover:bg-emerald-100 hover:shadow-lg">
                <p class="text-sm font-semibold text-emerald-700 uppercase tracking-wide">Nomor HP</p>
                <p class="mt-2 text-xl font-medium text-gray-900">{{ user?.NoHp || 'Not set' }}</p>
              </div>
              <div class="bg-emerald-50 p-6 rounded-2xl transition-all duration-300 hover:bg-emerald-100 hover:shadow-lg">
                <p class="text-sm font-semibold text-emerald-700 uppercase tracking-wide">Pekerjaan</p>
                <p class="mt-2 text-xl font-medium text-gray-900">{{ user?.pekerjaan || 'Not set' }}</p>
              </div>
              <div class="bg-emerald-50 p-6 rounded-2xl transition-all duration-300 hover:bg-emerald-100 hover:shadow-lg">
                <p class="text-sm font-semibold text-emerald-700 uppercase tracking-wide">Tanggal Lahir</p>
                <p class="mt-2 text-xl font-medium text-gray-900">{{ user?.tanggal_lahir ? new Date(user.tanggal_lahir).toLocaleDateString('id-ID') : 'Not set' }}</p>
              </div>
              <div class="bg-emerald-50 p-6 rounded-2xl transition-all duration-300 hover:bg-emerald-100 hover:shadow-lg">
                <p class="text-sm font-semibold text-emerald-700 uppercase tracking-wide">Domisili</p>
                <p class="mt-2 text-xl font-medium text-gray-900">{{ user?.domisili || 'Not set' }}</p>
              </div>
            </div>

            <div v-if="user?.informasi_ipbi" class="bg-emerald-50 p-6 rounded-2xl transition-all duration-300 hover:bg-emerald-100 hover:shadow-lg">
              <p class="text-sm font-semibold text-emerald-700 uppercase tracking-wide mb-2">Pengalaman di IPBI</p>
              <p class="text-gray-900 whitespace-pre-line">{{ user.informasi_ipbi }}</p>
            </div>

            <!-- Uji Kompetensi Section -->
            <div class="pt-6 border-t border-emerald-100">
              <h2 class="text-xl font-semibold text-emerald-700 mb-4">Data Pemetaan Guru</h2>
              <div class="bg-emerald-50 p-6 rounded-2xl space-y-4">
                <div>
                  <p class="text-sm font-semibold text-emerald-700 uppercase tracking-wide">
                    {{ user?.is_verified ? 'Nilai Final' : 'Nilai Sementara' }}
                  </p>
                  <p class="mt-2 text-xl font-medium text-gray-900">
                    {{ user?.nilai > 0 ? user.nilai : '-' }}
                  </p>
                  <p v-if="user?.is_verified" class="mt-2 text-sm text-emerald-600">
                    Nilai sudah diverifikasi oleh pihak IPBI
                  </p>
                </div>
                <div v-if="user?.nilai > 0">
                  <p class="text-sm font-semibold text-emerald-700 uppercase tracking-wide">Kategori</p>
                  <p class="mt-2 text-lg font-medium" :class="getCategoryClass(user.nilai)">
                    {{ getCategory(user.nilai) }}
                  </p>
                </div>
              </div>
            </div>

            <!-- List Sertifikat Section -->
            <div v-if="certificates.length > 0" class="pt-6 border-t border-emerald-100">
              <h2 class="text-xl font-semibold text-emerald-700 mb-4">Sertifikat yang Sudah Di-Submit</h2>
              <div class="bg-emerald-50 p-6 rounded-2xl">
                <ul class="space-y-3">
                  <li v-for="(cert, index) in certificates" :key="index" class="flex items-center space-x-3 p-3 bg-white rounded-lg hover:bg-emerald-100 transition-all duration-300">
                    <span class="text-emerald-600 text-xl">📜</span>
                    <span class="text-gray-900 font-medium">{{ cert }}</span>
                  </li>
                </ul>
              </div>
            </div>

            <div class="pt-6 border-t border-emerald-100 space-y-4">
              <!-- Delete Profile Picture Button -->
              <button
                v-if="profilePictureUrl"
                @click="showDeletePictureConfirm = true"
                class="text-orange-600 font-semibold hover:text-orange-700 transition-all duration-300 hover:underline flex items-center space-x-2"
              >
                <i class="fas fa-trash"></i>
                <span>Hapus Foto Profil</span>
              </button>
              
              <!-- Delete Account Button -->
              <button
                @click="showDeleteConfirm = true"
                class="text-red-600 font-semibold hover:text-red-700 transition-all duration-300 hover:underline"
              >
                Delete Account
              </button>
            </div>
          </div>

          <!-- Edit Mode -->
          <form v-else @submit.prevent="updateProfile" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-semibold text-emerald-700 uppercase tracking-wide">Name</label>
                <input
                  type="text"
                  v-model="editForm.name"
                  class="mt-2 block w-full rounded-lg border border-emerald-200 p-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300"
                  required
                />
              </div>
              <div>
                <label class="block text-sm font-semibold text-emerald-700 uppercase tracking-wide">Email</label>
                <input
                  type="email"
                  v-model="editForm.email"
                  class="mt-2 block w-full rounded-lg border border-emerald-200 p-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300"
                  required
                />
              </div>
              <div>
                <label class="block text-sm font-semibold text-emerald-700 uppercase tracking-wide">Nomor HP</label>
                <input
                  type="text"
                  v-model="editForm.NoHp"
                  class="mt-2 block w-full rounded-lg border border-emerald-200 p-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300"
                  placeholder="Nomor HP"
                />
              </div>
              <div>
                <label class="block text-sm font-semibold text-emerald-700 uppercase tracking-wide">Pekerjaan</label>
                <input
                  type="text"
                  v-model="editForm.pekerjaan"
                  class="mt-2 block w-full rounded-lg border border-emerald-200 p-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300"
                  placeholder="Pekerjaan"
                />
              </div>
              <div>
                <label class="block text-sm font-semibold text-emerald-700 uppercase tracking-wide">Tanggal Lahir</label>
                <input
                  type="date"
                  v-model="editForm.tanggal_lahir"
                  class="mt-2 block w-full rounded-lg border border-emerald-200 p-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300"
                />
              </div>
              <div>
                <label class="block text-sm font-semibold text-emerald-700 uppercase tracking-wide">Domisili</label>
                <input
                  type="text"
                  v-model="editForm.domisili"
                  class="mt-2 block w-full rounded-lg border border-emerald-200 p-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300"
                  placeholder="Domisili"
                />
              </div>
            </div>
            <div>
              <label class="block text-sm font-semibold text-emerald-700 uppercase tracking-wide">Pengalaman di IPBI</label>
              <textarea
                v-model="editForm.informasi_ipbi"
                class="mt-2 block w-full rounded-lg border border-emerald-200 p-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300"
                placeholder="Apa pengalaman anda di IPBI?"
                rows="3"
              ></textarea>
            </div>

            <div class="flex space-x-4">
              <button
                type="submit"
                class="flex-1 bg-emerald-600 text-white px-6 py-3 rounded-full hover:bg-emerald-700 transition-all duration-300 hover:shadow-md"
              >
                Save Changes
              </button>
              <button
                type="button"
                @click="cancelEditing"
                class="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-full hover:bg-gray-200 transition-all duration-300 hover:shadow-md"
              >
                Cancel
              </button>
            </div>
          </form>

          <!-- Error Message -->
          <div v-if="errorMessage" class="mt-6 p-4 bg-red-50 rounded-lg">
            <p class="text-sm font-medium text-red-600">{{ errorMessage }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Picture Confirmation Modal -->
    <div v-if="showDeletePictureConfirm" class="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div class="bg-white rounded-3xl max-w-md mx-4 p-8 shadow-2xl">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-2xl font-bold text-gray-900">Hapus Foto Profil</h3>
          <button
            @click="showDeletePictureConfirm = false"
            class="text-gray-500 hover:text-gray-700 transition-all duration-300"
          >
            ❌
          </button>
        </div>
        <p class="text-gray-600 mb-8 leading-relaxed">
          Apakah Anda yakin ingin menghapus foto profil? Tindakan ini tidak dapat dibatalkan.
        </p>
        <div class="flex space-x-4">
          <button
            @click="deleteProfilePicture"
            class="flex-1 bg-orange-600 text-white px-6 py-3 rounded-full hover:bg-orange-700 transition-all duration-300"
          >
            Hapus Foto
          </button>
          <button
            @click="showDeletePictureConfirm = false"
            class="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-full hover:bg-gray-200 transition-all duration-300"
          >
            Batal
          </button>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteConfirm" class="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div class="bg-white rounded-3xl max-w-md mx-4 p-8 shadow-2xl">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-2xl font-bold text-gray-900">Confirm Deletion</h3>
          <button
            @click="showDeleteConfirm = false"
            class="text-gray-500 hover:text-gray-700 transition-all duration-300"
          >
            ❌
          </button>
        </div>
        <p class="text-gray-600 mb-8 leading-relaxed">
          Are you sure you want to delete your account? This action is permanent and cannot be reversed.
        </p>
        <div class="flex space-x-4">
          <button
            @click="deleteAccount"
            class="flex-1 bg-red-600 text-white px-6 py-3 rounded-full hover:bg-red-700 transition-all duration-300"
          >
            Delete Account
          </button>
          <button
            @click="showDeleteConfirm = false"
            class="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-full hover:bg-gray-200 transition-all duration-300"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useDialog } from '@/composables/useDialog';
import axios from 'axios';

const router = useRouter();
const authStore = useAuthStore();
const { showAlert } = useDialog();
const user = ref(null);
const isEditing = ref(false);
const showDeleteConfirm = ref(false);
const showDeletePictureConfirm = ref(false);
const errorMessage = ref('');
const isLoading = ref(true);
const profilePictureUrl = ref(null);
const fileInput = ref(null);
const isUploading = ref(false);

const editForm = ref({
  name: '',
  email: '',
  NoHp: '',
  pekerjaan: '',
  tanggal_lahir: '',
  domisili: '',
  informasi_ipbi: ''
});

const certificates = ref([]);

onMounted(async () => {
  await loadProfile();
});

const loadProfile = async () => {
  isLoading.value = true;
  errorMessage.value = '';
  
  try {
    const response = await axios.get('/api/profile', {
      headers: {
        Authorization: `Bearer ${authStore.accessToken}`
      }
    });
    
    console.log('✅ Data dari API:', response.data);
    console.log('📸 Profile picture field:', response.data?.profile_picture);
    console.log('🔗 Profile picture URL field:', response.data?.profile_picture_url);
    console.log('📋 All fields in response:', Object.keys(response.data));
    
    user.value = response.data;
    authStore.setUser(response.data);
    
    editForm.value = {
      name: user.value?.name || '',
      email: user.value?.email || '',
      NoHp: user.value?.NoHp || '',
      pekerjaan: user.value?.pekerjaan || '',
      tanggal_lahir: user.value?.tanggal_lahir || '',
      domisili: user.value?.domisili || '',
      informasi_ipbi: user.value?.informasi_ipbi || ''
    };

    // Load certificates
    await loadCertificates();
    
    // Set profile picture URL - PRIORITAS: profile_picture_url > construct dari profile_picture
    if (response.data?.profile_picture_url) {
      // Gunakan profile_picture_url langsung dari backend (sudah full URL)
      profilePictureUrl.value = response.data.profile_picture_url;
      console.log('✅ Menggunakan profile_picture_url dari API:', profilePictureUrl.value);
    } else if (response.data?.profile_picture) {
      // Jika profile_picture_url tidak ada, construct dari profile_picture
      const baseURL = axios.defaults.baseURL || 'http://localhost:8000';
      // Hapus /api jika ada di baseURL
      const cleanBaseURL = baseURL.replace(/\/api$/, '');
      profilePictureUrl.value = `${cleanBaseURL}/storage/${response.data.profile_picture}`;
      console.log('✅ Construct URL dari profile_picture:', profilePictureUrl.value);
    } else {
      profilePictureUrl.value = null;
      console.log('⚠️ Tidak ada profile picture');
    }
    
    console.log('🎯 Final profilePictureUrl:', profilePictureUrl.value);
    
  } catch (error) {
    errorMessage.value = error.response?.data?.message || 'Failed to load profile';
    console.error('❌ Error fetching profile:', error);
  } finally {
    isLoading.value = false;
  }
};

const startEditing = () => {
  isEditing.value = true;
  editForm.value = {
    name: user.value?.name || '',
    email: user.value?.email || '',
    NoHp: user.value?.NoHp || '',
    pekerjaan: user.value?.pekerjaan || '',
    tanggal_lahir: user.value?.tanggal_lahir || '',
    domisili: user.value?.domisili || '',
    informasi_ipbi: user.value?.informasi_ipbi || ''
  };
};

const cancelEditing = async () => {
  isEditing.value = false;
  errorMessage.value = '';
  // Reload profile to ensure we have the latest data
  await loadProfile();
};

const updateProfile = async () => {
  try {
    errorMessage.value = '';
    
    const response = await axios.post(
      '/api/updateprofile',
      editForm.value,
      {
        headers: {
          Authorization: `Bearer ${authStore.accessToken}`
        }
      }
    );

    console.log('✅ Profile updated:', response.data);
    
    // Update user data dengan response terbaru (termasuk profile_picture_url)
    user.value = response.data;
    authStore.setUser(user.value);
    
    // Update profile picture URL dari response
    if (response.data?.profile_picture_url) {
      profilePictureUrl.value = response.data.profile_picture_url;
    } else if (response.data?.profile_picture) {
      const baseURL = axios.defaults.baseURL || 'http://localhost:8000';
      const cleanBaseURL = baseURL.replace(/\/api$/, '');
      profilePictureUrl.value = `${cleanBaseURL}/storage/${response.data.profile_picture}`;
    } else {
      profilePictureUrl.value = null;
    }
    
    isEditing.value = false;
    errorMessage.value = '';
    
    await showAlert('Profile berhasil diupdate!', 'Berhasil');
  } catch (error) {
    errorMessage.value = error.response?.data?.message || 'Failed to update profile';
    console.error('❌ Error updating profile:', error);
  }
};

const triggerFileInput = () => {
  fileInput.value?.click();
};

const handleFileSelect = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  // Validate file type
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
  if (!allowedTypes.includes(file.type)) {
    errorMessage.value = 'Format file tidak valid. Hanya JPEG, PNG, atau GIF yang diizinkan.';
    return;
  }

  // Validate file size (5MB max)
  if (file.size > 5 * 1024 * 1024) {
    errorMessage.value = 'File terlalu besar. Maksimal 5MB.';
    return;
  }

  try {
    isUploading.value = true;
    errorMessage.value = '';

    const formData = new FormData();
    formData.append('profile_picture', file);

    console.log('📤 Uploading profile picture...');
    
    const response = await axios.post('/api/users/profile/upload-picture', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${authStore.accessToken}`
      }
    });

    console.log('✅ Upload response:', response.data);

    if (response.data.success) {
      // Update profile picture URL dari response upload
      if (response.data.data?.profile_picture_url) {
        profilePictureUrl.value = response.data.data.profile_picture_url;
        console.log('✅ Profile picture URL updated:', profilePictureUrl.value);
      }
      
      // Reload profile untuk mendapatkan data terbaru
      await loadProfile();
      
      // Update auth store dengan data terbaru
      authStore.setUser(user.value);
      
      errorMessage.value = '';
      await showAlert('Foto profil berhasil diupload!', 'Berhasil');
    }
  } catch (error) {
    errorMessage.value = error.response?.data?.message || 'Gagal upload foto profil';
    console.error('❌ Error uploading profile picture:', error);
    console.error('Error details:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
  } finally {
    isUploading.value = false;
    // Reset file input
    event.target.value = '';
  }
};

const deleteProfilePicture = async () => {
  try {
    errorMessage.value = '';
    
    const response = await axios.delete('/api/users/profile/delete-picture', {
      headers: {
        Authorization: `Bearer ${authStore.accessToken}`
      }
    });

    console.log('✅ Delete response:', response.data);

    if (response.data.success) {
      // Clear profile picture
      profilePictureUrl.value = null;
      user.value.profile_picture = null;
      user.value.profile_picture_url = null;
      
      // Update auth store
      authStore.setUser(user.value);
      
      // Reload profile untuk memastikan data terbaru
      await loadProfile();
      
      showDeletePictureConfirm.value = false;
      errorMessage.value = '';
      await showAlert('Foto profil berhasil dihapus!', 'Berhasil');
    }
  } catch (error) {
    errorMessage.value = error.response?.data?.message || 'Gagal menghapus foto profil';
    showDeletePictureConfirm.value = false;
    console.error('❌ Error deleting profile picture:', error);
  }
};

const deleteAccount = async () => {
  try {
    await axios.delete('/api/profile', {
      headers: {
        Authorization: `Bearer ${authStore.accessToken}`
      }
    });

    authStore.logout();
    router.push({ name: 'login' });
  } catch (error) {
    errorMessage.value = error.response?.data?.message || 'Failed to delete account';
    showDeleteConfirm.value = false;
    console.error('❌ Error deleting account:', error);
  }
};

const handleImageError = (event) => {
  console.error('❌ Error loading profile picture image:', event);
  // Set ke null jika gambar gagal load
  profilePictureUrl.value = null;
  user.value.profile_picture = null;
  user.value.profile_picture_url = null;
};

const getCategory = (nilai) => {
  if (nilai >= 300) {
    return 'Advanced';
  } else if (nilai >= 200) {
    return 'Intermediate';
  } else {
    return 'Beginner';
  }
};

const getCategoryClass = (nilai) => {
  if (nilai >= 300) {
    return 'text-purple-600';
  } else if (nilai >= 200) {
    return 'text-blue-600';
  } else {
    return 'text-green-600';
  }
};

const loadCertificates = async () => {
  try {
    // Fetch semua soal untuk cek apakah ada file yang sudah di-submit
    const soalNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17];
    const submittedCertificates = [];

    for (const soalNum of soalNumbers) {
      try {
        const response = await axios.get(`/api/soal${soalNum}`, {
          headers: {
            Authorization: `Bearer ${authStore.accessToken}`
          }
        });

        const data = response.data;
        if (data) {
          // Check setiap field yang mungkin berisi file sertifikat
          const fields = Object.keys(data);
          fields.forEach(field => {
            if (data[field] && typeof data[field] === 'string' && data[field].trim() !== '') {
              // Jika field berisi path/file, anggap sebagai sertifikat
              if (field.includes('file') || field.includes('sertifikat') || field.includes('certificate') || 
                  field.includes('foto') || field.includes('photo') || field.includes('dokumen') || 
                  field.includes('document') || field.includes('bukti') || field.includes('proof')) {
                const certName = `Soal ${soalNum} - ${field.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}`;
                if (!submittedCertificates.includes(certName)) {
                  submittedCertificates.push(certName);
                }
              }
            }
          });
        }
      } catch (error) {
        // Skip jika soal tidak ada atau error
        continue;
      }
    }

    certificates.value = submittedCertificates;
  } catch (error) {
    console.error('❌ Error loading certificates:', error);
    certificates.value = [];
  }
};
</script>

<style scoped>
.flower-1,
.flower-2,
.flower-3 {
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

@keyframes float {
  0%,
  100% {
    transform: translateY(0) scale(1);
  }
  50% {
    transform: translateY(-25px) scale(1.05);
  }
}

.shadow-3xl {
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

.transition-all {
  transition: all 0.3s ease-in-out;
}
</style>