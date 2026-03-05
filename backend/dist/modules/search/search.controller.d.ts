import { SearchService } from './search.service';
export declare class SearchController {
    private readonly searchService;
    constructor(searchService: SearchService);
    searchFlights(origin: string, destination: string, departureDate: string, returnDate?: string, adults?: number, travelClass?: string): Promise<{
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
    searchHotels(cityCode: string, checkInDate: string, checkOutDate: string, adults?: number): Promise<{
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
}
