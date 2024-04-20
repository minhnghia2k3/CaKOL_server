import { Body, Controller, Delete, Get, Post, UseGuards } from '@nestjs/common';
import { CurrentUser } from 'src/users/users.decorator';
import { CartsService } from './carts.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UserActive } from 'src/users/guards/user-active.guard';
import { Users } from 'src/users/schemas/users.schema';
import { Carts } from './schemas/carts.schema';
import { CreateCartDto } from './dto/create-cart.dto';
import { DeleteCartDto } from './dto/delete-cart.dto';

@Controller('carts')
export class CartsController {
  constructor(private readonly cartsService: CartsService) {}

  @UseGuards(JwtAuthGuard, UserActive)
  @Get()
  async findUserCart(@CurrentUser() user: Users): Promise<Carts> {
    return await this.cartsService.findUserCart(user._id);
  }

  @UseGuards(JwtAuthGuard, UserActive)
  @Post()
  async addItemToCart(
    @CurrentUser() user: Users,
    @Body() createCartDto: CreateCartDto,
  ): Promise<Carts> {
    return await this.cartsService.addItemToCart(user._id, createCartDto);
  }

  @UseGuards(JwtAuthGuard, UserActive)
  @Delete()
  async removeItemFromCart(
    @CurrentUser() user: Users,
    @Body() deleteCartDto: DeleteCartDto,
  ): Promise<Carts> {
    return await this.cartsService.removeItemFromCart(user._id, deleteCartDto);
  }
}
