import { Schema, model, Document } from "mongoose";

export interface ProductDocument extends Document {
  name: string;
  price: number;
  category: string;
  tag?: string;
  description: string;
  colors: string[];
  images: string[];
  isNew: boolean;
  popularity: number;
  longDescription?: string;
  dimensions?: string;
  materials: string[];
}

const productSchema = new Schema<ProductDocument>(
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
      transform: (_doc, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
        return ret;
      },
    },
  }
);

productSchema.index({ category: 1 });
productSchema.index({ popularity: -1 });

export const Product = model<ProductDocument>("Product", productSchema);
