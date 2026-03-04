import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ApproveBookingDto {
  @ApiProperty({ description: 'Name of approver' })
  @IsString()
  approverName: string;
}
