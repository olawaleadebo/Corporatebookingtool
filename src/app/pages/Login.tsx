import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Plane, AlertCircle, CheckCircle2 } from 'lucide-react';
import { authService } from '../../services/auth.service';
import { toast } from 'sonner';
import api from '../../lib/api';
import { BackendOfflineAlert } from '../components/BackendOfflineAlert';

export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [backendStatus, setBackendStatus] = useState<'checking' | 'online' | 'offline'>('checking');

  useEffect(() => {
    checkBackendConnection();
  }, []);

  const checkBackendConnection = async () => {
    try {
      await api.get('/health');
      setBackendStatus('online');
    } catch (error) {
      // Silently set offline status - no console errors
      setBackendStatus('offline');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error('Please enter your email and password');
      return;
    }

    if (backendStatus === 'offline') {
      toast.error('Backend server is offline. Please start the backend first.');
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
      console.error('Login failed:', error);
      
      if (error.code === 'ERR_NETWORK') {
        toast.error('Cannot connect to backend server. Please ensure it is running.');
        setBackendStatus('offline');
      } else {
        const message = error.response?.data?.message || 'Login failed. Please check your credentials.';
        toast.error(message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Demo login function for testing
  const handleDemoLogin = (role: 'traveller' | 'arranger' | 'admin') => {
    if (backendStatus === 'offline') {
      toast.error('Backend server is offline. Please start the backend first.');
      return;
    }

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

        {/* Login Card */}
        <Card className="border-gray-200 bg-white shadow-2xl">
          <CardHeader>
            <CardTitle className="text-gray-900">Welcome Back</CardTitle>
            <CardDescription className="text-gray-600">
              Sign in to manage your corporate travel
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Backend Offline Alert */}
            {backendStatus === 'offline' && (
              <BackendOfflineAlert onRetry={checkBackendConnection} />
            )}

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
                disabled={isLoading || backendStatus === 'offline'}
              >
                {isLoading ? 'Logging in...' : 'Login'}
              </Button>
              <Button
                onClick={() => handleDemoLogin('traveller')}
                variant="outline"
                className="w-full border-gray-300 text-gray-700 hover:bg-gray-100 bg-white"
                disabled={isLoading || backendStatus === 'offline'}
              >
                Demo Login as Traveller
              </Button>
              <Button
                onClick={() => handleDemoLogin('arranger')}
                variant="outline"
                className="w-full border-gray-300 text-gray-700 hover:bg-gray-100 bg-white"
                disabled={isLoading || backendStatus === 'offline'}
              >
                Demo Login as Travel Arranger
              </Button>
              <Button
                onClick={() => handleDemoLogin('admin')}
                variant="outline"
                className="w-full border-gray-300 text-gray-700 hover:bg-gray-100 bg-white"
                disabled={isLoading || backendStatus === 'offline'}
              >
                Demo Login as Admin
              </Button>
            </div>

            <div className="text-center text-sm text-gray-500 pt-4">
              Enter credentials or use demo login
            </div>

            {/* Backend Status Indicator */}
            <div className="flex items-center justify-center gap-2 pt-2">
              {backendStatus === 'checking' && (
                <>
                  <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
                  <span className="text-xs text-gray-500">Checking backend...</span>
                </>
              )}
              {backendStatus === 'online' && (
                <>
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <span className="text-xs text-green-600">Backend connected</span>
                </>
              )}
              {backendStatus === 'offline' && (
                <>
                  <AlertCircle className="w-4 h-4 text-red-500" />
                  <span className="text-xs text-red-600">Backend offline - Start backend server</span>
                  <Button
                    onClick={checkBackendConnection}
                    variant="ghost"
                    size="sm"
                    className="text-xs h-auto py-1 px-2"
                  >
                    Retry
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}