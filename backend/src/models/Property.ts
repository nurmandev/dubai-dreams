import mongoose, { Schema, Document } from "mongoose";

export interface IProperty extends Document {
  ownerId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  price: number;
  address?: string;
  location: string;
  propertyType:
    | "apartment"
    | "condo"
    | "house"
    | "villa"
    | "land"
    | "commercial";
  status: "active" | "pending" | "sold" | "rented";
  views: number;
  favouritedBy: mongoose.Types.ObjectId[];
  images: string[];
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  amenities?: string[];
  yearBuilt?: number;
  kitchens?: number;
  garages?: number;
  garageSize?: number;
  floorsNo?: number;
  listedIn?: string;
  yearlyTaxRate?: number;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  videoUrl?: string;
  floorPlans?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const PropertySchema = new Schema<IProperty>(
  {
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    address: { type: String, trim: true },
    location: { type: String, required: true },
    propertyType: {
      type: String,
      enum: ["apartment", "condo", "house", "villa", "land", "commercial"],
      default: "apartment",
    },
    status: {
      type: String,
      enum: ["active", "pending", "sold", "rented"],
      default: "pending",
    },
    views: { type: Number, default: 0 },
    favouritedBy: [{ type: Schema.Types.ObjectId, ref: "User" }],
    images: [{ type: String }],
    videoUrl: { type: String },
    floorPlans: [{ type: String }],
    bedrooms: { type: Number },
    bathrooms: { type: Number },
    area: { type: Number },
    amenities: [{ type: String }],
    yearBuilt: { type: Number },
    kitchens: { type: Number },
    garages: { type: Number },
    garageSize: { type: Number },
    floorsNo: { type: Number },
    listedIn: { type: String },
    yearlyTaxRate: { type: Number },
    city: { type: String },
    state: { type: String },
    zipCode: { type: String },
    country: { type: String },
  },
  { timestamps: true },
);

export default mongoose.model<IProperty>("Property", PropertySchema);
