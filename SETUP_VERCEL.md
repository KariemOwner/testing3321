# KarAI - AI Chatbot untuk Portfolio Ikram Rezaul

## Setup di Vercel

### Cara Fix Error "Secret does not exist":

1. **Login ke Vercel Dashboard**
   - Buka https://vercel.com/dashboard
   - Pilih project Anda

2. **Tambahkan Environment Variables**
   - Pergi ke **Settings** → **Environment Variables**
   - Klik **Add New Variable**
   
3. **Tambahkan API Key dengan SALAH SATU nama berikut:**
   - `DASHSCOPE_API_KEY` (recommended)
   - `VITE_DASHSCOPE_API_KEY`
   
4. **Masukkan Nilai API Key:**
   - Dapatkan API key dari https://dashscope.console.aliyun.com/
   - Paste API key Anda di field "Value"
   - Pilih environments: **Production**, **Preview**, **Development**
   - Klik **Save**

5. **Redeploy Project**
   - Pergi ke **Deployments**
   - Klik **Redeploy** pada deployment terbaru
   - Atau push commit baru ke GitHub

## Struktur File

- `index.html` - Main website dengan chatbot KarAI
- `config.js` - Configuration untuk API key
- `vercel.json` - Vercel configuration

## Troubleshooting

### Error: "Secret does not exist"
- Pastikan Anda sudah menambahkan environment variable di Vercel Dashboard
- Nama variable harus persis: `DASHSCOPE_API_KEY` atau `VITE_DASHSCOPE_API_KEY`
- Redeploy project setelah menambahkan environment variable

### Chatbot hanya menampilkan response default
- Cek browser console untuk log messages
- Pastikan API key valid dan aktif
- Periksa quota API DashScope Anda

### Local Development
Untuk testing lokal tanpa API key, chatbot akan menggunakan fallback responses.

## Fallback Responses

Jika tidak ada API key, chatbot akan merespons berdasarkan keywords:
- hello, hi, hey → Salam
- who, about → Info tentang Ikram
- contact, whatsapp, email → Kontak
- projects, portfolio → Info proyek
- thanks, thank → Terima kasih
- bye, goodbye → Perpisahan
- name, karai → Identitas KarAI
- student, skill → Info skills
