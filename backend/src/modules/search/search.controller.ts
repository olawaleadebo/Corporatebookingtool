import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { SearchService } from './search.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('search')
@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get('health')
  @ApiOperation({ summary: 'Health check for search service' })
  @ApiResponse({ status: 200, description: 'Returns service status' })
  getHealth() {
    return {
      status: 'ok',
      service: 'search',
      timestamp: new Date().toISOString(),
    };
  }

  @Get('flights')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Search for flights' })
  @ApiResponse({ status: 200, description: 'Returns flight search results' })
  @ApiQuery({ name: 'origin', required: true, example: 'LOS' })
  @ApiQuery({ name: 'destination', required: true, example: 'LHR' })
  @ApiQuery({ name: 'departureDate', required: true, example: '2026-04-15' })
  @ApiQuery({ name: 'returnDate', required: false, example: '2026-04-22' })
  @ApiQuery({ name: 'adults', required: false, example: 1 })
  @ApiQuery({ name: 'travelClass', required: false, example: 'ECONOMY' })
  async searchFlights(
    @Query('origin') origin: string,
    @Query('destination') destination: string,
    @Query('departureDate') departureDate: string,
    @Query('returnDate') returnDate?: string,
    @Query('adults') adults: number = 1,
    @Query('travelClass') travelClass?: string,
  ) {
    return await this.searchService.searchFlights({
      origin,
      destination,
      departureDate,
      returnDate,
      adults: Number(adults),
      travelClass,
    });
  }

  @Get('hotels')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Search for hotels' })
  @ApiResponse({ status: 200, description: 'Returns hotel search results' })
  @ApiQuery({ name: 'cityCode', required: true, example: 'LON' })
  @ApiQuery({ name: 'checkInDate', required: true, example: '2026-04-15' })
  @ApiQuery({ name: 'checkOutDate', required: true, example: '2026-04-22' })
  @ApiQuery({ name: 'adults', required: false, example: 1 })
  async searchHotels(
    @Query('cityCode') cityCode: string,
    @Query('checkInDate') checkInDate: string,
    @Query('checkOutDate') checkOutDate: string,
    @Query('adults') adults: number = 1,
  ) {
    return await this.searchService.searchHotels({
      cityCode,
      checkInDate,
      checkOutDate,
      adults: Number(adults),
    });
  }
}