import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Textarea } from '../components/ui/textarea';
import { Badge } from '../components/ui/badge';
import { Calendar } from '../components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../components/ui/popover';
import { 
  Plane, 
  Hotel, 
  Car,
  ArrowLeft,
  CheckCircle,
  AlertTriangle,
  CalendarIcon,
  Search
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

export function BookingFlow() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const bookingType = searchParams.get('type') || 'flight';
  
  const [step, setStep] = useState(1);
  const [departureDate, setDepartureDate] = useState<Date>();
  const [returnDate, setReturnDate] = useState<Date>();
  const [selectedOption, setSelectedOption] = useState<any>(null);
  const [policyCheck, setPolicyCheck] = useState({ compliant: true, warnings: [] as string[] });

  // Mock search results
  const mockFlights = [
    { id: 1, airline: 'British Airways', departure: '08:00', arrival: '20:00', price: 1245, stops: 'Direct', duration: '12h', policyCompliant: true },
    { id: 2, airline: 'United Airlines', departure: '10:30', arrival: '23:15', price: 980, stops: '1 stop', duration: '14h 45m', policyCompliant: true },
    { id: 3, airline: 'Lufthansa', departure: '14:00', arrival: '04:30+1', price: 2100, stops: 'Direct', duration: '12h 30m', policyCompliant: false },
  ];

  const mockHotels = [
    { id: 1, name: 'Hilton London', rating: 4.5, price: 189, amenities: 'WiFi, Breakfast, Gym', policyCompliant: true },
    { id: 2, name: 'Premier Inn', rating: 4.0, price: 129, amenities: 'WiFi, Breakfast', policyCompliant: true },
    { id: 3, name: 'The Ritz London', rating: 5.0, price: 450, amenities: 'All amenities', policyCompliant: false },
  ];

  const mockCars = [
    { id: 1, type: 'Economy', model: 'Toyota Corolla', price: 45, features: 'AC, Automatic', policyCompliant: true },
    { id: 2, type: 'SUV', model: 'Honda CR-V', price: 75, features: 'AC, Automatic, GPS', policyCompliant: true },
    { id: 3, type: 'Luxury', model: 'BMW 5 Series', price: 150, features: 'All features', policyCompliant: false },
  ];

  const getBookingIcon = () => {
    switch (bookingType) {
      case 'flight':
        return <Plane className="w-6 h-6" />;
      case 'hotel':
        return <Hotel className="w-6 h-6" />;
      case 'car':
        return <Car className="w-6 h-6" />;
      default:
        return <Plane className="w-6 h-6" />;
    }
  };

  const getBookingTitle = () => {
    switch (bookingType) {
      case 'flight':
        return 'Book a Flight';
      case 'hotel':
        return 'Book a Hotel';
      case 'car':
        return 'Rent a Car';
      default:
        return 'Book Travel';
    }
  };

  const getSearchResults = () => {
    switch (bookingType) {
      case 'flight':
        return mockFlights;
      case 'hotel':
        return mockHotels;
      case 'car':
        return mockCars;
      default:
        return [];
    }
  };

  const handleSearch = () => {
    setStep(2);
    checkPolicy();
  };

  const checkPolicy = () => {
    const warnings = [];
    if (bookingType === 'flight' && departureDate) {
      const daysUntilDeparture = Math.floor((departureDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
      if (daysUntilDeparture < 7) {
        warnings.push('Booking less than 7 days in advance may incur higher costs');
      }
    }
    setPolicyCheck({ compliant: warnings.length === 0, warnings });
  };

  const handleSelectOption = (option: any) => {
    setSelectedOption(option);
    setStep(3);
  };

  const handleSubmitBooking = () => {
    toast.success('Booking request submitted for approval');
    setTimeout(() => {
      navigate('/traveller/bookings');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 py-4">
            <Button
              onClick={() => step > 1 ? setStep(step - 1) : navigate('/traveller')}
              variant="ghost"
              className="text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-lg text-white">
                {getBookingIcon()}
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">{getBookingTitle()}</h1>
                <p className="text-sm text-gray-600">Step {step} of 3</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Step 1: Search */}
        {step === 1 && (
          <Card className="bg-white border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-gray-900">Search {bookingType === 'flight' ? 'Flights' : bookingType === 'hotel' ? 'Hotels' : 'Cars'}</CardTitle>
              <CardDescription className="text-gray-500">
                Enter your travel details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {bookingType === 'flight' && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-gray-500">From</Label>
                      <Input
                        placeholder="New York (JFK)"
                        className="bg-gray-100 border-gray-300 text-gray-900"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-500">To</Label>
                      <Input
                        placeholder="London (LHR)"
                        className="bg-gray-100 border-gray-300 text-gray-900"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-gray-500">Departure Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal bg-gray-100 border-gray-300 text-gray-900 hover:bg-gray-200"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {departureDate ? format(departureDate, "PPP") : "Select date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={departureDate}
                            onSelect={setDepartureDate}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-gray-500">Return Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal bg-gray-100 border-gray-300 text-gray-900 hover:bg-gray-200"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {returnDate ? format(returnDate, "PPP") : "Select date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={returnDate}
                            onSelect={setReturnDate}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-gray-500">Passengers</Label>
                      <Select defaultValue="1">
                        <SelectTrigger className="bg-gray-100 border-gray-300 text-gray-900">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 Passenger</SelectItem>
                          <SelectItem value="2">2 Passengers</SelectItem>
                          <SelectItem value="3">3 Passengers</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-gray-500">Class</Label>
                      <Select defaultValue="economy">
                        <SelectTrigger className="bg-gray-100 border-gray-300 text-gray-900">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="economy">Economy</SelectItem>
                          <SelectItem value="premium">Premium Economy</SelectItem>
                          <SelectItem value="business">Business</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </>
              )}

              {bookingType === 'hotel' && (
                <>
                  <div className="space-y-2">
                    <Label className="text-gray-500">Location</Label>
                    <Input
                      placeholder="London, UK"
                      className="bg-gray-100 border-gray-300 text-gray-900"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-gray-500">Check-in</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal bg-gray-100 border-gray-300 text-gray-900 hover:bg-gray-200"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {departureDate ? format(departureDate, "PPP") : "Select date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={departureDate}
                            onSelect={setDepartureDate}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-gray-500">Check-out</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal bg-gray-100 border-gray-300 text-gray-900 hover:bg-gray-200"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {returnDate ? format(returnDate, "PPP") : "Select date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={returnDate}
                            onSelect={setReturnDate}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-gray-500">Rooms</Label>
                      <Select defaultValue="1">
                        <SelectTrigger className="bg-gray-100 border-gray-300 text-gray-900">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 Room</SelectItem>
                          <SelectItem value="2">2 Rooms</SelectItem>
                          <SelectItem value="3">3 Rooms</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-gray-500">Guests</Label>
                      <Select defaultValue="1">
                        <SelectTrigger className="bg-gray-100 border-gray-300 text-gray-900">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 Guest</SelectItem>
                          <SelectItem value="2">2 Guests</SelectItem>
                          <SelectItem value="3">3 Guests</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </>
              )}

              {bookingType === 'car' && (
                <>
                  <div className="space-y-2">
                    <Label className="text-gray-500">Pick-up Location</Label>
                    <Input
                      placeholder="London Heathrow Airport"
                      className="bg-gray-100 border-gray-300 text-gray-900"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-gray-500">Pick-up Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal bg-gray-100 border-gray-300 text-gray-900 hover:bg-gray-200"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {departureDate ? format(departureDate, "PPP") : "Select date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={departureDate}
                            onSelect={setDepartureDate}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-gray-500">Drop-off Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal bg-gray-100 border-gray-300 text-gray-900 hover:bg-gray-200"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {returnDate ? format(returnDate, "PPP") : "Select date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={returnDate}
                            onSelect={setReturnDate}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-500">Car Type</Label>
                    <Select defaultValue="economy">
                      <SelectTrigger className="bg-gray-100 border-gray-300 text-gray-900">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="economy">Economy</SelectItem>
                        <SelectItem value="suv">SUV</SelectItem>
                        <SelectItem value="luxury">Luxury</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}

              <Button
                onClick={handleSearch}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold"
              >
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Results */}
        {step === 2 && (
          <div className="space-y-6">
            {policyCheck.warnings.length > 0 && (
              <Card className="bg-yellow-50 border-yellow-200">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                    <div>
                      <p className="font-semibold text-yellow-800 mb-2">Policy Warnings</p>
                      {policyCheck.warnings.map((warning, idx) => (
                        <p key={idx} className="text-sm text-yellow-700">{warning}</p>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card className="bg-white border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-gray-900">Available Options</CardTitle>
                <CardDescription className="text-gray-600">
                  Select your preferred option
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {getSearchResults().map((option: any) => (
                  <div
                    key={option.id}
                    className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-400 transition-all cursor-pointer"
                    onClick={() => handleSelectOption(option)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        {bookingType === 'flight' && (
                          <div>
                            <p className="font-semibold text-gray-900 text-lg">{option.airline}</p>
                            <p className="text-sm text-gray-600">{option.departure} - {option.arrival} ({option.duration})</p>
                            <p className="text-sm text-gray-500">{option.stops}</p>
                          </div>
                        )}
                        {bookingType === 'hotel' && (
                          <div>
                            <p className="font-semibold text-gray-900 text-lg">{option.name}</p>
                            <p className="text-sm text-gray-600">Rating: {option.rating}⭐</p>
                            <p className="text-sm text-gray-500">{option.amenities}</p>
                          </div>
                        )}
                        {bookingType === 'car' && (
                          <div>
                            <p className="font-semibold text-gray-900 text-lg">{option.type} - {option.model}</p>
                            <p className="text-sm text-gray-600">{option.features}</p>
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-gray-900">₦{(option.price * 390).toLocaleString()}</p>
                        {option.policyCompliant ? (
                          <Badge className="bg-green-100 text-green-700 border-green-200">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Policy OK
                          </Badge>
                        ) : (
                          <Badge className="bg-red-100 text-red-700 border-red-200">
                            <AlertTriangle className="w-3 h-3 mr-1" />
                            Over Limit
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 3: Review & Submit */}
        {step === 3 && selectedOption && (
          <Card className="bg-white border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-gray-900">Review Booking</CardTitle>
              <CardDescription className="text-gray-600">
                Confirm your booking details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-3">Selected Option</h3>
                {bookingType === 'flight' && (
                  <div>
                    <p className="text-gray-900">{selectedOption.airline}</p>
                    <p className="text-sm text-gray-600">{selectedOption.departure} - {selectedOption.arrival}</p>
                    <p className="text-2xl font-bold text-blue-600 mt-2">₦{(selectedOption.price * 390).toLocaleString()}</p>
                  </div>
                )}
                {bookingType === 'hotel' && (
                  <div>
                    <p className="text-gray-900">{selectedOption.name}</p>
                    <p className="text-sm text-gray-600">Rating: {selectedOption.rating}⭐</p>
                    <p className="text-2xl font-bold text-blue-600 mt-2">₦{(selectedOption.price * 390).toLocaleString()}/night</p>
                  </div>
                )}
                {bookingType === 'car' && (
                  <div>
                    <p className="text-gray-900">{selectedOption.type} - {selectedOption.model}</p>
                    <p className="text-sm text-gray-600">{selectedOption.features}</p>
                    <p className="text-2xl font-bold text-blue-600 mt-2">₦{(selectedOption.price * 390).toLocaleString()}/day</p>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-gray-700">Business Justification</Label>
                <Textarea
                  placeholder="Explain the business purpose for this travel..."
                  className="bg-white border-gray-300 text-gray-900 min-h-[100px]"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-gray-700">Cost Center</Label>
                <Select defaultValue="marketing">
                  <SelectTrigger className="bg-white border-gray-300 text-gray-900">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="marketing">Marketing Department</SelectItem>
                    <SelectItem value="sales">Sales Department</SelectItem>
                    <SelectItem value="operations">Operations</SelectItem>
                    <SelectItem value="executive">Executive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-gray-700">Project Code (Optional)</Label>
                <Input
                  placeholder="PRJ-2026-001"
                  className="bg-white border-gray-300 text-gray-900"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleSubmitBooking}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                >
                  Submit for Approval
                </Button>
                <Button
                  onClick={() => setStep(2)}
                  variant="outline"
                  className="border-gray-300 text-gray-700"
                >
                  Back
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}