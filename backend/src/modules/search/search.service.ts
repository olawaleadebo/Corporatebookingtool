import { Injectable, Inject } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { AmadeusService } from './services/amadeus.service';

@Injectable()
export class SearchService {
  constructor(
    private amadeusService: AmadeusService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  async searchFlights(params: any) {
    return this.amadeusService.searchFlights(params);
  }

  async searchHotels(params: any) {
    return this.amadeusService.searchHotels(params);
  }

  async validateFlightAvailability(flightDetails: any) {
    // Validate flight still available and price hasn't changed
    // This would involve calling Amadeus flight pricing API
    this.logger.info('Validating flight availability', {
      context: 'SearchService',
      flightDetails,
    });
    
    // For now, return true (implement actual validation)
    return true;
  }

  async confirmFlightBooking(booking: any) {
    // Create flight order with Amadeus
    try {
      const travelers = [
        {
          id: '1',
          dateOfBirth: '1990-01-01',
          name: {
            firstName: booking.user?.firstName || 'Test',
            lastName: booking.user?.lastName || 'User',
          },
          gender: 'MALE',
          contact: {
            emailAddress: booking.user?.email || 'test@example.com',
            phones: [
              {
                deviceType: 'MOBILE',
                countryCallingCode: '234',
                number: '8012345678',
              },
            ],
          },
        },
      ];

      const order = await this.amadeusService.createFlightOrder(
        booking.amadeusData || {},
        travelers,
      );

      this.logger.info('Flight booking confirmed with Amadeus', {
        context: 'SearchService',
        bookingId: booking.id,
        orderId: order.id,
      });

      return {
        pnr: order.associatedRecords?.[0]?.reference || 'MOCK-PNR-123',
        ticketNumber: order.flightOffers?.[0]?.id || 'MOCK-TICKET-123',
        ...order,
      };
    } catch (error) {
      this.logger.error('Flight booking confirmation failed', {
        context: 'SearchService',
        bookingId: booking.id,
        error: error.message,
      });
      throw error;
    }
  }
}
