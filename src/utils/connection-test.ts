import { API_CONFIG } from '../config/api.config';

// 🔥 HARDCODED NGROK URL FOR TESTING
const HARDCODED_API_URL = 'https://chromoplasmic-ungaping-danielle.ngrok-free.dev/api/v1';

console.log('🔥 CONNECTION TEST USING HARDCODED URL:', HARDCODED_API_URL);

/**
 * Test connection to the backend server
 * This will help diagnose connection issues
 */
export async function testConnection() {
  console.log('🔍 TESTING CONNECTION');
  console.log('==========================================');
  console.log('Target URL (hardcoded):', HARDCODED_API_URL);
  console.log('Target URL (config):', API_CONFIG.API_BASE_URL);
  console.log('==========================================');

  try {
    // Test 1: Simple fetch to health endpoint
    console.log('Test 1: Basic fetch to /health');
    const healthUrl = `${HARDCODED_API_URL}/health`;
    console.log('Full URL:', healthUrl);
    
    const response = await fetch(healthUrl, {
      method: 'GET',
      headers: {
        'ngrok-skip-browser-warning': 'true',
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      mode: 'cors',
    });

    console.log('✅ Response status:', response.status);
    console.log('✅ Response ok:', response.ok);
    console.log('✅ Response type:', response.type);
    console.log('✅ Response headers:', Object.fromEntries(response.headers.entries()));
    
    const text = await response.text();
    console.log('✅ Response text:', text);
    
    try {
      const data = JSON.parse(text);
      console.log('✅ Response data (parsed):', data);
      return { success: true, data };
    } catch {
      console.log('⚠️ Response is not JSON');
      return { success: true, data: text };
    }
  } catch (error: any) {
    console.error('❌ CONNECTION TEST FAILED');
    console.error('Error:', error);
    console.error('Error message:', error.message);
    console.error('Error type:', error.constructor.name);
    console.error('Error stack:', error.stack);
    
    return { success: false, error: error.message };
  }
}

// Auto-run test on module load (only in development)
if (import.meta.env.DEV) {
  testConnection();
}
