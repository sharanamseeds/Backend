import mongoose from "mongoose";
import { localizedStringSchema, } from "../schema/localizedLanguage.schema.js";
const appBannerSchema = new mongoose.Schema({
    images: { type: [localizedStringSchema], default: [] },
    banners: { type: [localizedStringSchema], default: [] },
    is_active: { type: Boolean, default: false },
}, { timestamps: true });
// Indexes
appBannerSchema.index({ createdAt: 1 });
// Model
const AppBanner = mongoose.model("app_banners", appBannerSchema);
export default AppBanner;
//# sourceMappingURL=app_banner.model.js.map