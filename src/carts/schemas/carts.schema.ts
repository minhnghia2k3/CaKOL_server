import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { OfficeHours } from 'src/office-hours/schemas/officeHours.schema';
import { Users } from 'src/users/schemas/users.schema';

@Schema()
export class Carts extends Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Users', index: true })
  user: Users;

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'OfficeHours' }])
  office_hours: OfficeHours[];
}

export const CartsSchema = SchemaFactory.createForClass(Carts);
