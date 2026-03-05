import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { CheckCircle2, XCircle, Loader2, RefreshCw, Server, Database, Zap, Terminal } from 'lucide-react';
import { api } from '../../lib/api';
import { API_CONFIG } from '../../config/api.config';

interface HealthCheck {
  status: string;
  info?: {
    database?: { status: string };
    kafka?: { status: string };
  };
  error?: string;
  details?: any;
}

export default function SystemStatus() {
  const [health, setHealth] = useState<HealthCheck | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastCheck, setLastCheck] = useState<Date | null>(null);

  const checkHealth = async () => {
    setLoading(true);
    try {
      const response = await api.get('/health');
      setHealth(response.data);
      setLastCheck(new Date());
    } catch (error: any) {
      setHealth({
        status: 'error',
        error: error.message || 'Cannot connect to backend',
      });
      setLastCheck(new Date());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkHealth();
  }, []);

  const getStatusColor = (status?: string) => {
    if (!status) return 'text-gray-400';
    switch (status.toLowerCase()) {
      case 'up':
      case 'ok':
        return 'text-green-500';
      case 'down':
      case 'error':
        return 'text-red-500';
      default:
        return 'text-yellow-500';
    }
  };

  const getStatusIcon = (status?: string) => {
    if (!status || loading) return <Loader2 className="w-6 h-6 animate-spin" />;
    switch (status.toLowerCase()) {
      case 'up':
      case 'ok':
        return <CheckCircle2 className="w-6 h-6" />;
      default:
        return <XCircle className="w-6 h-6" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">System Status</h1>
          <p className="text-gray-600">
            Check the health of backend services and dependencies
          </p>
          {lastCheck && (
            <p className="text-sm text-gray-500 mt-1">
              Last checked: {lastCheck.toLocaleTimeString()}
            </p>
          )}
        </div>

        <div className="space-y-4">
          {/* Overall Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Backend API</span>
                <Button
                  onClick={checkHealth}
                  disabled={loading}
                  variant="outline"
                  size="sm"
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className={getStatusColor(health?.status)}>
                  {getStatusIcon(health?.status)}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-lg">
                    {loading ? 'Checking...' : health?.status === 'ok' ? 'All Systems Operational' : 'Service Unavailable'}
                  </p>
                  {health?.error && (
                    <p className="text-sm text-red-600 mt-1">{health.error}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Database Status */}
          {health?.info?.database && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  Database (PostgreSQL)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <div className={getStatusColor(health.info.database.status)}>
                    {getStatusIcon(health.info.database.status)}
                  </div>
                  <div>
                    <p className="font-semibold capitalize">{health.info.database.status}</p>
                    <p className="text-sm text-gray-600">PostgreSQL connection active</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Kafka Status */}
          {health?.info?.kafka && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Message Broker (Kafka)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <div className={getStatusColor(health.info.kafka.status)}>
                    {getStatusIcon(health.info.kafka.status)}
                  </div>
                  <div>
                    <p className="font-semibold capitalize">{health.info.kafka.status}</p>
                    <p className="text-sm text-gray-600">Kafka broker connected</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Connection Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server className="w-5 h-5" />
                Connection Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-sm text-gray-600">API Endpoint:</span>
                <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                  {API_CONFIG.API_BASE_URL}
                </code>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-sm text-gray-600">WebSocket URL:</span>
                <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                  {API_CONFIG.WS_URL}
                </code>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-gray-600">Environment:</span>
                <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                  {import.meta.env.MODE}
                </code>
              </div>
            </CardContent>
          </Card>

          {/* Troubleshooting */}
          {health?.status !== 'ok' && (
            <Card className="border-orange-200 bg-orange-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-900">
                  <Terminal className="w-5 h-5" />
                  Troubleshooting
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-orange-800">
                  The backend server is not responding. To start it:
                </p>
                
                <div className="bg-black/10 rounded-lg p-4 space-y-2">
                  <p className="text-xs font-semibold text-orange-900">Option 1: Docker (Recommended)</p>
                  <code className="text-xs block text-orange-900">
                    cd backend<br />
                    docker-compose up -d
                  </code>
                </div>

                <div className="bg-black/10 rounded-lg p-4 space-y-2">
                  <p className="text-xs font-semibold text-orange-900">Option 2: Quick Start Script</p>
                  <code className="text-xs block text-orange-900">
                    chmod +x start.sh<br />
                    ./start.sh
                  </code>
                </div>

                <div className="flex gap-2 mt-4">
                  <Button
                    onClick={checkHealth}
                    variant="outline"
                    size="sm"
                    className="text-orange-700 border-orange-300 hover:bg-orange-100"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Check Again
                  </Button>
                  <Button
                    onClick={() => window.open('/BACKEND_CONNECTION_FIX.md', '_blank')}
                    variant="outline"
                    size="sm"
                    className="text-orange-700 border-orange-300 hover:bg-orange-100"
                  >
                    View Full Guide
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
