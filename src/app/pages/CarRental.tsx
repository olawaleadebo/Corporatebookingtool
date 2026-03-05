import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { ArrowLeft, Car, Users, Briefcase, Luggage, Snowflake, Settings, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface CarOption {
  id: string;
  name: string;
  category: string;
  image: string;
  seats: number;
  transmission: string;
  features: string[];
  pricePerDay: number;
  price: number;
}

export function CarRental() {
  const navigate = useNavigate();
  const location = useLocation();
  const bookingState = location.state as any;
  const flight = bookingState?.flight;
  const hotel = bookingState?.hotel;
  const searchParams = bookingState?.searchParams;

  const [selectedCar, setSelectedCar] = useState<CarOption | null>(null);
  const [cars, setCars] = useState<CarOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Calculate rental days based on flight dates
  const calculateRentalDays = () => {
    if (searchParams?.departureDate && searchParams?.returnDate) {
      const departure = new Date(searchParams.departureDate);
      const returnDate = new Date(searchParams.returnDate);
      const diffTime = Math.abs(returnDate.getTime() - departure.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays || 1;
    }
    return 3; // Default to 3 days
  };

  const rentalDays = calculateRentalDays();

  // Fetch car rentals from API
  useEffect(() => {
    const fetchCars = async () => {
      try {
        setIsLoading(true);
        // API call would go here - for now, just set empty array
        // const results = await carService.searchCars({...});
        // setCars(results);
        setCars([]);
      } catch (error: any) {
        console.error('Car search error:', error);
        toast.error(error.message || 'Failed to search car rentals');
        setCars([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCars();
  }, [searchParams, rentalDays]);

  const getFeatureIcon = (feature: string) => {
    if (feature.includes('Air Conditioning')) return <Snowflake className="w-4 h-4" />;
    if (feature.includes('Seats') || feature.includes('Spacious')) return <Users className="w-4 h-4" />;
    if (feature.includes('Luggage')) return <Luggage className="w-4 h-4" />;
    if (feature.includes('GPS') || feature.includes('Bluetooth')) return <Settings className="w-4 h-4" />;
    return <Briefcase className="w-4 h-4" />;
  };

  const handleSelectCar = (car: CarOption) => {
    setSelectedCar(car);
  };

  const handleContinueToSummary = () => {
    if (!selectedCar) return;

    navigate('/traveller/booking-summary', {
      state: {
        flight: flight,
        hotel: hotel,
        car: selectedCar,
        searchParams: searchParams
      }
    });
  };

  const handleSkipCar = () => {
    navigate('/traveller/booking-summary', {
      state: {
        flight: flight,
        hotel: hotel,
        car: null,
        searchParams: searchParams
      }
    });
  };

  const currentTotal = (flight?.price || 0) + (hotel?.price || 0);

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
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  onClick={() => navigate('/traveller/hotel-search', { state: bookingState })}
                  className="text-gray-700 hover:text-gray-900"
                >
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Back to Hotels
                </Button>
                <div className="border-l border-gray-300 h-8" />
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Select Car Rental</h1>
                  <p className="text-sm text-gray-600">
                    {flight?.arrival?.city || 'Destination'} • {rentalDays} Day(s)
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                onClick={handleSkipCar}
                className="text-gray-600 hover:text-gray-900"
              >
                Skip Car Rental
              </Button>
            </div>
          </div>
        </div>

        {/* Car Rental Results */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-12 h-12 text-orange-500 animate-spin mb-4" />
              <p className="text-white text-lg font-medium">Searching for car rentals...</p>
              <p className="text-white/70 text-sm mt-2">Please wait while we find the best options for you</p>
            </div>
          ) : (
            <>
          {/* Current Booking Summary */}
          <Card className="bg-white/95 backdrop-blur-sm border-gray-200 mb-6">
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="bg-orange-100 p-2 rounded">
                      <Car className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Current Booking</p>
                      <p className="font-semibold text-gray-900">
                        Flight: {flight?.airline} {flight?.flightNumber}
                        {hotel && ` • Hotel: ${hotel.name}`}
                      </p>
                    </div>
                  </div>
                  <p className="font-bold text-gray-900">₦{currentTotal.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {cars.length === 0 ? (
            <div className="text-center py-20">
              <div className="bg-white/95 backdrop-blur-sm rounded-lg p-8 max-w-md mx-auto">
                <Car className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No cars available</h3>
                <p className="text-gray-600 mb-6">We couldn't find any car rentals at this time.</p>
                <Button
                  onClick={handleSkipCar}
                  className="bg-orange-500 hover:bg-orange-600 text-white"
                >
                  Continue Without Car
                </Button>
              </div>
            </div>
          ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {cars.map((car) => (
              <Card 
                key={car.id} 
                className={`bg-white/95 backdrop-blur-sm border-2 transition-all cursor-pointer hover:shadow-lg ${
                  selectedCar?.id === car.id 
                    ? 'border-orange-500 shadow-lg' 
                    : 'border-gray-200 hover:border-orange-300'
                }`}
                onClick={() => handleSelectCar(car)}
              >
                <CardContent className="p-0">
                  {/* Car Image */}
                  <div className="relative h-40 overflow-hidden bg-gray-100">
                    <img 
                      src={car.image} 
                      alt={car.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 right-3 bg-white px-3 py-1 rounded-full">
                      <span className="text-xs font-semibold text-gray-900">{car.category}</span>
                    </div>
                  </div>

                  {/* Car Info */}
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-gray-900 mb-3">{car.name}</h3>
                    
                    {/* Specs */}
                    <div className="flex items-center gap-4 mb-3 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{car.seats} Seats</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Settings className="w-4 h-4" />
                        <span>{car.transmission}</span>
                      </div>
                    </div>

                    {/* Features */}
                    <div className="space-y-1 mb-4">
                      {car.features.map((feature, idx) => (
                        <div 
                          key={idx}
                          className="flex items-center gap-2 text-xs text-gray-700"
                        >
                          {getFeatureIcon(feature)}
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>

                    {/* Price and Select */}
                    <div className="pt-3 border-t border-gray-200">
                      <div className="mb-3">
                        <p className="text-xs text-gray-600">₦{car.pricePerDay.toLocaleString()} per day</p>
                        <p className="text-2xl font-bold text-gray-900">₦{car.price.toLocaleString()}</p>
                        <p className="text-xs text-gray-600">{rentalDays} days total</p>
                      </div>
                      <Button
                        onClick={() => handleSelectCar(car)}
                        className={`w-full ${
                          selectedCar?.id === car.id
                            ? 'bg-orange-500 hover:bg-orange-600 text-white'
                            : 'bg-white border-2 border-orange-500 text-orange-500 hover:bg-orange-50'
                        }`}
                      >
                        {selectedCar?.id === car.id ? 'Selected' : 'Select'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          )}

          {/* Continue Button */}
          {selectedCar && (
            <div className="mt-8 flex justify-end">
              <Card className="bg-white/95 backdrop-blur-sm border-gray-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between gap-8">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Selected Car</p>
                      <p className="font-semibold text-gray-900">
                        {selectedCar.name} • ₦{selectedCar.price.toLocaleString()} ({rentalDays} days)
                      </p>
                    </div>
                    <Button
                      onClick={handleContinueToSummary}
                      className="bg-orange-500 hover:bg-orange-600 text-white px-8"
                    >
                      Continue to Summary
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
