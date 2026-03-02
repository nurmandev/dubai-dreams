import mongoose, { Schema, Document } from "mongoose";

export interface IBlog extends Document {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  author: string;
  image: string;
  category: string;
  tags: string[];
  status: "published" | "draft";
  publishedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const BlogSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    content: { type: String, required: true },
    excerpt: { type: String, required: true },
    author: { type: String, default: "Omnis Properties" },
    image: { type: String, required: true },
    category: { type: String, required: true },
    tags: [{ type: String }],
    status: {
      type: String,
      enum: ["published", "draft"],
      default: "published",
    },
    publishedAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

// Pre-save hook to generate slug if not provided?
// For now, assume it's provided or simple conversion

export default mongoose.model<IBlog>("Blog", BlogSchema);
