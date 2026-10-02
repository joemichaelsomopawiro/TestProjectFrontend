# 📝 Catatan Perbaikan Backend - Fitur Peta di HomePage

## 🎯 Tujuan
Membuat peta di HomePage bisa dilihat oleh semua orang (public) tanpa harus login, dan menampilkan lokasi guru berdasarkan domisili.

## 📋 File yang Perlu Diubah

### 1️⃣ File: `routes/api.php`

**Lokasi**: Baris ~43 (setelah route admin login)

**Perubahan**: Tambahkan 1 baris route publik

```php
// Route untuk Admin Login
Route::post('/admin/login', [AdminController::class, 'login']);

// ⬇️ TAMBAHKAN BARIS INI ⬇️
Route::get('/public/users', [UserController::class, 'publicUsers']);

// Rute yang dilindungi autentikasi
Route::middleware('auth:sanctum')->group(function () {
    // ... sisanya tetap sama
```

---

### 2️⃣ File: `app/Http/Controllers/UserController.php`

**Lokasi**: Di akhir class (sebelum penutup `}`)

**Perubahan**: Tambahkan method baru

```php
/**
 * Method untuk menampilkan data user/guru publik (tanpa autentikasi)
 * Digunakan untuk menampilkan peta di homepage
 */
public function publicUsers()
{
    try {
        // Ambil semua user yang bukan admin
        $teachers = \App\Models\User::where('is_admin', false)
            ->select('id', 'name', 'email', 'domisili')
            ->get();
        
        return response()->json([
            'success' => true,
            'data' => $teachers
        ], 200);
        
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'Gagal mengambil data guru'
        ], 500);
    }
}
```

---

## 🚀 Langkah-langkah Implementasi

### Step 1: Update Backend
1. Buka file `routes/api.php`
2. Tambahkan route publik seperti contoh di atas
3. Buka file `app/Http/Controllers/UserController.php`
4. Tambahkan method `publicUsers()` di akhir class

### Step 2: Clear Cache
Jalankan di terminal backend:

```bash
php artisan route:clear
php artisan cache:clear
php artisan serve
```

### Step 3: Update Frontend
Buka file `src/components/HomePage.vue`

**Baris ~439**, sudah menggunakan:
```javascript
const response = await axios.get('/api/public/users', {
```

---

## ✅ Cara Test

1. Pastikan backend Laravel berjalan di `http://127.0.0.1:8000`
2. Buka browser ke `http://127.0.0.1:5173` (frontend)
3. Scroll ke bagian peta
4. Peta seharusnya menampilkan marker-marker sesuai domisili guru

---

## 📌 Catatan Penting

- ✅ Endpoint `/api/public/users` **TIDAK memerlukan login**
- ✅ Hanya menampilkan: `id`, `name`, `email`, `domisili`
- ✅ Data admin **TIDAK ditampilkan**
- ✅ Jika API gagal, akan fallback ke sample data
- ✅ Geocoding otomatis convert teks domisili ke koordinat peta

---

## 🔍 Troubleshooting

### Error: Route not found
- Pastikan sudah clear cache: `php artisan route:clear`
- Restart server: `php artisan serve`

### Error: Method not found
- Pastikan method `publicUsers()` sudah ditambahkan di `UserController.php`
- Check penulisan nama method (case sensitive)

### Peta tidak muncul
- Check console browser untuk error
- Pastikan endpoint `/api/public/users` mengembalikan data JSON
- Test endpoint manual di: `http://127.0.0.1:8000/api/public/users`

---

## 📄 Summary

**Total perubahan**: 3 file
1. `routes/api.php` → +1 route
2. `UserController.php` → +1 method
3. `HomePage.vue` → ganti 1 endpoint

**Hasil**: Peta HomePage dapat dilihat oleh semua orang tanpa login! 🎉

