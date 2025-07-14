import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import urlRoutes from "./routes/UrlRoutes.js";
import { logger } from "./middlewares/logger.js";

dotenv.config();
const app = express();

app.use(express.json());
app.use(logger);
app.use("/", urlRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`Server started on port ${process.env.PORT}`);
    });
  })
  .catch(err => {
    console.error("DB connection error", err);
  });
