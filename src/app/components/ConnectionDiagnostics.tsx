import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { CheckCircle2, XCircle, ExternalLink, RefreshCw, AlertCircle } from 'lucide-react';
import { API_CONFIG } from '../../config/api.config';

export function ConnectionDiagnostics() {
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState<any>(null);

  const testConnection = async () => {
    setTesting(true);
    setResult(null);

    try {
      console.log('🔍 Testing connection to:', API_CONFIG.API_BASE_URL);
      
      const response = await fetch(`${API_CONFIG.API_BASE_URL}/health`, {
        method: 'GET',
        headers: {
          'ngrok-skip-browser-warning': 'true',
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        mode: 'cors',
      });

      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        data = text;
      }

      setResult({
        success: true,
        status: response.status,
        statusText: response.statusText,
        data,
      });
    } catch (error: any) {
      setResult({
        success: false,
        error: error.message,
        type: error.constructor.name,
      });
    } finally {
      setTesting(false);
    }
  };

  return (
    <Card className="border-orange-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-orange-500" />
          Backend Connection Diagnostics
        </CardTitle>
        <CardDescription>
          Test your connection to the backend server
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Configuration Display */}
        <div className="space-y-2 bg-gray-50 p-4 rounded-lg text-sm">
          <div>
            <strong>API Base URL:</strong>
            <div className="font-mono text-xs mt-1 break-all">
              {API_CONFIG.API_BASE_URL}
            </div>
          </div>
          <div>
            <strong>WebSocket URL:</strong>
            <div className="font-mono text-xs mt-1 break-all">
              {API_CONFIG.WS_URL}
            </div>
          </div>
        </div>

        {/* Test Button */}
        <Button 
          onClick={testConnection} 
          disabled={testing}
          className="w-full"
        >
          {testing ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              Testing Connection...
            </>
          ) : (
            <>
              <RefreshCw className="w-4 h-4 mr-2" />
              Test Connection
            </>
          )}
        </Button>

        {/* Manual Test Link */}
        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => window.open(`${API_CONFIG.API_BASE_URL}/health`, '_blank')}
        >
          <ExternalLink className="w-4 h-4 mr-2" />
          Open Health Endpoint in New Tab
        </Button>

        {/* Results */}
        {result && (
          <Alert variant={result.success ? "default" : "destructive"}>
            {result.success ? (
              <CheckCircle2 className="h-4 w-4" />
            ) : (
              <XCircle className="h-4 w-4" />
            )}
            <AlertTitle>
              {result.success ? '✅ Connection Successful' : '❌ Connection Failed'}
            </AlertTitle>
            <AlertDescription>
              {result.success ? (
                <div className="mt-2 space-y-1">
                  <div><strong>Status:</strong> {result.status} {result.statusText}</div>
                  <div><strong>Response:</strong></div>
                  <pre className="text-xs bg-gray-100 p-2 rounded mt-1 overflow-auto">
                    {JSON.stringify(result.data, null, 2)}
                  </pre>
                </div>
              ) : (
                <div className="mt-2 space-y-2">
                  <div><strong>Error:</strong> {result.error}</div>
                  <div className="text-xs space-y-1">
                    <p><strong>Common causes:</strong></p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Backend server is not running</li>
                      <li>Ngrok tunnel is not active</li>
                      <li>CORS configuration issue</li>
                      <li>Firewall blocking the connection</li>
                    </ul>
                  </div>
                </div>
              )}
            </AlertDescription>
          </Alert>
        )}

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm space-y-2">
          <h4 className="font-semibold text-blue-900">Troubleshooting Steps:</h4>
          <ol className="list-decimal list-inside space-y-1 text-blue-800">
            <li>Ensure your NestJS backend is running on port 3000</li>
            <li>Verify ngrok tunnel is active: <code className="bg-blue-100 px-1 rounded">ngrok http 3000</code></li>
            <li>Update the ngrok URL in <code className="bg-blue-100 px-1 rounded">/src/config/api.config.ts</code></li>
            <li>Restart your backend server after CORS changes</li>
            <li>Check browser console (F12) for detailed error messages</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
}
