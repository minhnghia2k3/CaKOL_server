import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Carts } from './schemas/carts.schema';
import { Model } from 'mongoose';
import { CreateCartDto } from './dto/create-cart.dto';
import { OfficeHoursService } from 'src/office-hours/office-hours.service';
import { DeleteCartDto } from './dto/delete-cart.dto';

@Injectable()
export class CartsService {
  constructor(
    @InjectModel(Carts.name) private readonly cartModel: Model<Carts>,
    private readonly officeHoursService: OfficeHoursService,
  ) {}

  /**
   * Find user cart with userId
   * @param userId
   * @returns Promise<Carts>
   */
  async findUserCart(userId: string): Promise<Carts> {
    return (await this.cartModel.findOne({ user: userId })).populate({
      path: 'office_hours',
      populate: {
        path: 'kol',
        select: 'name images',
      },
    });
  }

  /**
   * Upsert item to user cart
   * @param userId
   * @param newItem
   * @returns
   */
  async addItemToCart(
    userId: string,
    createCartDto: CreateCartDto,
  ): Promise<Carts> {
    /** Upsert item to user cart
     *  Find user by id
     *  Create carts with userId
     * If there is already carts => push item to office_hours[]
     */

    const officeHours = await this.validateOfficeHour(
      createCartDto.office_hours,
    );

    if (!officeHours.available)
      throw new BadRequestException(
        `The office hour is not available ${officeHours.appointmentTime}`,
      );

    const cart = await this.cartModel.findOne({ user: userId });

    if (!cart) {
      return await this.cartModel.create({
        user: userId,
        office_hours: officeHours,
      });
    }
    cart.office_hours.push(officeHours);

    // Change availability of officeHour to false
    officeHours.available = false;
    await officeHours.save();
    return await cart.save();
  }

  async removeItemFromCart(userId: string, deleteCartDto: DeleteCartDto) {
    const officeHours = await this.validateOfficeHour(
      deleteCartDto.office_hours,
    );

    const cart = await this.cartModel.findOne({ user: userId });
    if (!cart)
      throw new NotFoundException(`Not found user's cart by userId: ${userId}`);

    // Remove office_hours from cart.
    cart.office_hours = cart.office_hours.filter((oh) => {
      return oh._id.toString() !== officeHours._id.toString();
    });

    // Change availability of officeHour to true
    officeHours.available = true;
    await officeHours.save();

    return await cart.save();
  }

  private async validateOfficeHour(officeHourId: string) {
    // Validate officeHoursId
    const officeHour = await this.officeHoursService.findById(officeHourId);
    if (!officeHour)
      throw new NotFoundException(
        `Not found office hours by id: ${officeHourId}`,
      );
    return officeHour;
  }
}
