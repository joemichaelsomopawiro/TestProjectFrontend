# 🔧 Perbaikan Backend - Endpoint /api/public/teachers

## ❌ Masalah

Error 404 saat mengakses endpoint `/api/public/teachers`:
```
GET http://127.0.0.1:8000/api/public/teachers 404 (Not Found)
```

**Penyebab:** Route `/api/public/teachers` belum terdaftar atau tidak bisa diakses.

---

## ✅ Solusi

### **Step 1: Pastikan Route Terdaftar di `routes/api.php`**

Buka file `routes/api.php` dan pastikan ada route berikut:

```php
<?php

use App\Http\Controllers\AdminController;
// ... import controller lainnya

// Public Routes (tidak perlu authentication)
Route::get('/public/teachers', [AdminController::class, 'publicTeachers']);

// Route lainnya...
```

**PENTING:** Route ini harus di **LUAR** middleware `auth:sanctum` agar bisa diakses tanpa login.

**Contoh struktur yang benar:**

```php
<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AdminController;
// ... controller lainnya

// Public Routes (TIDAK perlu authentication)
Route::get('/public/teachers', [AdminController::class, 'publicTeachers']);

// Route untuk OTP dan Password Reset
Route::post('/otp/send', [OTPController::class, 'requestOtp']);
Route::post('/otp/verify', [OTPController::class, 'verifyOtp']);
Route::post('/forgot-password', [PasswordResetController::class, 'forgotPassword']);
Route::post('/reset-password', [PasswordResetController::class, 'resetPassword']);

// Route untuk User dan Login
Route::post('/register', [UserController::class, 'store']);
Route::post('/login', [LoginController::class, 'login'])->name('login');

// Route untuk Admin Login
Route::post('/admin/login', [AdminController::class, 'login']);

// Rute yang dilindungi autentikasi (perlu login)
Route::middleware('auth:sanctum')->group(function () {
    // Route yang memerlukan authentication di sini
    Route::get('/users', [UserController::class, 'index']);
    // ... route lainnya
});
```

---

### **Step 2: Pastikan Method `publicTeachers()` Ada di AdminController**

Buka file `app/Http/Controllers/AdminController.php` dan pastikan ada method berikut:

```php
<?php

namespace App\Http\Controllers;

use App\Models\User;
// ... import lainnya

class AdminController extends Controller
{
    // ... method lainnya

    /**
     * Method untuk menampilkan data guru publik (tanpa autentikasi)
     * Digunakan untuk menampilkan peta di homepage
     */
    public function publicTeachers()
    {
        try {
            // Get all teachers (non-admin) dengan domisili
            $teachers = User::where('is_admin', false)
                ->whereNotNull('domisili')
                ->where('domisili', '!=', '')
                ->select('id', 'name', 'email', 'domisili')
                ->get();

            return response()->json([
                'success' => true,
                'message' => 'Data guru berhasil diambil',
                'count' => $teachers->count(),
                'data' => $teachers
            ], 200);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil data guru: ' . $e->getMessage()
            ], 500);
        }
    }
}
```

**PENTING:** 
- Method ini **TIDAK** memerlukan authentication
- Hanya return user dengan `is_admin = false`
- Hanya return user yang memiliki `domisili` (tidak null dan tidak kosong)
- Return format: `{ success: true, data: [...] }`

---

### **Step 3: Clear Route Cache**

Setelah menambahkan route, jalankan command berikut di terminal backend:

```bash
php artisan route:clear
php artisan cache:clear
php artisan config:clear
```

---

### **Step 4: Cek Route List**

Untuk memastikan route sudah terdaftar, jalankan:

```bash
php artisan route:list | grep public/teachers
```

**Expected output:**
```
GET|HEAD  api/public/teachers ................... AdminController@publicTeachers
```

Jika tidak muncul, berarti route belum terdaftar dengan benar.

---

### **Step 5: Test Endpoint di Browser**

Buka browser dan akses:
```
http://127.0.0.1:8000/api/public/teachers
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Data guru berhasil diambil",
  "count": 5,
  "data": [
    {
      "id": 1,
      "name": "Nama Guru",
      "email": "guru@example.com",
      "domisili": "Jakarta, Indonesia"
    },
    {
      "id": 2,
      "name": "Nama Guru 2",
      "email": "guru2@example.com",
      "domisili": "Bandung, Jawa Barat"
    }
  ]
}
```

---

## 🐛 Troubleshooting

### Problem 1: Route Masih Return 404

**Solution:**
1. Pastikan route ada di `routes/api.php` **DI LUAR** middleware `auth:sanctum`
2. Pastikan import `AdminController` sudah benar
3. Clear route cache: `php artisan route:clear`
4. Restart server: `php artisan serve`

### Problem 2: Method `publicTeachers()` Tidak Ada

**Solution:**
1. Tambahkan method `publicTeachers()` di `AdminController.php`
2. Pastikan method return format JSON yang benar
3. Pastikan tidak ada error di method tersebut

### Problem 3: CORS Error

**Solution:**
1. Update `config/cors.php`:
   ```php
   'allowed_origins' => ['http://localhost:5173', 'http://localhost:5174'],
   'supports_credentials' => false,
   ```
2. Clear config cache: `php artisan config:clear`

### Problem 4: Route Terdaftar Tapi Masih 404

**Solution:**
1. Cek apakah menggunakan prefix `/api` di `RouteServiceProvider`
2. Pastikan URL yang diakses: `http://127.0.0.1:8000/api/public/teachers`
3. Cek apakah server running di port yang benar

---

## 📋 Checklist

Setelah semua perbaikan, pastikan:

- [ ] Route `/api/public/teachers` terdaftar di `routes/api.php`
- [ ] Route berada di **LUAR** middleware `auth:sanctum`
- [ ] Method `publicTeachers()` ada di `AdminController.php`
- [ ] Method return format: `{ success: true, data: [...] }`
- [ ] Route cache sudah di-clear: `php artisan route:clear`
- [ ] Server sudah di-restart: `php artisan serve`
- [ ] Test di browser: `http://127.0.0.1:8000/api/public/teachers` return data
- [ ] Tidak ada CORS error

---

## 🧪 Testing

### Test di Browser:
```
http://127.0.0.1:8000/api/public/teachers
```

### Test di Postman/Thunder Client:
```
GET http://127.0.0.1:8000/api/public/teachers
Headers: 
  Accept: application/json
```

**Expected Response:**
- Status: `200 OK`
- Body: JSON dengan format `{ success: true, data: [...] }`

---

## 📝 Catatan Penting

1. **Route Public:** Route `/api/public/teachers` adalah **PUBLIC** (tidak perlu authentication)
2. **Data Filtering:** Backend sudah filter:
   - Hanya user dengan `is_admin = false`
   - Hanya user dengan `domisili` tidak NULL dan tidak kosong
3. **Response Format:** Pastikan return format sesuai dengan yang diharapkan frontend

---

**Setelah memperbaiki backend, refresh halaman frontend dan maps seharusnya sudah bisa menampilkan data domisili guru! 🚀**

