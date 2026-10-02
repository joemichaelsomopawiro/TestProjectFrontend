<template>
  <div class="data-guru">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-extrabold text-emerald-900">Data Guru</h1>
      <!-- Export Button -->
      <button 
        @click="exportTeachers"
        class="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors flex items-center"
        :disabled="loadingExport"
      >
        <span v-if="loadingExport" class="flex items-center">
          <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Exporting...
        </span>
        <span v-else class="flex items-center">
          <i class="fas fa-download mr-2"></i>
          Export Data Guru
        </span>
      </button>
    </div>
    
    <!-- Loading State -->
    <div v-if="loading" class="text-center py-8">
      <p class="text-lg text-gray-600">Memuat data...</p>
    </div>
    
    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 p-4 rounded-lg mb-6">
      <p class="text-sm font-medium text-red-600">{{ error }}</p>
    </div>
    
    <!-- Controls -->
    <div v-else class="mb-6">
      <div class="flex flex-col md:flex-row gap-4 justify-between items-start mb-4">
        <!-- Search Box -->
        <div class="w-full md:w-64">
          <label for="search" class="sr-only">Cari</label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <i class="fas fa-search text-gray-400"></i>
            </div>
            <input
              id="search"
              v-model="searchQuery"
              type="text"
              placeholder="Cari nama atau email..."
              class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
        </div>
        
        <!-- Sort Controls -->
        <div class="flex items-center space-x-2 w-full md:w-auto">
          <label for="sortBy" class="text-sm font-medium text-gray-700 whitespace-nowrap">Urutkan:</label>
          <select 
            id="sortBy" 
            v-model="sortBy" 
            class="rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring focus:ring-emerald-200 focus:ring-opacity-50"
          >
            <option value="name">Nama</option>
            <option value="email">Email</option>
            <option value="pekerjaan">Pekerjaan</option>
            <option value="tanggal_lahir">Tanggal Lahir</option>
            <option value="domisili">Domisili</option>
            <option value="status">Status</option>
          </select>
          
          <button 
            @click="toggleSortOrder" 
            class="flex items-center px-3 py-2 bg-emerald-100 text-emerald-800 rounded-md hover:bg-emerald-200 transition-colors"
          >
            <span class="mr-1">{{ sortOrder === 'asc' ? 'A-Z' : 'Z-A' }}</span>
            <span v-if="sortOrder === 'asc'">↑</span>
            <span v-else>↓</span>
          </button>
        </div>
      </div>
    </div>
    
    <!-- Table Container -->
    <div v-if="!loading && !error" class="overflow-x-auto bg-white rounded-lg shadow">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-emerald-600 text-white">
          <tr>
            <th scope="col" class="py-3 px-4 text-left text-xs font-medium uppercase tracking-wider">No</th>
            <th scope="col" class="py-3 px-4 text-left text-xs font-medium uppercase tracking-wider">Nama</th>
            <th scope="col" class="py-3 px-4 text-left text-xs font-medium uppercase tracking-wider">Email</th>
            <th scope="col" class="py-3 px-4 text-left text-xs font-medium uppercase tracking-wider hidden md:table-cell">No HP</th>
            <th scope="col" class="py-3 px-4 text-left text-xs font-medium uppercase tracking-wider hidden md:table-cell">Pekerjaan</th>
            <th scope="col" class="py-3 px-4 text-left text-xs font-medium uppercase tracking-wider hidden lg:table-cell">Tanggal Lahir</th>
            <th scope="col" class="py-3 px-4 text-left text-xs font-medium uppercase tracking-wider hidden lg:table-cell">Domisili</th>
            <th scope="col" class="py-3 px-4 text-left text-xs font-medium uppercase tracking-wider">Status</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-if="filteredUsers.length === 0">
            <td colspan="8" class="py-4 px-4 text-center text-gray-500">
              {{ searchQuery ? 'Tidak ada data yang sesuai dengan pencarian' : 'Tidak ada data guru' }}
            </td>
          </tr>
          <tr 
            v-for="(user, index) in filteredUsers" 
            :key="user.id" 
            class="hover:bg-gray-50 transition-colors duration-200"
          >
            <td class="py-3 px-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ index + 1 }}</td>
            <td class="py-3 px-4 whitespace-nowrap text-sm text-gray-700">{{ user.name }}</td>
            <td class="py-3 px-4 whitespace-nowrap text-sm text-gray-500">{{ user.email }}</td>
            <td class="py-3 px-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">{{ user.NoHp || '-' }}</td>
            <td class="py-3 px-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">{{ user.pekerjaan || '-' }}</td>
            <td class="py-3 px-4 whitespace-nowrap text-sm text-gray-500 hidden lg:table-cell">{{ user.tanggal_lahir || '-' }}</td>
            <td class="py-3 px-4 whitespace-nowrap text-sm text-gray-500 hidden lg:table-cell">{{ user.domisili || '-' }}</td>
            <td class="py-3 px-4 whitespace-nowrap text-sm text-gray-500">
              <span 
                :class="{
                  'px-2 py-1 text-xs font-medium rounded': true,
                  'bg-green-100 text-green-800': user.status === 'Aktif',
                  'bg-yellow-100 text-yellow-800': user.status === 'Pending',
                  'bg-red-100 text-red-800': user.status === 'Nonaktif',
                  'bg-gray-100 text-gray-800': !user.status
                }"
              >
                {{ user.status || 'Tidak ada' }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <!-- Mobile View for Each Record -->
    <div v-if="!loading && !error" class="lg:hidden mt-4 space-y-4">
      <div 
        v-for="(user, index) in filteredUsers" 
        :key="user.id"
        class="bg-white rounded-lg shadow p-4 border-l-4 border-emerald-500"
      >
        <div class="flex justify-between items-start mb-2">
          <div>
            <span class="inline-block bg-emerald-100 text-emerald-800 text-xs font-medium px-2 py-1 rounded-full mb-2">
              #{{ index + 1 }}
            </span>
            <h3 class="font-medium text-gray-900">{{ user.name }}</h3>
          </div>
          <span 
            :class="{
              'px-2 py-1 text-xs font-medium rounded': true,
              'bg-green-100 text-green-800': user.status === 'Aktif',
              'bg-yellow-100 text-yellow-800': user.status === 'Pending',
              'bg-red-100 text-red-800': user.status === 'Nonaktif',
              'bg-gray-100 text-gray-800': !user.status
            }"
          >
            {{ user.status || 'Tidak ada' }}
          </span>
        </div>
        <p class="text-sm text-gray-500 mb-1">{{ user.email }}</p>
        <div class="grid grid-cols-2 gap-2 mt-3 text-xs text-gray-500">
          <div>
            <p class="font-medium text-gray-700">No HP:</p>
            <p>{{ user.NoHp || '-' }}</p>
          </div>
          <div>
            <p class="font-medium text-gray-700">Pekerjaan:</p>
            <p>{{ user.pekerjaan || '-' }}</p>
          </div>
          <div>
            <p class="font-medium text-gray-700">Tanggal Lahir:</p>
            <p>{{ user.tanggal_lahir || '-' }}</p>
          </div>
          <div>
            <p class="font-medium text-gray-700">Domisili:</p>
            <p>{{ user.domisili || '-' }}</p>
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
import { useRouter } from 'vue-router';

const router = useRouter();
const authStore = useAuthStore();
const users = ref([]);
const loading = ref(true);
const error = ref(null);
const sortBy = ref('name');
const sortOrder = ref('asc');
const searchQuery = ref('');
const loadingExport = ref(false);

const toggleSortOrder = () => {
  sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
};

const filteredUsers = computed(() => {
  // Filter out admin users first
  const nonAdminUsers = users.value.filter(user => !user.is_admin);
  
  // Then apply search filter if there is a search query
  const searchFiltered = searchQuery.value
    ? nonAdminUsers.filter(user => {
        const query = searchQuery.value.toLowerCase();
        return (
          (user.name && user.name.toLowerCase().includes(query)) ||
          (user.email && user.email.toLowerCase().includes(query)) ||
          (user.domisili && user.domisili.toLowerCase().includes(query)) ||
          (user.pekerjaan && user.pekerjaan.toLowerCase().includes(query))
        );
      })
    : nonAdminUsers;
  
  // Finally sort the filtered users
  return [...searchFiltered].sort((a, b) => {
    const fieldA = a[sortBy.value] || '';
    const fieldB = b[sortBy.value] || '';
    
    if (sortOrder.value === 'asc') {
      return fieldA.localeCompare(fieldB);
    } else {
      return fieldB.localeCompare(fieldA);
    }
  });
});

const fetchUsers = async () => {
  try {
    const response = await axios.get('/api/users', {
      headers: {
        Authorization: `Bearer ${authStore.accessToken}`,
      },
    });
    users.value = response.data.data || [];
    error.value = null;
  } catch (err) {
    error.value = err.response?.data?.message || 'Gagal mengambil data guru';
    console.error('Error fetching users:', err.response?.data);
  } finally {
    loading.value = false;
  }
};

const exportTeachers = async () => {
  try {
    loadingExport.value = true;
    
    const response = await axios.get('/api/admin/export/teachers', {
      headers: {
        Authorization: `Bearer ${authStore.accessToken}`,
      },
      responseType: 'blob'
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'data_guru_terdaftar.xlsx');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

  } catch (err) {
    console.error('Error exporting teachers:', err);
    error.value = err.response?.data?.message || 'Gagal mengekspor data guru';
  } finally {
    loadingExport.value = false;
  }
};

onMounted(() => {
  if (!authStore.isLoggedIn || !authStore.isUserAdmin) {
    router.push({ name: 'home' });
    return;
  }
  fetchUsers();
});
</script>

<style scoped>
.data-guru {
  max-width: 100%;
  padding: 30px;
}

@media (min-width: 1024px) {
  /* Hide mobile cards on larger screens */
  .lg\:hidden {
    display: none;
  }
}

@media (max-width: 1023px) {
  /* Hide table on smaller screens */
  table {
    display: none;
  }
}
</style>