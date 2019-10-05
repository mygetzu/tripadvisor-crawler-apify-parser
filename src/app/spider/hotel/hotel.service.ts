import {
  Injectable,
  Inject,
  HttpService,
  BadRequestException,
} from '@nestjs/common';
import { CreateHotelDto } from './dto/create-hotel.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Hotel } from './hotel.entity';
import { Repository } from 'typeorm';
import { IHotel } from './interfaces/hotel.interface';
import { Location } from '../location/location.entity';
import { ApiService } from '../api/api.service';
import { URL_HOTELS_BY_LOCATION } from '../../utils/constants';

@Injectable()
export class HotelService {
  constructor(
    private readonly apiService: ApiService,
    @InjectRepository(Hotel) private readonly repo: Repository<Hotel>,
  ) {}

  async create(dto: CreateHotelDto): Promise<Hotel> {
    try {
      const save = await this.repo.save(dto);

      if (save) {
        console.log('Saved ! Hotel ' + dto.location_id + ' - ' + dto.name);
        return save;
      }
    } catch (error) {
      console.log('Failed to save hotel with loc hotel id: ' + dto.location_id);
      console.log(error + '\n');
      throw new BadRequestException('Failed to save data !');
    }
  }

  async getAllHotel(): Promise<Hotel[]> {
    try {
      return await this.repo.find();
    } catch (error) {
      throw new BadRequestException('Failed to get data hotel !');
    }
  }

  async getHotelByID(id: string): Promise<Hotel> {
    try {
      return await this.repo.findOne({ where: { location_id: id } });
    } catch (error) {
      throw new BadRequestException('Failed to get data hotel !');
    }
  }

  async createMany(loc: Location): Promise<any> {
    const locationID = loc.location_id;
    let url = URL_HOTELS_BY_LOCATION + locationID + '/hotels';
    let next = false;

    do {
      try {
        let response = await this.apiService.grabHotelByLocation(
          url,
          loc.location_id,
        );
        const hotels = response.data;
        const paging = response.paging;

        await Promise.all(
          hotels.map(async hotel => {
            const hotelCreate = { ...hotel, locationID };
            await this.create(hotelCreate);
          }),
        );

        if (paging.next != null) {
          next = true;
          url = paging.next;
        } else next = false;
      } catch (error) {
        console.log('Failed to save hotel from location ID : ' + locationID);
        console.log(error + '\n');
        break;
      }
    } while (next);
  }
}