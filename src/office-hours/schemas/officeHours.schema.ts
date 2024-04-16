import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

@Schema()
export class OfficeHours extends Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'KOLs' })
  kol: string;
  @Prop({ type: String, required: true })
  appointmentTime: string;
  @Prop({ type: Date, default: Date.now() })
  appointmentDate: Date;
  @Prop({ type: String, required: true })
  price: string;
  @Prop({ type: Boolean, default: true })
  available: boolean;
}

export const OfficeHoursSchema = SchemaFactory.createForClass(OfficeHours);
