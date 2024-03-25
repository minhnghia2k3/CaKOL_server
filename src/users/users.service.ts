import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Users } from './schemas/users.schema';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/request/create-user.dto';
import { UsersResponse } from './dto/response/users-response.dto';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/request/update-user.dto';
import { PathLike, unlink } from 'fs';
@Injectable()
export class UsersService {
  constructor(@InjectModel(Users.name) private usersModel: Model<Users>) {}

  /**
   * Format response
   */
  private async builtResponse(user: Users) {
    return {
      _id: user._id,
      email: user.email,
      avatar: user.avatar,
      type: user.type,
      active: user.active,
    };
  }

  async findUserByEmail(email: string): Promise<Users> {
    return await this.usersModel.findOne({ email: email });
  }

  async findUserById(userId: string): Promise<UsersResponse> {
    const user = await this.usersModel.findById(userId);
    if (!user) {
      throw new NotFoundException('Not found user by id.');
    }
    return this.builtResponse(user);
  }

  private removeImage(path: PathLike): void {
    unlink(path, (err) => {
      if (err) throw err;
      console.log(`${path} was deleted`);
    });
  }

  private async hashPassword(password: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    return hashedPassword;
  }

  async comparePassword(hashedPassword: string, plainPassword: string) {
    const isValidPassword = await bcrypt.compare(plainPassword, hashedPassword);
    return isValidPassword;
  }

  /**
   * Create a new user with `createUserDto` body.
   * @param createUserDto
   * @returns UsersResponse
   */
  async createUser(createUserDto: CreateUserDto): Promise<UsersResponse> {
    const user = await this.findUserByEmail(createUserDto.email);
    if (user) {
      throw new ConflictException('Email already registered.');
    }

    const hashedPassword = await this.hashPassword(createUserDto.password);

    const newUser = await this.usersModel.create({
      ...createUserDto,
      password: hashedPassword,
    });

    return this.builtResponse(newUser);
  }

  /**
   * Handle login logical
   * @param email
   * @param plainPassword
   * @returns UsersResponse
   */
  async validateUser(
    email: string,
    plainPassword: string,
  ): Promise<UsersResponse> {
    const user = await this.findUserByEmail(email);
    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }
    const validatePassword = await this.comparePassword(
      user.password,
      plainPassword,
    );

    if (!validatePassword) {
      throw new BadRequestException('Invalid credentials');
    }

    return this.builtResponse(user);
  }

  async updateUser(
    userId: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UsersResponse> {
    if (updateUserDto.avatar) {
      const currentUser = await this.usersModel.findById(userId);
      if (currentUser.avatar) {
        const imagePath = `uploads/users/${currentUser.avatar}`;
        this.removeImage(imagePath);
      }
    }
    const user = await this.usersModel.findByIdAndUpdate(
      userId,
      updateUserDto,
      {
        new: true,
      },
    );
    if (!user) {
      throw new NotFoundException(`Not found user by id.`);
    }

    return this.builtResponse(user);
  }

  async deleteUser(userId: string): Promise<UsersResponse> {
    const user = this.usersModel.findByIdAndUpdate(
      userId,
      { active: false },
      { new: true },
    );
    if (!user) {
      throw new NotFoundException(`Not found user by id.`);
    }
    return user;
  }
}
