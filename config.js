// KarAI Configuration File
// This file reads API keys from environment variables (for Vercel deployment)

// For Vercel: Set VITE_DASHSCOPE_API_KEY in your Vercel Environment Variables
const QWEN_API_URL = 'https://dashscope-intl.aliyuncs.com/api/v1/services/aigc/text-generation/generation';
const QWEN_MODEL = 'qwen-flash';

// Try to get API key from multiple sources in order of priority
let apiKey = '';

// Check if we're in a browser environment with window.__ENV__ already set
if (typeof window !== 'undefined' && window.__ENV__?.VITE_DASHSCOPE_API_KEY) {
    apiKey = window.__ENV__.VITE_DASHSCOPE_API_KEY;
    console.log('KarAI Config: API key found in window.__ENV__');
}
// Check for Node.js process.env (Vercel server-side)
else if (typeof process !== 'undefined' && process.env?.VITE_DASHSCOPE_API_KEY) {
    apiKey = process.env.VITE_DASHSCOPE_API_KEY;
    console.log('KarAI Config: API key found in process.env');
}
// Check for import.meta.env (Vite/browser build)
else if (typeof import.meta !== 'undefined' && import.meta.env?.VITE_DASHSCOPE_API_KEY) {
    apiKey = import.meta.env.VITE_DASHSCOPE_API_KEY;
    console.log('KarAI Config: API key found in import.meta.env');
}

const QWEN_API_KEY = apiKey;

console.log('KarAI Config: API Key status:', apiKey ? '✓ Loaded' : '✗ Not found - will use fallback responses');

export { QWEN_API_URL, QWEN_MODEL, QWEN_API_KEY };
