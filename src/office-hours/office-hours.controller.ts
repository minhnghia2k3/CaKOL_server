import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateOfficeHoursDto } from './dto/create-office-hours.dto';
import { OfficeHoursService } from './office-hours.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { AdminRole } from 'src/users/guards/admin-role.guard';
import { getOhsQueryDto } from './dto/get-ohs-query.dto';

@Controller('office-hours')
export class OfficeHoursController {
  constructor(private officeHoursService: OfficeHoursService) {}
  @UseGuards(JwtAuthGuard, AdminRole)
  @Get()
  async listOfficeHours(@Query() query: getOhsQueryDto) {
    return await this.officeHoursService.listOfficeHours({
      kolName: query.name,
      limit: query.limit,
      page: query.page,
    });
  }

  @UseGuards(JwtAuthGuard, AdminRole)
  @Post()
  async createOfficeHour(@Body() createOfficeHoursDto: CreateOfficeHoursDto) {
    return await this.officeHoursService.create(createOfficeHoursDto);
  }

  @UseGuards(JwtAuthGuard, AdminRole)
  @Delete(':id')
  async deleteOfficeHour(@Param('id') id: string) {
    return await this.officeHoursService.delete(id);
  }
}
