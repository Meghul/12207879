import mongoose from "mongoose";

const clickSchema = new mongoose.Schema({
  shortcode: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  referrer: { type: String },
  ip: { type: String }
});

export default mongoose.model("Click", clickSchema);
