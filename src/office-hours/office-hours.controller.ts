import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreateOfficeHoursDto } from './dto/create-office-hours.dto';
import { OfficeHoursService } from './office-hours.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { AdminRole } from 'src/users/guards/admin-role.guard';

@Controller('office-hours')
export class OfficeHoursController {
  constructor(private officeHoursService: OfficeHoursService) {}
  @UseGuards(JwtAuthGuard, AdminRole)
  @Get()
  async listOfficeHours() {
    return await this.officeHoursService.listOfficeHours();
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
