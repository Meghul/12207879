import Url from "../models/Urlmodel.js";
import Click from "../models/Clickmodel.js";
import { generateShortcode } from "../utils/shortcodegenerator.js";

export const createShortUrl = async (req, res) => {
  try {
    let { url, validity, shortcode } = req.body;

    if (!url) return res.status(400).json({ error: "Missing URL." });

    const validityMinutes = parseInt(validity) || 30;
    const expiresAt = new Date(Date.now() + validityMinutes * 60 * 1000);

    if (shortcode) {
      const valid = /^[a-zA-Z0-9]{4,10}$/.test(shortcode);
      if (!valid) return res.status(400).json({ error: "Invalid custom shortcode." });

      const exists = await Url.findOne({ shortcode });
      if (exists) return res.status(409).json({ error: "Shortcode already in use." });
    } else {
      let unique = false;
      while (!unique) {
        shortcode = generateShortcode();
        const exists = await Url.findOne({ shortcode });
        if (!exists) unique = true;
      }
    }

    const newUrl = new Url({ url, shortcode, expiresAt });
    await newUrl.save();

    res.status(201).json({
      message: "Short URL created",
      shortLink: `http://localhost:${process.env.PORT}/${shortcode}`,
      expiry: expiresAt
    });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const handleRedirect = async (req, res) => {
  const { shortcode } = req.params;

  const urlData = await Url.findOne({ shortcode });
  if (!urlData) return res.status(404).json({ error: "Shortcode not found" });

  if (new Date() > urlData.expiresAt) {
    return res.status(410).json({ error: "Shortcode expired" });
  }

  await new Click({
    shortcode,
    referrer: req.get("Referer") || "direct",
    ip: req.ip
  }).save();

  res.redirect(urlData.url);
};

export const getShortUrlStats = async (req, res) => {
  const { shortcode } = req.params;

  const urlData = await Url.findOne({ shortcode });
  if (!urlData) return res.status(404).json({ error: "Shortcode not found" });

  const clicks = await Click.find({ shortcode });

  res.status(200).json({
    originalUrl: urlData.url,
    shortLink: `http://localhost:${process.env.PORT}/${shortcode}`,
    createdAt: urlData.createdAt,
    expiry: urlData.expiresAt,
    totalClicks: clicks.length,
    clickDetails: clicks.map(click => ({
      timestamp: click.timestamp,
      referrer: click.referrer,
      ip: click.ip
    }))
  });
};
