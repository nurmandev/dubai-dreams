import mongoose, { Schema, Document } from "mongoose";

export interface IInquiry extends Document {
  name: string;
  email: string;
  phone: string;
  message: string;
  budget?: string;
  propertyId?: mongoose.Types.ObjectId;
  propertyTitle?: string;
  status: "new" | "resolved" | "archived";
  createdAt: Date;
  updatedAt: Date;
}

const InquirySchema = new Schema<IInquiry>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    message: { type: String, required: true },
    budget: { type: String },
    propertyId: { type: Schema.Types.ObjectId, ref: "Property" },
    propertyTitle: { type: String },
    status: {
      type: String,
      enum: ["new", "resolved", "archived"],
      default: "new",
    },
  },
  { timestamps: true },
);

export default mongoose.model<IInquiry>("Inquiry", InquirySchema);
