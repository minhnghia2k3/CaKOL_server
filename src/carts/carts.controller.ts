import { Body, Controller, Delete, Get, Post, UseGuards } from '@nestjs/common';
import { CurrentUser } from 'src/users/users.decorator';
import { CartsService } from './carts.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UserActive } from 'src/users/guards/user-active.guard';
import { Users } from 'src/users/schemas/users.schema';
import { OwnerGuard } from 'src/users/guards/owner.guard';
import { Carts } from './schemas/carts.schema';
import { CreateCartDto } from './dto/create-cart.dto';
import { DeleteCartDto } from './dto/delete-cart.dto';

@Controller('users')
export class CartsController {
  constructor(private readonly cartsService: CartsService) {}

  @UseGuards(JwtAuthGuard, UserActive, OwnerGuard)
  @Get(':id/carts')
  async findUserCart(@CurrentUser() user: Users): Promise<Carts> {
    return await this.cartsService.findUserCart(user._id);
  }

  @UseGuards(JwtAuthGuard, UserActive, OwnerGuard)
  @Post(':id/carts')
  async addItemToCart(
    @CurrentUser() user: Users,
    @Body() createCartDto: CreateCartDto,
  ): Promise<Carts> {
    return await this.cartsService.addItemToCart(user._id, createCartDto);
  }

  @UseGuards(JwtAuthGuard, UserActive, OwnerGuard)
  @Delete(':id/carts')
  async removeItemFromCart(
    @CurrentUser() user: Users,
    @Body() deleteCartDto: DeleteCartDto,
  ): Promise<Carts> {
    return await this.cartsService.removeItemFromCart(user._id, deleteCartDto);
  }
}
