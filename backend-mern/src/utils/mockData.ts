// Mock data for fallback when Amadeus API fails

export const generateMockFlights = (origin: string, destination: string, departureDate: string) => {
  const airlines = [
    { code: 'W3', name: 'Arik Air' },
    { code: 'P4', name: 'Air Peace' },
    { code: 'QK', name: 'Ibom Air' },
    { code: 'OJ', name: 'Overland Airways' },
    { code: 'N0', name: 'Dana Air' },
  ];

  const cabinClasses = ['Economy', 'Premium Economy', 'Business'];
  
  return airlines.flatMap((airline, airlineIdx) =>
    cabinClasses.map((cabin, cabinIdx) => {
      const basePrice = cabin === 'Economy' ? 110000 : cabin === 'Premium Economy' ? 285000 : 625000;
      const priceVariation = Math.random() * 50000;
      const price = Math.round(basePrice + priceVariation);
      
      const departureTime = `${(6 + airlineIdx * 2 + cabinIdx).toString().padStart(2, '0')}:${(Math.random() * 60).toFixed(0).padStart(2, '0')}`;
      const duration = 60 + Math.floor(Math.random() * 30);
      const arrivalHour = parseInt(departureTime.split(':')[0]) + Math.floor(duration / 60);
      const arrivalMinute = (parseInt(departureTime.split(':')[1]) + (duration % 60)) % 60;
      const arrivalTime = `${arrivalHour.toString().padStart(2, '0')}:${arrivalMinute.toString().padStart(2, '0')}`;

      return {
        id: `mock-${airline.code}-${cabinIdx}-${Date.now()}`,
        airline: airline.name,
        airlineCode: airline.code,
        flightNumber: `${airline.code}${(100 + airlineIdx * 10 + cabinIdx)}`,
        departure: {
          airport: origin,
          city: origin === 'LOS' ? 'Lagos' : origin === 'ABV' ? 'Abuja' : origin,
          date: departureDate,
          time: departureTime,
        },
        arrival: {
          airport: destination,
          city: destination === 'LOS' ? 'Lagos' : destination === 'ABV' ? 'Abuja' : destination,
          date: departureDate,
          time: arrivalTime,
        },
        duration: `${Math.floor(duration / 60)}h ${duration % 60}m`,
        cabin: cabin,
        price: price,
        currency: 'NGN',
        available: true,
        stops: 0,
      };
    })
  );
};

export const generateMockHotels = (location: string, checkIn: string, checkOut: string) => {
  const hotels = [
    { name: 'Eko Hotels & Suites', rating: 5, basePrice: 85000 },
    { name: 'Transcorp Hilton', rating: 5, basePrice: 95000 },
    { name: 'Lagos Continental', rating: 4, basePrice: 55000 },
    { name: 'Sheraton Lagos', rating: 5, basePrice: 75000 },
    { name: 'Radisson Blu Anchorage', rating: 5, basePrice: 70000 },
    { name: 'Four Points by Sheraton', rating: 4, basePrice: 60000 },
    { name: 'The Wheatbaker', rating: 5, basePrice: 80000 },
    { name: 'Oriental Hotel', rating: 5, basePrice: 72000 },
  ];

  const roomTypes = ['Standard Room', 'Deluxe Room', 'Executive Suite', 'Presidential Suite'];

  return hotels.flatMap((hotel) =>
    roomTypes.slice(0, hotel.rating === 5 ? 4 : 3).map((roomType, idx) => {
      const priceMultiplier = idx === 0 ? 1 : idx === 1 ? 1.4 : idx === 2 ? 2.2 : 4.5;
      const price = Math.round(hotel.basePrice * priceMultiplier);
      
      return {
        id: `mock-hotel-${hotel.name.replace(/\s/g, '-')}-${idx}-${Date.now()}`,
        name: hotel.name,
        location: location,
        rating: hotel.rating,
        roomType: roomType,
        checkIn: checkIn,
        checkOut: checkOut,
        price: price,
        currency: 'NGN',
        amenities: [
          'Free WiFi',
          'Pool',
          'Gym',
          'Restaurant',
          'Room Service',
          'Airport Shuttle',
          ...(hotel.rating === 5 ? ['Spa', 'Concierge'] : []),
        ],
        available: true,
      };
    })
  );
};

export const generateMockCars = (location: string, pickupDate: string, dropoffDate: string) => {
  const companies = [
    { name: 'Avis Nigeria', types: ['Economy', 'Compact', 'SUV', 'Luxury'] },
    { name: 'Europcar Nigeria', types: ['Economy', 'Compact', 'SUV'] },
    { name: 'ABC Transport', types: ['Economy', 'SUV', 'Van'] },
  ];

  const carDetails: Record<string, { basePrice: number; features: string[] }> = {
    Economy: { basePrice: 15000, features: ['AC', 'Manual', '4 Seats'] },
    Compact: { basePrice: 18000, features: ['AC', 'Automatic', '4 Seats'] },
    SUV: { basePrice: 35000, features: ['AC', 'Automatic', '7 Seats', '4WD'] },
    Luxury: { basePrice: 65000, features: ['AC', 'Automatic', '5 Seats', 'Premium Interior'] },
    Van: { basePrice: 40000, features: ['AC', 'Manual', '12 Seats'] },
  };

  const checkInDate = new Date(pickupDate);
  const checkOutDate = new Date(dropoffDate);
  const days = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));

  return companies.flatMap((company) =>
    company.types.map((type) => {
      const details = carDetails[type];
      const dailyPrice = details.basePrice;
      const totalPrice = dailyPrice * days;
      
      return {
        id: `mock-car-${company.name.replace(/\s/g, '-')}-${type}-${Date.now()}`,
        company: company.name,
        carType: type,
        pickupLocation: location,
        pickupDate: pickupDate,
        dropoffLocation: location,
        dropoffDate: dropoffDate,
        days: days,
        dailyPrice: dailyPrice,
        totalPrice: totalPrice,
        currency: 'NGN',
        features: details.features,
        available: true,
      };
    })
  );
};
