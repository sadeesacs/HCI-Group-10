import { Schema, model, HydratedDocument } from "mongoose";

export interface ProductAttrs {
  name: string;
  price: number;
  category: string;
  tag?: string;
  description: string;
  colors: string[];
  images: string[];
  isNew?: boolean;
  popularity: number;
  longDescription?: string;
  dimensions?: string;
  materials?: string[];
}

export type ProductDocument = HydratedDocument<ProductAttrs>;

const productSchema = new Schema<ProductAttrs>(
  {
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    category: { type: String, required: true, trim: true },
    tag: { type: String, trim: true },
    description: { type: String, required: true, trim: true },
    colors: { type: [String], default: [] },
    images: { type: [String], default: [] },
    isNew: { type: Boolean, default: false },
    popularity: { type: Number, default: 0, min: 0 },
    longDescription: { type: String, trim: true },
    dimensions: { type: String, trim: true },
    materials: { type: [String], default: [] },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      virtuals: true,
      transform: (_doc, ret: any) => {
        ret.id = ret._id?.toString();
        delete ret._id;
        return ret;
      },
    },
  }
);

productSchema.index({ category: 1 });
productSchema.index({ popularity: -1 });

export const Product = model<ProductAttrs>("Product", productSchema);
