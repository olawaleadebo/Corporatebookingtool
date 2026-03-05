"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AmadeusService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const nest_winston_1 = require("nest-winston");
const winston_1 = require("winston");
const amadeus_1 = __importDefault(require("amadeus"));
let AmadeusService = class AmadeusService {
    constructor(configService, logger) {
        this.configService = configService;
        this.logger = logger;
        this.amadeus = new amadeus_1.default({
            clientId: this.configService.get('AMADEUS_CLIENT_ID'),
            clientSecret: this.configService.get('AMADEUS_CLIENT_SECRET'),
            hostname: this.configService.get('AMADEUS_HOSTNAME') || 'test',
        });
    }
    async searchFlights(params) {
        try {
            const searchParams = {
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
        }
        catch (error) {
            this.logger.error('Flight search failed', {
                context: 'AmadeusService',
                error: error.message,
                params,
            });
            throw new Error(`Amadeus API error: ${error.message}`);
        }
    }
    async searchHotels(params) {
        try {
            const hotelListResponse = await this.amadeus.referenceData.locations.hotels.byCity.get({
                cityCode: params.cityCode,
            });
            if (!hotelListResponse.data || hotelListResponse.data.length === 0) {
                return [];
            }
            const hotelIds = hotelListResponse.data.slice(0, 10).map((hotel) => hotel.hotelId);
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
        }
        catch (error) {
            this.logger.error('Hotel search failed', {
                context: 'AmadeusService',
                error: error.message,
                params,
            });
            throw new Error(`Amadeus API error: ${error.message}`);
        }
    }
    async getFlightPrice(flightOfferId) {
        try {
            const response = await this.amadeus.shopping.flightOffers.pricing.post(JSON.stringify({
                data: {
                    type: 'flight-offers-pricing',
                    flightOffers: [{ id: flightOfferId }],
                },
            }));
            return response.data;
        }
        catch (error) {
            this.logger.error('Flight pricing failed', {
                context: 'AmadeusService',
                error: error.message,
            });
            throw new Error(`Amadeus API error: ${error.message}`);
        }
    }
    async createFlightOrder(flightOffer, travelers) {
        try {
            const response = await this.amadeus.booking.flightOrders.post(JSON.stringify({
                data: {
                    type: 'flight-order',
                    flightOffers: [flightOffer],
                    travelers,
                },
            }));
            this.logger.info('Flight order created', {
                context: 'AmadeusService',
                orderId: response.data.id,
            });
            return response.data;
        }
        catch (error) {
            this.logger.error('Flight order creation failed', {
                context: 'AmadeusService',
                error: error.message,
            });
            throw new Error(`Amadeus API error: ${error.message}`);
        }
    }
    transformFlightResults(data) {
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
    transformHotelResults(data) {
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
};
exports.AmadeusService = AmadeusService;
exports.AmadeusService = AmadeusService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Inject)(nest_winston_1.WINSTON_MODULE_PROVIDER)),
    __metadata("design:paramtypes", [config_1.ConfigService,
        winston_1.Logger])
], AmadeusService);
//# sourceMappingURL=amadeus.service.js.map