import mongoose, { Schema } from "mongoose";
const FileSchema = new Schema({
    filename: { type: String, required: true },
    originalname: { type: String, required: true },
    path: { type: String, required: true },
    mimetype: { type: String, required: true },
    size: { type: Number, required: true },
    uploadDate: { type: Date, default: Date.now },
}, { timestamps: true });
export default mongoose.model("File", FileSchema);
//# sourceMappingURL=files.models.js.map