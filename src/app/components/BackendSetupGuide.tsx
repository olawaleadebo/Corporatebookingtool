import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { CheckCircle2, Terminal, Link2, RefreshCw } from 'lucide-react';
import { API_CONFIG } from '../../config/api.config';

export function BackendSetupGuide() {
  return (
    <Card className="border-red-200 bg-red-50/50">
      <CardHeader>
        <CardTitle className="text-red-900 flex items-center gap-2">
          <Terminal className="w-5 h-5" />
          Backend Setup Required
        </CardTitle>
        <CardDescription className="text-red-700">
          Follow these steps to connect to your backend
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Configuration */}
        <Alert className="bg-white">
          <Link2 className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-1">
              <p className="font-semibold text-sm">Current Configuration:</p>
              <code className="text-xs bg-gray-100 px-2 py-1 rounded block break-all">
                {API_CONFIG.API_BASE_URL}
              </code>
            </div>
          </AlertDescription>
        </Alert>

        {/* Steps */}
        <div className="space-y-3">
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
              1
            </div>
            <div className="flex-1">
              <p className="font-semibold text-sm text-gray-900">Start Backend Server</p>
              <code className="text-xs bg-gray-900 text-gray-100 px-2 py-1 rounded block mt-1">
                cd backend && npm run start:dev
              </code>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex-shrink-0 w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
              2
            </div>
            <div className="flex-1">
              <p className="font-semibold text-sm text-gray-900">Start Ngrok Tunnel</p>
              <code className="text-xs bg-gray-900 text-gray-100 px-2 py-1 rounded block mt-1">
                ngrok http 3000
              </code>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex-shrink-0 w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
              3
            </div>
            <div className="flex-1">
              <p className="font-semibold text-sm text-gray-900">Update Ngrok URL</p>
              <p className="text-xs text-gray-600 mt-1">
                Edit <code className="bg-gray-100 px-1 rounded">/src/config/api.config.ts</code>
              </p>
              <code className="text-xs bg-gray-900 text-gray-100 px-2 py-1 rounded block mt-1">
                const NGROK_URL = 'https://your-url.ngrok-free.dev';
              </code>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex-shrink-0 w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
              4
            </div>
            <div className="flex-1">
              <p className="font-semibold text-sm text-gray-900">Restart Backend</p>
              <p className="text-xs text-gray-600 mt-1">
                Required after CORS config changes
              </p>
              <div className="flex items-center gap-2 mt-1 text-xs text-gray-600">
                <RefreshCw className="w-3 h-3" />
                Press Ctrl+C then run start:dev again
              </div>
            </div>
          </div>
        </div>

        {/* Success Indicator */}
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            <p className="font-semibold text-sm">When successful, you'll see:</p>
            <ul className="list-disc list-inside text-xs mt-1 space-y-1">
              <li>Green "Backend Online" status</li>
              <li>Login form becomes active</li>
              <li>Demo login buttons enabled</li>
            </ul>
          </AlertDescription>
        </Alert>

        {/* Quick Links */}
        <div className="bg-blue-50 border border-blue-200 rounded p-3">
          <p className="text-sm font-semibold text-blue-900 mb-2">Need Help?</p>
          <p className="text-xs text-blue-800">
            See <code className="bg-blue-100 px-1 rounded">/BACKEND_SETUP.md</code> for detailed instructions
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
