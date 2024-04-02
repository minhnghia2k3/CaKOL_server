import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFiles,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { KolsService, builtListResponse } from './kols.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserActive } from '../users/guards/user-active.guard';
import { KOLs } from './schemas/kols.schema';
import { CreateKOLDto } from './dto/request/create-kol.dto';
import { UpdateKOLDto } from './dto/request/update-kol.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { multerOptions } from './multer-options';
import { KOLIdDto } from './dto/request/kol-id.dto';
import { GetKOLsQueryDto } from './dto/request/get-kols-query.dto';
import { AdminRole } from '../users/guards/admin-role.guard';
import { DeleteFileOnErrorFilter } from './filter/delete-file-on-error.filter';
import { ApiConsumes, ApiParam } from '@nestjs/swagger';

@Controller('kols')
export class KolsController {
  constructor(private readonly kolsService: KolsService) {}

  /**
   * Format images into body payload
   * @param body
   * @param images
   * @returns KOLs
   */
  private formatData(body: UpdateKOLDto, images?: Express.Multer.File[]) {
    const result = { ...body };

    // Assign images.
    const files = JSON.parse(JSON.stringify(images));
    if (files.images && files.images.length > 0) {
      result.images = files.images.map((image) => image.filename);
    }

    return result;
  }

  /**
   * Get all KOLs
   * @param query
   * @returns List of KOLs
   */
  @Get()
  async getKOLs(@Query() query: GetKOLsQueryDto): Promise<builtListResponse> {
    return await this.kolsService.getAllKOLs({
      query: query,
      limit: query.limit,
      page: query.page,
    });
  }

  /**
   * Get KOL by id.
   * @param params
   * @returns KOL
   */
  @Get(':id')
  @ApiParam({ name: 'id', description: 'KOL ID in ObjectId' })
  async getKOL(@Param() params: KOLIdDto): Promise<KOLs> {
    return await this.kolsService.getKOL(params.id);
  }

  /**
   * Create a new KOL
   * @param createKOLDto
   * @param images
   * @returns KOL
   */
  @UseGuards(JwtAuthGuard, UserActive, AdminRole)
  @Post()
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'images', maxCount: 5 }], multerOptions),
  )
  @UseFilters(DeleteFileOnErrorFilter)
  @ApiConsumes('multipart/form-data')
  async createKOL(
    @Body() createKOLDto: CreateKOLDto,
    @UploadedFiles() images?: Express.Multer.File[],
  ): Promise<KOLs> {
    const newKOLData = this.formatData(createKOLDto, images);
    return await this.kolsService.createKOL(newKOLData);
  }

  /**
   * Update existing KOL
   * @param params
   * @param updateKOLDto
   * @param images
   * @returns KOL
   */
  @UseGuards(JwtAuthGuard, UserActive, AdminRole)
  @Put(':id')
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'images', maxCount: 5 }], multerOptions),
  )
  @UseFilters(DeleteFileOnErrorFilter)
  @ApiParam({ name: 'id', description: 'KOL ID in ObjectId' })
  @ApiConsumes('multipart/form-data')
  async updateKOL(
    @Param() params: KOLIdDto,
    @Body() updateKOLDto: UpdateKOLDto,
    @UploadedFiles() images?: Express.Multer.File[],
  ): Promise<KOLs> {
    const newKOLData = this.formatData(updateKOLDto, images);
    return await this.kolsService.updateKOL(params.id, newKOLData);
  }

  /**
   * Set KOL's active to false
   * @param params
   * @returns KOL
   */
  @UseGuards(JwtAuthGuard, UserActive, AdminRole)
  @Delete(':id')
  @ApiParam({ name: 'id', description: 'KOL ID in ObjectId' })
  async deleteKOL(@Param() params: KOLIdDto): Promise<KOLs> {
    return await this.kolsService.deleteKOL(params.id);
  }
}
