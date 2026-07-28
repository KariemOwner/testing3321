# KarAI - AI Chat System Setup

## Cara Setting API Key di Vercel

Sistem AI Chat sudah diperbaiki dan siap digunakan. API Key **TIDAK** disimpan di `index.html` untuk keamanan.

### Langkah-langkah:

1. **Buka Dashboard Vercel** Anda
2. **Pilih Project** yang ingin Anda deploy
3. **Masuk ke Settings** → **Environment Variables**
4. **Tambahkan Environment Variable baru:**
   - **Name:** `DASHSCOPE_API_KEY`
   - **Value:** (masukkan API Key DashScope/Qwen Anda)
   - **Environments:** Centang semua (Production, Preview, Development)

5. **Deploy ulang** project Anda

### File yang telah dibuat/dimodifikasi:

- **`config.js`** - File konfigurasi khusus untuk menyimpan pengaturan API (tidak berisi API key secara langsung)
- **`vercel.json`** - Konfigurasi Vercel untuk environment variables
- **`index.html`** - Sudah dimodifikasi untuk membaca API key dari `window.__ENV__`

### Cara Kerja:

1. Saat web di-load di Vercel, environment variable `DASHSCOPE_API_KEY` akan otomatis tersedia
2. Script di `index.html` akan membaca API key tersebut dan menyimpannya di `window.__ENV__`
3. Sistem AI Chat akan menggunakan API key tersebut untuk berkomunikasi dengan Qwen API

### Catatan Penting:

- **JANGAN PERNAH** commit API key ke Git
- API key hanya tersimpan di Vercel environment variables
- Jika testing lokal, Anda perlu setup environment variable di mesin lokal juga

### Testing Lokal (Optional):

Jika ingin testing dengan API key di lokal:
```bash
# Buat file .env.local
echo "DASHSCOPE_API_KEY=your-api-key-here" > .env.local
```

Atau gunakan Vercel CLI:
```bash
vercel env pull
```
