import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { ArrowLeft, Hotel as HotelIcon, Star, MapPin, Wifi, Coffee, Car, UtensilsCrossed, Loader2 } from 'lucide-react';
import { searchService, type Hotel } from '../../services/search.service';
import { toast } from 'sonner';

export function HotelSearch() {
  const navigate = useNavigate();
  const location = useLocation();
  const bookingState = location.state as any;
  const flight = bookingState?.flight;
  const searchParams = bookingState?.searchParams;

  const [selectedHotel, setSelectedHotel] = useState<any>(null);
  const [hotels, setHotels] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Calculate nights from search params
  const calculateNights = () => {
    if (!searchParams?.departureDate || !searchParams?.returnDate) return 2;
    const checkIn = new Date(searchParams.departureDate);
    const checkOut = new Date(searchParams.returnDate);
    const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays || 2;
  };

  const nights = calculateNights();

  // Fetch hotels from backend
  useEffect(() => {
    const fetchHotels = async () => {
      if (!flight?.arrival?.city) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const cityCode = flight.arrival.airport || flight.arrival.city.substring(0, 3).toUpperCase();
        const checkInDate = searchParams?.departureDate || new Date().toISOString().split('T')[0];
        const checkOutDate = searchParams?.returnDate || new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

        const results = await searchService.searchHotels({
          cityCode,
          checkInDate,
          checkOutDate,
          adults: searchParams?.passengers?.adults || 1,
        });

        // Transform backend hotel data to match our UI format
        const transformedHotels = results.map((hotel: Hotel) => ({
          ...hotel,
          pricePerNight: Math.round(hotel.price / nights),
          distance: '5 km from city center',
          amenities: ['Free WiFi', 'Restaurant', 'Pool', 'Parking'],
          image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=80',
        }));

        setHotels(transformedHotels);
      } catch (error: any) {
        console.error('Hotel search error:', error);
        toast.error(error.message || 'Failed to search hotels');
        setHotels([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHotels();
  }, [flight, searchParams, nights]);

  const getAmenityIcon = (amenity: string) => {
    if (amenity.includes('WiFi')) return <Wifi className="w-4 h-4" />;
    if (amenity.includes('Restaurant') || amenity.includes('Breakfast')) return <UtensilsCrossed className="w-4 h-4" />;
    if (amenity.includes('Bar') || amenity.includes('Coffee')) return <Coffee className="w-4 h-4" />;
    if (amenity.includes('Parking')) return <Car className="w-4 h-4" />;
    return <MapPin className="w-4 h-4" />;
  };

  const handleSelectHotel = (hotel: HotelOption) => {
    setSelectedHotel(hotel);
  };

  const handleContinueToCar = () => {
    if (!selectedHotel) return;

    navigate('/traveller/car-rental', {
      state: {
        flight: flight,
        hotel: selectedHotel,
        searchParams: searchParams
      }
    });
  };

  const handleSkipHotel = () => {
    navigate('/traveller/car-rental', {
      state: {
        flight: flight,
        hotel: null,
        searchParams: searchParams
      }
    });
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
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  onClick={() => navigate('/traveller/flight-results', { state: searchParams })}
                  className="text-gray-700 hover:text-gray-900"
                >
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Back to Flights
                </Button>
                <div className="border-l border-gray-300 h-8" />
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Select Hotel</h1>
                  <p className="text-sm text-gray-600">
                    {flight?.arrival?.city || 'Destination'} • {nights} Night(s) • {searchParams?.departureDate || 'Select Date'}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                onClick={handleSkipHotel}
                className="text-gray-600 hover:text-gray-900"
              >
                Skip Hotel
              </Button>
            </div>
          </div>
        </div>

        {/* Hotel Results */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Current Booking Summary */}
          <Card className="bg-white/95 backdrop-blur-sm border-gray-200 mb-6">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="bg-orange-100 p-2 rounded">
                    <Hotel className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Selected Flight</p>
                    <p className="font-semibold text-gray-900">
                      {flight?.airline} {flight?.flightNumber} • {flight?.departure?.city} → {flight?.arrival?.city}
                    </p>
                  </div>
                </div>
                <p className="font-bold text-gray-900">₦{flight?.price?.toLocaleString()}</p>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {hotels.map((hotel) => (
              <Card 
                key={hotel.id} 
                className={`bg-white/95 backdrop-blur-sm border-2 transition-all cursor-pointer hover:shadow-lg ${
                  selectedHotel?.id === hotel.id 
                    ? 'border-orange-500 shadow-lg' 
                    : 'border-gray-200 hover:border-orange-300'
                }`}
                onClick={() => handleSelectHotel(hotel)}
              >
                <CardContent className="p-0">
                  {/* Hotel Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={hotel.image} 
                      alt={hotel.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 right-3 bg-white px-3 py-1 rounded-full flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold text-gray-900">{hotel.rating}.0</span>
                    </div>
                  </div>

                  {/* Hotel Info */}
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{hotel.name}</h3>
                    
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                      <MapPin className="w-4 h-4" />
                      <span>{hotel.location} • {hotel.distance}</span>
                    </div>

                    {/* Amenities */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {hotel.amenities.slice(0, 4).map((amenity, idx) => (
                        <div 
                          key={idx}
                          className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded text-xs text-gray-700"
                        >
                          {getAmenityIcon(amenity)}
                          <span>{amenity}</span>
                        </div>
                      ))}
                    </div>

                    {/* Price and Select */}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                      <div>
                        <p className="text-xs text-gray-600">₦{hotel.pricePerNight.toLocaleString()} per night</p>
                        <p className="text-2xl font-bold text-gray-900">₦{hotel.price.toLocaleString()}</p>
                        <p className="text-xs text-gray-600">{nights} nights total</p>
                      </div>
                      <Button
                        onClick={() => handleSelectHotel(hotel)}
                        className={
                          selectedHotel?.id === hotel.id
                            ? 'bg-orange-500 hover:bg-orange-600 text-white'
                            : 'bg-white border-2 border-orange-500 text-orange-500 hover:bg-orange-50'
                        }
                      >
                        {selectedHotel?.id === hotel.id ? 'Selected' : 'Select'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Continue Button */}
          {selectedHotel && (
            <div className="mt-8 flex justify-end">
              <Card className="bg-white/95 backdrop-blur-sm border-gray-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between gap-8">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Selected Hotel</p>
                      <p className="font-semibold text-gray-900">
                        {selectedHotel.name} • ₦{selectedHotel.price.toLocaleString()} ({nights} nights)
                      </p>
                    </div>
                    <Button
                      onClick={handleContinueToCar}
                      className="bg-orange-500 hover:bg-orange-600 text-white px-8"
                    >
                      Continue to Car Rental
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
