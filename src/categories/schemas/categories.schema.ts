import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ versionKey: false })
export class Categories extends Document {
  @Prop({ unique: true })
  name: string;

  @Prop()
  image: string;
}

export const CategoriesSchema = SchemaFactory.createForClass(Categories);
