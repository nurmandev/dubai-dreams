import mongoose, { Schema, Document } from "mongoose";

export interface IKYC extends Document {
  userId?: mongoose.Types.ObjectId;
  fullName: string;
  email: string;
  phone: string;
  nationality: string;
  address: string;
  passportNumber?: string;
  idType: "passport" | "emirates_id" | "other";
  idNumber?: string;
  documentUrls: {
    passportCopy?: string;
    visaCopy?: string;
    emiratesIdCopy?: string;
    supportingDocuments?: string[];
  };
  status: "pending" | "approved" | "rejected";
  remarks?: string;
  createdAt: Date;
  updatedAt: Date;
}

const KYCSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    nationality: { type: String, required: true },
    address: { type: String, required: true },
    idType: {
      type: String,
      enum: ["passport", "emirates_id", "other"],
      default: "passport",
    },
    idNumber: { type: String },
    documentUrls: {
      passportCopy: { type: String },
      visaCopy: { type: String },
      emiratesIdCopy: { type: String },
      supportingDocuments: [{ type: String }],
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    remarks: { type: String },
  },
  { timestamps: true },
);

export default mongoose.model<IKYC>("KYC", KYCSchema);
