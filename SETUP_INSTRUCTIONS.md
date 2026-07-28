# KarAI - AI Chat System Setup

## Cara Setting API Key di Vercel

Sistem AI Chat sudah diperbaiki dan siap digunakan. API Key **TIDAK** disimpan di `index.html` untuk keamanan.

### Langkah-langkah:

1. **Buka Dashboard Vercel** Anda
2. **Pilih Project** yang ingin Anda deploy
3. **Masuk ke Settings** → **Environment Variables**
4. **Tambahkan Environment Variable baru:**
   - **Name:** `VITE_DASHSCOPE_API_KEY`
   - **Value:** (masukkan API Key DashScope/Qwen Anda dari https://home.qwencloud.com/api-keys)
   - **Environments:** Centang semua (Production, Preview, Development)

5. **Deploy ulang** project Anda agar perubahan diterapkan

### File yang telah dibuat/dimodifikasi:

- **`config.js`** - File konfigurasi khusus untuk menyimpan pengaturan API (tidak berisi API key secara langsung)
- **`vercel.json`** - Konfigurasi Vercel untuk environment variables
- **`index.html`** - Sudah dimodifikasi untuk membaca API key dari `window.__ENV__`

### Cara Kerja:

1. Saat web di-load di Vercel, environment variable `VITE_DASHSCOPE_API_KEY` akan otomatis tersedia
2. Script di `index.html` akan membaca API key tersebut dan menyimpannya di `window.__ENV__.VITE_DASHSCOPE_API_KEY`
3. Sistem AI Chat akan menggunakan API key tersebut untuk berkomunikasi dengan Qwen API

### Catatan Penting:

- **JANGAN PERNAH** commit API key ke Git
- API key hanya tersimpan di Vercel environment variables
- Pastikan nama environment variable di Vercel adalah **`VITE_DASHSCOPE_API_KEY`** (bukan `DASHSCOPE_API_KEY`)
- Jika testing lokal, Anda perlu setup environment variable di mesin lokal juga

### Testing Lokal (Optional):

Jika ingin testing dengan API key di lokal:
```bash
# Buat file .env.local
echo "VITE_DASHSCOPE_API_KEY=your-api-key-here" > .env.local
```

Atau gunakan Vercel CLI:
```bash
vercel env pull
```

### Troubleshooting:

Jika chatbot masih tidak berfungsi setelah deploy:

1. **Cek Console Browser** - Buka Developer Tools (F12) dan lihat apakah ada error
2. **Pastikan API Key Valid** - Cek di https://home.qwencloud.com/api-keys bahwa API key masih aktif
3. **Redeploy** - Kadang perlu redeploy setelah menambahkan environment variable baru
4. **Cek Network Tab** - Lihat apakah request ke Qwen API berhasil atau ada error CORS/Authentication

