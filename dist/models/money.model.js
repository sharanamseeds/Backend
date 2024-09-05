import mongoose from "mongoose";
const moneySchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true,
    },
    amount: { type: Number, required: true },
    description: { type: String },
}, { timestamps: true });
moneySchema.index({ amount: 1 });
moneySchema.index({ user_id: 1 });
moneySchema.index({ createdAt: 1 });
const Money = mongoose.model("moneys", moneySchema);
export default Money;
//# sourceMappingURL=money.model.js.map