# Fix: Vercel Environment Variable Error

## Masalah
Error: `Environment Variable "VITE_DASHSCOPE_API_KEY" references Secret "vite-dashscope-api-key", which does not exist.`

## Penyebab
File `vercel.json` sebelumnya mencoba mereferensikan secrets yang tidak ada di Vercel dengan format `@secret-name`. Ini menyebabkan error karena Vercel mencari secret yang tidak pernah dibuat.

## Solusi yang Diterapkan

### 1. **Hapus Referensi Secret dari vercel.json**
File `vercel.json` sekarang hanya berisi konfigurasi dasar tanpa referensi ke secrets:

```json
{
  "buildCommand": "echo 'No build needed for static site'",
  "outputDirectory": "."
}
```

### 2. **Standarisasi Nama Environment Variable**
Semua kode sekarang menggunakan **`DASHSCOPE_API_KEY`** (bukan `VITE_DASHSCOPE_API_KEY`) sebagai nama variabel environment utama.

### 3. **Setup di Vercel Dashboard**

Untuk memperbaiki error ini, ikuti langkah berikut:

1. **Buka Vercel Dashboard**
   - Pergi ke https://vercel.com/dashboard
   - Pilih project Anda

2. **Tambahkan Environment Variable**
   - Klik **Settings** → **Environment Variables**
   - Klik **Add Environment Variable**
   - Isi:
     - **Name**: `DASHSCOPE_API_KEY`
     - **Value**: [API key DashScope Anda](https://dashscope.console.aliyun.com/apiKey)
     - **Environments**: Centang semua (Production, Preview, Development)
   - Klik **Save**

3. **Redeploy Project**
   - Setelah menyimpan environment variable, deploy ulang project
   - Atau trigger redeploy manual dari dashboard

## Kenapa Qwen/DashScope?

Sebagai AI dari Alibaba, saya menggunakan **Qwen** model yang dihosting di **DashScope** platform. Ini adalah layanan resmi Alibaba Cloud untuk mengakses model-model AI terbaru mereka.

- **Qwen**: Model bahasa besar (LLM) dari Alibaba
- **DashScope**: Platform API untuk mengakses model Qwen
- **DASHSCOPE_API_KEY**: Kunci API untuk autentikasi ke DashScope

## Struktur Kode yang Diperbaiki

### config.js
- Membaca API key dari `window.__ENV__.DASHSCOPE_API_KEY`
- Fallback ke `process.env.DASHSCOPE_API_KEY` untuk server-side
- Export `QWEN_API_KEY` untuk digunakan di aplikasi

### index.html
- Initialize `window.__ENV__` object
- Import `config.js` sebagai ES module
- Gunakan `DASHSCOPE_API_KEY` secara konsisten di seluruh kode chatbot

## Testing

Setelah setup:
1. Deploy ke Vercel
2. Buka browser console (F12)
3. Chat dengan bot
4. Cek log:
   - ✓ `KarAI Config: API key found in window.__ENV__` = Berhasil!
   - ⚠ `No API key found` = Perlu setup environment variable

## Troubleshooting

### Masih dapat error yang sama?
1. Pastikan environment variable sudah di-save di Vercel
2. Redeploy project setelah menambah environment variable
3. Clear cache browser dan hard refresh (Ctrl+Shift+R)

### API key tidak terdeteksi?
1. Cek Vercel Function Logs di dashboard
2. Pastikan nama persis: `DASHSCOPE_API_KEY` (case-sensitive)
3. Pastikan environment variable aktif untuk semua environments

### Bot masih jawab singkat saja?
Ini normal jika API key belum terdeteksi. Bot akan menggunakan fallback responses. Setelah API key terdeteksi, bot akan menggunakan Qwen AI untuk respons yang lebih pintar.
