import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

import { UserTypeEnum } from '../enums/user-type.enum';
import { PlanStatusEnum } from '../enums/plan-status.enum';

export type UserDocument = User & Document;

@Schema({
  timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
  toObject: {
    transform: (doc, ret) => {
      return ret;
    },
    virtuals: true,
  },
  toJSON: {
    transform: (doc, ret) => {
      delete ret.password;
      delete ret.__v;
      return ret;
    },
    virtuals: true,
  },
})
class Plan {
  @Prop({ type: String })
  name: string;

  @Prop({ type: Number })
  amount: number;

  @Prop({ description: String })
  description: string;

  @Prop({
    type: String,
    required: true,
    enum: PlanStatusEnum,
    default: PlanStatusEnum.active,
  })
  status: string;
}

@Schema({ _id: false })
class Location {
  @Prop({ type: String })
  state: string;

  @Prop({ type: String })
  municipality: string;

  @Prop({ type: String })
  city: string;

  @Prop({ type: String })
  address: string;
}

@Schema({
  timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
  toObject: {
    transform: (doc, ret) => {
      return ret;
    },
    virtuals: true,
  },
  toJSON: {
    transform: (doc, ret) => {
      delete ret.password;
      delete ret.__v;
      return ret;
    },
    virtuals: true,
  },
})
export class User {
  // @Prop({ type: String, unique: true })
  // _id: string;

  @Prop({ type: String })
  companyName: string;

  @Prop({ type: String })
  name: string;

  @Prop({ type: String })
  lastName: string;

  @Prop({ type: String, unique: true, lowercase: true })
  email: string;

  @Prop({ type: String, required: true, select: false })
  password: string;

  @Prop({ type: Boolean, default: false })
  passwordChange: boolean;

  @Prop({ type: String })
  phone: string;

  @Prop({ type: String })
  photo: string;

  @Prop({ type: String, default: 'client' })
  role: string;

  @Prop({
    type: String,
    required: true,
    enum: UserTypeEnum,
    default: UserTypeEnum.person,
  })
  userType: string;

  @Prop({ type: Location })
  location: Location;

  @Prop({ type: MongooseSchema.Types.Array })
  plans: Plan[];

  @Prop({ type: Date })
  lastLogin: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
