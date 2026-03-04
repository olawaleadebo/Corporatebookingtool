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
  async searchFlights(params: FlightSearchParams): Promise<Flight[]> {
    const response = await api.get<Flight[]>('/search/flights', { params });
    return response.data;
  }

  async searchHotels(params: HotelSearchParams): Promise<Hotel[]> {
    const response = await api.get<Hotel[]>('/search/hotels', { params });
    return response.data;
  }
}

export const searchService = new SearchService();
