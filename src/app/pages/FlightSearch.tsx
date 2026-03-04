import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { 
  Plane, 
  ArrowLeftRight,
  Calendar,
  Users,
  Briefcase,
  ChevronDown,
  Plus,
  Minus,
  User,
  Baby,
  ArrowLeft,
  LogOut
} from 'lucide-react';

export function FlightSearch() {
  const navigate = useNavigate();
  const [tripType, setTripType] = useState<'return' | 'one-way' | 'multi-route'>('return');
  const [from, setFrom] = useState('Lagos');
  const [to, setTo] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [flightClass, setFlightClass] = useState('Economy');
  const [isPassengerDropdownOpen, setIsPassengerDropdownOpen] = useState(false);
  const [passengers, setPassengers] = useState({
    adults: 1,
    children: 0,
    infants: 0
  });

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsPassengerDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSwapLocations = () => {
    const temp = from;
    setFrom(to);
    setTo(temp);
  };

  const updatePassengerCount = (type: 'adults' | 'children' | 'infants', delta: number) => {
    setPassengers(prev => ({
      ...prev,
      [type]: Math.max(0, prev[type] + delta)
    }));
  };

  const getTotalPassengers = () => {
    return passengers.adults + passengers.children + passengers.infants;
  };

  const handleSearch = () => {
    // Navigate to flight results with search parameters
    navigate('/traveller/flight-results', {
      state: {
        tripType,
        from,
        to,
        departureDate,
        returnDate,
        passengers,
        class: flightClass
      }
    });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header with Background Image */}
      <div 
        className="relative bg-cover bg-center h-72"
        style={{ 
          backgroundImage: `url('https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1600&q=80')`,
          backgroundPosition: 'center 40%'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/50" />
        
        {/* Header Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
              <div className="bg-orange-500 p-2 rounded-lg">
                <Plane className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">BTMTravel COBT</h1>
                <p className="text-sm text-white/90">Corporate Booking Tool</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={() => navigate('/traveller')}
                variant="ghost"
                className="text-white hover:bg-white/20"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
              <Button
                onClick={() => navigate('/')}
                variant="ghost"
                className="text-white hover:bg-white/20"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>

        {/* Search Box */}
        <div className="absolute left-0 right-0 -bottom-40 z-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8">
              {/* Trip Type Selector */}
              <div className="flex flex-wrap gap-4 mb-6">
                <button
                  onClick={() => setTripType('return')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 transition-all ${
                    tripType === 'return'
                      ? 'bg-orange-500 border-orange-500 text-white'
                      : 'bg-white border-gray-300 text-gray-700 hover:border-orange-300'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    tripType === 'return' ? 'border-white' : 'border-gray-400'
                  }`}>
                    {tripType === 'return' && <div className="w-2.5 h-2.5 rounded-full bg-white" />}
                  </div>
                  <span className="font-medium">Return</span>
                </button>

                <button
                  onClick={() => setTripType('one-way')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 transition-all ${
                    tripType === 'one-way'
                      ? 'bg-orange-500 border-orange-500 text-white'
                      : 'bg-white border-gray-300 text-gray-700 hover:border-orange-300'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    tripType === 'one-way' ? 'border-white' : 'border-gray-400'
                  }`}>
                    {tripType === 'one-way' && <div className="w-2.5 h-2.5 rounded-full bg-white" />}
                  </div>
                  <span className="font-medium">One-Way</span>
                </button>

                <button
                  onClick={() => setTripType('multi-route')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 transition-all ${
                    tripType === 'multi-route'
                      ? 'bg-orange-500 border-orange-500 text-white'
                      : 'bg-white border-gray-300 text-gray-700 hover:border-orange-300'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    tripType === 'multi-route' ? 'border-white' : 'border-gray-400'
                  }`}>
                    {tripType === 'multi-route' && <div className="w-2.5 h-2.5 rounded-full bg-white" />}
                  </div>
                  <span className="font-medium">Multi-Route</span>
                </button>
              </div>

              {/* Search Fields */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                {/* From */}
                <div className="md:col-span-3">
                  <Label className="text-gray-700 font-medium mb-2 block">From</Label>
                  <div className="relative">
                    <Input
                      value={from}
                      onChange={(e) => setFrom(e.target.value)}
                      className="pr-3 h-12 bg-white border-gray-300 text-gray-900"
                    />
                    {from && (
                      <div className="absolute left-3 top-1/2 -translate-y-1/2">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-orange-500 text-white">
                          {from}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Swap Button */}
                <div className="md:col-span-1 flex justify-center items-center">
                  <Button
                    onClick={handleSwapLocations}
                    variant="ghost"
                    size="icon"
                    className="rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700"
                  >
                    <ArrowLeftRight className="w-5 h-5" />
                  </Button>
                </div>

                {/* To */}
                <div className="md:col-span-3">
                  <Label className="text-gray-700 font-medium mb-2 block">To</Label>
                  <Input
                    value={to}
                    onChange={(e) => setTo(e.target.value)}
                    placeholder='Try "London"'
                    className="h-12 bg-white border-gray-300 text-gray-900 placeholder:text-gray-400"
                  />
                </div>

                {/* Departure */}
                <div className="md:col-span-2">
                  <Label className="text-gray-700 font-medium mb-2 block">Departure</Label>
                  <div className="relative">
                    <Input
                      type="date"
                      value={departureDate}
                      onChange={(e) => setDepartureDate(e.target.value)}
                      placeholder="mm/dd/yy"
                      className="h-12 bg-white border-gray-300 text-gray-900"
                    />
                  </div>
                </div>

                {/* Return */}
                {tripType === 'return' && (
                  <div className="md:col-span-2">
                    <Label className="text-gray-700 font-medium mb-2 block">Return</Label>
                    <div className="relative">
                      <Input
                        type="date"
                        value={returnDate}
                        onChange={(e) => setReturnDate(e.target.value)}
                        placeholder="mm/dd/yy"
                        className="h-12 bg-white border-gray-300 text-gray-900"
                      />
                    </div>
                  </div>
                )}

                {/* Passengers Dropdown */}
                <div className={tripType === 'return' ? 'md:col-span-1' : 'md:col-span-3'} ref={dropdownRef}>
                  <div className="relative">
                    <button
                      onClick={() => setIsPassengerDropdownOpen(!isPassengerDropdownOpen)}
                      className="w-full h-12 px-4 bg-white border border-gray-300 rounded-lg flex items-center justify-between hover:border-orange-300 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <Users className="w-5 h-5 text-gray-600" />
                        <span className="font-medium text-gray-900">{getTotalPassengers()}</span>
                        <Briefcase className="w-4 h-4 text-gray-600" />
                      </div>
                      <ChevronDown className={`w-4 h-4 text-gray-600 transition-transform ${
                        isPassengerDropdownOpen ? 'rotate-180' : ''
                      }`} />
                    </button>

                    {/* Passengers Dropdown Panel */}
                    {isPassengerDropdownOpen && (
                      <div className="absolute top-full mt-2 right-0 w-80 bg-white rounded-lg shadow-2xl border border-gray-200 p-4 z-50">
                        {/* Class Selector */}
                        <div className="mb-4 pb-4 border-b border-gray-200">
                          <Label className="text-gray-700 font-medium mb-2 block">Class</Label>
                          <select
                            value={flightClass}
                            onChange={(e) => setFlightClass(e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                          >
                            <option>Economy</option>
                            <option>Premium Economy</option>
                            <option>Business</option>
                            <option>First Class</option>
                          </select>
                        </div>

                        {/* Passenger Counters */}
                        <div className="space-y-4 mb-4">
                          {/* Adults */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <User className="w-5 h-5 text-gray-600" />
                              <div>
                                <p className="font-medium text-gray-900">Adult</p>
                                <p className="text-xs text-gray-500">Over 11</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => updatePassengerCount('adults', -1)}
                                disabled={passengers.adults <= 1}
                                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <Minus className="w-4 h-4 text-gray-600" />
                              </button>
                              <span className="w-8 text-center font-medium text-gray-900">
                                {passengers.adults}
                              </span>
                              <button
                                onClick={() => updatePassengerCount('adults', 1)}
                                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                              >
                                <Plus className="w-4 h-4 text-gray-600" />
                              </button>
                            </div>
                          </div>

                          {/* Children */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <User className="w-5 h-5 text-gray-600" />
                              <div>
                                <p className="font-medium text-gray-900">Child</p>
                                <p className="text-xs text-gray-500">2-11</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => updatePassengerCount('children', -1)}
                                disabled={passengers.children <= 0}
                                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <Minus className="w-4 h-4 text-gray-600" />
                              </button>
                              <span className="w-8 text-center font-medium text-gray-900">
                                {passengers.children}
                              </span>
                              <button
                                onClick={() => updatePassengerCount('children', 1)}
                                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                              >
                                <Plus className="w-4 h-4 text-gray-600" />
                              </button>
                            </div>
                          </div>

                          {/* Infants */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Baby className="w-5 h-5 text-gray-600" />
                              <div>
                                <p className="font-medium text-gray-900">Infant</p>
                                <p className="text-xs text-gray-500">Under 2</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => updatePassengerCount('infants', -1)}
                                disabled={passengers.infants <= 0}
                                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <Minus className="w-4 h-4 text-gray-600" />
                              </button>
                              <span className="w-8 text-center font-medium text-gray-900">
                                {passengers.infants}
                              </span>
                              <button
                                onClick={() => updatePassengerCount('infants', 1)}
                                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                              >
                                <Plus className="w-4 h-4 text-gray-600" />
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2 pt-4 border-t border-gray-200">
                          <Button
                            onClick={() => setIsPassengerDropdownOpen(false)}
                            variant="outline"
                            className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-100"
                          >
                            Cancel
                          </Button>
                          <Button
                            onClick={() => setIsPassengerDropdownOpen(false)}
                            className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-semibold"
                          >
                            Done
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Search Button */}
              <div className="mt-6">
                <Button
                  onClick={handleSearch}
                  className="w-full h-12 bg-orange-500 hover:bg-orange-600 text-white font-semibold text-lg"
                >
                  Search Flights
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Area (spacing for the search box) */}
      <div className="pt-48 pb-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Additional content can go here */}
        </div>
      </div>
    </div>
  );
}