import Amadeus from 'amadeus';
import { logger } from '../utils/logger';
import { generateMockFlights, generateMockHotels } from '../utils/mockData';

export class AmadeusService {
  private client: Amadeus | null = null;

  constructor() {
    try {
      const clientId = process.env.AMADEUS_CLIENT_ID;
      const clientSecret = process.env.AMADEUS_CLIENT_SECRET;
      const hostname = process.env.AMADEUS_HOSTNAME || 'test';

      if (clientId && clientSecret) {
        this.client = new Amadeus({
          clientId,
          clientSecret,
          hostname: hostname as 'production' | 'test',
        });
        logger.info('Amadeus service initialized', { context: 'AmadeusService' });
      } else {
        logger.warn('Amadeus credentials not provided, will use mock data', {
          context: 'AmadeusService',
        });
      }
    } catch (error: any) {
      logger.error('Failed to initialize Amadeus client', {
        context: 'AmadeusService',
        error: error.message,
      });
    }
  }

  async searchFlights(params: {
    originLocationCode: string;
    destinationLocationCode: string;
    departureDate: string;
    adults: number;
    returnDate?: string;
    travelClass?: string;
  }): Promise<any[]> {
    try {
      if (!this.client) {
        logger.info('Using mock flight data (Amadeus not configured)', {
          context: 'AmadeusService',
        });
        return generateMockFlights(
          params.originLocationCode,
          params.destinationLocationCode,
          params.departureDate
        );
      }

      logger.info('Searching flights with Amadeus', {
        context: 'AmadeusService',
        params,
      });

      const response = await this.client.shopping.flightOffersSearch.get({
        originLocationCode: params.originLocationCode,
        destinationLocationCode: params.destinationLocationCode,
        departureDate: params.departureDate,
        adults: params.adults.toString(),
        ...(params.returnDate && { returnDate: params.returnDate }),
        ...(params.travelClass && { travelClass: params.travelClass }),
        currencyCode: 'NGN',
        max: 50,
      });

      const flights = this.formatFlightOffers(response.data);
      
      logger.info('Flights retrieved successfully', {
        context: 'AmadeusService',
        count: flights.length,
      });

      return flights;
    } catch (error: any) {
      logger.error('Amadeus flight search error, returning mock data', {
        context: 'AmadeusService',
        error: error.message,
        params,
      });
      
      // Return mock data as fallback
      return generateMockFlights(
        params.originLocationCode,
        params.destinationLocationCode,
        params.departureDate
      );
    }
  }

  async searchHotels(params: {
    cityCode: string;
    checkInDate: string;
    checkOutDate: string;
    adults?: number;
  }): Promise<any[]> {
    try {
      if (!this.client) {
        logger.info('Using mock hotel data (Amadeus not configured)', {
          context: 'AmadeusService',
        });
        return generateMockHotels(params.cityCode, params.checkInDate, params.checkOutDate);
      }

      logger.info('Searching hotels with Amadeus', {
        context: 'AmadeusService',
        params,
      });

      // First get hotel IDs by city
      const hotelListResponse = await this.client.referenceData.locations.hotels.byCity.get({
        cityCode: params.cityCode,
      });

      if (!hotelListResponse.data || hotelListResponse.data.length === 0) {
        logger.warn('No hotels found for city, using mock data', {
          context: 'AmadeusService',
          cityCode: params.cityCode,
        });
        return generateMockHotels(params.cityCode, params.checkInDate, params.checkOutDate);
      }

      // Get hotel offers
      const hotelIds = hotelListResponse.data.slice(0, 20).map((h: any) => h.hotelId).join(',');
      const offerResponse = await this.client.shopping.hotelOffersSearch.get({
        hotelIds,
        checkInDate: params.checkInDate,
        checkOutDate: params.checkOutDate,
        adults: (params.adults || 1).toString(),
        currency: 'NGN',
      });

      const hotels = this.formatHotelOffers(offerResponse.data);
      
      logger.info('Hotels retrieved successfully', {
        context: 'AmadeusService',
        count: hotels.length,
      });

      return hotels;
    } catch (error: any) {
      logger.error('Amadeus hotel search error, returning mock data', {
        context: 'AmadeusService',
        error: error.message,
        params,
      });
      
      // Return mock data as fallback
      return generateMockHotels(params.cityCode, params.checkInDate, params.checkOutDate);
    }
  }

  async createFlightOrder(flightOffer: any, travelers: any[]): Promise<any> {
    try {
      if (!this.client) {
        logger.info('Mock flight order created (Amadeus not configured)', {
          context: 'AmadeusService',
        });
        return {
          id: `MOCK-ORDER-${Date.now()}`,
          associatedRecords: [{ reference: `MOCK-PNR-${Date.now()}` }],
          flightOffers: [{ id: `MOCK-TICKET-${Date.now()}` }],
        };
      }

      const response = await this.client.booking.flightOrders.post(
        JSON.stringify({
          data: {
            type: 'flight-order',
            flightOffers: [flightOffer],
            travelers,
          },
        })
      );

      logger.info('Flight order created successfully', {
        context: 'AmadeusService',
        orderId: response.data.id,
      });

      return response.data;
    } catch (error: any) {
      logger.error('Failed to create flight order', {
        context: 'AmadeusService',
        error: error.message,
      });
      throw error;
    }
  }

  private formatFlightOffers(offers: any[]): any[] {
    return offers.map((offer) => {
      const segment = offer.itineraries[0].segments[0];
      const lastSegment = offer.itineraries[0].segments[offer.itineraries[0].segments.length - 1];
      
      return {
        id: offer.id,
        airline: segment.carrierCode,
        flightNumber: `${segment.carrierCode}${segment.number}`,
        departure: {
          airport: segment.departure.iataCode,
          city: segment.departure.iataCode,
          date: segment.departure.at.split('T')[0],
          time: segment.departure.at.split('T')[1].substring(0, 5),
        },
        arrival: {
          airport: lastSegment.arrival.iataCode,
          city: lastSegment.arrival.iataCode,
          date: lastSegment.arrival.at.split('T')[0],
          time: lastSegment.arrival.at.split('T')[1].substring(0, 5),
        },
        duration: offer.itineraries[0].duration,
        cabin: offer.travelerPricings[0].fareDetailsBySegment[0].cabin,
        price: parseFloat(offer.price.total),
        currency: offer.price.currency,
        available: true,
        stops: offer.itineraries[0].segments.length - 1,
        amadeusData: offer,
      };
    });
  }

  private formatHotelOffers(offers: any[]): any[] {
    return offers.flatMap((hotel) =>
      hotel.offers.map((offer: any) => ({
        id: offer.id,
        name: hotel.hotel.name,
        location: hotel.hotel.cityCode,
        rating: hotel.hotel.rating || 4,
        roomType: offer.room.typeEstimated.category || 'Standard',
        checkIn: offer.checkInDate,
        checkOut: offer.checkOutDate,
        price: parseFloat(offer.price.total),
        currency: offer.price.currency,
        amenities: hotel.hotel.amenities || [],
        available: true,
        amadeusData: offer,
      }))
    );
  }
}
