import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Textarea } from '../components/ui/textarea';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { ArrowLeft, Plane, Hotel, Car, CheckCircle, AlertCircle, FileText, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { bookingService } from '../../services/booking.service';

export function BookingSummary() {
  const navigate = useNavigate();
  const location = useLocation();
  const bookingState = location.state as any;
  
  const flight = bookingState?.flight;
  const hotel = bookingState?.hotel;
  const car = bookingState?.car;
  const searchParams = bookingState?.searchParams;

  const [justification, setJustification] = useState('');
  const [costCenter, setCostCenter] = useState('');
  const [projectCode, setProjectCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If no flight data, redirect back
  if (!flight) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <AlertCircle className="w-12 h-12 text-orange-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">No Booking Data</h2>
            <p className="text-gray-600 mb-4">Please start by searching for a flight.</p>
            <Button
              onClick={() => navigate('/traveller/search')}
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              Search Flights
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Calculate totals - ensure we have valid numbers
  const flightTotal = flight?.price ? Number(flight.price) : 0;
  const hotelTotal = hotel?.price ? Number(hotel.price) : 0;
  const carTotal = car?.price ? Number(car.price) : 0;
  const subtotal = flightTotal + hotelTotal + carTotal;
  const tax = subtotal * 0.075; // 7.5% VAT
  const total = subtotal + tax;

  // Get number of nights for hotel display
  const hotelNights = hotel ? 2 : 0;
  // Get rental days for car display
  const carDays = car ? 3 : 0;

  const handleSubmitForApproval = async () => {
    if (!justification.trim()) {
      toast.error('Please provide a justification for this trip');
      return;
    }

    setIsSubmitting(true);

    try {
      // Create booking via API
      const bookingData = {
        type: (hotel && car) ? 'combined' : (hotel ? 'flight' : 'flight') as 'flight' | 'hotel' | 'car' | 'combined',
        flightDetails: flight,
        hotelDetails: hotel || undefined,
        carDetails: car || undefined,
        flightPrice: flightTotal,
        hotelPrice: hotel ? hotelTotal : undefined,
        carPrice: car ? carTotal : undefined,
        justification: justification.trim(),
        costCenter: costCenter.trim() || undefined,
        projectCode: projectCode.trim() || undefined,
      };

      console.log('📋 Creating booking:', bookingData);
      const booking = await bookingService.createBooking(bookingData);
      
      console.log('✅ Booking created:', booking);
      toast.success(`Booking ${booking.bookingReference} submitted for approval!`);
      
      // Navigate to bookings page
      setTimeout(() => {
        navigate('/traveller/bookings');
      }, 1500);
    } catch (error: any) {
      console.error('❌ Booking creation failed:', error);
      toast.error(error.message || 'Failed to create booking');
    } finally {
      setIsSubmitting(false);
    }
  };

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
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => navigate('/traveller/car-rental', { state: bookingState })}
                className="text-gray-700 hover:text-gray-900"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back
              </Button>
              <div className="border-l border-gray-300 h-8" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Booking Summary</h1>
                <p className="text-sm text-gray-600">Review your booking and submit for approval</p>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Summary */}
        <div className="max-w-5xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Booking Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Flight Details */}
              <Card className="bg-white/95 backdrop-blur-sm border-gray-200">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className="bg-orange-100 p-2 rounded">
                      <Plane className="w-5 h-5 text-orange-600" />
                    </div>
                    <CardTitle className="text-gray-900">Flight Details</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Airline</p>
                      <p className="font-semibold text-gray-900">{flight?.airline}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Flight Number</p>
                      <p className="font-semibold text-gray-900">{flight?.flightNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">From</p>
                      <p className="font-semibold text-gray-900">{flight?.departure?.city}</p>
                      <p className="text-sm text-gray-600">{flight?.departure?.time}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">To</p>
                      <p className="font-semibold text-gray-900">{flight?.arrival?.city}</p>
                      <p className="text-sm text-gray-600">{flight?.arrival?.time}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Date</p>
                      <p className="font-semibold text-gray-900">{searchParams?.departureDate}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Class</p>
                      <p className="font-semibold text-gray-900">{flight?.class}</p>
                    </div>
                  </div>
                  <div className="pt-3 border-t border-gray-200 flex justify-between items-center">
                    <p className="text-sm text-gray-600">Flight Cost</p>
                    <p className="text-xl font-bold text-gray-900">₦{flightTotal.toLocaleString()}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Hotel Details */}
              {hotel && (
                <Card className="bg-white/95 backdrop-blur-sm border-gray-200">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <div className="bg-orange-100 p-2 rounded">
                        <Hotel className="w-5 h-5 text-orange-600" />
                      </div>
                      <CardTitle className="text-gray-900">Hotel Details</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Hotel Name</p>
                        <p className="font-semibold text-gray-900">{hotel.name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Location</p>
                        <p className="font-semibold text-gray-900">{hotel.location}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Check-in</p>
                        <p className="font-semibold text-gray-900">{searchParams?.departureDate}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Nights</p>
                        <p className="font-semibold text-gray-900">{hotelNights} nights</p>
                      </div>
                    </div>
                    <div className="pt-3 border-t border-gray-200 flex justify-between items-center">
                      <p className="text-sm text-gray-600">Hotel Cost</p>
                      <p className="text-xl font-bold text-gray-900">₦{hotelTotal.toLocaleString()}</p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Car Details */}
              {car && (
                <Card className="bg-white/95 backdrop-blur-sm border-gray-200">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <div className="bg-orange-100 p-2 rounded">
                        <Car className="w-5 h-5 text-orange-600" />
                      </div>
                      <CardTitle className="text-gray-900">Car Rental Details</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Vehicle</p>
                        <p className="font-semibold text-gray-900">{car.name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Category</p>
                        <p className="font-semibold text-gray-900">{car.category}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Transmission</p>
                        <p className="font-semibold text-gray-900">{car.transmission}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Rental Period</p>
                        <p className="font-semibold text-gray-900">{carDays} days</p>
                      </div>
                    </div>
                    <div className="pt-3 border-t border-gray-200 flex justify-between items-center">
                      <p className="text-sm text-gray-600">Car Rental Cost</p>
                      <p className="text-xl font-bold text-gray-900">₦{carTotal.toLocaleString()}</p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Justification */}
              <Card className="bg-white/95 backdrop-blur-sm border-gray-200">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className="bg-orange-100 p-2 rounded">
                      <FileText className="w-5 h-5 text-orange-600" />
                    </div>
                    <CardTitle className="text-gray-900">Trip Justification</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Please provide a business justification for this trip (purpose, expected outcomes, etc.)"
                    value={justification}
                    onChange={(e) => setJustification(e.target.value)}
                    className="min-h-[120px] bg-white border-gray-300 text-gray-900"
                  />
                  <p className="text-xs text-gray-600 mt-2">
                    Required for approval process
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Price Summary */}
            <div className="space-y-6">
              <Card className="bg-white/95 backdrop-blur-sm border-gray-200 sticky top-4">
                <CardHeader>
                  <CardTitle className="text-gray-900">Price Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Breakdown */}
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Flight</span>
                      <span className="font-semibold text-gray-900">₦{flightTotal.toLocaleString()}</span>
                    </div>
                    {hotel && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Hotel ({hotelNights} nights)</span>
                        <span className="font-semibold text-gray-900">₦{hotelTotal.toLocaleString()}</span>
                      </div>
                    )}
                    {car && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Car Rental ({carDays} days)</span>
                        <span className="font-semibold text-gray-900">₦{carTotal.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="border-t border-gray-200 pt-3 flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-semibold text-gray-900">₦{subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">VAT (7.5%)</span>
                      <span className="font-semibold text-gray-900">₦{tax.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                    </div>
                  </div>

                  {/* Total */}
                  <div className="border-t-2 border-gray-300 pt-4">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-lg font-bold text-gray-900">Total</span>
                      <span className="text-2xl font-bold text-orange-600">₦{total.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                    </div>

                    <Button
                      onClick={handleSubmitForApproval}
                      disabled={isSubmitting || !justification.trim()}
                      className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-5 h-5 mr-2" />
                          Submit for Approval
                        </>
                      )}
                    </Button>
                  </div>

                  {/* Info */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <div className="flex gap-2">
                      <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div className="text-xs text-blue-900">
                        <p className="font-semibold mb-1">Approval Required</p>
                        <p>This booking will be sent to your Travel Arranger for review and approval based on company policy.</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}