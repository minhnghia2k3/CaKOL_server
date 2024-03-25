import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum Roles {
  User = 0,
  Admin = 1,
}

@Schema({ timestamps: true })
export class Users extends Document {
  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  avatar: string;

  @Prop({ required: true, default: Roles.User })
  type: Roles;

  @Prop({ default: 1 })
  active: boolean;
}

export const UsersSchema = SchemaFactory.createForClass(Users);
