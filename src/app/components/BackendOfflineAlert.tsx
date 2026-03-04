import { AlertCircle, Terminal } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Button } from './ui/button';

export function BackendOfflineAlert({ onRetry }: { onRetry: () => void }) {
  return (
    <Alert variant="destructive" className="mb-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Backend Server Offline</AlertTitle>
      <AlertDescription className="mt-2 space-y-2">
        <p className="text-sm">
          The backend server is not running. Please start it to use the application.
        </p>
        <div className="bg-black/10 rounded p-3 mt-2">
          <div className="flex items-center gap-2 mb-2">
            <Terminal className="w-4 h-4" />
            <span className="text-xs font-semibold">Quick Start:</span>
          </div>
          <code className="text-xs block">
            cd backend<br />
            docker-compose up -d
          </code>
        </div>
        <div className="flex gap-2 mt-3">
          <Button
            onClick={onRetry}
            variant="outline"
            size="sm"
            className="text-xs"
          >
            Check Connection Again
          </Button>
          <Button
            onClick={() => window.open('https://github.com/your-repo#backend-setup', '_blank')}
            variant="outline"
            size="sm"
            className="text-xs"
          >
            View Setup Guide
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
}