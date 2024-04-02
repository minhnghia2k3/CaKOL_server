import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { KOLs } from './schemas/kols.schema';
import { FilterQuery, Model } from 'mongoose';
import { UpdateKOLDto } from './dto/request/update-kol.dto';
import { CreateKOLDto } from './dto/request/create-kol.dto';
import { GetKOLsQueryDto } from './dto/request/get-kols-query.dto';
import { CategoriesService } from '../categories/categories.service';

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
  constructor(
    @InjectModel(KOLs.name) private kolsModel: Model<KOLs>,
    private readonly categoriesService: CategoriesService,
  ) {}

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
    query,
    limit = 10,
    page = 1,
  }: {
    query?: GetKOLsQueryDto;
    limit?: number;
    page?: number;
  }): Promise<builtListResponse> {
    const userQuery: FilterQuery<KOLs> = { active: { $ne: false } };

    if (query.name) {
      userQuery.name = { $regex: new RegExp(query.name, 'iu') };
    }

    if (query.location)
      userQuery.location = { $regex: new RegExp(query.location, 'iu') };

    if (query.slug) {
      const category = await this.categoriesService.getCategory({
        slug: { $regex: new RegExp(query.slug, 'i') },
      });
      userQuery.categories = category._id;
    }

    const skipUnit = page === 0 ? 0 : Math.ceil(page - 1) * limit;
    const totalUnits = await this.kolsModel.countDocuments(userQuery);
    const kols = await this.kolsModel
      .find({ ...userQuery })
      .skip(skipUnit)
      .limit(limit)
      .populate('categories')
      .sort({ createdAt: -1 });

    const totalPage = Math.ceil(totalUnits / limit);

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
