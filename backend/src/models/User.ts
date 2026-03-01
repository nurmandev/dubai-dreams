import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";

interface ISession {
  sessionId: string;
  refreshTokenHash: string;
  device: string;
  ip: string;
  userAgent: string;
  lastActive: Date;
}

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  about?: string;
  avatar?: string;
  socials?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  isEmailVerified: boolean;
  isMfaEnabled: boolean;
  mfaSecret?: string;
  passwordHistory: string[];
  sessions: ISession[];
  failedLoginAttempts: number;
  lockUntil?: Date;
  comparePassword(password: string): Promise<boolean>;
}

const SessionSchema = new Schema<ISession>({
  sessionId: { type: String, required: true },
  refreshTokenHash: { type: String, required: true },
  device: { type: String, required: true },
  ip: { type: String, required: true },
  userAgent: { type: String, required: true },
  lastActive: { type: Date, default: Date.now },
});

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    firstName: { type: String, trim: true },
    lastName: { type: String, trim: true },
    phoneNumber: { type: String, trim: true },
    about: { type: String },
    avatar: { type: String },
    socials: {
      facebook: String,
      twitter: String,
      instagram: String,
      linkedin: String,
    },
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
    },
    isEmailVerified: {
      type: Boolean,
      default: true,
    },
    isMfaEnabled: {
      type: Boolean,
      default: false,
    },
    mfaSecret: {
      type: String, // Store encrypted
    },
    passwordHistory: {
      type: [String],
      default: [],
    },
    sessions: {
      type: [SessionSchema],
      default: [],
    },
    failedLoginAttempts: {
      type: Number,
      default: 0,
    },
    lockUntil: {
      type: Date,
    },
  },
  { timestamps: true },
);

// Hash password before saving
UserSchema.pre("save", async function (this: any) {
  if (!this.isModified("password")) return;

  try {
    const salt = await bcrypt.genSalt(12);
    const hash = await bcrypt.hash(this.password, salt);

    this.password = hash;
  } catch (error: any) {
    throw error;
  }
});

UserSchema.methods.comparePassword = async function (
  this: any,
  password: string,
) {
  return bcrypt.compare(password, this.password);
};

export default mongoose.model<IUser>("User", UserSchema);
