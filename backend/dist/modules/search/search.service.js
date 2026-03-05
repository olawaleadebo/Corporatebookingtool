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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchService = void 0;
const common_1 = require("@nestjs/common");
const nest_winston_1 = require("nest-winston");
const winston_1 = require("winston");
const amadeus_service_1 = require("./services/amadeus.service");
let SearchService = class SearchService {
    constructor(amadeusService, logger) {
        this.amadeusService = amadeusService;
        this.logger = logger;
    }
    async searchFlights(params) {
        return this.amadeusService.searchFlights(params);
    }
    async searchHotels(params) {
        return this.amadeusService.searchHotels(params);
    }
    async validateFlightAvailability(flightDetails) {
        this.logger.info('Validating flight availability', {
            context: 'SearchService',
            flightDetails,
        });
        return true;
    }
    async confirmFlightBooking(booking) {
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
            const order = await this.amadeusService.createFlightOrder(booking.amadeusData || {}, travelers);
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
        }
        catch (error) {
            this.logger.error('Flight booking confirmation failed', {
                context: 'SearchService',
                bookingId: booking.id,
                error: error.message,
            });
            throw error;
        }
    }
};
exports.SearchService = SearchService;
exports.SearchService = SearchService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Inject)(nest_winston_1.WINSTON_MODULE_PROVIDER)),
    __metadata("design:paramtypes", [amadeus_service_1.AmadeusService,
        winston_1.Logger])
], SearchService);
//# sourceMappingURL=search.service.js.map