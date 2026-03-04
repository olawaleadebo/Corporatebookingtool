import { useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { 
  Plane, 
  CheckCircle, 
  Clock, 
  XCircle,
  AlertCircle,
  LogOut,
  User
} from 'lucide-react';

export function TravelArrangerDashboard() {
  const navigate = useNavigate();

  const pendingRequests = [
    { id: 1, traveller: 'John Doe', type: 'Flight', destination: 'Lagos to London', amount: '₦485,000', date: '2026-03-15', priority: 'high' },
    { id: 2, traveller: 'Jane Smith', type: 'Hotel', destination: 'Hilton London', amount: '₦348,000', date: '2026-03-15', priority: 'normal' },
    { id: 3, traveller: 'Mike Johnson', type: 'Car', destination: 'London Heathrow', amount: '₦125,000', date: '2026-03-15', priority: 'low' },
  ];

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
                <p className="text-sm text-gray-600">Travel Arranger Portal</p>
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
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, Jane!</h2>
          <p className="text-gray-600">Review and manage travel booking requests</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-blue-600 border-0">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-100 mb-1">Pending</p>
                  <p className="text-3xl font-bold text-white">12</p>
                </div>
                <Clock className="w-8 h-8 text-white" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200 shadow-sm">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Approved Today</p>
                  <p className="text-3xl font-bold text-green-600">8</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200 shadow-sm">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Rejected</p>
                  <p className="text-3xl font-bold text-red-600">3</p>
                </div>
                <XCircle className="w-8 h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200 shadow-sm">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Value</p>
                  <p className="text-3xl font-bold text-gray-900">₦2.4M</p>
                </div>
                <AlertCircle className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pending Requests */}
        <Card className="bg-white border-gray-200 shadow-sm">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle className="text-gray-900">Pending Approval Requests</CardTitle>
                <CardDescription className="text-gray-600">
                  Review and approve travel bookings
                </CardDescription>
              </div>
              <Button
                onClick={() => navigate('/arranger/approvals')}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold"
              >
                Review All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingRequests.map((request) => (
                <div
                  key={request.id}
                  className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-300 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="bg-blue-100 p-3 rounded-full flex-shrink-0">
                      <User className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-900">{request.traveller}</p>
                      <p className="text-sm text-gray-600">
                        {request.type} - {request.destination}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">{request.date}</p>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div className="text-left sm:text-right">
                      <p className="font-semibold text-gray-900">{request.amount}</p>
                      <Badge className={
                        request.priority === 'high' 
                          ? 'bg-red-100 text-red-700 border-red-200'
                          : request.priority === 'normal'
                          ? 'bg-yellow-100 text-yellow-700 border-yellow-200'
                          : 'bg-gray-100 text-gray-700 border-gray-200'
                      }>
                        {request.priority}
                      </Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        <CheckCircle className="w-4 h-4 sm:mr-1" />
                        <span className="hidden sm:inline">Approve</span>
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-red-300 text-red-600 hover:bg-red-50"
                      >
                        <XCircle className="w-4 h-4 sm:mr-1" />
                        <span className="hidden sm:inline">Reject</span>
                      </Button>
                    </div>
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