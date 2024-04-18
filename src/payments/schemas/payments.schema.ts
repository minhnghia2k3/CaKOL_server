import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { OfficeHours } from 'src/office-hours/schemas/officeHours.schema';
import { Users } from 'src/users/schemas/users.schema';

export enum Status {
  'Cancel' = 0,
  'Pending' = 1,
  'Done' = 2,
}
@Schema({ timestamps: true })
export class Payments extends Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  user: Users;
  @Prop({ required: true })
  orderId: string;
  @Prop({ required: true })
  orderInfo: string;
  @Prop({ required: true })
  paymentMethod: string;
  @Prop({ required: true })
  amount: number;
  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'OfficeHours' }],
    required: true,
  })
  office_hours: OfficeHours[];
  @Prop({ enum: Status, default: Status.Pending })
  status: Status;
}

export const PaymentsSchema = SchemaFactory.createForClass(Payments);
