import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { Payments, Status } from './schemas/payments.schema';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import { CartsService } from 'src/carts/carts.service';
import { InjectModel } from '@nestjs/mongoose';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';

export interface Payment {
  partnerCode: string;
  orderId: string;
  requestId: string;
  amount: number;
  responseTime: number;
  message: string;
  resultCode: number;
  payUrl: string;
  shortLink: string;
}

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);
  constructor(
    @InjectModel(Payments.name) private readonly paymentsModel: Model<Payments>,
    private readonly configService: ConfigService,
    private readonly cartsService: CartsService,
    private readonly httpService: HttpService,
  ) {}

  private async paymentProcess({
    orderInfo,
    amount,
  }: {
    orderInfo: string;
    amount: number;
  }): Promise<Payment> {
    const accessKey = this.configService.get<string>('MOMO_ACCESS_KEY');
    const secretKey = this.configService.get<string>('MOMO_SECRET_KEY');
    // const orderInfo = '....';
    const partnerCode = 'MOMO';
    const redirectUrl = this.configService.get<string>('MOMO_REDIRECT_URL');
    const ipnUrl = this.configService.get<string>('MOMO_REDIRECT_URL');
    const requestType = 'payWithMethod';
    // const amount = '...';
    const orderId = partnerCode + new Date().getTime();
    const requestId = orderId;
    const extraData = '';
    const paymentCode =
      'T8Qii53fAXyUftPV3m9ysyRhEanUs9KlOPfHgpMR0ON50U10Bh+vZdpJU7VY4z+Z2y77fJHkoDc69scwwzLuW5MzeUKTwPo3ZMaB29imm6YulqnWfTkgzqRaion+EuD7FN9wZ4aXE1+mRt0gHsU193y+yxtRgpmY7SDMU9hCKoQtYyHsfFR5FUAOAKMdw2fzQqpToei3rnaYvZuYaxolprm9+/+WIETnPUDlxCYOiw7vPeaaYQQH0BF0TxyU3zu36ODx980rJvPAgtJzH1gUrlxcSS1HQeQ9ZaVM1eOK/jl8KJm6ijOwErHGbgf/hVymUQG65rHU2MWz9U8QUjvDWA==';
    const orderGroupId = '';
    const autoCapture = true;
    const lang = 'vi';
    const apiUrl = this.configService.get<string>('MOMO_API');

    const rawSignature =
      'accessKey=' +
      accessKey +
      '&amount=' +
      amount +
      '&extraData=' +
      extraData +
      '&ipnUrl=' +
      ipnUrl +
      '&orderId=' +
      orderId +
      '&orderInfo=' +
      orderInfo +
      '&partnerCode=' +
      partnerCode +
      '&redirectUrl=' +
      redirectUrl +
      '&requestId=' +
      requestId +
      '&requestType=' +
      requestType;

    const signature = crypto
      .createHmac('sha256', secretKey)
      .update(rawSignature)
      .digest('hex');

    const requestBody = JSON.stringify({
      partnerCode: partnerCode,
      partnerName: 'CaKOL Booking Service',
      storeId: 'CaKOL-Booking',
      requestId: requestId,
      amount: amount,
      orderId: orderId,
      orderInfo: orderInfo,
      redirectUrl: redirectUrl,
      ipnUrl: ipnUrl,
      lang: lang,
      requestType: requestType,
      autoCapture: autoCapture,
      extraData: extraData,
      orderGroupId: orderGroupId,
      signature: signature,
    });

    const options = {
      hostname: 'test-payment.momo.vn',
      port: 443,
      path: '/v2/gateway/api/create',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(requestBody),
      },
    };
    const { data } = await firstValueFrom(
      this.httpService
        .post(apiUrl, requestBody, {
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(requestBody),
          },
        })
        .pipe(
          catchError((error: AxiosError) => {
            throw error.response.data;
          }),
        ),
    );
    return data;
  }

  /**
   * Process user pay
   * @param userId
   * @returns
   */
  async makePayment(userId: string) {
    try {
      // Find the user's cart
      const cart = await this.cartsService.findUserCart(userId);
      if (!cart)
        throw new NotFoundException(`Not found cart by userId: ${userId}`);

      // Calculate the total price & office_hours id
      const totalPrice = cart.office_hours.reduce(
        (total, oh) => total + +oh.price,
        0,
      );
      const office_hours = cart.office_hours.map((oh) => oh._id);

      // Process payment
      const orderInfo = `CaKOL Booking - Payment id ${cart._id}`;
      const res = await this.paymentProcess({ orderInfo, amount: totalPrice });
      if (res && res.resultCode === 0) {
        // Store result to db
        const receipt = await this.paymentsModel.create({
          user: userId,
          orderId: res.orderId,
          paymentMethod: res.partnerCode,
          amount: res.amount,
          office_hours: office_hours,
          orderInfo: orderInfo,
          status: Status.Done,
        });

        this.logger.log(`A receipt "${res.orderId}" has been created.`);

        // Clear office_hours from cart
        cart.office_hours = [];
        await cart.save();

        // Convert receipt to plain object
        const plainObject = receipt.toObject();

        return {
          ...plainObject,
          payUrl: res.payUrl,
          shortLink: res.shortLink,
        };
      }
    } catch (error) {
      this.logger.error(
        `Error processing payment for userId: ${userId}`,
        error,
      );
      throw new BadRequestException(error);
    }
  }

  /**
   * List all user invoices.
   * @param userId
   */
  async listReceipts(userId: string) {
    return await this.paymentsModel.find(
      { user: userId },
      {},
      { sort: 'createdAt -1' },
    );
  }

  /**
   * List all invoice records
   */
  async listAllReceipts() {
    return await this.paymentsModel
      .find({ status: 2 })
      .populate({ path: 'user', model: 'Users' });
  }
}
