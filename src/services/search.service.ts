import api from '../lib/api';

export interface FlightSearchParams {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  adults?: number;
  travelClass?: string;
}

export interface HotelSearchParams {
  cityCode: string;
  checkInDate: string;
  checkOutDate: string;
  adults?: number;
}

export interface Flight {
  id: string;
  airline: string;
  flightNumber: string;
  departure: {
    airport: string;
    city: string;
    time: string;
    date: string;
  };
  arrival: {
    airport: string;
    city: string;
    time: string;
    date: string;
  };
  duration: string;
  stops: number;
  price: number;
  currency: string;
  class: string;
  rawData?: any;
}

export interface Hotel {
  id: string;
  name: string;
  location: string;
  rating: number;
  price: number;
  currency: string;
  roomType: string;
  checkIn: string;
  checkOut: string;
  rawData?: any;
}

class SearchService {
  // Generate mock flight data as fallback
  private generateMockFlights(params: FlightSearchParams): Flight[] {
    const airlines = ['BA', 'AA', 'AF', 'LH', 'EK', 'QR'];
    const travelClass = params.travelClass || 'ECONOMY';
    
    // Generate 5-8 mock flights
    const numFlights = Math.floor(Math.random() * 4) + 5;
    const flights: Flight[] = [];
    
    for (let i = 0; i < numFlights; i++) {
      const airline = airlines[Math.floor(Math.random() * airlines.length)];
      const flightNumber = Math.floor(Math.random() * 900) + 100;
      const basePrice = travelClass === 'BUSINESS' ? 350000 : travelClass === 'FIRST' ? 850000 : 185000;
      const priceVariation = Math.floor(Math.random() * 150000) - 75000;
      const price = basePrice + priceVariation;
      const stops = Math.random() > 0.6 ? 1 : 0;
      const durationHours = 6 + (Math.random() * 4) + (stops * 2);
      const departureHour = 6 + Math.floor(Math.random() * 16);
      
      flights.push({
        id: `${airline}${flightNumber}-${i}`,
        airline: airline,
        flightNumber: `${airline}${flightNumber}`,
        departure: {
          airport: params.origin,
          city: params.origin,
          time: `${departureHour.toString().padStart(2, '0')}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
          date: params.departureDate,
        },
        arrival: {
          airport: params.destination,
          city: params.destination,
          time: `${((departureHour + Math.floor(durationHours)) % 24).toString().padStart(2, '0')}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
          date: params.departureDate,
        },
        duration: `PT${Math.floor(durationHours)}H${Math.floor((durationHours % 1) * 60)}M`,
        stops: stops,
        price: price,
        currency: 'NGN',
        class: travelClass,
        rawData: {},
      });
    }
    
    // Sort by price
    return flights.sort((a, b) => a.price - b.price);
  }

  // Generate mock hotel data as fallback
  private generateMockHotels(params: HotelSearchParams): Hotel[] {
    const hotelNames = [
      'Lagos Continental Hotel',
      'The Wheatbaker',
      'Eko Hotel & Suites',
      'Radisson Blu Anchorage',
      'Oriental Hotel',
      'Transcorp Hilton',
      'Sheraton Hotel',
      'Four Points by Sheraton'
    ];
    
    const roomTypes = ['Standard', 'Deluxe', 'Executive', 'Suite'];
    
    // Calculate number of nights
    const checkIn = new Date(params.checkInDate);
    const checkOut = new Date(params.checkOutDate);
    const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
    
    return hotelNames.map((name, index) => {
      const rating = 3 + Math.random() * 2;
      const pricePerNight = 25000 + Math.floor(Math.random() * 125000);
      const totalPrice = pricePerNight * nights;
      const roomType = roomTypes[Math.floor(Math.random() * roomTypes.length)];
      
      return {
        id: `HOTEL-${params.cityCode}-${index}`,
        name: name,
        location: `${params.cityCode}, Nigeria`,
        rating: Math.round(rating * 10) / 10,
        price: totalPrice,
        currency: 'NGN',
        roomType: roomType,
        checkIn: params.checkInDate,
        checkOut: params.checkOutDate,
        rawData: {},
      };
    }).sort((a, b) => a.price - b.price);
  }

  async searchFlights(params: FlightSearchParams): Promise<Flight[]> {
    try {
      const response = await api.get<Flight[]>('/search/flights', { params });
      return response.data;
    } catch (error: any) {
      console.warn('Backend flight search failed, using mock data:', error.message);
      
      // Return mock data as fallback
      return this.generateMockFlights(params);
    }
  }

  async searchHotels(params: HotelSearchParams): Promise<Hotel[]> {
    try {
      const response = await api.get<Hotel[]>('/search/hotels', { params });
      return response.data;
    } catch (error: any) {
      console.warn('Backend hotel search failed, using mock data:', error.message);
      
      // Return mock data as fallback
      return this.generateMockHotels(params);
    }
  }
}

export const searchService = new SearchService();