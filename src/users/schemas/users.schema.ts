import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

enum Type {
  user = 'User',
  admin = 'Admin',
}

@Schema()
export class Users extends Document {
  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, default: 'User' })
  type: Type;
}

export const UsersSchema = SchemaFactory.createForClass(Users);
