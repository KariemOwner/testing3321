// KarAI Configuration File
// This file reads API keys from environment variables (for Vercel deployment)

// For Vercel: Set DASHSCOPE_API_KEY in your Vercel Environment Variables
// Go to: Project Settings > Environment Variables > Add DASHSCOPE_API_KEY
const QWEN_API_URL = 'https://dashscope-intl.aliyuncs.com/api/v1/services/aigc/text-generation/generation';
const QWEN_MODEL = 'qwen-flash';

// Try to get API key from multiple sources in order of priority
let apiKey = '';

// Check if we're in a browser environment with window.__ENV__ already set
if (typeof window !== 'undefined' && window.__ENV__) {
    // Try different possible variable names
    apiKey = window.__ENV__.DASHSCOPE_API_KEY || 
             window.__ENV__.VITE_DASHSCOPE_API_KEY || 
             window.__ENV__.DASHSCOPE_API_KEY ||
             '';
    if (apiKey) {
        console.log('KarAI Config: API key found in window.__ENV__');
    }
}

// Fallback: Check for Node.js process.env (Vercel server-side - won't work for static sites)
if (!apiKey && typeof process !== 'undefined' && process.env) {
    apiKey = process.env.DASHSCOPE_API_KEY || process.env.VITE_DASHSCOPE_API_KEY || '';
    if (apiKey) {
        console.log('KarAI Config: API key found in process.env');
    }
}

// Fallback: Check for import.meta.env (Vite/browser build - won't work without bundler)
if (!apiKey && typeof import.meta !== 'undefined' && import.meta.env) {
    apiKey = import.meta.env.DASHSCOPE_API_KEY || import.meta.env.VITE_DASHSCOPE_API_KEY || '';
    if (apiKey) {
        console.log('KarAI Config: API key found in import.meta.env');
    }
}

const QWEN_API_KEY = apiKey;

console.log('KarAI Config: API Key status:', apiKey ? '✓ Loaded' : '✗ Not found - will use fallback responses only');
console.log('KarAI Config: To enable AI responses, add DASHSCOPE_API_KEY or VITE_DASHSCOPE_API_KEY to Vercel Environment Variables');

export { QWEN_API_URL, QWEN_MODEL, QWEN_API_KEY };
