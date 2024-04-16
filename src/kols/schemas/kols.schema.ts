import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Categories } from '../../categories/schemas/categories.schema';
import { OfficeHours } from 'src/office-hours/schemas/officeHours.schema';

@Schema({ timestamps: true })
export class KOLs extends Document {
  @Prop({ required: true, index: true })
  name: string;

  @Prop({ type: [String], default: [] })
  images: string[];

  @Prop({ index: true })
  location: string;

  @Prop({ required: true, index: true })
  major: string;

  @Prop()
  bio: string;

  @Prop()
  yob: number;

  @Prop({ type: Map, of: String, default: [] })
  socials: Record<string, string>;

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'OfficeHours' }])
  office_hours: OfficeHours[];

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'Categories' }])
  categories: Categories[];

  @Prop({ default: true })
  active: boolean;
}

export const KOLsSchema = SchemaFactory.createForClass(KOLs);
