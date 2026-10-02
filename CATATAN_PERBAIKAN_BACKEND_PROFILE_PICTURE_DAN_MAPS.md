# 📝 Catatan Perbaikan Backend - Profile Picture & Maps

## 🎯 Fitur yang Diperlukan

### 1. Profile Picture Upload & Display
- Upload profile picture via API
- Display profile picture di profile page
- Delete profile picture

### 2. Maps Data dari Backend
- Public endpoint untuk fetch data guru untuk maps
- Filter admin dari data yang ditampilkan
- Return data dengan field `domisili`

---

## 🔧 Implementasi Backend

### 1️⃣ Profile Picture Upload

#### File: `app/Http/Controllers/UserController.php` (atau controller yang sesuai)

#### Method: `uploadProfilePicture(Request $request)`

```php
public function uploadProfilePicture(Request $request)
{
    $request->validate([
        'profile_picture' => 'required|image|mimes:jpeg,png,jpg,gif|max:5120', // 5MB max
    ]);

    $user = $request->user();

    // Delete old profile picture if exists
    if ($user->profile_picture) {
        $oldPath = public_path('storage/' . $user->profile_picture);
        if (file_exists($oldPath)) {
            unlink($oldPath);
        }
    }

    // Store new profile picture
    $file = $request->file('profile_picture');
    $filename = time() . '_' . $user->id . '_' . $file->getClientOriginalName();
    $path = $file->storeAs('profile-pictures', $filename, 'public');

    // Update user profile_picture field
    $user->profile_picture = $path;
    $user->save();

    return response()->json([
        'success' => true,
        'message' => 'Profile picture berhasil diupload',
        'data' => [
            'profile_picture' => $path,
            'profile_picture_url' => asset('storage/' . $path)
        ]
    ], 200);
}
```

#### Method: `deleteProfilePicture(Request $request)`

```php
public function deleteProfilePicture(Request $request)
{
    $user = $request->user();

    if ($user->profile_picture) {
        $oldPath = public_path('storage/' . $user->profile_picture);
        if (file_exists($oldPath)) {
            unlink($oldPath);
        }

        $user->profile_picture = null;
        $user->save();

        return response()->json([
            'success' => true,
            'message' => 'Profile picture berhasil dihapus'
        ], 200);
    }

    return response()->json([
        'success' => false,
        'message' => 'Profile picture tidak ditemukan'
    ], 404);
}
```

#### Routes: `routes/api.php`

```php
// Profile Picture Routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/users/profile/upload-picture', [UserController::class, 'uploadProfilePicture']);
    Route::delete('/users/profile/delete-picture', [UserController::class, 'deleteProfilePicture']);
});
```

---

### 2️⃣ Profile Picture Display di API Profile

#### File: `app/Http/Controllers/ProfileController.php` (atau controller yang handle `/api/profile`)

#### Method: `show(Request $request)`

**Pastikan field `profile_picture` di-return:**

```php
public function show(Request $request)
{
    $user = $request->user();
    
    return response()->json([
        'name' => $user->name,
        'email' => $user->email,
        'profile_picture' => $user->profile_picture,  // ⬅️ PASTIKAN INI ADA
        'nilai' => $user->nilai,
        'is_verified' => $user->is_verified,
    ]);
}
```

---

### 3️⃣ Public Endpoint untuk Maps Data

#### File: `app/Http/Controllers/AdminController.php` (atau controller yang sesuai)

#### Method: `publicTeachers()`

```php
public function publicTeachers()
{
    // Get all teachers (non-admin) dengan domisili
    $teachers = \App\Models\User::where('is_admin', false)
        ->whereNotNull('domisili')
        ->where('domisili', '!=', '')
        ->select('id', 'name', 'email', 'domisili')
        ->get();

    return response()->json([
        'success' => true,
        'data' => $teachers
    ], 200);
}
```

#### Routes: `routes/api.php`

```php
// Public Routes (tidak perlu authentication)
Route::get('/public/teachers', [AdminController::class, 'publicTeachers']);
```

**ATAU jika menggunakan prefix `/api` di Laravel:**

```php
// Di routes/api.php, pastikan route sudah terdaftar
Route::get('/public/teachers', [AdminController::class, 'publicTeachers']);
```

**Full URL akan menjadi:** `http://127.0.0.1:8000/api/public/teachers`

---

## 📋 Checklist Implementasi

### Database
- [ ] Pastikan column `profile_picture` ada di table `users`
- [ ] Pastikan column `domisili` ada di table `users`
- [ ] Pastikan migration sudah di-run
- [ ] Pastikan storage link sudah dibuat: `php artisan storage:link`

### Storage Configuration
- [ ] Pastikan `config/filesystems.php` sudah benar:
  ```php
  'disks' => [
      'public' => [
          'driver' => 'local',
          'root' => storage_path('app/public'),
          'url' => env('APP_URL').'/storage',
          'visibility' => 'public',
      ],
  ],
  ```

### Routes
- [ ] Route `/api/users/profile/upload-picture` (POST) sudah terdaftar
- [ ] Route `/api/users/profile/delete-picture` (DELETE) sudah terdaftar
- [ ] Route `/api/public/teachers` (GET) sudah terdaftar
- [ ] Route `/api/profile` (GET) sudah return field `profile_picture`

### Controllers
- [ ] Method `uploadProfilePicture()` sudah diimplementasi
- [ ] Method `deleteProfilePicture()` sudah diimplementasi
- [ ] Method `publicTeachers()` sudah diimplementasi
- [ ] Method `show()` di ProfileController sudah return `profile_picture`

### CORS Configuration
- [ ] Pastikan CORS sudah dikonfigurasi untuk allow frontend origin
- [ ] File: `config/cors.php` atau `.env`:
  ```php
  'allowed_origins' => ['http://localhost:5173'], // untuk development
  'allowed_origins' => ['https://your-frontend-domain.com'], // untuk production
  ```

---

## 🧪 Testing

### 1. Test Upload Profile Picture

```bash
POST http://127.0.0.1:8000/api/users/profile/upload-picture
Authorization: Bearer {your_token}
Content-Type: multipart/form-data

Body:
  profile_picture: [file image]

Expected Response:
{
  "success": true,
  "message": "Profile picture berhasil diupload",
  "data": {
    "profile_picture": "profile-pictures/1234567890_1_image.jpg",
    "profile_picture_url": "http://127.0.0.1:8000/storage/profile-pictures/1234567890_1_image.jpg"
  }
}
```

### 2. Test Get Profile (dengan profile_picture)

```bash
GET http://127.0.0.1:8000/api/profile
Authorization: Bearer {your_token}

Expected Response:
{
  "name": "Nama User",
  "email": "user@example.com",
  "profile_picture": "profile-pictures/1234567890_1_image.jpg",  ⬅️ MUST EXIST
  "nilai": 100,
  "is_verified": false
}
```

### 3. Test Delete Profile Picture

```bash
DELETE http://127.0.0.1:8000/api/users/profile/delete-picture
Authorization: Bearer {your_token}

Expected Response:
{
  "success": true,
  "message": "Profile picture berhasil dihapus"
}
```

### 4. Test Public Teachers Endpoint (untuk Maps)

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
      "domisili": "Jakarta, Indonesia"
    },
    {
      "id": 2,
      "name": "Guru 2",
      "email": "guru2@example.com",
      "domisili": "Bandung, Jawa Barat"
    }
  ]
}
```

**PENTING:** 
- Endpoint ini **TIDAK** memerlukan authentication (public)
- Hanya return user dengan `is_admin = false` dan memiliki `domisili`
- Tidak return admin

---

## 🚀 Langkah-langkah Implementasi

### Step 1: Buat Migration (jika belum ada)

```bash
php artisan make:migration add_profile_picture_to_users_table
```

```php
// Di file migration
public function up()
{
    Schema::table('users', function (Blueprint $table) {
        $table->string('profile_picture')->nullable()->after('email');
    });
}

public function down()
{
    Schema::table('users', function (Blueprint $table) {
        $table->dropColumn('profile_picture');
    });
}
```

```bash
php artisan migrate
```

### Step 2: Buat Storage Link

```bash
php artisan storage:link
```

Ini akan membuat symbolic link dari `public/storage` ke `storage/app/public`

### Step 3: Implementasi Methods di Controller

- Copy method `uploadProfilePicture()` ke `UserController.php`
- Copy method `deleteProfilePicture()` ke `UserController.php`
- Copy method `publicTeachers()` ke `AdminController.php`
- Update method `show()` di `ProfileController.php` untuk return `profile_picture`

### Step 4: Register Routes

Tambahkan routes di `routes/api.php`:

```php
use App\Http\Controllers\UserController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\ProfileController;

// Public routes
Route::get('/public/teachers', [AdminController::class, 'publicTeachers']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/profile', [ProfileController::class, 'show']);
    Route::post('/users/profile/upload-picture', [UserController::class, 'uploadProfilePicture']);
    Route::delete('/users/profile/delete-picture', [UserController::class, 'deleteProfilePicture']);
});
```

### Step 5: Clear Cache

```bash
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear
```

### Step 6: Restart Server

```bash
php artisan serve
```

### Step 7: Test di Postman/Thunder Client

Test semua endpoint sesuai dengan section "Testing" di atas.

---

## ⚠️ Troubleshooting

### Problem 1: Profile picture tidak tampil setelah upload

**Solution:**
- Pastikan `php artisan storage:link` sudah dijalankan
- Check apakah file benar-benar tersimpan di `storage/app/public/profile-pictures/`
- Pastikan method `show()` di ProfileController return field `profile_picture`
- Check URL di browser: `http://127.0.0.1:8000/storage/profile-pictures/xxx.jpg` harus bisa diakses

### Problem 2: Upload gagal dengan error "The file exceeds your upload_max_filesize"

**Solution:**
- Update `php.ini`:
  ```ini
  upload_max_filesize = 10M
  post_max_size = 10M
  ```
- Restart PHP server

### Problem 3: Endpoint `/api/public/teachers` return 404

**Solution:**
- Pastikan route sudah terdaftar di `routes/api.php`
- Clear route cache: `php artisan route:clear`
- Check apakah route terdaftar: `php artisan route:list | grep public/teachers`
- Pastikan menggunakan prefix `/api` jika Laravel menggunakan `RouteServiceProvider` dengan prefix

### Problem 4: CORS error saat fetch dari frontend

**Solution:**
- Update `config/cors.php`:
  ```php
  'allowed_origins' => ['http://localhost:5173'],
  'supports_credentials' => false, // karena pakai token, bukan session
  ```
- Atau update `.env`:
  ```
  SANCTUM_STATEFUL_DOMAINS=localhost:5173
  ```

---

## 📝 Catatan Penting

1. **Storage Path**: File disimpan di `storage/app/public/profile-pictures/` dan diakses via `http://domain.com/storage/profile-pictures/xxx.jpg`

2. **File Naming**: Format filename: `{timestamp}_{user_id}_{original_filename}` untuk menghindari conflict

3. **File Validation**: 
   - Format: JPEG, PNG, JPG, GIF
   - Max size: 5MB (5120 KB)

4. **Security**: 
   - Upload endpoint memerlukan authentication (`auth:sanctum`)
   - Public teachers endpoint tidak memerlukan authentication (public)

5. **Data Filtering**: 
   - Public teachers endpoint hanya return user dengan `is_admin = false`
   - Hanya return user yang memiliki `domisili` (tidak null dan tidak kosong)

---

## ✅ Checklist Final

Setelah semua implementasi, pastikan:

- [ ] Upload profile picture berhasil
- [ ] Profile picture tampil di profile page
- [ ] Delete profile picture berhasil
- [ ] Public teachers endpoint return data dengan benar
- [ ] Maps di frontend bisa load data dari backend
- [ ] Tidak ada CORS error
- [ ] Storage link sudah dibuat
- [ ] File tersimpan dengan benar di `storage/app/public/profile-pictures/`

---

**Selamat mengimplementasi! 🚀**


