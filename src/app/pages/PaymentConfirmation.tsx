import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import { 
  CreditCard,
  FileText,
  CheckCircle,
  ArrowLeft,
  Lock,
  Calendar,
  Building2,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import { paymentService } from '../../services/payment.service';
import { authService } from '../../services/auth.service';

export function PaymentConfirmation() {
  const navigate = useNavigate();
  const location = useLocation();
  const bookingData = location.state as any;
  
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [processingPayment, setProcessingPayment] = useState(false);

  // Mock booking data
  const booking = {
    type: 'Flight',
    destination: 'New York to London',
    airline: 'British Airways',
    date: '2026-03-15',
    returnDate: '2026-03-20',
    passengers: 1,
    class: 'Economy',
    bookingRef: 'BA12345',
    basePrice: 1145,
    taxes: 85,
    fees: 15,
    total: 1245
  };

  const handlePayment = async () => {
    if (!bookingData?.bookingId) {
      toast.error('No booking ID found');
      return;
    }

    setProcessingPayment(true);

    try {
      const user = authService.getCurrentUser();
      if (!user) {
        toast.error('User not authenticated');
        navigate('/');
        return;
      }

      // Initialize payment via Paystack
      const paymentResponse = await paymentService.initializePayment({
        bookingId: bookingData.bookingId,
        email: user.email,
      });

      console.log('💳 Payment initialized:', paymentResponse);

      // Redirect to Paystack payment page
      if (paymentResponse.authorizationUrl) {
        window.location.href = paymentResponse.authorizationUrl;
      } else {
        toast.error('Payment initialization failed');
      }
    } catch (error: any) {
      console.error('Payment error:', error);
      toast.error(error.message || 'Payment initialization failed');
      setProcessingPayment(false);
    }
  };

  // Handle payment verification on return from Paystack
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const reference = params.get('reference');
    
    if (reference) {
      verifyPayment(reference);
    }
  }, []);

  const verifyPayment = async (reference: string) => {
    try {
      const result = await paymentService.verifyPayment(reference);
      
      if (result.success) {
        toast.success('Payment verified successfully!');
        setTimeout(() => {
          navigate('/traveller/bookings');
        }, 1500);
      } else {
        toast.error(result.message || 'Payment verification failed');
      }
    } catch (error: any) {
      console.error('Payment verification error:', error);
      toast.error(error.message || 'Payment verification failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Header */}
      <div className="bg-black/50 border-b border-gray-800 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 py-4">
            <Button
              onClick={() => navigate('/traveller')}
              variant="ghost"
              className="text-gray-400 hover:text-white"
              disabled={processingPayment}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-orange-500 to-yellow-500 p-2 rounded-lg">
                <CreditCard className="w-6 h-6 text-black" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Payment Confirmation</h1>
                <p className="text-sm text-gray-400">Complete your booking</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Payment Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Payment Method Selection */}
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Payment Method</CardTitle>
                <CardDescription className="text-gray-400">
                  Choose how you'd like to pay
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                  <div className="space-y-3">
                    <div
                      className={`flex items-center space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        paymentMethod === 'card'
                          ? 'border-orange-500 bg-orange-500/10'
                          : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
                      }`}
                      onClick={() => setPaymentMethod('card')}
                    >
                      <RadioGroupItem value="card" id="card" />
                      <div className="flex items-center gap-3 flex-1">
                        <CreditCard className="w-5 h-5 text-orange-400" />
                        <div>
                          <Label htmlFor="card" className="text-white font-semibold cursor-pointer">
                            Credit/Debit Card
                          </Label>
                          <p className="text-sm text-gray-400">Pay now with card</p>
                        </div>
                      </div>
                      <Badge className="bg-green-500/10 text-green-400 border-green-500/20">
                        Instant
                      </Badge>
                    </div>

                    <div
                      className={`flex items-center space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        paymentMethod === 'invoice'
                          ? 'border-orange-500 bg-orange-500/10'
                          : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
                      }`}
                      onClick={() => setPaymentMethod('invoice')}
                    >
                      <RadioGroupItem value="invoice" id="invoice" />
                      <div className="flex items-center gap-3 flex-1">
                        <FileText className="w-5 h-5 text-orange-400" />
                        <div>
                          <Label htmlFor="invoice" className="text-white font-semibold cursor-pointer">
                            Company Invoice
                          </Label>
                          <p className="text-sm text-gray-400">Bill to company account</p>
                        </div>
                      </div>
                      <Badge className="bg-yellow-500/10 text-yellow-400 border-yellow-500/20">
                        Net 30
                      </Badge>
                    </div>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Card Payment Form */}
            {paymentMethod === 'card' && (
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Lock className="w-5 h-5 text-green-400" />
                    Card Details
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Your payment information is secure and encrypted
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-gray-300">Card Number</Label>
                    <Input
                      placeholder="1234 5678 9012 3456"
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-300">Cardholder Name</Label>
                    <Input
                      placeholder="John Doe"
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-gray-300">Expiry Date</Label>
                      <Input
                        placeholder="MM/YY"
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-300">CVV</Label>
                      <Input
                        type="password"
                        placeholder="123"
                        maxLength={3}
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-300">Billing Address</Label>
                    <Input
                      placeholder="123 Main St, City, State, ZIP"
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Invoice Payment Details */}
            {paymentMethod === 'invoice' && (
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-orange-400" />
                    Invoice Details
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    This will be billed to your company account
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-gray-300">Company Name</Label>
                    <Input
                      defaultValue="Acme Corporation"
                      className="bg-gray-800 border-gray-700 text-white"
                      disabled
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-300">Billing Department</Label>
                    <Select defaultValue="finance">
                      <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="finance">Finance Department</SelectItem>
                        <SelectItem value="accounting">Accounting</SelectItem>
                        <SelectItem value="operations">Operations</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-300">PO Number (Optional)</Label>
                    <Input
                      placeholder="PO-2026-001"
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </div>

                  <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                    <div className="flex items-start gap-3">
                      <Calendar className="w-5 h-5 text-blue-400 mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold text-blue-400 mb-1">Payment Terms</p>
                        <p className="text-sm text-blue-300">
                          Invoice will be sent to your billing department. Payment due within 30 days.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <Card className="bg-gray-900 border-gray-800 sticky top-8">
              <CardHeader>
                <CardTitle className="text-white">Booking Summary</CardTitle>
                <CardDescription className="text-gray-400">
                  Review your booking details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Booking Type</p>
                  <p className="text-white font-semibold">{booking.type}</p>
                </div>

                <Separator className="bg-gray-800" />

                <div>
                  <p className="text-sm text-gray-400 mb-1">Route</p>
                  <p className="text-white font-semibold">{booking.destination}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-400 mb-1">Airline</p>
                  <p className="text-white">{booking.airline}</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Departure</p>
                    <p className="text-white text-sm">{booking.date}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Return</p>
                    <p className="text-white text-sm">{booking.returnDate}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Passengers</p>
                    <p className="text-white">{booking.passengers}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Class</p>
                    <p className="text-white">{booking.class}</p>
                  </div>
                </div>

                <Separator className="bg-gray-800" />

                {/* Price Breakdown */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Base Fare</span>
                    <span className="text-white">${booking.basePrice}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Taxes & Fees</span>
                    <span className="text-white">${booking.taxes}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Service Fee</span>
                    <span className="text-white">${booking.fees}</span>
                  </div>
                </div>

                <Separator className="bg-gray-800" />

                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-white">Total</span>
                  <span className="text-2xl font-bold text-orange-400">${booking.total}</span>
                </div>

                <Button
                  onClick={handlePayment}
                  disabled={processingPayment}
                  className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-black font-semibold"
                >
                  {processingPayment ? (
                    <>Processing...</>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Confirm Payment
                    </>
                  )}
                </Button>

                <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                  <Lock className="w-3 h-3" />
                  <span>Secure payment powered by BTMTravel</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
