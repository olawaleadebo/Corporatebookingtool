import { useState } from 'react';
import { Button } from './ui/button';
import { ChevronDown, ChevronUp, Info, AlertCircle } from 'lucide-react';
import { API_CONFIG } from '../../config/api.config';

export function CorsDebugPanel() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between text-left"
      >
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-blue-600" />
          <span className="font-semibold text-blue-900">
            Connection Debug Info
          </span>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4 text-blue-600" />
        ) : (
          <ChevronDown className="w-4 h-4 text-blue-600" />
        )}
      </button>

      {isExpanded && (
        <div className="mt-3 space-y-3 text-blue-900">
          <div className="bg-white rounded p-2 space-y-1">
            <p className="font-semibold">Backend URL:</p>
            <code className="block bg-blue-50 p-1 rounded break-all text-[10px]">
              {API_CONFIG.API_BASE_URL}
            </code>
          </div>

          <div className="bg-white rounded p-2 space-y-1">
            <p className="font-semibold">Headers Sent:</p>
            <code className="block bg-blue-50 p-1 rounded text-[10px]">
              {JSON.stringify(API_CONFIG.headers, null, 2)}
            </code>
          </div>

          <div className="bg-yellow-50 border border-yellow-300 rounded p-2">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-yellow-700 mt-0.5 flex-shrink-0" />
              <div className="space-y-1">
                <p className="font-semibold text-yellow-900">
                  Did you restart the backend?
                </p>
                <p className="text-yellow-800">
                  CORS and Helmet fixes only work after restarting the backend server.
                </p>
                <div className="bg-yellow-100 rounded p-2 mt-2 space-y-1">
                  <p className="font-mono text-[10px] text-yellow-900">
                    # Stop backend (Ctrl+C), then:
                  </p>
                  <p className="font-mono text-[10px] text-yellow-900">
                    cd backend && npm run start:dev
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded p-2 space-y-1">
            <p className="font-semibold">Common CORS Issues:</p>
            <ul className="list-disc list-inside space-y-1 text-blue-800">
              <li>Backend not restarted after CORS changes</li>
              <li>Ngrok URL changed (doesn't match config)</li>
              <li>Backend not running on port 3000</li>
              <li>Ngrok not pointing to localhost:3000</li>
            </ul>
          </div>

          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => window.open(`${API_CONFIG.API_BASE_URL}/health`, '_blank')}
              className="flex-1 text-xs"
            >
              Test in Browser
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                navigator.clipboard.writeText(API_CONFIG.API_BASE_URL);
                alert('URL copied to clipboard!');
              }}
              className="flex-1 text-xs"
            >
              Copy URL
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
