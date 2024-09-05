import mongoose from "mongoose";

export interface typePermission extends Document {
  role: mongoose.Types.ObjectId | null;
  module: mongoose.Types.ObjectId | null;
  can_read: boolean;
  can_select: boolean;
  can_add: boolean;
  can_update: boolean;
  can_delete: boolean;
  can_upload: boolean;
  can_download: boolean;
}

const permissionSchema = new mongoose.Schema(
  {
    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Roles",
    },
    module: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Modules",
    },
    can_read: {
      type: Boolean,
      default: false,
    },
    can_select: {
      type: Boolean,
      default: false,
    },
    can_add: {
      type: Boolean,
      default: false,
    },
    can_update: {
      type: Boolean,
      default: false,
    },
    can_delete: {
      type: Boolean,
      default: false,
    },
    can_upload: {
      type: Boolean,
      default: false,
    },
    can_download: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    autoCreate: true,
  }
);

permissionSchema.index({ module: 1 });
permissionSchema.index({ role: 1 });

const Permissions = mongoose.model<typePermission>(
  "Permissions",
  permissionSchema
);
export default Permissions;
