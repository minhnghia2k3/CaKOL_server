import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { KOLs } from './schemas/kols.schema';
import { FilterQuery, Model } from 'mongoose';
import { UpdateKOLDto } from './dto/request/update-kol.dto';
import { CreateKOLDto } from './dto/request/create-kol.dto';

export type builtListResponse = {
  info: {
    unit: number;
    currentPage: number;
    totalPage: number;
  };
  data: any;
};
@Injectable()
export class KolsService {
  constructor(@InjectModel(KOLs.name) private kolsModel: Model<KOLs>) {}

  async builtListResponse(
    kol: KOLs[],
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
      data: [...kol],
    };
  }

  async getAllKOLs({
    filter,
    limit = 10,
    page = 1,
  }: {
    filter?: FilterQuery<KOLs>;
    limit?: number;
    page?: number;
  }): Promise<builtListResponse> {
    const skipUnit = page === 0 ? 0 : Math.ceil(page - 1) * limit;
    const totalUnit = await this.kolsModel.countDocuments();
    const kols = await this.kolsModel
      .find({ ...filter, active: { $ne: false } })
      .skip(skipUnit)
      .limit(limit)
      .populate('categories')
      .sort({ createdAt: -1 });
    const totalPage = kols.length === 0 ? 0 : Math.ceil(totalUnit / limit);

    return this.builtListResponse(
      kols,
      kols.length,
      page === 0 ? 1 : page,
      totalPage,
    );
  }

  async getKOL(kolId: string): Promise<KOLs> {
    return await this.kolsModel.findById(kolId);
  }

  async createKOL(createKOLDto: CreateKOLDto): Promise<KOLs> {
    return await this.kolsModel.create(createKOLDto);
  }

  async updateKOL(kolId: string, updateKOLDto: UpdateKOLDto): Promise<KOLs> {
    //TODO: handle update images
    const kol = await this.kolsModel.findByIdAndUpdate(kolId, updateKOLDto, {
      new: true,
    });
    if (!kol) {
      throw new NotFoundException('Not found KOL by id.');
    }
    return kol;
  }
  async deleteKOL(kolId: string): Promise<KOLs> {
    const kol = await this.kolsModel.findByIdAndUpdate(
      kolId,
      { active: false },
      { new: true },
    );
    if (!kol) {
      throw new NotFoundException('Not found KOL by id.');
    }
    return kol;
  }
}
