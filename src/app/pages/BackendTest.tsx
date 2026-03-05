import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { CheckCircle2, XCircle, Clock, RefreshCw, Server, Database, Zap, Activity } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '../components/ui/alert';
import api from '../../lib/api';
import { Separator } from '../components/ui/separator';
import { API_CONFIG } from '../../config/api.config';

interface HealthCheck {
  name: string;
  status: 'checking' | 'success' | 'error';
  message?: string;
  timestamp?: string;
  details?: any;
}

export function BackendTest() {
  const [overallStatus, setOverallStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [healthChecks, setHealthChecks] = useState<HealthCheck[]>([
    { name: 'Server Reachability', status: 'checking' },
    { name: 'Health Endpoint', status: 'checking' },
    { name: 'Database Connection', status: 'checking' },
    { name: 'API Version', status: 'checking' },
  ]);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);
  const [isRunningTests, setIsRunningTests] = useState(false);

  useEffect(() => {
    runHealthChecks();
  }, []);

  const updateHealthCheck = (name: string, status: 'checking' | 'success' | 'error', message?: string, details?: any) => {
    setHealthChecks(prev => 
      prev.map(check => 
        check.name === name 
          ? { ...check, status, message, details, timestamp: new Date().toISOString() }
          : check
      )
    );
  };

  const runHealthChecks = async () => {
    setIsRunningTests(true);
    setOverallStatus('checking');
    
    // Reset all checks to checking
    setHealthChecks(prev => prev.map(check => ({ ...check, status: 'checking' as const })));

    try {
      // Test 1: Basic Server Reachability
      try {
        const response = await fetch(`${API_CONFIG.API_BASE_URL}/health/live`, {
          method: 'GET',
          signal: AbortSignal.timeout(5000),
          headers: API_CONFIG.NGROK_HEADERS,
        });
        
        if (response.ok) {
          const data = await response.json();
          updateHealthCheck('Server Reachability', 'success', 'Server is reachable', data);
        } else {
          updateHealthCheck('Server Reachability', 'error', `HTTP ${response.status}: ${response.statusText}`);
        }
      } catch (error: any) {
        updateHealthCheck('Server Reachability', 'error', error.message || 'Cannot connect to server');
        setOverallStatus('offline');
        setIsRunningTests(false);
        setLastChecked(new Date());
        return;
      }

      // Test 2: Full Health Check Endpoint
      try {
        const healthResponse = await api.get('/health');
        updateHealthCheck('Health Endpoint', 'success', 'Health check passed', healthResponse.data);
        
        // Test 3: Database Connection (from health data)
        if (healthResponse.data.details?.database?.status === 'up') {
          updateHealthCheck('Database Connection', 'success', 'Database connected');
        } else {
          updateHealthCheck('Database Connection', 'error', 'Database not connected');
        }
      } catch (error: any) {
        updateHealthCheck('Health Endpoint', 'error', error.message);
        updateHealthCheck('Database Connection', 'error', 'Could not verify database');
      }

      // Test 4: API Version
      try {
        const versionResponse = await api.get('/health/ready');
        updateHealthCheck('API Version', 'success', 'API is ready', versionResponse.data);
      } catch (error: any) {
        updateHealthCheck('API Version', 'error', error.message);
      }

      // Determine overall status
      const hasErrors = healthChecks.some(check => check.status === 'error');
      setOverallStatus(hasErrors ? 'offline' : 'online');
      
    } catch (error) {
      console.error('Health check failed:', error);
      setOverallStatus('offline');
    } finally {
      setIsRunningTests(false);
      setLastChecked(new Date());
    }
  };

  const getStatusIcon = (status: 'checking' | 'success' | 'error') => {
    switch (status) {
      case 'checking':
        return <Clock className="w-4 h-4 text-yellow-500 animate-pulse" />;
      case 'success':
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />;
    }
  };

  const getStatusBadge = (status: 'checking' | 'success' | 'error') => {
    switch (status) {
      case 'checking':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Checking</Badge>;
      case 'success':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Success</Badge>;
      case 'error':
        return <Badge variant="destructive">Failed</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Backend Status Monitor</h1>
            <p className="text-gray-600 mt-1">Real-time health monitoring for BTMTravel COBT backend</p>
          </div>
          <Button
            onClick={runHealthChecks}
            disabled={isRunningTests}
            className="bg-orange-500 hover:bg-orange-600"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isRunningTests ? 'animate-spin' : ''}`} />
            {isRunningTests ? 'Testing...' : 'Run Tests'}
          </Button>
        </div>

        {/* Overall Status Card */}
        <Card className="border-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Server className="w-8 h-8 text-orange-500" />
                <div>
                  <CardTitle className="text-gray-900">Overall Status</CardTitle>
                  <CardDescription className="text-gray-600">
                    Backend server health summary
                  </CardDescription>
                </div>
              </div>
              {overallStatus === 'checking' && (
                <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 text-lg px-4 py-2">
                  <Activity className="w-5 h-5 mr-2 animate-pulse" />
                  Checking...
                </Badge>
              )}
              {overallStatus === 'online' && (
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-lg px-4 py-2">
                  <CheckCircle2 className="w-5 h-5 mr-2" />
                  Online
                </Badge>
              )}
              {overallStatus === 'offline' && (
                <Badge variant="destructive" className="text-lg px-4 py-2">
                  <XCircle className="w-5 h-5 mr-2" />
                  Offline
                </Badge>
              )}
            </div>
          </CardHeader>
          {lastChecked && (
            <CardContent>
              <p className="text-sm text-gray-500">
                Last checked: {lastChecked.toLocaleTimeString()}
              </p>
            </CardContent>
          )}
        </Card>

        {/* Backend Offline Alert */}
        {overallStatus === 'offline' && (
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertTitle>Backend Server Not Running</AlertTitle>
            <AlertDescription className="mt-2">
              <p className="mb-3">
                The backend server is not reachable. Please start the backend using one of these methods:
              </p>
              <div className="bg-black/10 rounded p-3 space-y-2">
                <div>
                  <p className="text-xs font-semibold mb-1">Quick Start (Recommended):</p>
                  <code className="text-xs block bg-black/10 p-2 rounded">
                    chmod +x start.sh && ./start.sh
                  </code>
                </div>
                <div>
                  <p className="text-xs font-semibold mb-1">Manual Start:</p>
                  <code className="text-xs block bg-black/10 p-2 rounded">
                    cd backend<br />
                    docker-compose up -d
                  </code>
                </div>
              </div>
              <Button
                onClick={runHealthChecks}
                variant="outline"
                size="sm"
                className="mt-3"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Retry Connection
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Detailed Health Checks */}
        <Card>
          <CardHeader>
            <CardTitle className="text-gray-900">Detailed Health Checks</CardTitle>
            <CardDescription className="text-gray-600">
              Individual component status
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {healthChecks.map((check, index) => (
              <div key={check.name}>
                {index > 0 && <Separator className="my-4" />}
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    {getStatusIcon(check.status)}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900">{check.name}</h3>
                        {getStatusBadge(check.status)}
                      </div>
                      {check.message && (
                        <p className="text-sm text-gray-600">{check.message}</p>
                      )}
                      {check.details && (
                        <details className="mt-2">
                          <summary className="text-xs text-gray-500 cursor-pointer hover:text-gray-700">
                            View details
                          </summary>
                          <pre className="mt-2 p-3 bg-gray-50 rounded text-xs overflow-auto max-h-40">
                            {JSON.stringify(check.details, null, 2)}
                          </pre>
                        </details>
                      )}
                      {check.timestamp && (
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(check.timestamp).toLocaleTimeString()}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Connection Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-gray-900">Connection Information</CardTitle>
            <CardDescription className="text-gray-600">
              Backend server configuration
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">Backend URL:</span>
              <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                {API_CONFIG.API_BASE_URL}
              </code>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">Health Endpoint:</span>
              <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                {API_CONFIG.API_BASE_URL}/health
              </code>
            </div>
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">API Documentation:</span>
              <a 
                href={`${API_CONFIG.WS_URL}/api/docs`}
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-orange-500 hover:text-orange-600 underline"
              >
                {API_CONFIG.WS_URL}/api/docs
              </a>
            </div>
          </CardContent>
        </Card>

        {/* Helpful Resources */}
        <Card>
          <CardHeader>
            <CardTitle className="text-gray-900">Helpful Resources</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Button
                variant="outline"
                className="justify-start"
                onClick={() => window.open(`${API_CONFIG.WS_URL}/api/docs`, '_blank')}
              >
                📚 API Documentation
              </Button>
              <Button
                variant="outline"
                className="justify-start"
                onClick={() => {
                  const link = document.createElement('a');
                  link.href = '/BACKEND_SETUP.md';
                  link.click();
                }}
              >
                📖 Backend Setup Guide
              </Button>
              <Button
                variant="outline"
                className="justify-start"
                onClick={() => {
                  const link = document.createElement('a');
                  link.href = '/TROUBLESHOOTING.md';
                  link.click();
                }}
              >
                🔧 Troubleshooting Guide
              </Button>
              <Button
                variant="outline"
                className="justify-start"
                onClick={() => {
                  const link = document.createElement('a');
                  link.href = '/backend/API_TESTING.md';
                  link.click();
                }}
              >
                🧪 API Testing Examples
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Commands */}
        <Card>
          <CardHeader>
            <CardTitle className="text-gray-900">Quick Commands</CardTitle>
            <CardDescription className="text-gray-600">
              Useful terminal commands for backend management
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-1">Start Backend:</p>
              <code className="block text-sm bg-gray-900 text-gray-100 p-3 rounded">
                cd backend && docker-compose up -d
              </code>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-1">View Logs:</p>
              <code className="block text-sm bg-gray-900 text-gray-100 p-3 rounded">
                cd backend && docker-compose logs -f api
              </code>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-1">Stop Backend:</p>
              <code className="block text-sm bg-gray-900 text-gray-100 p-3 rounded">
                cd backend && docker-compose down
              </code>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-1">Check Health (curl):</p>
              <code className="block text-sm bg-gray-900 text-gray-100 p-3 rounded">
                curl {API_CONFIG.API_BASE_URL}/health
              </code>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
