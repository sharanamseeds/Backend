var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import mongoose from "mongoose";
const moduleSchema = new mongoose.Schema({
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
}, {
    timestamps: true,
    autoCreate: true,
});
moduleSchema.statics.isCodeExists = function (code, excludeModuleId) {
    return __awaiter(this, void 0, void 0, function* () {
        const module = yield this.findOne({ code, _id: { $ne: excludeModuleId } });
        return !!module;
    });
};
moduleSchema.index({ code: 1 }, { unique: true });
const Modules = mongoose.model("Modules", moduleSchema);
export default Modules;
//# sourceMappingURL=modules.model.js.map