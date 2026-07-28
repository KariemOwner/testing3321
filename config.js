// KarAI Configuration File
// This file reads API keys from environment variables (for Vercel deployment)

// For Vercel: Set VITE_DASHSCOPE_API_KEY in your Vercel Environment Variables
const QWEN_API_URL = 'https://dashscope-intl.aliyuncs.com/api/v1/services/aigc/text-generation/generation';
const QWEN_MODEL = 'qwen-flash';
const QWEN_API_KEY = process?.env?.VITE_DASHSCOPE_API_KEY || 
                     import.meta?.env?.VITE_DASHSCOPE_API_KEY || 
                     window?.__ENV__?.VITE_DASHSCOPE_API_KEY || 
                     '';

export { QWEN_API_URL, QWEN_MODEL, QWEN_API_KEY };
