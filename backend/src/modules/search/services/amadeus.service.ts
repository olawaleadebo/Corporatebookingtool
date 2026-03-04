import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import Amadeus from 'amadeus';

@Injectable()
export class AmadeusService {
  private amadeus: Amadeus;

  constructor(
    private configService: ConfigService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {
    this.amadeus = new Amadeus({
      clientId: this.configService.get('AMADEUS_CLIENT_ID'),
      clientSecret: this.configService.get('AMADEUS_CLIENT_SECRET'),
      hostname: this.configService.get('AMADEUS_HOSTNAME') || 'test',
    });
  }

  async searchFlights(params: {
    origin: string;
    destination: string;
    departureDate: string;
    returnDate?: string;
    adults: number;
    travelClass?: string;
  }) {
    try {
      const searchParams: any = {
        originLocationCode: params.origin,
        destinationLocationCode: params.destination,
        departureDate: params.departureDate,
        adults: params.adults,
        max: 10,
      };

      if (params.returnDate) {
        searchParams.returnDate = params.returnDate;
      }

      if (params.travelClass) {
        searchParams.travelClass = params.travelClass.toUpperCase();
      }

      const response = await this.amadeus.shopping.flightOffersSearch.get(searchParams);

      this.logger.info('Flight search completed', {
        context: 'AmadeusService',
        origin: params.origin,
        destination: params.destination,
        results: response.data.length,
      });

      return this.transformFlightResults(response.data);
    } catch (error) {
      this.logger.error('Flight search failed', {
        context: 'AmadeusService',
        error: error.message,
        params,
      });
      throw new Error(`Amadeus API error: ${error.message}`);
    }
  }

  async searchHotels(params: {
    cityCode: string;
    checkInDate: string;
    checkOutDate: string;
    adults: number;
  }) {
    try {
      // First, get hotel list by city
      const hotelListResponse = await this.amadeus.referenceData.locations.hotels.byCity.get({
        cityCode: params.cityCode,
      });

      if (!hotelListResponse.data || hotelListResponse.data.length === 0) {
        return [];
      }

      // Get hotel IDs (limit to first 10)
      const hotelIds = hotelListResponse.data.slice(0, 10).map((hotel: any) => hotel.hotelId);

      // Search for hotel offers
      const offersResponse = await this.amadeus.shopping.hotelOffersSearch.get({
        hotelIds: hotelIds.join(','),
        checkInDate: params.checkInDate,
        checkOutDate: params.checkOutDate,
        adults: params.adults,
      });

      this.logger.info('Hotel search completed', {
        context: 'AmadeusService',
        cityCode: params.cityCode,
        results: offersResponse.data.length,
      });

      return this.transformHotelResults(offersResponse.data);
    } catch (error) {
      this.logger.error('Hotel search failed', {
        context: 'AmadeusService',
        error: error.message,
        params,
      });
      throw new Error(`Amadeus API error: ${error.message}`);
    }
  }

  async getFlightPrice(flightOfferId: string) {
    try {
      const response = await this.amadeus.shopping.flightOffers.pricing.post(
        JSON.stringify({
          data: {
            type: 'flight-offers-pricing',
            flightOffers: [{ id: flightOfferId }],
          },
        }),
      );

      return response.data;
    } catch (error) {
      this.logger.error('Flight pricing failed', {
        context: 'AmadeusService',
        error: error.message,
      });
      throw new Error(`Amadeus API error: ${error.message}`);
    }
  }

  async createFlightOrder(flightOffer: any, travelers: any[]) {
    try {
      const response = await this.amadeus.booking.flightOrders.post(
        JSON.stringify({
          data: {
            type: 'flight-order',
            flightOffers: [flightOffer],
            travelers,
          },
        }),
      );

      this.logger.info('Flight order created', {
        context: 'AmadeusService',
        orderId: response.data.id,
      });

      return response.data;
    } catch (error) {
      this.logger.error('Flight order creation failed', {
        context: 'AmadeusService',
        error: error.message,
      });
      throw new Error(`Amadeus API error: ${error.message}`);
    }
  }

  private transformFlightResults(data: any[]) {
    return data.map((offer) => {
      const itinerary = offer.itineraries[0];
      const segment = itinerary.segments[0];
      const lastSegment = itinerary.segments[itinerary.segments.length - 1];

      return {
        id: offer.id,
        airline: segment.carrierCode,
        flightNumber: `${segment.carrierCode}${segment.number}`,
        departure: {
          airport: segment.departure.iataCode,
          city: segment.departure.iataCode,
          time: new Date(segment.departure.at).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
          }),
          date: segment.departure.at.split('T')[0],
        },
        arrival: {
          airport: lastSegment.arrival.iataCode,
          city: lastSegment.arrival.iataCode,
          time: new Date(lastSegment.arrival.at).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
          }),
          date: lastSegment.arrival.at.split('T')[0],
        },
        duration: itinerary.duration,
        stops: itinerary.segments.length - 1,
        price: parseFloat(offer.price.total),
        currency: offer.price.currency,
        class: offer.travelerPricings[0].fareDetailsBySegment[0].cabin,
        rawData: offer,
      };
    });
  }

  private transformHotelResults(data: any[]) {
    return data.map((hotel) => {
      const offer = hotel.offers[0];
      
      return {
        id: hotel.hotel.hotelId,
        name: hotel.hotel.name,
        location: `${hotel.hotel.cityCode}, ${hotel.hotel.countryCode}`,
        rating: hotel.hotel.rating || 0,
        price: parseFloat(offer.price.total),
        currency: offer.price.currency,
        roomType: offer.room.typeEstimated.category,
        checkIn: offer.checkInDate,
        checkOut: offer.checkOutDate,
        rawData: hotel,
      };
    });
  }
}
