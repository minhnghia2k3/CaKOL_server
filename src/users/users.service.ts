import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Users } from './schemas/users.schema';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersResponse } from './dto/users-response.dto';
import * as bcrypt from 'bcrypt';
@Injectable()
export class UsersService {
  constructor(@InjectModel(Users.name) private usersModel: Model<Users>) {}

  async findUserByEmail(email: string): Promise<Users> {
    return await this.usersModel.findOne({ email: email });
  }

  private async builtResponse(user: Users) {
    return {
      _id: user._id,
      email: user.email,
      type: user.type,
    };
  }

  async findUserById(userId: string): Promise<UsersResponse> {
    return await this.builtResponse(await this.usersModel.findById(userId));
  }
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

  private async hashPassword(password: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    return hashedPassword;
  }

  async comparePassword(hashedPassword: string, plainPassword: string) {
    const isValidPassword = await bcrypt.compare(plainPassword, hashedPassword);
    return isValidPassword;
  }

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
}
