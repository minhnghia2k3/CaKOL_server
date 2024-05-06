import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Categories } from './schemas/categories.schema';
import { FilterQuery, Model } from 'mongoose';
import { CreateCategoryDto } from './dto/create-category.dto';
import { PathLike, unlink } from 'fs';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Categories.name) private categoriesModel: Model<Categories>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  private removeImage(path: PathLike): void {
    unlink(path, (err) => {
      if (err) throw err;
      console.log(`${path} was deleted`);
    });
  }

  async getCategories(): Promise<Categories[]> {
    const result = await this.categoriesModel.find({});
    await this.cacheManager.set('allCategories', result);
    return result;
  }

  async getCategory(filter: FilterQuery<Categories>): Promise<Categories> {
    const category = await this.categoriesModel.findOne(filter);
    // if (!category)
    //   throw new NotFoundException('Not found by Categories request.');
    return category;
  }

  async createCategory(
    createCategoryDto: CreateCategoryDto,
  ): Promise<Categories> {
    const isCategoryExist = await this.categoriesModel.findOne({
      slug: createCategoryDto.slug,
    });
    if (isCategoryExist) {
      throw new ConflictException(
        `There is already has category with name "${createCategoryDto.slug}"`,
      );
    }
    return await this.categoriesModel.create(createCategoryDto);
  }

  async deleteCategory(categoryId: string) {
    const deletedCategory =
      await this.categoriesModel.findByIdAndDelete(categoryId);
    if (deletedCategory?.image) {
      const imagePath = `uploads/categories/${deletedCategory.image}`;
      this.removeImage(imagePath);
    }
    if (!deletedCategory) {
      throw new NotFoundException(`Not found category by id.`);
    }
    return deletedCategory;
  }
}
