import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { OfficeHours } from '../office-hours/schemas/officeHours.schema';
import { CreateOfficeHoursDto } from './dto/create-office-hours.dto';
import { KolsService, builtListResponse } from 'src/kols/kols.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class OfficeHoursService {
  constructor(
    @InjectModel(OfficeHours.name)
    private readonly officeHoursModel: Model<OfficeHours>,
    private readonly kolsService: KolsService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async findById(officeHoursId: string): Promise<OfficeHours> {
    return await this.officeHoursModel.findById(officeHoursId);
  }

  /**
   * Create new office hour and sign to relative kol.
   * @param officeHoursDto
   * @returns
   */
  async create(officeHoursDto: CreateOfficeHoursDto) {
    const officeHour = await this.officeHoursModel.create(officeHoursDto);

    const kol = await this.kolsService.getKOL(officeHoursDto.kol);
    if (!kol)
      throw new NotFoundException(`Not found kol id: ${officeHoursDto.kol}`);
    if (!kol.office_hours) {
      kol.office_hours = officeHour._id;
    }
    kol.office_hours.push(officeHour._id);
    await kol.save();

    return officeHour;
  }

  async builtListResponse(
    ohs: OfficeHours[],
    unit: number,
    currentPage: number,
    totalPage: number,
  ) {
    return {
      info: {
        unit: unit,
        currentPage: currentPage,
        totalPage: totalPage,
      },
      data: [...ohs],
    };
  }

  /**
   * List all office hours
   * @returns
   */
  async listOfficeHours({
    kolName,
    limit = 10,
    page = 1,
  }: {
    kolName?: string;
    limit?: number;
    page?: number;
  }): Promise<builtListResponse> {
    const skipUnit = page === 0 ? 0 : Math.ceil(page - 1) * limit;
    const ohs = await this.officeHoursModel
      .find({})
      .limit(limit)
      .skip(skipUnit)
      .populate({
        path: 'kol',
        select: 'name images',
      })
      .sort({ appointmentDate: -1 });

    const totalUnits = await this.officeHoursModel.countDocuments();
    const totalPage = Math.ceil(totalUnits / limit);
    const result = this.builtListResponse(ohs, ohs.length, page, totalPage);
    await this.cacheManager.set('allOhs', result);
    return result;
  }

  /**
   * Delete specific office hour by id
   * @param id
   * @returns
   */
  async delete(id: string) {
    const officeHour = await this.officeHoursModel.findOneAndDelete({
      _id: id,
    });
    if (!officeHour) {
      throw new NotFoundException(`Not found office hour id: ${id}`);
    }

    this.removeOfficeHourFromKOL(officeHour.kol, officeHour._id);

    return officeHour;
  }

  private async removeOfficeHourFromKOL(kolId: string, officeHourId: string) {
    const kol = await this.kolsService.getKOL(kolId);
    if (!kol) {
      throw new NotFoundException(`KOL not found with id: ${kolId}`);
    }

    // Remove the specific office hour ID from the array
    kol.office_hours = kol.office_hours.filter(
      (oh) => oh.toString() !== officeHourId,
    );
    await kol.save();
  }
}
