import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { 
  Plane, 
  Hotel, 
  Car,
  ArrowLeft,
  Clock,
  CheckCircle,
  XCircle,
  Download,
  Eye,
  Calendar,
  DollarSign
} from 'lucide-react';

export function MyBookings() {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState('all');

  const bookings = [
    {
      id: 1,
      type: 'flight',
      title: 'New York to London',
      airline: 'British Airways',
      date: '2026-03-15',
      returnDate: '2026-03-20',
      status: 'approved',
      amount: 1245,
      bookingRef: 'BA12345',
      costCenter: 'Marketing',
      approver: 'Jane Smith',
      approvedDate: '2026-02-28'
    },
    {
      id: 2,
      type: 'hotel',
      title: 'Hilton London',
      location: 'London, UK',
      date: '2026-03-15',
      returnDate: '2026-03-20',
      status: 'pending',
      amount: 890,
      bookingRef: 'PENDING',
      costCenter: 'Marketing',
      submittedDate: '2026-03-01'
    },
    {
      id: 3,
      type: 'car',
      title: 'Toyota Corolla',
      location: 'London Heathrow',
      date: '2026-03-15',
      returnDate: '2026-03-20',
      status: 'rejected',
      amount: 320,
      bookingRef: 'N/A',
      costCenter: 'Marketing',
      rejectedBy: 'Jane Smith',
      rejectedDate: '2026-03-01',
      rejectionReason: 'Over budget for ground transportation'
    },
    {
      id: 4,
      type: 'flight',
      title: 'London to Paris',
      airline: 'Air France',
      date: '2026-04-10',
      returnDate: '2026-04-12',
      status: 'approved',
      amount: 450,
      bookingRef: 'AF67890',
      costCenter: 'Sales',
      approver: 'Mike Johnson',
      approvedDate: '2026-03-02'
    },
    {
      id: 5,
      type: 'hotel',
      title: 'Hotel de Paris',
      location: 'Paris, France',
      date: '2026-04-10',
      returnDate: '2026-04-12',
      status: 'approved',
      amount: 380,
      bookingRef: 'HP12345',
      costCenter: 'Sales',
      approver: 'Mike Johnson',
      approvedDate: '2026-03-02'
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
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-500/10 text-green-700 border-green-500/20';
      case 'pending':
        return 'bg-yellow-500/10 text-yellow-700 border-yellow-500/20';
      case 'rejected':
        return 'bg-red-500/10 text-red-700 border-red-500/20';
      default:
        return 'bg-gray-500/10 text-gray-700 border-gray-500/20';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'flight':
        return <Plane className="w-5 h-5 text-orange-600" />;
      case 'hotel':
        return <Hotel className="w-5 h-5 text-orange-600" />;
      case 'car':
        return <Car className="w-5 h-5 text-orange-600" />;
      default:
        return null;
    }
  };

  const filteredBookings = bookings.filter((booking) => {
    if (selectedTab === 'all') return true;
    return booking.status === selectedTab;
  });

  return (
    <div 
      className="min-h-screen bg-cover bg-center relative"
      style={{ 
        backgroundImage: `url('https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1600&q=80')`,
        backgroundPosition: 'center 40%'
      }}
    >
      <div className="absolute inset-0 bg-black/50" />

      <div className="relative z-10 min-h-screen">
        {/* Header */}
        <div className="bg-white/95 backdrop-blur-sm shadow-md border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-4 py-4">
              <Button
                onClick={() => navigate('/traveller')}
                variant="ghost"
                className="text-gray-700 hover:text-gray-900"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div className="border-l border-gray-300 h-8" />
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-r from-orange-500 to-yellow-500 p-2 rounded-lg">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">My Bookings</h1>
                  <p className="text-sm text-gray-600">View and manage your travel bookings</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card className="bg-white/95 backdrop-blur-sm border-gray-200">
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-gray-900">{bookings.length}</p>
                  <p className="text-sm text-gray-600 mt-1">Total Bookings</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/95 backdrop-blur-sm border-gray-200">
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-green-600">
                    {bookings.filter(b => b.status === 'approved').length}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Approved</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/95 backdrop-blur-sm border-gray-200">
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-yellow-600">
                    {bookings.filter(b => b.status === 'pending').length}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Pending</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/95 backdrop-blur-sm border-gray-200">
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-gray-900">
                    ₦{bookings.filter(b => b.status === 'approved').reduce((sum, b) => sum + b.amount, 0).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Total Spent</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Bookings List */}
          <Card className="bg-white/95 backdrop-blur-sm border-gray-200">
            <CardHeader>
              <CardTitle className="text-gray-900">All Bookings</CardTitle>
              <CardDescription className="text-gray-600">
                Your complete booking history
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
                <TabsList className="grid w-full grid-cols-4 bg-gray-100 mb-6">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="approved">Approved</TabsTrigger>
                  <TabsTrigger value="pending">Pending</TabsTrigger>
                  <TabsTrigger value="rejected">Rejected</TabsTrigger>
                </TabsList>

                <TabsContent value={selectedTab} className="space-y-4">
                  {filteredBookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="p-4 bg-white/80 rounded-lg border border-gray-200 hover:border-orange-500/50 transition-all shadow-sm"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start gap-4">
                          <div className="bg-orange-100 p-3 rounded-lg">
                            {getTypeIcon(booking.type)}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 text-lg">{booking.title}</p>
                            <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                              <Calendar className="w-4 h-4" />
                              <span>{booking.date}</span>
                              {booking.returnDate && (
                                <>
                                  <span>-</span>
                                  <span>{booking.returnDate}</span>
                                </>
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                              <DollarSign className="w-4 h-4" />
                              <span>Cost Center: {booking.costCenter}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-gray-900">₦{booking.amount.toLocaleString()}</p>
                          <Badge className={`mt-2 ${getStatusColor(booking.status)}`}>
                            <span className="flex items-center gap-1">
                              {getStatusIcon(booking.status)}
                              {booking.status}
                            </span>
                          </Badge>
                        </div>
                      </div>

                      {/* Booking Details */}
                      <div className="grid grid-cols-2 gap-4 p-3 bg-gray-50 rounded-lg mb-3">
                        <div>
                          <p className="text-xs text-gray-500">Booking Reference</p>
                          <p className="text-sm text-gray-900 font-mono">{booking.bookingRef}</p>
                        </div>
                        {booking.status === 'approved' && (
                          <>
                            <div>
                              <p className="text-xs text-gray-500">Approved By</p>
                              <p className="text-sm text-gray-900">{booking.approver}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Approved Date</p>
                              <p className="text-sm text-gray-900">{booking.approvedDate}</p>
                            </div>
                          </>
                        )}
                        {booking.status === 'pending' && (
                          <div>
                            <p className="text-xs text-gray-500">Submitted Date</p>
                            <p className="text-sm text-gray-900">{booking.submittedDate}</p>
                          </div>
                        )}
                        {booking.status === 'rejected' && (
                          <>
                            <div>
                              <p className="text-xs text-gray-500">Rejected By</p>
                              <p className="text-sm text-gray-900">{booking.rejectedBy}</p>
                            </div>
                            <div className="col-span-2">
                              <p className="text-xs text-gray-500">Rejection Reason</p>
                              <p className="text-sm text-red-600">{booking.rejectionReason}</p>
                            </div>
                          </>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-gray-300 text-gray-700 hover:bg-gray-100"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View Details
                        </Button>
                        {booking.status === 'approved' && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-orange-500 text-orange-600 hover:bg-orange-50"
                          >
                            <Download className="w-4 h-4 mr-1" />
                            Download Receipt
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}

                  {filteredBookings.length === 0 && (
                    <div className="text-center py-12">
                      <p className="text-gray-600">No bookings found</p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}