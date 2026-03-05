import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Plane } from 'lucide-react';
import { authService } from '../../services/auth.service';
import { toast } from 'sonner';

export function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    role: 'traveller' as 'traveller' | 'travel_arranger' | 'admin',
    department: '',
    costCenter: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
      toast.error('Please fill in all required fields');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return false;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return false;
    }

    return true;
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const { confirmPassword, ...registrationData } = formData;
      
      // Remove empty optional fields
      const cleanData = Object.fromEntries(
        Object.entries(registrationData).filter(([_, v]) => v !== '')
      );

      const { user } = await authService.register(cleanData);
      toast.success(`Welcome, ${user.firstName}! Your account has been created.`);

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
      const message = error.response?.data?.message || error.message || 'Registration failed. Please try again.';
      toast.error(Array.isArray(message) ? message.join(', ') : message);
    } finally {
      setIsLoading(false);
    }
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

      <div className="w-full max-w-2xl relative z-10">
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

        {/* Signup Card */}
        <Card className="border-gray-200 bg-white shadow-2xl">
          <CardHeader>
            <CardTitle className="text-gray-900">Create Account</CardTitle>
            <CardDescription className="text-gray-600">
              Sign up to start managing your corporate travel
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSignup} className="space-y-4">
              {/* Name Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-gray-700">First Name *</Label>
                  <Input
                    id="firstName"
                    type="text"
                    placeholder="John"
                    value={formData.firstName}
                    onChange={(e) => handleChange('firstName', e.target.value)}
                    className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-gray-700">Last Name *</Label>
                  <Input
                    id="lastName"
                    type="text"
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={(e) => handleChange('lastName', e.target.value)}
                    className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400"
                    required
                  />
                </div>
              </div>

              {/* Email & Phone */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@company.com"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber" className="text-gray-700">Phone Number</Label>
                  <Input
                    id="phoneNumber"
                    type="tel"
                    placeholder="+234 801 234 5678"
                    value={formData.phoneNumber}
                    onChange={(e) => handleChange('phoneNumber', e.target.value)}
                    className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400"
                  />
                </div>
              </div>

              {/* Password Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-700">Password *</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => handleChange('password', e.target.value)}
                    className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-gray-700">Confirm Password *</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={(e) => handleChange('confirmPassword', e.target.value)}
                    className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400"
                    required
                  />
                </div>
              </div>

              {/* Role Selection */}
              <div className="space-y-2">
                <Label htmlFor="role" className="text-gray-700">Role *</Label>
                <Select value={formData.role} onValueChange={(value) => handleChange('role', value)}>
                  <SelectTrigger className="bg-white border-gray-300 text-gray-900">
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="traveller">Traveller</SelectItem>
                    <SelectItem value="travel_arranger">Travel Arranger</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Department & Cost Center */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="department" className="text-gray-700">Department</Label>
                  <Input
                    id="department"
                    type="text"
                    placeholder="e.g., Sales, IT"
                    value={formData.department}
                    onChange={(e) => handleChange('department', e.target.value)}
                    className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="costCenter" className="text-gray-700">Cost Center</Label>
                  <Input
                    id="costCenter"
                    type="text"
                    placeholder="e.g., CC-001"
                    value={formData.costCenter}
                    onChange={(e) => handleChange('costCenter', e.target.value)}
                    className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="space-y-3 pt-4">
                <Button
                  type="submit"
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold"
                  disabled={isLoading}
                >
                  {isLoading ? 'Creating Account...' : 'Create Account'}
                </Button>
              </div>

              {/* Link to Login */}
              <div className="text-center text-sm text-gray-600 pt-2">
                Already have an account?{' '}
                <Button
                  type="button"
                  variant="link"
                  className="text-orange-500 hover:text-orange-600 p-0 h-auto font-semibold"
                  onClick={() => navigate('/')}
                >
                  Login here
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
