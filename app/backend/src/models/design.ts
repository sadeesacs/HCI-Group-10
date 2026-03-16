import { Schema, model, type Document, type Model, type Types } from "mongoose";

interface FurnitureItem {
  id: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  color: string;
  label: string;
  glbPath?: string;
}

interface RoomConfig {
  shape: string;
  dimensions: Record<string, unknown>;
  wallHeight: number;
  wallColor: string;
  floorColor: string;
  ceilingColor: string;
  doors: Array<Record<string, unknown>>;
  windows: Array<Record<string, unknown>>;
}

export interface IDesign {
  userId: Types.ObjectId;
  slotIndex: number;
  name: string;
  roomConfig: RoomConfig;
  items: FurnitureItem[];
}

export interface IDesignDocument extends IDesign, Document {}
export interface IDesignModel extends Model<IDesignDocument> {}

const furnitureItemSchema = new Schema(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    x: { type: Number, required: true },
    y: { type: Number, required: true },
    width: { type: Number, required: true },
    height: { type: Number, required: true },
    rotation: { type: Number, required: true, default: 0 },
    color: { type: String, required: true },
    label: { type: String, required: true },
    glbPath: { type: String },
  },
  { _id: false }
);

const roomConfigSchema = new Schema(
  {
    shape: { type: String, required: true },
    dimensions: { type: Schema.Types.Mixed, required: true },
    wallHeight: { type: Number, required: true },
    wallColor: { type: String, required: true },
    floorColor: { type: String, required: true },
    ceilingColor: { type: String, required: true },
    doors: { type: [Schema.Types.Mixed], default: [] },
    windows: { type: [Schema.Types.Mixed], default: [] },
  },
  { _id: false }
);

const designSchema = new Schema<IDesignDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    slotIndex: { type: Number, required: true, min: 0, max: 9 },
    name: { type: String, required: true, trim: true, maxlength: 100 },
    roomConfig: { type: roomConfigSchema, required: true },
    items: { type: [furnitureItemSchema], default: [] },
  },
  {
    timestamps: true,
    toJSON: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      transform: (_doc: any, ret: any) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

// Each user can only have one design per slot
designSchema.index({ userId: 1, slotIndex: 1 }, { unique: true });

export const Design = model<IDesignDocument, IDesignModel>("Design", designSchema);
