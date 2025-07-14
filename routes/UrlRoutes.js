import express from "express";
import {
  createShortUrl,
  handleRedirect,
  getShortUrlStats
} from "../controllers/UrlControllers.js";

const router = express.Router();

router.post("/shorturls", createShortUrl);
router.get("/shorturls/:shortcode", getShortUrlStats);
router.get("/:shortcode", handleRedirect);

export default router;
