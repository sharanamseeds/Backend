import mongoose from "mongoose";

export interface childrenInterface {
  icon: string;
  name: string;
  code: string;
  route: string;
  active_on: Array<string>;
  parent_id: mongoose.Types.ObjectId | null;
  isForAdmin: boolean;
  isForUser: boolean;
  sort_order: number;
  is_default: boolean;
}

export interface typeModule extends Document {
  icon: string;
  name: string;
  code: string;
  route: string;
  active_on: Array<string>;
  childrens: childrenInterface[];
  parent_id: mongoose.Types.ObjectId | null;
  isForAdmin: boolean;
  isForUser: boolean;
  sort_order: number;
  is_default: boolean;
  identifier: string;
}

const moduleSchema = new mongoose.Schema(
  {
    icon: {
      type: String,
      trim: true,
      default: "",
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    identifier: { type: String, default: null },
    code: {
      type: String,
      required: true,
      trim: true,
    },
    route: {
      type: String,
      trim: true,
    },
    active_on: {
      type: Array,
      default: [],
    },
    childrens: {
      type: Array,
      default: [],
    },
    parent_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Modules",
      default: null,
    },
    isForAdmin: {
      type: Boolean,
      default: false,
    },
    isForUser: {
      type: Boolean,
      default: false,
    },
    sort_order: {
      type: Number,
      default: 1,
    },
    is_default: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    autoCreate: true,
  }
);

moduleSchema.statics.isCodeExists = async function (code, excludeModuleId) {
  const module = await this.findOne({ code, _id: { $ne: excludeModuleId } });
  return !!module;
};

moduleSchema.index({ code: 1 }, { unique: true });

const Modules = mongoose.model<typeModule>("Modules", moduleSchema);
export default Modules;
