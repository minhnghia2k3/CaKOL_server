import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { Categories } from './schemas/categories.schema';
import { CreateCategoryDto } from './dto/create-category.dto';
import { ParamsDto } from './dto/params.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from './multer-options';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  async getCategories(): Promise<Categories[]> {
    return await this.categoriesService.getCategories();
  }

  @Post()
  @UseInterceptors(FileInterceptor('image', multerOptions))
  async createCategory(
    @Body() createCategoryDto: CreateCategoryDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    createCategoryDto.image = image?.filename;
    return await this.categoriesService.createCategory(createCategoryDto);
  }

  @Delete(':id')
  async deleteCategory(@Param() params: ParamsDto) {
    return await this.categoriesService.deleteCategory(params.id);
  }
}
