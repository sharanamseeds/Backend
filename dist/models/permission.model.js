import mongoose from "mongoose";
const permissionSchema = new mongoose.Schema({
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
}, {
    timestamps: true,
    autoCreate: true,
});
permissionSchema.index({ module: 1 });
permissionSchema.index({ role: 1 });
const Permissions = mongoose.model("Permissions", permissionSchema);
export default Permissions;
//# sourceMappingURL=permission.model.js.map