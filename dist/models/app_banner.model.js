import mongoose from "mongoose";
import { localizedStringSchema, } from "../schema/localizedLanguage.schema.js";
const appBannerSchema = new mongoose.Schema({
    images: { type: [localizedStringSchema], default: [] },
}, { timestamps: true });
// Indexes
appBannerSchema.index({ createdAt: 1 });
// Model
const AppBanner = mongoose.model("app_banners", appBannerSchema);
export default AppBanner;
//# sourceMappingURL=app_banner.model.js.map