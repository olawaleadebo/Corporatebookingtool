import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';
import { AmadeusService } from './services/amadeus.service';

@Module({
  imports: [ConfigModule],
  controllers: [SearchController],
  providers: [SearchService, AmadeusService],
  exports: [SearchService],
})
export class SearchModule {}
