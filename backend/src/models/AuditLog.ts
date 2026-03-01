import mongoose, { Schema, Document } from 'mongoose';

export interface IAuditLog extends Document {
  userId?: mongoose.Types.ObjectId;
  action: string;
  ip: string;
  userAgent: string;
  device: string;
  status: 'success' | 'failure';
  details?: string;
  timestamp: Date;
}

const AuditLogSchema = new Schema<IAuditLog>({
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  action: { type: String, required: true },
  ip: { type: String, required: true },
  userAgent: { type: String, required: true },
  device: { type: String, required: true },
  status: { type: String, enum: ['success', 'failure'], required: true },
  details: { type: String },
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.model<IAuditLog>('AuditLog', AuditLogSchema);
