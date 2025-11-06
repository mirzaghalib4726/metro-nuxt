import { Document, Schema, model } from "mongoose";

interface IProduct extends Document {
  name: string;
  description?: string;
  price: number;
  category: Schema.Types.ObjectId;
  stock: number;
  image?: string;
  metadata: {
    createdAt: Date;
    updatedAt: Date;
  };
  version: number;
}

const productSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: String,
  price: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: "Category",
    required: true,
    index: true,
  },
  stock: {
    type: Number,
    default: 0,
    min: 0,
  },
  metadata: {
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
});

// Add versioning for concurrent updates
productSchema.set("versionKey", "version");
productSchema.pre("save", function (this: IProduct) {
  if (this.isNew) {
    this.version = 0;
  } else {
    this.version++;
  }
});

export default model<IProduct>("Product", productSchema);
