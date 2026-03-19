import { Schema, model, type Document, type Model } from "mongoose";

export interface IUser {
  name: string;
  email: string;
  password: string; // hashed
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserDocument extends IUser, Document {}

export interface IUserModel extends Model<IUserDocument> {}

const userSchema = new Schema<IUserDocument>(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: 255,
    },
    password: { type: String, required: true, minlength: 6, select: false },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc, ret) => {
        const safeRet = ret as Record<string, unknown>;
        safeRet.id = String(safeRet._id);
        delete safeRet._id;
        delete safeRet.__v;
        delete safeRet.password;
      },
    },
  }
);

export const User = model<IUserDocument, IUserModel>("User", userSchema);