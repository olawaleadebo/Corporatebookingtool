import { useState } from 'react';
import { X, AlertTriangle } from 'lucide-react';
import { Button } from './ui/button';

export function RestartBanner() {
  const [isDismissed, setIsDismissed] = useState(() => {
    return localStorage.getItem('restart-banner-dismissed') === 'true';
  });

  const handleDismiss = () => {
    localStorage.setItem('restart-banner-dismissed', 'true');
    setIsDismissed(true);
  };

  if (isDismissed) return null;

  return (
    <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 rounded-lg shadow-lg mb-4">
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-6 h-6 flex-shrink-0 mt-0.5" />
        <div className="flex-1 space-y-2">
          <h3 className="font-bold text-lg">🔥 URLs HARDCODED - Testing Mode Active!</h3>
          <p className="text-sm text-white/90">
            The ngrok URL is now hardcoded directly in all API files. This eliminates any configuration issues!
          </p>
          <div className="bg-orange-700/50 rounded p-2 text-xs">
            <p className="font-semibold text-white">Hardcoded URL:</p>
            <p className="font-mono text-white/90 break-all">
              https://chromoplasmic-ungaping-danielle.ngrok-free.dev
            </p>
          </div>
          <p className="text-sm text-white/90">
            Make sure your backend is running and ngrok URL matches the one above!
          </p>
          <div className="bg-orange-700/50 rounded p-3 space-y-1 font-mono text-xs">
            <p className="text-white/80"># Make sure these are running:</p>
            <p className="font-semibold">1. cd backend && npm run start:dev</p>
            <p className="font-semibold">2. ngrok http 3000</p>
          </div>
          <p className="text-xs text-white/80">
            Check "Connection Status" below - should show "Backend Online" in green if ngrok URL matches!
          </p>
        </div>
        <button
          onClick={handleDismiss}
          className="text-white/80 hover:text-white transition-colors p-1"
          aria-label="Dismiss"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      <div className="mt-3 flex gap-2">
        <Button
          size="sm"
          variant="secondary"
          onClick={() => window.open('/START_HERE.md', '_blank')}
          className="text-xs"
        >
          📖 Read Full Guide
        </Button>
        <Button
          size="sm"
          variant="secondary"
          onClick={() => window.open('/QUICK_FIX.md', '_blank')}
          className="text-xs"
        >
          ⚡ Quick Fix Steps
        </Button>
        <Button
          size="sm"
          variant="secondary"
          onClick={handleDismiss}
          className="text-xs ml-auto"
        >
          I've Restarted - Dismiss
        </Button>
      </div>
    </div>
  );
}
