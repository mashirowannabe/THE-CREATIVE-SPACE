# IcaMeal

**Good food, student budget.**

IcaMeal adalah web app perencanaan makan yang membantu mahasiswa dan anak kos menyusun menu mingguan berdasarkan anggaran dan preferensi makan. Aplikasi menyediakan katalog resep, estimasi biaya, informasi nutrisi, serta daftar belanja yang dirangkum dari menu pilihan.

## Fitur

- **Budget planner** — atur anggaran makan mingguan dan lihat estimasi biaya serta sisa anggaran.
- **Preferensi makan** — sesuaikan rekomendasi dengan pilihan Semua, Vegan, Tinggi Protein, atau Super Hemat.
- **Weekly meal plan** — lihat dan atur ulang rekomendasi menu selama tujuh hari.
- **Monthly meal plan** — kalender inspirasi menu 30 hari dengan akses melalui pembelian paket.
- **Recipe catalog** — jelajahi resep, bahan, langkah memasak, dan informasi nutrisi.
- **Shopping list** — kumpulkan bahan dari menu mingguan, tandai bahan yang sudah dibeli, dan salin daftar belanja.
- **Akun pengguna** — registrasi dan login melalui Supabase Auth.
- **Good Food Club** — membership untuk membuka menu dan informasi nutrisi tambahan.
- **Paket digital** — Recipe Book 30 Menu Anak Kos dan Meal Plan Bulanan.

## Teknologi

- HTML5
- CSS3
- Vanilla JavaScript
- [Supabase](https://supabase.com/) — Auth, PostgreSQL, Row Level Security (RLS), dan Edge Functions
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript) — dimuat melalui jsDelivr CDN
- Google Fonts — DM Sans dan Fraunces

## Struktur proyek

```text
ICAMEAL/
├── assets/
│   └── hero-botanical.svg
├── supabase/
│   └── migrations/
│       ├── 20261118000000_expand_recipe_catalog_and_local_atlas.sql
│       └── 20261118020000_replace_recipe_atlas_with_real_photos.sql
├── app.js
├── index.html
├── styles.css
├── supabase-client.js
└── SUPABASE_SETUP.md
```

## Menjalankan secara lokal

Project ini merupakan static web app, sehingga tidak memerlukan proses build atau framework JavaScript.

1. Clone repository:

   ```bash
   git clone https://github.com/mashirowannabe/ICAMEAL.git
   cd ICAMEAL
   ```

2. Jalankan web server lokal. Contohnya, gunakan extension **Live Server** di Visual Studio Code dan buka `index.html`.

   Alternatif dengan Python:

   ```bash
   python -m http.server 5500
   ```

3. Buka [http://localhost:5500](http://localhost:5500).

Aplikasi menggunakan konfigurasi Supabase yang didefinisikan di `supabase-client.js`. Agar autentikasi dan data berjalan, proyek Supabase terkait harus aktif dan sudah memiliki skema, data, policy, serta fungsi yang dibutuhkan.

Panduan konfigurasi lebih lanjut tersedia di [SUPABASE_SETUP.md](./SUPABASE_SETUP.md).

## Backend dan konfigurasi

IcaMeal menggunakan Supabase untuk autentikasi dan penyimpanan data aplikasi. Data resep, profil, meal plan, daftar belanja, produk, pembelian, dan entitlement dikelola melalui database.

Sebelum menjalankan instance Supabase sendiri, siapkan:

- Supabase project dan konfigurasi URL serta publishable key.
- Skema database dan migration yang diperlukan.
- Row Level Security (RLS) policies.
- Supabase Auth dan URL redirect untuk domain lokal maupun deployment.
- Edge Function `demo-checkout` untuk alur pembelian simulasi.

Jangan pernah menaruh Supabase **secret key** atau **service-role key** di kode sisi browser. Publishable key memang ditujukan untuk penggunaan publik; akses data tetap harus dilindungi dengan RLS dan otorisasi sisi server.

## Status pembayaran

Alur membership dan pembelian paket pada versi ini merupakan **simulasi** melalui Edge Function `demo-checkout`. Tidak ada transaksi atau pembayaran uang sungguhan. Integrasi payment gateway belum menjadi bagian dari alur checkout saat ini.

## Dokumentasi

- [Panduan Supabase Setup](./SUPABASE_SETUP.md)
- [Repository GitHub](https://github.com/mashirowannabe/ICAMEAL)

## Lisensi

Belum ada berkas lisensi yang disertakan di repository ini. Hak penggunaan dan distribusi kode mengikuti ketentuan pemilik repository.
