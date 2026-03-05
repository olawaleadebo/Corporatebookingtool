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
exports.SearchController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const search_service_1 = require("./search.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let SearchController = class SearchController {
    constructor(searchService) {
        this.searchService = searchService;
    }
    searchFlights(origin, destination, departureDate, returnDate, adults = 1, travelClass) {
        return this.searchService.searchFlights({
            origin,
            destination,
            departureDate,
            returnDate,
            adults: Number(adults),
            travelClass,
        });
    }
    searchHotels(cityCode, checkInDate, checkOutDate, adults = 1) {
        return this.searchService.searchHotels({
            cityCode,
            checkInDate,
            checkOutDate,
            adults: Number(adults),
        });
    }
};
exports.SearchController = SearchController;
__decorate([
    (0, common_1.Get)('flights'),
    (0, swagger_1.ApiOperation)({ summary: 'Search for flights' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns flight search results' }),
    (0, swagger_1.ApiQuery)({ name: 'origin', required: true, example: 'LOS' }),
    (0, swagger_1.ApiQuery)({ name: 'destination', required: true, example: 'LHR' }),
    (0, swagger_1.ApiQuery)({ name: 'departureDate', required: true, example: '2026-04-15' }),
    (0, swagger_1.ApiQuery)({ name: 'returnDate', required: false, example: '2026-04-22' }),
    (0, swagger_1.ApiQuery)({ name: 'adults', required: false, example: 1 }),
    (0, swagger_1.ApiQuery)({ name: 'travelClass', required: false, example: 'ECONOMY' }),
    __param(0, (0, common_1.Query)('origin')),
    __param(1, (0, common_1.Query)('destination')),
    __param(2, (0, common_1.Query)('departureDate')),
    __param(3, (0, common_1.Query)('returnDate')),
    __param(4, (0, common_1.Query)('adults')),
    __param(5, (0, common_1.Query)('travelClass')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, Number, String]),
    __metadata("design:returntype", void 0)
], SearchController.prototype, "searchFlights", null);
__decorate([
    (0, common_1.Get)('hotels'),
    (0, swagger_1.ApiOperation)({ summary: 'Search for hotels' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns hotel search results' }),
    (0, swagger_1.ApiQuery)({ name: 'cityCode', required: true, example: 'LON' }),
    (0, swagger_1.ApiQuery)({ name: 'checkInDate', required: true, example: '2026-04-15' }),
    (0, swagger_1.ApiQuery)({ name: 'checkOutDate', required: true, example: '2026-04-22' }),
    (0, swagger_1.ApiQuery)({ name: 'adults', required: false, example: 1 }),
    __param(0, (0, common_1.Query)('cityCode')),
    __param(1, (0, common_1.Query)('checkInDate')),
    __param(2, (0, common_1.Query)('checkOutDate')),
    __param(3, (0, common_1.Query)('adults')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Number]),
    __metadata("design:returntype", void 0)
], SearchController.prototype, "searchHotels", null);
exports.SearchController = SearchController = __decorate([
    (0, swagger_1.ApiTags)('search'),
    (0, common_1.Controller)('search'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [search_service_1.SearchService])
], SearchController);
//# sourceMappingURL=search.controller.js.map