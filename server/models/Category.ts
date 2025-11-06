import { model, Model, Schema } from "mongoose";

interface ICategory {
  name: string;
  description?: string;
  parent: Schema.Types.ObjectId | null;
  children: Schema.Types.ObjectId[];
  addToTree(parentId: string): Promise<ICategory>;
}

const categorySchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: String,
  parent: {
    type: Schema.Types.ObjectId,
    ref: "Category",
    default: null,
  },
  children: [
    {
      type: Schema.Types.ObjectId,
      ref: "Category",
    },
  ],
});

// Add tree structure methods
categorySchema.methods.addToTree = async function (
  this: any & { constructor: Model<ICategory> },
  parentId: string
) {
  const parent = await this.constructor.findById(parentId);
  if (!parent) throw new Error("Parent category not found");

  this.parent = parentId;
  parent.children.push(this._id);
  await parent.save();
  return this.save();
};

export default model<ICategory>("Category", categorySchema);
