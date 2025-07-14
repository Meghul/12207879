import mongoose from "mongoose";

const urlSchema = new mongoose.Schema({
  url: { type: String, required: true },
  shortcode: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true }
});

export default mongoose.model("Url", urlSchema);
