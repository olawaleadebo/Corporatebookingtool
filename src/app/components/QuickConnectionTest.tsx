import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { CheckCircle2, XCircle, Loader2, ExternalLink } from 'lucide-react';
import { API_CONFIG } from '../../config/api.config';

// 🔥 HARDCODED NGROK URL FOR TESTING
const HARDCODED_API_URL = 'https://chromoplasmic-ungaping-danielle.ngrok-free.dev/api/v1';

console.log('🔥 QuickConnectionTest USING HARDCODED URL:', HARDCODED_API_URL);

export function QuickConnectionTest() {
  const [status, setStatus] = useState<'testing' | 'success' | 'failed' | 'idle'>('idle');
  const [response, setResponse] = useState<any>(null);

  const testNow = async () => {
    setStatus('testing');
    setResponse(null);

    const healthUrl = `${HARDCODED_API_URL}/health`;
    
    console.log('🧪 Quick Test Starting...');
    console.log('📍 Testing URL (hardcoded):', healthUrl);
    console.log('📍 Config URL (for comparison):', API_CONFIG.API_BASE_URL);

    try {
      const startTime = Date.now();
      
      const res = await fetch(healthUrl, {
        method: 'GET',
        headers: {
          'ngrok-skip-browser-warning': 'true',
          'Content-Type': 'application/json',
        },
        mode: 'cors',
      });

      const elapsed = Date.now() - startTime;
      const text = await res.text();
      
      console.log('✅ Response received in', elapsed, 'ms');
      console.log('📊 Status:', res.status);
      console.log('📄 Response:', text);

      let data;
      try {
        data = JSON.parse(text);
      } catch {
        data = text;
      }

      setResponse({
        status: res.status,
        ok: res.ok,
        data,
        time: elapsed,
      });

      setStatus(res.ok ? 'success' : 'failed');
    } catch (error: any) {
      console.error('❌ Test failed:', error);
      setResponse({
        error: error.message,
        type: error.name,
      });
      setStatus('failed');
    }
  };

  // Auto-test on mount
  useEffect(() => {
    testNow();
  }, []);

  return (
    <div className="bg-white border rounded-lg p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm">Connection Status</h3>
        {status === 'testing' && (
          <div className="flex items-center gap-2 text-blue-600">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-xs">Testing...</span>
          </div>
        )}
        {status === 'success' && (
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircle2 className="w-4 h-4" />
            <span className="text-xs font-semibold">Backend Online</span>
          </div>
        )}
        {status === 'failed' && (
          <div className="flex items-center gap-2 text-red-600">
            <XCircle className="w-4 h-4" />
            <span className="text-xs font-semibold">Backend Offline</span>
          </div>
        )}
      </div>

      {response && (
        <div className="text-xs space-y-2">
          {response.ok ? (
            <div className="bg-green-50 border border-green-200 rounded p-2">
              <p className="text-green-800 font-semibold">✅ Connection Successful!</p>
              <p className="text-green-700 mt-1">Response time: {response.time}ms</p>
            </div>
          ) : response.error ? (
            <div className="bg-red-50 border border-red-200 rounded p-2">
              <p className="text-red-800 font-semibold">❌ Cannot Connect</p>
              <p className="text-red-700 mt-1">{response.error}</p>
              <div className="mt-2 space-y-1 text-red-600">
                <p className="font-semibold">Checklist:</p>
                <ul className="list-disc list-inside space-y-0.5">
                  <li>Is backend running? <code className="bg-red-100 px-1">npm run start:dev</code></li>
                  <li>Is ngrok running? <code className="bg-red-100 px-1">ngrok http 3000</code></li>
                  <li>Did you restart backend after CORS changes?</li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="bg-yellow-50 border border-yellow-200 rounded p-2">
              <p className="text-yellow-800 font-semibold">⚠️ Server Error</p>
              <p className="text-yellow-700 mt-1">Status: {response.status}</p>
            </div>
          )}
        </div>
      )}

      <div className="flex gap-2">
        <Button 
          onClick={testNow} 
          size="sm" 
          variant="outline"
          className="flex-1"
          disabled={status === 'testing'}
        >
          {status === 'testing' ? 'Testing...' : 'Retest'}
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => window.open(`${API_CONFIG.API_BASE_URL}/health`, '_blank')}
        >
          <ExternalLink className="w-3 h-3" />
        </Button>
      </div>

      <div className="text-xs text-gray-500 bg-gray-50 rounded p-2 break-all">
        <strong>Testing:</strong> {API_CONFIG.API_BASE_URL}/health
      </div>
    </div>
  );
}
