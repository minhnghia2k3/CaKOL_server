import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Categories } from './schemas/categories.schema';
import { Model } from 'mongoose';
import { CreateCategoryDto } from './dto/create-category.dto';
import { PathLike, unlink } from 'fs';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Categories.name) private categoriesModel: Model<Categories>,
  ) {}

  private removeImage(path: PathLike): void {
    unlink(path, (err) => {
      if (err) throw err;
      console.log(`${path} was deleted`);
    });
  }

  async getCategories(): Promise<Categories[]> {
    return await this.categoriesModel.find({});
  }

  async createCategory(
    createCategoryDto: CreateCategoryDto,
  ): Promise<Categories> {
    const isCategoryExist = await this.categoriesModel.findOne({
      name: createCategoryDto.name,
    });
    console.log('exist: ', isCategoryExist);
    if (isCategoryExist) {
      throw new ConflictException(
        `There is already has category with name "${createCategoryDto.name}"`,
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
