<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-100 to-emerald-50 py-6 px-4 sm:px-6 lg:px-8">
    <div class="max-w-4xl mx-auto">
      <!-- Header -->
      <h1 class="text-2xl sm:text-4xl font-extrabold text-emerald-900 mb-8 text-center tracking-tight animate__animated animate__fadeInDown">
        Detail Pengguna: {{ user?.name || 'Memuat...' }}
      </h1>

      <!-- Loading State -->
      <div v-if="isLoading" class="text-center text-gray-600 animate__animated animate__pulse animate__infinite">
        Memuat data pengguna...
      </div>

      <!-- Error State -->
      <div v-if="error" class="mb-8 p-6 bg-red-50 rounded-xl shadow-md text-center">
        <p class="text-lg font-medium text-red-600">{{ error }}</p>
      </div>

      <!-- User Info Card -->
      <div v-if="!isLoading && !error && user" class="bg-white p-6 rounded-xl shadow-lg mb-8 transition-all duration-300 hover:shadow-xl">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <p class="text-base sm:text-lg text-gray-700">
            <strong class="text-emerald-800">Email:</strong> {{ user.email }}
          </p>
          <p class="text-base sm:text-lg text-gray-700">
            <strong class="text-emerald-800">Status:</strong>
            <span :class="user.is_verified ? 'text-emerald-600 font-medium' : 'text-red-600 font-medium'">
              {{ user.is_verified ? 'Sudah Dinilai' : 'Belum Dinilai' }}
            </span>
          </p>
          <p class="text-base sm:text-lg text-gray-700">
            <strong class="text-emerald-800">Total Nilai:</strong>
            <span v-if="!isEditingTotal" class="font-semibold text-emerald-700">{{ totalNilai }}</span>
            <input
              v-else
              v-model.number="editedTotalNilai"
              type="number"
              min="0"
              class="font-semibold text-emerald-700 border rounded px-2 py-1 w-20"
              @keypress.enter="confirmUpdateAndVerify"
            >
            <button
              v-if="!user.is_verified"
              @click="toggleEditTotal"
              class="ml-2 text-sm text-emerald-600 hover:text-emerald-800"
            >
              {{ isEditingTotal ? 'Batal' : 'Edit' }}
            </button>
          </p>
        </div>
        <div class="mt-6 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <button
            v-if="!user.is_verified && !isEditingTotal"
            @click="verifyUser"
            class="w-full bg-emerald-600 text-white px-4 py-2 rounded-lg font-semibold shadow-md hover:bg-emerald-700 hover:scale-105 transform transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            Verifikasi Uji Kompetensi
          </button>
          <button
            v-if="isEditingTotal"
            @click="confirmUpdateAndVerify"
            class="w-full bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold shadow-md hover:bg-blue-700 hover:scale-105 transform transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Simpan & Verifikasi
          </button>
          <button
            v-if="user.is_verified"
            @click="unverifyUser"
            class="w-full bg-red-600 text-white px-4 py-2 rounded-lg font-semibold shadow-md hover:bg-red-700 hover:scale-105 transform transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Batalkan Verifikasi
          </button>
        </div>
      </div>

      <!-- Submissions Table -->
      <div v-if="!isLoading && !error">
        <h2 class="text-xl sm:text-3xl font-semibold text-emerald-900 mb-6 text-center tracking-tight animate__animated animate__fadeInUp">
          Daftar Nilai Soal
        </h2>
        <div class="overflow-x-auto">
          <table class="min-w-full bg-white rounded-xl shadow-md">
            <thead class="bg-emerald-100 text-xs sm:text-sm">
              <tr>
                <th class="py-2 px-2 sm:py-3 sm:px-4 text-left text-emerald-800 font-semibold">No</th>
                <th class="py-2 px-2 sm:py-3 sm:px-4 text-left text-emerald-800 font-semibold">Soal</th>
                <th class="py-2 px-2 sm:py-3 sm:px-4 text-left text-emerald-800 font-semibold">Nilai</th>
                <th class="py-2 px-2 sm:py-3 sm:px-4 text-left text-emerald-800 font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(soal, key, index) in soals"
                :key="key"
                class="border-b hover:bg-emerald-50 transition-colors duration-200 text-xs sm:text-sm"
              >
                <td class="py-2 px-2 sm:py-3 sm:px-4">{{ index + 1 }}</td>
                <td class="py-2 px-2 sm:py-3 sm:px-4">{{ getDescriptiveSoalName(key) }}</td>
                <td class="py-2 px-2 sm:py-3 sm:px-4 font-medium text-emerald-700">{{ soal?.nilai || 0 }}</td>
                <td class="py-2 px-2 sm:py-3 sm:px-4">
                  <router-link
                    v-if="soal"
                    :to="{ name: 'soal-detail', params: { userId: user.id, soalNumber: key.replace('soal', '') } }"
                    class="inline-block bg-teal-500 text-white px-2 py-1 sm:px-3 sm:py-2 rounded-md font-medium hover:bg-teal-600 transition-all duration-300"
                  >
                    {{ user.is_verified ? 'Lihat Detail' : 'Periksa' }}
                  </router-link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Popup Konfirmasi -->
    <div v-if="showConfirmPopup" class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 animate-fade-in">
      <div class="bg-white rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl transform transition-all duration-300 scale-95 hover:scale-100 mx-4">
        <h3 class="text-lg sm:text-xl font-bold text-gray-800 mb-4 animate-slide-in-down">Konfirmasi</h3>
        <p class="text-gray-700 leading-relaxed animate-fade-in-up mb-6">
          {{ confirmMessage }}
        </p>
        <div class="flex justify-end space-x-4">
          <button
            @click="handleConfirmCancel"
            class="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition-colors duration-200"
          >
            Batal
          </button>
          <button
            @click="handleConfirmOk"
            class="px-4 py-2 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-colors duration-200"
          >
            Ya, Lanjutkan
          </button>
        </div>
      </div>
    </div>

    <!-- Popup Success -->
    <div v-if="showSuccessPopup" class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 animate-fade-in">
      <div class="bg-white rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl transform transition-all duration-300 scale-95 hover:scale-100 mx-4">
        <div class="text-center">
          <div class="mb-4">
            <svg class="mx-auto h-16 w-16 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <h3 class="text-lg sm:text-xl font-bold text-gray-800 mb-4 animate-slide-in-down">Berhasil!</h3>
          <p class="text-gray-700 leading-relaxed animate-fade-in-up mb-6">
            {{ successMessage }}
          </p>
          <button
            @click="closeSuccessPopup"
            class="px-6 py-2 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-colors duration-200"
          >
            OK
          </button>
        </div>
      </div>
    </div>

    <!-- Popup Error -->
    <div v-if="showErrorPopup" class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 animate-fade-in">
      <div class="bg-white rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl transform transition-all duration-300 scale-95 hover:scale-100 mx-4">
        <div class="text-center">
          <div class="mb-4">
            <svg class="mx-auto h-16 w-16 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <h3 class="text-lg sm:text-xl font-bold text-gray-800 mb-4 animate-slide-in-down">Terjadi Kesalahan</h3>
          <p class="text-gray-700 leading-relaxed animate-fade-in-up mb-6">
            {{ errorMessage }}
          </p>
          <button
            @click="closeErrorPopup"
            class="px-6 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors duration-200"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { useAuthStore } from '@/stores/auth';
import 'animate.css';

export default {
  data() {
    return {
      user: null,
      soals: {},
      totalNilai: 0,
      editedTotalNilai: 0,
      isEditingTotal: false,
      isLoading: false,
      error: null,
      // Popup states
      showConfirmPopup: false,
      showSuccessPopup: false,
      showErrorPopup: false,
      confirmMessage: '',
      successMessage: '',
      errorMessage: '',
      confirmCallback: null,
      confirmCancelCallback: null,
    };
  },
  created() {
    this.fetchUserDetail();
  },
  methods: {
    async fetchUserDetail() {
      const authStore = useAuthStore();
      this.isLoading = true;
      this.error = null;

      if (!authStore.accessToken) {
        this.error = 'Silakan login terlebih dahulu.';
        this.isLoading = false;
        this.$router.push({ name: 'login' });
        return;
      }

      try {
        const response = await axios.get(`/api/admin/users/${this.$route.params.userId}`, {
          headers: { Authorization: `Bearer ${authStore.accessToken}` },
        });
        console.log('User detail response:', response.data);
        this.user = response.data.user;
        this.soals = response.data.soals;
        this.totalNilai = response.data.totalNilai;
        this.editedTotalNilai = this.totalNilai;
      } catch (error) {
        console.error('Error fetching user detail:', error.response || error);
        this.error = error.response?.status === 401
          ? 'Sesi Anda telah habis. Silakan login kembali.'
          : error.response?.data?.message || 'Gagal memuat detail pengguna.';
        if (error.response?.status === 401) {
          this.$router.push({ name: 'login' });
        }
      } finally {
        this.isLoading = false;
      }
    },
    verifyUser() {
      this.showConfirmDialog(
        'Apakah Anda yakin ingin memverifikasi pengguna ini?',
        async () => {
          const authStore = useAuthStore();
          try {
            await axios.post(
              `/api/admin/users/${this.$route.params.userId}/verify`,
              {},
              { headers: { Authorization: `Bearer ${authStore.accessToken}` } }
            );
            this.fetchUserDetail();
            this.showSuccessDialog('Pengguna telah diverifikasi! Silakan cek notifikasi untuk detail.');
          } catch (error) {
            console.error('Error verifying user:', error.response || error);
            const message = error.response?.status === 401
              ? 'Sesi Anda telah habis. Silakan login kembali.'
              : error.response?.data?.message || 'Kesalahan tidak diketahui';
            this.showErrorDialog('Gagal memverifikasi pengguna: ' + message);
          }
        }
      );
    },
    toggleEditTotal() {
      this.isEditingTotal = !this.isEditingTotal;
      if (!this.isEditingTotal) {
        this.editedTotalNilai = this.totalNilai;
      }
    },
    confirmUpdateAndVerify() {
      this.showConfirmDialog(
        'Anda akan mengubah nilai Guru secara manual (Tidak berdasarkan perhitungan pemeriksaan). Pastikan anda memberikan nilai yang tepat!',
        () => {
          this.verifyUserWithCustomScore();
        }
      );
    },
    async verifyUserWithCustomScore() {
      const authStore = useAuthStore();
      try {
        const response = await axios.post(
          `/api/admin/users/${this.$route.params.userId}/verify`,
          { total_nilai: this.editedTotalNilai },
          { headers: { Authorization: `Bearer ${authStore.accessToken}` } }
        );
        console.log('Verification response:', response.data);
        this.totalNilai = response.data.totalNilai || this.editedTotalNilai;
        this.isEditingTotal = false;
        this.fetchUserDetail();
        this.showSuccessDialog('Nilai berhasil diperbarui dan pengguna telah diverifikasi! Silakan cek notifikasi untuk detail.');
      } catch (error) {
        console.error('Error verifying user with custom score:', error.response || error);
        const message = error.response?.status === 401
          ? 'Sesi Anda telah habis. Silakan login kembali.'
          : error.response?.data?.message || 'Kesalahan tidak diketahui';
        this.showErrorDialog('Gagal memperbarui nilai dan verifikasi: ' + message);
      }
    },
    unverifyUser() {
      this.showConfirmDialog(
        'Apakah Anda yakin ingin membatalkan verifikasi pengguna ini? Nilai dan status verifikasi akan direset.',
        async () => {
          const authStore = useAuthStore();
          try {
            await axios.post(
              `/api/admin/users/${this.$route.params.userId}/unverify`,
              {},
              { headers: { Authorization: `Bearer ${authStore.accessToken}` } }
            );
            this.fetchUserDetail();
            this.showSuccessDialog('Verifikasi pengguna telah dibatalkan!');
          } catch (error) {
            console.error('Error unverifying user:', error.response || error);
            const message = error.response?.status === 401
              ? 'Sesi Anda telah habis. Silakan login kembali.'
              : error.response?.data?.message || 'Kesalahan tidak diketahui';
            this.showErrorDialog('Gagal membatalkan verifikasi: ' + message);
          }
        }
      );
    },
    showConfirmDialog(message, okCallback) {
      this.confirmMessage = message;
      this.confirmCallback = okCallback;
      this.showConfirmPopup = true;
    },
    handleConfirmOk() {
      if (this.confirmCallback) {
        this.confirmCallback();
      }
      this.showConfirmPopup = false;
      this.confirmCallback = null;
      this.confirmCancelCallback = null;
    },
    handleConfirmCancel() {
      if (this.confirmCancelCallback) {
        this.confirmCancelCallback();
      }
      this.showConfirmPopup = false;
      this.confirmCallback = null;
      this.confirmCancelCallback = null;
    },
    showSuccessDialog(message) {
      this.successMessage = message;
      this.showSuccessPopup = true;
    },
    closeSuccessPopup() {
      this.showSuccessPopup = false;
      this.successMessage = '';
    },
    showErrorDialog(message) {
      this.errorMessage = message;
      this.showErrorPopup = true;
    },
    closeErrorPopup() {
      this.showErrorPopup = false;
      this.errorMessage = '';
    },
    getDescriptiveSoalName(soalKey) {
      const soalNameMap = {
        'soal1': 'Data 1: Pendidikan Formal Terakhir Anda',
        'soal2': 'Data 2: Apakah kamu punya sertifikat Pendidikan Guru Merangkai Bunga?',
        'soal3': 'Data 3: Apakah anda memiliki kemampuan mengajar dalam bahasa asing?',
        'soal4': 'Data 4: Apakah anda memiliki sertifikasi dari Lembaga Floristy Asing dan Dalam Negeri?',
        'soal5': 'Data 5: Sertifikasi Kompetensi di Bidang Merangkai Bunga',
        'soal6': 'Data 6: Penghargaan dalam Bidang Floristry',
        'soal7': 'Data 7: Kejuaraan/Lomba Merangkai Bunga',
        'soal8': 'Data 8: Sertifikat Pelatihan/Seminar/Keikutsertaan Acara',
        'soal9': 'Data 9: Simposium Ikatan Perangkai Bunga Indonesia (IPBI)',
        'soal10': 'Data 10: Sebagai Demonstrator/Guru/Nara Sumber Bersertifikat',
        'soal11': 'Data 11: Penguji / Juri',
        'soal12': 'Data 12: Kepengurusan di Organisasi Ikatan Perangkai Bunga Indonesia (IPBI)',
        'soal13': 'Data 13: Sekolah Merangkai Bunga / Perguruan Tinggi',
        'soal14': 'Data 14: Kemampuan Mengajar Secara Online',
        'soal15': 'Data 15: Memiliki Kemampuan Floristry di Gaya Merangkai Bunga Lainnya',
        'soal16': 'Data 16: Informasi Florist dan Proyek',
        'soal17': 'Data 17: Publikasi - Mengisi Artikel / Tampil pada Media Cetak',
      };
      return soalNameMap[soalKey] || soalKey.replace('soal', 'Soal ').replace(/\b\w/g, char => char.toUpperCase());
    },
  },
};
</script>

<style scoped>
table { border-collapse: collapse; }
th, td { border: 1px solid #d1d5db; }
th { background-color: #d1fae5; }

@media (max-width: 640px) {
  .min-h-screen { padding: 1rem; }
  table { font-size: 0.75rem; }
  th, td { padding: 0.5rem; }
  .grid-cols-2 { grid-template-columns: 1fr; }
}
</style>

<style>
/* Popup Animations */
@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slide-in-down {
  from { 
    opacity: 0;
    transform: translateY(-20px);
  }
  to { 
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fade-in-up {
  from { 
    opacity: 0;
    transform: translateY(10px);
  }
  to { 
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.3s ease-out;
}

.animate-slide-in-down {
  animation: slide-in-down 0.4s ease-out;
}

.animate-fade-in-up {
  animation: fade-in-up 0.4s ease-out;
}
</style>