import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersResponse } from './dto/users-response.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Request } from 'express';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Post()
  async createUser(
    @Body() createUserDto: CreateUserDto,
  ): Promise<UsersResponse> {
    return await this.usersService.createUser(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getUser(@Req() req: Request) {
    return req.user;
  }
}
