import { Schema, model, HydratedDocument } from "mongoose";

export interface ContactAttrs {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export type ContactDocument = HydratedDocument<ContactAttrs>;

const contactSchema = new Schema<ContactAttrs>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    subject: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true, maxlength: 2000 },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      transform: (_doc, ret: any) => {
        ret.id = ret._id?.toString();
        delete ret._id;
        return ret;
      },
    },
  }
);

contactSchema.index({ createdAt: -1 });

export const Contact = model<ContactAttrs>("Contact", contactSchema);
