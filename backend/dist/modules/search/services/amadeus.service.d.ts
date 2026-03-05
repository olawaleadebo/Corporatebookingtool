import { ConfigService } from '@nestjs/config';
import { Logger } from 'winston';
export declare class AmadeusService {
    private configService;
    private readonly logger;
    private amadeus;
    constructor(configService: ConfigService, logger: Logger);
    searchFlights(params: {
        origin: string;
        destination: string;
        departureDate: string;
        returnDate?: string;
        adults: number;
        travelClass?: string;
    }): Promise<{
        id: any;
        airline: any;
        flightNumber: string;
        departure: {
            airport: any;
            city: any;
            time: string;
            date: any;
        };
        arrival: {
            airport: any;
            city: any;
            time: string;
            date: any;
        };
        duration: any;
        stops: number;
        price: number;
        currency: any;
        class: any;
        rawData: any;
    }[]>;
    searchHotels(params: {
        cityCode: string;
        checkInDate: string;
        checkOutDate: string;
        adults: number;
    }): Promise<{
        id: any;
        name: any;
        location: string;
        rating: any;
        price: number;
        currency: any;
        roomType: any;
        checkIn: any;
        checkOut: any;
        rawData: any;
    }[]>;
    getFlightPrice(flightOfferId: string): Promise<any>;
    createFlightOrder(flightOffer: any, travelers: any[]): Promise<any>;
    private transformFlightResults;
    private transformHotelResults;
}
