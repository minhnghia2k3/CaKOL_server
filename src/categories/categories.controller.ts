import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { Categories } from './schemas/categories.schema';
import { CreateCategoryDto } from './dto/create-category.dto';
import { ParamsDto } from './dto/params.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from './multer-options';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UserActive } from 'src/users/guards/user-active.guard';
import { AdminRole } from 'src/users/guards/admin-role.guard';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  async getCategories(): Promise<Categories[]> {
    return await this.categoriesService.getCategories();
  }

  @UseGuards(JwtAuthGuard, UserActive, AdminRole)
  @Post()
  @UseInterceptors(FileInterceptor('image', multerOptions))
  async createCategory(
    @Body() createCategoryDto: CreateCategoryDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    createCategoryDto.image = image?.filename;
    return await this.categoriesService.createCategory(createCategoryDto);
  }

  @UseGuards(JwtAuthGuard, UserActive, AdminRole)
  @Delete(':id')
  async deleteCategory(@Param() params: ParamsDto) {
    return await this.categoriesService.deleteCategory(params.id);
  }
}
