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
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUserParam } from './dto/request/get-user.dto';
import { UpdateUserDto } from './dto/request/update-user.dto';
import { OwnerGuard } from './guards/owner.guard';
import { UserActive } from './guards/user-active.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from './multer-options';
import { ApiParam } from '@nestjs/swagger';
import { CurrentUser } from './users.decorator';
import { Users } from './schemas/users.schema';
import { AdminRole } from './guards/admin-role.guard';
import { CacheInterceptor } from '@nestjs/cache-manager';

@Controller('users')
@UseInterceptors(CacheInterceptor)
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
   * Get current user
   * @param params
   * @returns UsersResponse
   */
  @UseGuards(JwtAuthGuard, UserActive)
  @Get()
  async getUser(@CurrentUser() user: Users): Promise<UsersResponse> {
    return await this.usersService.findUserById(user._id);
  }

  /**
   * [PUT] /users/:id
   *
   * Update user by id with body.
   */
  @UseGuards(JwtAuthGuard, OwnerGuard, UserActive)
  @Put(':id')
  @ApiParam({ name: 'id', description: 'User ID in ObjectId' })
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
  @UseGuards(JwtAuthGuard, AdminRole, OwnerGuard, UserActive)
  @Delete(':id')
  @ApiParam({ name: 'id', description: 'User ID in ObjectId' })
  async deleteUser(@Param() params: GetUserParam) {
    return this.usersService.deleteUser(params.id);
  }

  /**
   * Find all user's records.
   * @returns Users
   */
  @UseGuards(JwtAuthGuard, AdminRole)
  @Get('/all')
  async getTotalUsers(): Promise<UsersResponse[]> {
    return await this.usersService.findUsers();
  }
}
