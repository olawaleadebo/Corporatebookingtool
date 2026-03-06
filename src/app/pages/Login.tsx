import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Plane, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { authService } from '../../services/auth.service';
import { toast } from 'sonner';
import api from '../../lib/api';

export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [backendStatus, setBackendStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [responseTime, setResponseTime] = useState<number | null>(null);

  useEffect(() => {
    checkBackendConnection();
  }, []);

  const checkBackendConnection = async () => {
    setBackendStatus('checking');
    setResponseTime(null);
    const startTime = Date.now();
    
    try {
      // Use the /health endpoint which exists on the backend
      await api.get('/health');
      const endTime = Date.now();
      setResponseTime(endTime - startTime);
      setBackendStatus('online');
    } catch (error) {
      setBackendStatus('offline');
      setResponseTime(null);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error('Please enter your email and password');
      return;
    }

    setIsLoading(true);

    try {
      const { user } = await authService.login({ email, password });
      toast.success(`Welcome back, ${user.firstName}!`);

      // Redirect based on role
      if (user.role === 'traveller') {
        navigate('/traveller');
      } else if (user.role === 'travel_arranger') {
        navigate('/arranger');
      } else if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/traveller');
      }
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Login failed. Please check your credentials.';
      toast.error(Array.isArray(message) ? message.join(', ') : message);
    } finally {
      setIsLoading(false);
    }
  };

  // Demo login function for testing
  const handleDemoLogin = (role: 'traveller' | 'arranger' | 'admin') => {
    const demoCredentials: Record<string, { email: string; password: string }> = {
      traveller: { email: 'traveller@test.com', password: 'Test123!' },
      arranger: { email: 'arranger@test.com', password: 'Test123!' },
      admin: { email: 'admin@test.com', password: 'Test123!' },
    };

    const credentials = demoCredentials[role];
    setEmail(credentials.email);
    setPassword(credentials.password);
    
    // Auto-submit after setting credentials
    setTimeout(() => {
      handleLogin({ preventDefault: () => {} } as React.FormEvent);
    }, 100);
  };

  return (
    <div 
      className="min-h-screen bg-cover bg-center flex items-center justify-center p-4 relative"
      style={{ 
        backgroundImage: `url('https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1600&q=80')`,
        backgroundPosition: 'center 40%'
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/40" />

      <div className="w-full max-w-md relative z-10">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="bg-orange-500 p-3 rounded-lg shadow-lg">
              <Plane className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">BTMTravel COBT</h1>
          <p className="text-white/90 text-lg drop-shadow">Corporate Booking Tool</p>
        </div>

        {/* Backend Connection Status */}
        <Card className="mb-4 border-gray-200 bg-white/95 shadow-lg">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {backendStatus === 'checking' && (
                  <>
                    <RefreshCw className="w-5 h-5 text-yellow-500 animate-spin" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Checking connection...</p>
                      <p className="text-xs text-gray-500">Testing backend server</p>
                    </div>
                  </>
                )}
                {backendStatus === 'online' && (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    <div>
                      <p className="text-sm font-medium text-green-600">Backend Online</p>
                      <p className="text-xs text-gray-500">
                        Response time: {responseTime}ms
                      </p>
                    </div>
                  </>
                )}
                {backendStatus === 'offline' && (
                  <>
                    <AlertCircle className="w-5 h-5 text-red-500" />
                    <div>
                      <p className="text-sm font-medium text-red-600">Backend Offline</p>
                      <p className="text-xs text-gray-500">Cannot connect to server</p>
                    </div>
                  </>
                )}
              </div>
              <Button
                onClick={checkBackendConnection}
                variant="outline"
                size="sm"
                className="text-xs"
                disabled={backendStatus === 'checking'}
              >
                Retest
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Login Card */}
        <Card className="border-gray-200 bg-white shadow-2xl">
          <CardHeader>
            <CardTitle className="text-gray-900">Welcome Back</CardTitle>
            <CardDescription className="text-gray-600">
              Sign in to manage your corporate travel
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-700">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400"
              />
            </div>

            <div className="space-y-3 pt-4">
              <Button
                onClick={handleLogin}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold"
                disabled={isLoading}
              >
                {isLoading ? 'Logging in...' : 'Login'}
              </Button>
              <Button
                onClick={() => handleDemoLogin('traveller')}
                variant="outline"
                className="w-full border-gray-300 text-gray-700 hover:bg-gray-100 bg-white"
                disabled={isLoading}
              >
                Demo Login as Traveller
              </Button>
              <Button
                onClick={() => handleDemoLogin('arranger')}
                variant="outline"
                className="w-full border-gray-300 text-gray-700 hover:bg-gray-100 bg-white"
                disabled={isLoading}
              >
                Demo Login as Travel Arranger
              </Button>
              <Button
                onClick={() => handleDemoLogin('admin')}
                variant="outline"
                className="w-full border-gray-300 text-gray-700 hover:bg-gray-100 bg-white"
                disabled={isLoading}
              >
                Demo Login as Admin
              </Button>
            </div>

            <div className="text-center text-sm text-gray-500 pt-4">
              Enter credentials or use demo login
            </div>

            {/* Link to Signup */}
            <div className="text-center text-sm text-gray-600 pt-2 border-t border-gray-200">
              <p className="mt-4">
                Don't have an account?{' '}
                <Button
                  type="button"
                  variant="link"
                  className="text-orange-500 hover:text-orange-600 p-0 h-auto font-semibold"
                  onClick={() => navigate('/signup')}
                >
                  Sign up here
                </Button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
