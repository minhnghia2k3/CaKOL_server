import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Categories } from 'src/categories/schemas/categories.schema';

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

  /**
   * office_hours: [
   *  {
   *    time: 13:00 - 15:00,
   *    date: `date now`,
   *    available: true,
   *    price: 12$
   *  }
   * ]
   */
  @Prop({
    type: [
      {
        time: String,
        available: Boolean,
        price: String,
      },
    ],
    default: [],
  })
  office_hours: {
    time: string;
    available: boolean;
    price: string;
  }[];

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'Categories' }])
  categories: Categories[];

  @Prop({ default: true })
  active: boolean;
}

export const KOLsSchema = SchemaFactory.createForClass(KOLs);
