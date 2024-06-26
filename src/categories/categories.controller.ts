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
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserActive } from '../users/guards/user-active.guard';
import { AdminRole } from '../users/guards/admin-role.guard';
import { ApiConsumes, ApiParam } from '@nestjs/swagger';

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
  @ApiConsumes('multipart/form-data')
  async createCategory(
    @Body() createCategoryDto: CreateCategoryDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    createCategoryDto.image = image?.filename;
    return await this.categoriesService.createCategory(createCategoryDto);
  }

  @UseGuards(JwtAuthGuard, UserActive, AdminRole)
  @Delete(':id')
  @ApiParam({ name: 'id', description: 'Category ID in ObjectId' })
  async deleteCategory(@Param() params: ParamsDto) {
    return await this.categoriesService.deleteCategory(params.id);
  }
}
