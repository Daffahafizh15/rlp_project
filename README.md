# FORME — Fashion Brand E-Commerce Platform

> **"Define Your Own Style."**  
> Aplikasi web e-commerce modern, terstruktur, scalable, dan responsive khusus untuk brand fashion **FORME**, dibangun dengan arsitektur **Clean Layering** menggunakan **NestJS**, **React + Vite**, **Tailwind CSS**, dan **MySQL (Laragon) via Prisma ORM**.

---

## 1. Ikhtisar & Karakteristik Brand

FORME adalah brand fashion milik sendiri (*single-brand*) dengan konsep desain **Modern Minimalist**:
- **Palet Warna**: Monokrom dominan `#111111` (Primary Black), `#FFFFFF` (Secondary White), `#F5F5F5` (Background), dengan aksen fungsional status `#16A34A` (Success), `#D97706` (Warning), dan `#DC2626` (Danger).
- **Tipografi**: **Poppins** untuk Heading dan **Inter** untuk Body text.
- **3 Kategori Produk**:
  1. **Streetwear**: Oversized T-Shirt, Boxy Hoodie, Graphic Acid Wash Tee.
  2. **Casual**: Essential Supima Tee, Relaxed Linen Shirt, Pleated Chino.
  3. **Formal**: Tailored Blazer, Oxford Dress Shirt, Smart Tapered Trousers.
- **Manajemen Varian (2D Matrix)**:
  Stok dikelola mandiri berdasarkan kombinasi ukuran (S, M, L, XL, XXL) dan warna, dengan **SKU unik** per variasi.

---

## 2. Aturan Bisnis & Fitur Utama

### A. Hak Akses & Proteksi Guest
- **Guest (Tanpa Login)**:
  - Dapat membuka Landing Page, melihat seluruh katalog produk, mencari, dan memfilter kategori.
  - **Dilarang membuka halaman detail produk**. Jika tombol *View Detail* diklik, sistem otomatis mengarahkan ke halaman login dan kembali ke produk tujuan setelah login (*seamless redirection*).
- **Customer (Terotentikasi)**:
  - Melihat detail varian, foto galeri, stok real-time, memilih varian & kuantitas, keranjang belanja, checkout transaksi, manajemen alamat, upload bukti transfer/QRIS, dan pelacakan pesanan.
- **Admin**:
  - Dashboard analitik real-time dari database nyata (omzet, total penjualan, grafik 7 hari, peringatan stok menipis $\le 5$, produk terlaris).
  - Manajemen produk & stok varian.
  - Manajemen status pesanan (Input resi kurir, pembatalan pesanan dengan *stock rollback* otomatis).
  - Verifikasi bukti transfer manual (Setujui $\rightarrow$ *Processing* / Tolak $\rightarrow$ catatan alasan ke pelanggan).
  - Pengaturan tarif flat zona pengiriman.

### B. Alur Finansial & Snapshotting
- **Dual State Machine**:
  - `OrderStatus`: `WAITING_PAYMENT` $\rightarrow$ `PAYMENT_REVIEW` $\rightarrow$ `PROCESSING` $\rightarrow$ `SHIPPED` $\rightarrow$ `COMPLETED` (atau `CANCELLED`).
  - `PaymentStatus`: `PENDING` $\rightarrow$ `WAITING_VERIFICATION` $\rightarrow$ `PAID` (atau `REJECTED`).
- **Transaction Snapshotting**:
  Nama produk, SKU, ukuran, warna, harga beli, dan alamat disimpan permanen sebagai snapshot pada `orders` dan `order_items` untuk kekekalan data transaksi.
- **Stock Reservation**:
  Stok varian dipotong langsung saat checkout dalam *database transaction*, dan di-rollback otomatis jika pesanan dibatalkan.

---

## 3. Akun Demo Bawaan

| Role | Email | Password | Hak Akses |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@forme.com` | `AdminFORME2026!` | Akses penuh Admin Portal (`/admin`) |
| **Customer** | `customer@forme.com` | `CustomerFORME2026!` | Akses Katalog, Detail Produk, Checkout, Keranjang |

*(Tersedia tombol satu-klik "Customer Demo" & "Admin Demo" pada halaman Login untuk pengujian cepat).*

---

## 4. Panduan Menjalankan Aplikasi

### Prasyarat
1. **Laragon**: Buka aplikasi Laragon dan klik **Start All** (pastikan MySQL aktif di port `3306`).
2. **Node.js**: Versi $\ge 18$.

### Langkah 1: Jalankan Backend API (NestJS)
Buka terminal baru di folder proyek:
```bash
cd backend
npm run start:dev
```
- Backend aktif di: `http://localhost:5000/api`
- Dokumentasi Interaktif Swagger OpenAPI: `http://localhost:5000/api/docs`

### Langkah 2: Jalankan Frontend (React + Vite)
Buka terminal kedua di folder proyek:
```bash
cd frontend
npm run dev
```
- Akses website FORME di browser: `http://localhost:5173`

---

## 5. Struktur Direktori Proyek

```
c:\FORME FASHION E-COMMERCE\
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma       # 12 Tabel ter-normalisasi
│   │   └── seed.ts             # Seeding Admin, Kategori, Produk & Varian
│   ├── uploads/                # Static asset storage (proofs & product photos)
│   ├── src/
│   │   ├── common/             # Global filter, interceptor, guard, decorator
│   │   ├── core/prisma/        # Prisma service & module
│   │   └── modules/            # Auth, Products, Categories, Cart, Orders, Payments, Shipping, Reports
│   └── dist/                   # Production build NestJS
│
├── frontend/
│   ├── src/
│   │   ├── components/         # Reusable Button, Input, Modal, Badges, ProductCard, Grid
│   │   ├── context/            # AuthContext & CartContext
│   │   ├── layouts/            # PublicLayout, CustomerLayout, AdminLayout
│   │   ├── pages/
│   │   │   ├── public/         # Landing, Catalog, Login, Register
│   │   │   ├── customer/       # Detail Produk, Keranjang, Checkout, Orders, Profile
│   │   │   └── admin/          # Dashboard, Products, Orders, Payments, Shipping
│   │   ├── routes/             # AppRoutes, ProtectedRoute, AdminRoute
│   │   └── services/           # Typed Axios API Client
│   └── dist/                   # Production build Vite
│
└── package.json
```

---

## 6. Skenario Pengujian End-to-End

1. **Guest Restriction**:
   - Buka `http://localhost:5173/catalog` sebagai Guest tanpa login.
   - Perhatikan bahwa kartu produk menampilkan nama, harga, dan varian ukuran.
   - Klik tombol **"Login untuk Detail"** pada salah satu produk $\rightarrow$ Anda langsung dialihkan ke `/login?redirect=/products/:slug` dengan notifikasi banner proteksi.
2. **Login & Pemesanan**:
   - Klik tombol **"Customer Demo"** lalu klik **Masuk**.
   - Sistem langsung mengarahkan Anda kembali ke halaman detail produk yang sebelumnya ingin dilihat.
   - Pilih warna, ukuran, dan tentukan kuantitas $\rightarrow$ Klik **Tambah ke Keranjang**.
3. **Checkout Transaksional**:
   - Buka `/cart` $\rightarrow$ Klik **Lanjut ke Checkout**.
   - Pilih alamat pengiriman (tarif flat zona otomatis dihitung).
   - Pilih metode pembayaran **Transfer Bank BCA** atau **QRIS** $\rightarrow$ Klik **Konfirmasi & Buat Pesanan**.
4. **Pembayaran & Verifikasi Admin**:
   - Halaman faktur pesanan terbuka menampilkan instruksi rekening BCA / QRIS dan kolom upload bukti bayar.
   - Unggah foto bukti transfer $\rightarrow$ Status pesanan berubah menjadi `PAYMENT_REVIEW`.
   - Logout lalu login dengan akun **Admin** (`admin@forme.com`).
   - Buka menu **Verifikasi Pembayaran** di sidebar admin $\rightarrow$ Klik **Lihat Bukti** lalu klik **Setujui**.
   - Status pesanan customer otomatis berubah menjadi `DIPROSES` secara real-time!
5. **Dashboard Analitik**:
   - Buka `/admin` untuk melihat omzet, jumlah order, grafik 7 hari, dan produk terlaris yang langsung dihitung dari database MySQL Laragon.
