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
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { KolsService, builtListResponse } from './kols.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UserActive } from 'src/users/guards/user-active.guard';
import { KOLs } from './schemas/kols.schema';
import { CreateKOLDto } from './dto/request/create-kol.dto';
import { UpdateKOLDto } from './dto/request/update-kol.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { multerOptions } from './multer-options';
import { KOLIdDto } from './dto/request/kol-id.dto';
import { GetKOLsQueryDto } from './dto/request/get-kols-query.dto';
import { AdminRole } from 'src/users/guards/admin-role.guard';

@Controller('kols')
export class KolsController {
  constructor(private readonly kolsService: KolsService) {}

  private formatData(body: UpdateKOLDto, images?: Express.Multer.File[]) {
    const result = { ...body };

    // Assign images.
    const files = JSON.parse(JSON.stringify(images));
    if (files.images && files.images.length > 0) {
      result.images = files.images.map((image) => image.filename);
    }

    return result;
  }

  @Get()
  async getKOLs(@Query() query: GetKOLsQueryDto): Promise<builtListResponse> {
    let filter: any = {};
    if (query.name || query.major) {
      filter = { $or: [] };

      if (query.name) {
        filter.$or.push({
          name: { $regex: new RegExp(query.name, 'iu') },
        });
      }

      if (query.major) {
        filter.$or.push({ major: { $regex: new RegExp(query.major, 'iu') } });
      }

      if (query.location) {
        filter.$or.push({
          major: { $regex: new RegExp(query.location, 'iu') },
        });
      }
      // filter = { $or: [ {name: /abc}, {major: /abc/}] }
    }
    return await this.kolsService.getAllKOLs({
      filter: filter,
      limit: query.limit,
      page: query.page,
    });
  }

  @Get(':id')
  async getKOL(@Param() params: KOLIdDto): Promise<KOLs> {
    return await this.kolsService.getKOL(params.id);
  }

  @UseGuards(JwtAuthGuard, UserActive, AdminRole)
  @Post()
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'images', maxCount: 5 }], multerOptions),
  )
  async createKOL(
    @Body() createKOLDto: CreateKOLDto,
    @UploadedFiles() images?: Express.Multer.File[],
  ): Promise<KOLs> {
    const newKOLData = this.formatData(createKOLDto, images);
    return await this.kolsService.createKOL(newKOLData);
  }

  @UseGuards(JwtAuthGuard, UserActive, AdminRole)
  @Put(':id')
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'images', maxCount: 5 }], multerOptions),
  )
  async updateKOL(
    @Param() params: KOLIdDto,
    @Body() updateKOLDto: UpdateKOLDto,
    @UploadedFiles() images?: Express.Multer.File[],
  ): Promise<KOLs> {
    const newKOLData = this.formatData(updateKOLDto, images);
    return await this.kolsService.updateKOL(params.id, newKOLData);
  }

  @UseGuards(JwtAuthGuard, UserActive, AdminRole)
  @Delete(':id')
  async deleteKOL(@Param() params: KOLIdDto): Promise<KOLs> {
    return await this.kolsService.deleteKOL(params.id);
  }
}
