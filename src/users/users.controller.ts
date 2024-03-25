import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/request/create-user.dto';
import { UsersResponse } from './dto/response/users-response.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { GetUserParam } from './dto/request/get-user.dto';
import { UpdateUserDto } from './dto/request/update-user.dto';
import { OwnerGuard } from './guards/owner.guard';
import { UserActive } from './guards/user-active.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from './multer-options';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * [POST] /users
   *
   * Create a new user with body
   */
  @Post()
  async createUser(
    @Body() createUserDto: CreateUserDto,
  ): Promise<UsersResponse> {
    return await this.usersService.createUser(createUserDto);
  }

  /**
   * [GET] /users/:id
   *
   * Get user by user Id.
   */
  @Get(':id')
  async getUser(@Param() params: GetUserParam): Promise<UsersResponse> {
    return await this.usersService.findUserById(params.id);
  }

  /**
   * [PUT] /users/:id
   *
   * Update user by id with body.
   */
  @UseGuards(JwtAuthGuard, OwnerGuard, UserActive)
  @Put(':id')
  @UseInterceptors(FileInterceptor('avatar', multerOptions))
  async updateUser(
    @Param() params: GetUserParam,
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile() avatar: Express.Multer.File,
  ) {
    updateUserDto.avatar = avatar?.filename;
    return await this.usersService.updateUser(params.id, updateUserDto);
  }

  /**
   * [DELETE] /users/:id
   *
   * Update user's active to boolean.
   */
  @UseGuards(JwtAuthGuard, OwnerGuard, UserActive)
  @Delete(':id')
  async deleteUser(@Param() params: GetUserParam) {
    return this.usersService.deleteUser(params.id);
  }
}
