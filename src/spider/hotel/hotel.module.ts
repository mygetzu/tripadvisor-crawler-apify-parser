import { Module, HttpService, HttpModule } from '@nestjs/common';
import { HotelService } from './hotel.service';
import { HotelController } from './hotel.controller';
import { LocationService } from '../location/location.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Location } from '../location/location.entity';
import { Hotel } from './hotel.entity';
import { ApiService } from '../api/api.service';

@Module({
  providers: [
    HotelService,
    ApiService,

    // ...hotelProviders
  ],
  controllers: [HotelController],
  imports: [
    HttpModule.register({
      timeout: 18000,
      maxRedirects: 5,
    }),
    TypeOrmModule.forFeature([Hotel]),
  ],
  exports: [HotelService, ApiService],
})
export class HotelModule {}
