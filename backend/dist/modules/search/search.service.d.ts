import { Logger } from 'winston';
import { AmadeusService } from './services/amadeus.service';
export declare class SearchService {
    private amadeusService;
    private readonly logger;
    constructor(amadeusService: AmadeusService, logger: Logger);
    searchFlights(params: any): Promise<{
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
    searchHotels(params: any): Promise<{
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
    validateFlightAvailability(flightDetails: any): Promise<boolean>;
    confirmFlightBooking(booking: any): Promise<any>;
}
