import mongoose, { Schema, Document } from "mongoose";

export interface ISocialChannel extends Document {
  name: string;
  url: string;
  icon: string; // 'whatsapp', 'telegram', 'youtube', 'facebook', 'instagram', 'x', 'linkedin'
  isActive: boolean;
  order: number;
}

const SocialChannelSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    url: { type: String, required: true },
    icon: { type: String, default: "link" },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export default mongoose.model<ISocialChannel>("SocialChannel", SocialChannelSchema);
