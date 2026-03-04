import { useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { 
  Plane, 
  Hotel, 
  Car, 
  Calendar, 
  CreditCard, 
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  LogOut
} from 'lucide-react';

export function TravellerDashboard() {
  const navigate = useNavigate();

  const recentBookings = [
    {
      id: 1,
      type: 'Flight',
      destination: 'Lagos to London',
      date: '2026-03-15',
      status: 'approved',
      amount: '₦485,000'
    },
    {
      id: 2,
      type: 'Hotel',
      destination: 'Hilton London',
      date: '2026-03-15 - 2026-03-20',
      status: 'pending',
      amount: '₦348,000'
    },
    {
      id: 3,
      type: 'Car',
      destination: 'London Heathrow',
      date: '2026-03-15',
      status: 'rejected',
      amount: '₦125,000'
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'rejected':
        return <XCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'rejected':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Plane className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Corporate Travel</h1>
                <p className="text-sm text-gray-600">Traveller Portal</p>
              </div>
            </div>
            <Button
              onClick={() => navigate('/')}
              variant="ghost"
              className="text-gray-600 hover:text-gray-900"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, John!</h2>
          <p className="text-gray-600">Ready to plan your next business trip?</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <Card 
            className="bg-blue-600 border-0 cursor-pointer hover:shadow-lg hover:shadow-blue-500/20 transition-all"
            onClick={() => navigate('/traveller/search')}
          >
            <CardHeader>
              <Plane className="w-8 h-8 text-white mb-2" />
              <CardTitle className="text-white">Book Flight</CardTitle>
              <CardDescription className="text-blue-100">
                Search and book flights
              </CardDescription>
            </CardHeader>
          </Card>

          <Card 
            className="bg-white border-gray-200 shadow-sm cursor-pointer hover:shadow-lg transition-all"
            onClick={() => navigate('/traveller/book?type=hotel')}
          >
            <CardHeader>
              <Hotel className="w-8 h-8 text-blue-600 mb-2" />
              <CardTitle className="text-gray-900">Book Hotel</CardTitle>
              <CardDescription className="text-gray-600">
                Find and reserve hotels
              </CardDescription>
            </CardHeader>
          </Card>

          <Card 
            className="bg-white border-gray-200 shadow-sm cursor-pointer hover:shadow-lg transition-all"
            onClick={() => navigate('/traveller/book?type=car')}
          >
            <CardHeader>
              <Car className="w-8 h-8 text-blue-600 mb-2" />
              <CardTitle className="text-gray-900">Rent Car</CardTitle>
              <CardDescription className="text-gray-600">
                Book rental vehicles
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <Card className="bg-white border-gray-200 shadow-sm">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Bookings</p>
                  <p className="text-3xl font-bold text-gray-900">24</p>
                </div>
                <Calendar className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200 shadow-sm">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Pending Approvals</p>
                  <p className="text-3xl font-bold text-yellow-600">3</p>
                </div>
                <Clock className="w-8 h-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200 shadow-sm">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Spent</p>
                  <p className="text-3xl font-bold text-gray-900">₦1.2M</p>
                </div>
                <CreditCard className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Bookings */}
        <Card className="bg-white border-gray-200 shadow-sm">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle className="text-gray-900">Recent Bookings</CardTitle>
                <CardDescription className="text-gray-600">
                  Your latest travel requests
                </CardDescription>
              </div>
              <Button
                onClick={() => navigate('/traveller/bookings')}
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-100"
              >
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-300 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="bg-blue-100 p-3 rounded-lg flex-shrink-0">
                      {booking.type === 'Flight' && <Plane className="w-5 h-5 text-blue-600" />}
                      {booking.type === 'Hotel' && <Hotel className="w-5 h-5 text-blue-600" />}
                      {booking.type === 'Car' && <Car className="w-5 h-5 text-blue-600" />}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-900">{booking.destination}</p>
                      <p className="text-sm text-gray-600">{booking.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="font-semibold text-gray-900">{booking.amount}</p>
                    <Badge className={getStatusColor(booking.status)}>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(booking.status)}
                        <span className="capitalize">{booking.status}</span>
                      </div>
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}