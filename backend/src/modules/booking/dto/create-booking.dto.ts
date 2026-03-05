import { IsString, IsNumber, IsOptional, IsObject, Min, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { BookingType } from '../entities/booking.entity';

export class CreateBookingDto {
  // @ApiProperty({ description: 'Booking type', example: 'combined' })
  // @IsString()
  // type: string;
  @IsEnum(BookingType)
  @ApiProperty({
    description: 'Booking type',
    enum: BookingType,
    example: BookingType.COMBINED,
  })
  type: BookingType;

  @ApiProperty({ description: 'Flight details' })
  @IsOptional()
  @IsObject()
  flightDetails?: any;

  @ApiProperty({ description: 'Hotel details' })
  @IsOptional()
  @IsObject()
  hotelDetails?: any;

  @ApiProperty({ description: 'Car rental details' })
  @IsOptional()
  @IsObject()
  carDetails?: any;

  @ApiProperty({ description: 'Flight price in Naira', example: 125000 })
  @IsNumber()
  @Min(0)
  flightPrice: number;

  @ApiProperty({ description: 'Hotel price in Naira', example: 85000 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  hotelPrice?: number;

  @ApiProperty({ description: 'Car rental price in Naira', example: 35000 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  carPrice?: number;

  @ApiProperty({ description: 'Business justification for trip' })
  @IsString()
  justification: string;

  @ApiProperty({ description: 'Cost center code', required: false })
  @IsOptional()
  @IsString()
  costCenter?: string;

  @ApiProperty({ description: 'Project code', required: false })
  @IsOptional()
  @IsString()
  projectCode?: string;
}
