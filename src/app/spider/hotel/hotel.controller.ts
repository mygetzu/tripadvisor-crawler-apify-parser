import {
  Controller,
  Post,
  Body,
  Get,
  HttpService,
  Res,
  Param,
} from '@nestjs/common';
import { HotelService } from './hotel.service';
import { CreateHotelDto } from './dto/create-hotel.dto';
import { ApiService } from '../api/api.service';
import { URL_HOTELS_BY_LOCATION } from '../../utils/constants';

@Controller('api/v1/spider/hotel')
export class HotelController {
  constructor(
    private readonly service: HotelService,
    private readonly apiService: ApiService,
  ) {}

  @Post()
  async create(@Body() dto: CreateHotelDto) {
    this.service.create(dto);
  }

  @Get()
  async getHotel() {
    const url = URL_HOTELS_BY_LOCATION + '12853007' + '/hotels';
    // return await this.apiService.grabHotelByLocation(url, '12853007');
  }

  @Get('/:id')
  async getHotelId(@Param('id') id: string) {
    const data = await this.service.getHotelByLocHotelID(id);
    return data;
  }
}
