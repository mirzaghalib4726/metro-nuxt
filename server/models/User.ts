import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password: string;
  name?: string;
  company?: string;
  role: Schema.Types.ObjectId;
  permissions: Array<{
    resource: string;
    actions: string[];
  }>;
  metadata: {
    lastLogin?: Date;
    loginCount: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
      select: false, // Don't include password in queries by default
    },
    name: {
      type: String,
      trim: true,
    },
    company: {
      type: String,
      trim: true,
    },
    role: {
      type: Schema.Types.ObjectId,
      ref: 'Role',
      required: true,
      index: true,
    },
    permissions: [
      {
        resource: {
          type: String,
          enum: ['product', 'category', 'order', 'user'],
        },
        actions: {
          type: [String],
          enum: ['create', 'read', 'update', 'delete'],
        },
      },
    ],
    metadata: {
      lastLogin: Date,
      loginCount: {
        type: Number,
        default: 0,
      },
    },
  },
  {
    timestamps: true,
  }
);

export default model<IUser>('User', userSchema);
