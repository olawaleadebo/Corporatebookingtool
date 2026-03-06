import { Request, Response } from 'express';
import { AmadeusService } from '../services/amadeus.service';
import { cacheService } from '../services/cache.service';
import { logger } from '../utils/logger';
import { generateMockCars } from '../utils/mockData';

export class SearchController {
  private amadeusService: AmadeusService;

  constructor() {
    this.amadeusService = new AmadeusService();
  }

  async searchFlights(req: Request, res: Response): Promise<void> {
    try {
      const {
        origin,
        destination,
        departureDate,
        returnDate,
        adults = 1,
        travelClass,
      } = req.query;

      if (!origin || !destination || !departureDate) {
        res.status(400).json({
          success: false,
          message: 'Missing required parameters: origin, destination, departureDate',
        });
        return;
      }

      logger.info('Flight search request', {
        context: 'SearchController',
        origin,
        destination,
        departureDate,
      });

      // Generate cache key
      const cacheKey = cacheService.generateFlightSearchKey({
        origin: origin as string,
        destination: destination as string,
        departureDate: departureDate as string,
        adults: parseInt(adults as string),
        returnDate: returnDate as string,
      });

      // Try to get from cache, or fetch fresh data
      const flights = await cacheService.getOrSet(
        cacheKey,
        async () => {
          return await this.amadeusService.searchFlights({
            originLocationCode: origin as string,
            destinationLocationCode: destination as string,
            departureDate: departureDate as string,
            adults: parseInt(adults as string),
            returnDate: returnDate as string,
            travelClass: travelClass as string,
          });
        },
        1800 // Cache for 30 minutes
      );

      res.status(200).json({
        success: true,
        message: 'Flights retrieved successfully',
        data: flights,
        count: flights.length,
      });
    } catch (error: any) {
      logger.error('Flight search error', {
        context: 'SearchController',
        error: error.message,
      });
      
      res.status(500).json({
        success: false,
        message: 'Failed to search flights',
        data: [], // Return empty array as fallback
      });
    }
  }

  async searchHotels(req: Request, res: Response): Promise<void> {
    try {
      const { cityCode, checkIn, checkOut, adults = 1 } = req.query;

      if (!cityCode || !checkIn || !checkOut) {
        res.status(400).json({
          success: false,
          message: 'Missing required parameters: cityCode, checkIn, checkOut',
        });
        return;
      }

      logger.info('Hotel search request', {
        context: 'SearchController',
        cityCode,
        checkIn,
        checkOut,
      });

      // Generate cache key
      const cacheKey = cacheService.generateHotelSearchKey({
        cityCode: cityCode as string,
        checkInDate: checkIn as string,
        checkOutDate: checkOut as string,
        adults: parseInt(adults as string),
      });

      // Try to get from cache, or fetch fresh data
      const hotels = await cacheService.getOrSet(
        cacheKey,
        async () => {
          return await this.amadeusService.searchHotels({
            cityCode: cityCode as string,
            checkInDate: checkIn as string,
            checkOutDate: checkOut as string,
            adults: parseInt(adults as string),
          });
        },
        1800 // Cache for 30 minutes
      );

      res.status(200).json({
        success: true,
        message: 'Hotels retrieved successfully',
        data: hotels,
        count: hotels.length,
      });
    } catch (error: any) {
      logger.error('Hotel search error', {
        context: 'SearchController',
        error: error.message,
      });
      
      res.status(500).json({
        success: false,
        message: 'Failed to search hotels',
        data: [], // Return empty array as fallback
      });
    }
  }

  async searchCars(req: Request, res: Response): Promise<void> {
    try {
      const { location, pickupDate, dropoffDate } = req.query;

      if (!location || !pickupDate || !dropoffDate) {
        res.status(400).json({
          success: false,
          message: 'Missing required parameters: location, pickupDate, dropoffDate',
        });
        return;
      }

      logger.info('Car search request', {
        context: 'SearchController',
        location,
        pickupDate,
        dropoffDate,
      });

      // Generate cache key
      const cacheKey = cacheService.generateCarSearchKey({
        pickupLocationCode: location as string,
        pickupDate: pickupDate as string,
        dropOffDate: dropoffDate as string,
      });

      // Try to get from cache, or fetch fresh data
      const cars = await cacheService.getOrSet(
        cacheKey,
        async () => {
          return generateMockCars(
            location as string,
            pickupDate as string,
            dropoffDate as string
          );
        },
        1800 // Cache for 30 minutes
      );

      res.status(200).json({
        success: true,
        message: 'Cars retrieved successfully',
        data: cars,
        count: cars.length,
      });
    } catch (error: any) {
      logger.error('Car search error', {
        context: 'SearchController',
        error: error.message,
      });
      
      res.status(500).json({
        success: false,
        message: 'Failed to search cars',
        data: [], // Return empty array as fallback
      });
    }
  }
}