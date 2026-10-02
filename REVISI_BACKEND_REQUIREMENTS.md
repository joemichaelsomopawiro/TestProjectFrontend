# 📝 Dokumentasi Revisi Backend - Requirements

## 🎯 Overview
Dokumentasi ini berisi semua requirement backend untuk fitur-fitur revisi yang diminta oleh dosen.

---

## 1️⃣ Profile Update - Update Semua Field dari Register

### 📋 Field yang Harus Bisa Di-Update
Semua field yang ada di register harus bisa di-update melalui endpoint profile update:
- `name` (Nama Lengkap)
- `email` (Email)
- `NoHp` (Nomor HP)
- `pekerjaan` (Pekerjaan)
- `tanggal_lahir` (Tanggal Lahir)
- `domisili` (Domisili)
- `informasi_ipbi` (Pengalaman di IPBI)

### 🔧 Endpoint yang Perlu Diperbaiki

#### File: `app/Http/Controllers/ProfileController.php` atau `UserController.php`

**Method: `update(Request $request)` atau `updateProfile(Request $request)`**

```php
public function update(Request $request)
{
    $user = $request->user();
    
    $validated = $request->validate([
        'name' => 'sometimes|string|max:255',
        'email' => 'sometimes|email|unique:users,email,' . $user->id,
        'NoHp' => 'sometimes|string|max:20',
        'pekerjaan' => 'nullable|string|max:255',
        'tanggal_lahir' => 'nullable|date',
        'domisili' => 'nullable|string|max:255',
        'informasi_ipbi' => 'nullable|string',
    ]);
    
    // Update hanya field yang ada di request
    $user->fill($validated);
    $user->save();
    
    return response()->json([
        'success' => true,
        'message' => 'Profile berhasil diupdate',
        'data' => [
            'name' => $user->name,
            'email' => $user->email,
            'NoHp' => $user->NoHp,
            'pekerjaan' => $user->pekerjaan,
            'tanggal_lahir' => $user->tanggal_lahir,
            'domisili' => $user->domisili,
            'informasi_ipbi' => $user->informasi_ipbi,
            'profile_picture' => $user->profile_picture,
            'profile_picture_url' => $user->profile_picture ? asset('storage/' . $user->profile_picture) : null,
            'nilai' => $user->nilai,
            'is_verified' => $user->is_verified,
        ]
    ], 200);
}
```

**Route: `routes/api.php`**
```php
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/updateprofile', [ProfileController::class, 'update']);
    // atau
    Route::put('/profile', [ProfileController::class, 'update']);
});
```

---

## 2️⃣ Profile API - Return Semua Field

### 🔧 Endpoint: `GET /api/profile`

**Method: `show(Request $request)`**

Pastikan endpoint `/api/profile` mengembalikan **SEMUA** field yang diperlukan:

```php
public function show(Request $request)
{
    $user = $request->user();
    
    return response()->json([
        'name' => $user->name,
        'email' => $user->email,
        'NoHp' => $user->NoHp,
        'pekerjaan' => $user->pekerjaan,
        'tanggal_lahir' => $user->tanggal_lahir,
        'domisili' => $user->domisili,
        'informasi_ipbi' => $user->informasi_ipbi,
        'profile_picture' => $user->profile_picture,
        'profile_picture_url' => $user->profile_picture ? asset('storage/' . $user->profile_picture) : null,
        'nilai' => $user->nilai,
        'is_verified' => $user->is_verified,
    ]);
}
```

---

## 3️⃣ Public Teachers Endpoint - Tambahkan Field `NoHp` dan `nilai`

### 🔧 Endpoint: `GET /api/public/teachers`

**File: `app/Http/Controllers/AdminController.php` atau `UserController.php`**

**Method: `publicTeachers()`**

```php
public function publicTeachers()
{
    // Get all teachers (non-admin) dengan domisili
    $teachers = \App\Models\User::where('is_admin', false)
        ->whereNotNull('domisili')
        ->where('domisili', '!=', '')
        ->select('id', 'name', 'email', 'domisili', 'NoHp', 'nilai')  // ⬅️ TAMBAHKAN NoHp dan nilai
        ->get();

    return response()->json([
        'success' => true,
        'data' => $teachers
    ], 200);
}
```

**Route: `routes/api.php`**
```php
// Public Routes (tidak perlu authentication)
Route::get('/public/teachers', [AdminController::class, 'publicTeachers']);
```

### 📋 Field yang Harus Di-Return
- `id` - ID user
- `name` - Nama guru
- `email` - Email guru
- `domisili` - Domisili guru
- `NoHp` - Nomor HP guru (untuk ditampilkan di popup maps)
- `nilai` - Nilai akhir guru (untuk menentukan kategori)

---

## 4️⃣ Database Schema Check

### ✅ Pastikan Column Berikut Ada di Table `users`:

```sql
-- Check apakah semua column ini ada
- name (string)
- email (string, unique)
- NoHp (string, nullable)
- pekerjaan (string, nullable)
- tanggal_lahir (date, nullable)
- domisili (string, nullable)
- informasi_ipbi (text, nullable)
- nilai (integer, nullable)
- is_verified (boolean, default: false)
- profile_picture (string, nullable)
```

### 🔧 Migration (jika belum ada)

```php
// File: database/migrations/xxxx_add_fields_to_users_table.php

public function up()
{
    Schema::table('users', function (Blueprint $table) {
        // Pastikan semua column ini ada
        if (!Schema::hasColumn('users', 'NoHp')) {
            $table->string('NoHp')->nullable()->after('email');
        }
        if (!Schema::hasColumn('users', 'pekerjaan')) {
            $table->string('pekerjaan')->nullable()->after('NoHp');
        }
        if (!Schema::hasColumn('users', 'tanggal_lahir')) {
            $table->date('tanggal_lahir')->nullable()->after('pekerjaan');
        }
        if (!Schema::hasColumn('users', 'domisili')) {
            $table->string('domisili')->nullable()->after('tanggal_lahir');
        }
        if (!Schema::hasColumn('users', 'informasi_ipbi')) {
            $table->text('informasi_ipbi')->nullable()->after('domisili');
        }
        if (!Schema::hasColumn('users', 'nilai')) {
            $table->integer('nilai')->nullable()->after('informasi_ipbi');
        }
        if (!Schema::hasColumn('users', 'profile_picture')) {
            $table->string('profile_picture')->nullable()->after('email');
        }
    });
}
```

---

## 5️⃣ Kategori Berdasarkan Nilai

### 📊 Logic Kategori (Frontend sudah handle, backend hanya perlu return `nilai`)

- **Advanced**: `nilai >= 300`
- **Intermediate**: `nilai >= 200` dan `< 300`
- **Beginner**: `nilai < 200` atau `nilai = null`

**Backend hanya perlu memastikan field `nilai` di-return di semua endpoint yang relevan.**

---

## 6️⃣ List Sertifikat

### 📋 Endpoint yang Digunakan
Frontend akan fetch dari endpoint berikut untuk mendapatkan list sertifikat:
- `GET /api/soal1` sampai `GET /api/soal17`

**Tidak perlu perubahan backend**, frontend akan otomatis check field yang berisi file/sertifikat.

---

## 7️⃣ Maps - Simplify Domisili

### 📋 Logic Simplify (Frontend sudah handle)

Frontend akan:
1. Ambil bagian pertama sebelum koma
2. Hapus detail wilayah (Barat, Timur, Selatan, Utara, Pusat, dll)
3. Group berdasarkan kota yang sudah di-simplify

**Backend tidak perlu perubahan**, cukup return `domisili` seperti biasa.

---

## 8️⃣ Maps Popup - Nama, Kategori, Kontak

### 📋 Data yang Diperlukan di Popup

Popup maps akan menampilkan:
- **Nama**: `name`
- **Kategori**: Dihitung dari `nilai` (Advanced/Intermediate/Beginner)
- **Nomor Kontak**: `NoHp`

**Backend sudah di-handle** di endpoint `/api/public/teachers` dengan menambahkan field `NoHp` dan `nilai` (lihat section 3).

---

## 📋 Checklist Implementasi Backend

### Step 1: Update Profile Update Endpoint
- [ ] Pastikan endpoint `/api/updateprofile` atau `/api/profile` (PUT) bisa update semua field
- [ ] Tambahkan validation untuk semua field
- [ ] Return semua field setelah update

### Step 2: Update Profile GET Endpoint
- [ ] Pastikan `/api/profile` return semua field: name, email, NoHp, pekerjaan, tanggal_lahir, domisili, informasi_ipbi, nilai, profile_picture

### Step 3: Update Public Teachers Endpoint
- [ ] Tambahkan field `NoHp` dan `nilai` di select query
- [ ] Pastikan endpoint `/api/public/teachers` return field tersebut

### Step 4: Database Check
- [ ] Pastikan semua column ada di table `users`
- [ ] Run migration jika ada column yang belum ada

### Step 5: Testing
- [ ] Test update profile dengan semua field
- [ ] Test GET profile return semua field
- [ ] Test public teachers endpoint return NoHp dan nilai
- [ ] Test maps popup menampilkan data dengan benar

---

## 🧪 Testing

### 1. Test Update Profile

```bash
POST http://127.0.0.1:8000/api/updateprofile
Authorization: Bearer {your_token}
Content-Type: application/json

{
  "name": "Nama Baru",
  "email": "email@baru.com",
  "NoHp": "081234567890",
  "pekerjaan": "Guru",
  "tanggal_lahir": "1990-01-01",
  "domisili": "Bandung",
  "informasi_ipbi": "Pengalaman di IPBI"
}

Expected Response:
{
  "success": true,
  "message": "Profile berhasil diupdate",
  "data": {
    "name": "Nama Baru",
    "email": "email@baru.com",
    "NoHp": "081234567890",
    "pekerjaan": "Guru",
    "tanggal_lahir": "1990-01-01",
    "domisili": "Bandung",
    "informasi_ipbi": "Pengalaman di IPBI",
    "nilai": 350,
    "is_verified": false
  }
}
```

### 2. Test GET Profile

```bash
GET http://127.0.0.1:8000/api/profile
Authorization: Bearer {your_token}

Expected Response:
{
  "name": "Nama User",
  "email": "user@example.com",
  "NoHp": "081234567890",
  "pekerjaan": "Guru",
  "tanggal_lahir": "1990-01-01",
  "domisili": "Bandung",
  "informasi_ipbi": "Pengalaman di IPBI",
  "nilai": 350,
  "is_verified": false,
  "profile_picture": "profile-pictures/xxx.jpg",
  "profile_picture_url": "http://127.0.0.1:8000/storage/profile-pictures/xxx.jpg"
}
```

### 3. Test Public Teachers Endpoint

```bash
GET http://127.0.0.1:8000/api/public/teachers

Expected Response:
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Guru 1",
      "email": "guru1@example.com",
      "domisili": "Bandung",
      "NoHp": "081234567890",  ⬅️ MUST EXIST
      "nilai": 350  ⬅️ MUST EXIST
    },
    {
      "id": 2,
      "name": "Guru 2",
      "email": "guru2@example.com",
      "domisili": "Jakarta",
      "NoHp": "081234567891",  ⬅️ MUST EXIST
      "nilai": 250  ⬅️ MUST EXIST
    }
  ]
}
```

---

## ⚠️ Troubleshooting

### Problem 1: Field tidak ter-update
**Solution:**
- Pastikan field ada di database
- Check validation rules
- Pastikan field di-fill dengan benar

### Problem 2: Public teachers tidak return NoHp dan nilai
**Solution:**
- Pastikan field ditambahkan di select query
- Clear cache: `php artisan cache:clear`
- Restart server

### Problem 3: Maps popup tidak menampilkan data
**Solution:**
- Pastikan endpoint `/api/public/teachers` return `NoHp` dan `nilai`
- Check console browser untuk error
- Pastikan data di database sudah terisi

---

## 📄 Summary

**Total Perubahan Backend:**
1. Update endpoint `/api/updateprofile` untuk handle semua field
2. Update endpoint `/api/profile` (GET) untuk return semua field
3. Update endpoint `/api/public/teachers` untuk return `NoHp` dan `nilai`
4. Pastikan semua column ada di database

**Hasil:**
- ✅ Profile bisa update semua field dari register
- ✅ Profile menampilkan kategori berdasarkan nilai
- ✅ Maps popup menampilkan nama, kategori, dan kontak
- ✅ Domisili di-simplify di frontend (tidak perlu perubahan backend)

---

**Selamat mengimplementasi! 🚀**

