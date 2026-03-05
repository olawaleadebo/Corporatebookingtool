/**
 * API Configuration for BTMTravel COBT
 * 
 * ⚠️  IMPORTANT: Update this URL when your ngrok tunnel changes!
 * 
 * Quick Setup:
 * 1. Start backend: cd backend && npm run start:dev
 * 2. Start ngrok: ngrok http 3000
 * 3. Copy your ngrok URL (e.g., https://abc123.ngrok-free.dev)
 * 4. Update NGROK_URL below with your new URL
 * 5. Restart backend after CORS changes
 * 
 * See /BACKEND_SETUP.md for detailed instructions
 */

const NGROK_URL = 'https://chromoplasmic-ungaping-danielle.ngrok-free.dev';

export const API_CONFIG = {
  // Backend API base URL
  API_BASE_URL: `${NGROK_URL}/api/v1`,
  
  // WebSocket URL (without /api/v1)
  WS_URL: NGROK_URL,
  
  // Request timeout in milliseconds
  TIMEOUT: 30000,
  
  // ngrok specific headers
  NGROK_HEADERS: {
    'ngrok-skip-browser-warning': 'true',
  },
} as const;

// Log configuration on load
console.log('====================================');
console.log('🔗 API CONFIGURATION LOADED');
console.log('====================================');
console.log('   API URL:', API_CONFIG.API_BASE_URL);
console.log('   WebSocket URL:', API_CONFIG.WS_URL);
console.log('   Timeout:', API_CONFIG.TIMEOUT);
console.log('   Headers:', API_CONFIG.NGROK_HEADERS);
console.log('====================================');
