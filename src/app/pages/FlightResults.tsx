import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { ArrowLeft, Plane, Clock, Calendar } from 'lucide-react';

interface Flight {
  id: string;
  airline: string;
  flightNumber: string;
  departure: {
    time: string;
    airport: string;
    city: string;
  };
  arrival: {
    time: string;
    airport: string;
    city: string;
  };
  duration: string;
  price: number;
  stops: number;
  class: string;
}

export function FlightResults() {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = location.state as any;

  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);

  // Calculate total passengers from the passengers object
  const getTotalPassengers = () => {
    if (!searchParams?.passengers) return 1;
    const { adults = 0, children = 0, infants = 0 } = searchParams.passengers;
    return adults + children + infants;
  };

  const totalPassengers = getTotalPassengers();

  // Sample flight data based on search
  const flights: Flight[] = [
    {
      id: 'FL001',
      airline: 'Air Peace',
      flightNumber: 'P4 7101',
      departure: {
        time: '06:00',
        airport: 'LOS',
        city: searchParams?.from || 'Lagos'
      },
      arrival: {
        time: '07:15',
        airport: 'ABV',
        city: searchParams?.to || 'Abuja'
      },
      duration: '1h 15m',
      price: 85000,
      stops: 0,
      class: searchParams?.class || 'Economy'
    },
    {
      id: 'FL002',
      airline: 'Arik Air',
      flightNumber: 'W3 302',
      departure: {
        time: '08:30',
        airport: 'LOS',
        city: searchParams?.from || 'Lagos'
      },
      arrival: {
        time: '09:50',
        airport: 'ABV',
        city: searchParams?.to || 'Abuja'
      },
      duration: '1h 20m',
      price: 78000,
      stops: 0,
      class: searchParams?.class || 'Economy'
    },
    {
      id: 'FL003',
      airline: 'Dana Air',
      flightNumber: '9J 205',
      departure: {
        time: '11:00',
        airport: 'LOS',
        city: searchParams?.from || 'Lagos'
      },
      arrival: {
        time: '12:20',
        airport: 'ABV',
        city: searchParams?.to || 'Abuja'
      },
      duration: '1h 20m',
      price: 72000,
      stops: 0,
      class: searchParams?.class || 'Economy'
    },
    {
      id: 'FL004',
      airline: 'Air Peace',
      flightNumber: 'P4 7105',
      departure: {
        time: '14:30',
        airport: 'LOS',
        city: searchParams?.from || 'Lagos'
      },
      arrival: {
        time: '15:45',
        airport: 'ABV',
        city: searchParams?.to || 'Abuja'
      },
      duration: '1h 15m',
      price: 88000,
      stops: 0,
      class: searchParams?.class || 'Economy'
    },
    {
      id: 'FL005',
      airline: 'Aero Contractors',
      flightNumber: 'NG 130',
      departure: {
        time: '17:00',
        airport: 'LOS',
        city: searchParams?.from || 'Lagos'
      },
      arrival: {
        time: '18:25',
        airport: 'ABV',
        city: searchParams?.to || 'Abuja'
      },
      duration: '1h 25m',
      price: 75000,
      stops: 0,
      class: searchParams?.class || 'Economy'
    }
  ];

  const handleSelectFlight = (flight: Flight) => {
    setSelectedFlight(flight);
  };

  const handleContinueToHotel = () => {
    if (!selectedFlight) return;

    navigate('/traveller/hotel-search', {
      state: {
        flight: selectedFlight,
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
                  onClick={() => navigate('/traveller/search')}
                  className="text-gray-700 hover:text-gray-900"
                >
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Back to Search
                </Button>
                <div className="border-l border-gray-300 h-8" />
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Available Flights</h1>
                  <p className="text-sm text-gray-600">
                    {searchParams?.from || 'Lagos'} → {searchParams?.to || 'Abuja'} • {searchParams?.departureDate || 'Select Date'} • {totalPassengers} Passenger(s)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Flight Results */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="space-y-4">
            {flights.map((flight) => (
              <Card 
                key={flight.id} 
                className={`bg-white/95 backdrop-blur-sm border-2 transition-all cursor-pointer hover:shadow-lg ${
                  selectedFlight?.id === flight.id 
                    ? 'border-orange-500 shadow-lg' 
                    : 'border-gray-200 hover:border-orange-300'
                }`}
                onClick={() => handleSelectFlight(flight)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    {/* Flight Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="bg-orange-500 p-2 rounded">
                          <Plane className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{flight.airline}</p>
                          <p className="text-sm text-gray-600">{flight.flightNumber}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-8">
                        {/* Departure */}
                        <div>
                          <p className="text-2xl font-bold text-gray-900">{flight.departure.time}</p>
                          <p className="text-sm text-gray-600">{flight.departure.airport}</p>
                          <p className="text-sm font-medium text-gray-900">{flight.departure.city}</p>
                        </div>

                        {/* Duration */}
                        <div className="flex-1 flex flex-col items-center">
                          <div className="flex items-center gap-2 text-gray-600 mb-1">
                            <Clock className="w-4 h-4" />
                            <span className="text-sm">{flight.duration}</span>
                          </div>
                          <div className="w-full h-px bg-gray-300 relative">
                            <Plane className="w-4 h-4 text-orange-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-90" />
                          </div>
                          <p className="text-xs text-gray-600 mt-1">
                            {flight.stops === 0 ? 'Direct' : `${flight.stops} Stop(s)`}
                          </p>
                        </div>

                        {/* Arrival */}
                        <div>
                          <p className="text-2xl font-bold text-gray-900">{flight.arrival.time}</p>
                          <p className="text-sm text-gray-600">{flight.arrival.airport}</p>
                          <p className="text-sm font-medium text-gray-900">{flight.arrival.city}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 mt-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="w-4 h-4" />
                          <span>{searchParams?.departureDate || 'Not specified'}</span>
                        </div>
                        <div className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700">
                          {flight.class}
                        </div>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="text-right pl-8">
                      <p className="text-3xl font-bold text-gray-900">₦{flight.price.toLocaleString()}</p>
                      <p className="text-sm text-gray-600 mb-4">per person</p>
                      <Button
                        onClick={() => handleSelectFlight(flight)}
                        className={
                          selectedFlight?.id === flight.id
                            ? 'bg-orange-500 hover:bg-orange-600 text-white'
                            : 'bg-white border-2 border-orange-500 text-orange-500 hover:bg-orange-50'
                        }
                      >
                        {selectedFlight?.id === flight.id ? 'Selected' : 'Select Flight'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Continue Button */}
          {selectedFlight && (
            <div className="mt-8 flex justify-end">
              <Card className="bg-white/95 backdrop-blur-sm border-gray-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between gap-8">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Selected Flight</p>
                      <p className="font-semibold text-gray-900">
                        {selectedFlight.airline} {selectedFlight.flightNumber} • ₦{selectedFlight.price.toLocaleString()}
                      </p>
                    </div>
                    <Button
                      onClick={handleContinueToHotel}
                      className="bg-orange-500 hover:bg-orange-600 text-white px-8"
                    >
                      Continue to Hotel Search
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