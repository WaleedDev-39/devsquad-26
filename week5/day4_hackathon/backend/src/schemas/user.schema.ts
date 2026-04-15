import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  fullName: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  mobileNumber: string;

  @Prop()
  nationality: string;

  @Prop()
  idType: string;

  @Prop()
  idNumber: string;

  @Prop()
  avatar: string;

  @Prop({
    type: {
      country: String,
      city: String,
      address1: String,
      address2: String,
      landLineNumber: String,
      poBox: String,
    },
    default: {},
  })
  address: {
    country: string;
    city: string;
    address1: string;
    address2: string;
    landLineNumber: string;
    poBox: string;
  };

  @Prop({
    type: {
      informationType: String,
      fileNumber: String,
      plateState: String,
      plateCode: String,
      plateNumber: String,
      driverLicenseNumber: String,
      issueCity: String,
    },
    default: {},
  })
  trafficInfo: {
    informationType: string;
    fileNumber: string;
    plateState: string;
    plateCode: string;
    plateNumber: string;
    driverLicenseNumber: string;
    issueCity: string;
  };

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Car' }], default: [] })
  wishlist: Types.ObjectId[];
}

export const UserSchema = SchemaFactory.createForClass(User);
