import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { Readable } from "stream";

// Configure Cloudinary (reads from .env)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Use memory storage — buffer the file, then stream to Cloudinary
const storage = multer.memoryStorage();

// Only accept images
const fileFilter = (_req, file, cb) => {
  const allowed = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only .jpg, .jpeg, .png and .webp files are allowed"), false);
  }
};

export const upload = multer({ storage, fileFilter });

/**
 * Express middleware — uploads req.file buffer to Cloudinary.
 * Attaches { url, public_id } to req.cloudinary after upload.
 * Must be placed AFTER upload.single("image") in the route chain.
 */
export const uploadToCloudinary = (req, res, next) => {
  if (!req.file) return next(); // no file — nothing to do

  const stream = cloudinary.uploader.upload_stream(
    {
      folder: "bakehub",
      transformation: [{ width: 1200, crop: "limit", quality: "auto" }],
    },
    (error, result) => {
      if (error) {
        console.error("[Cloudinary upload error]", error);
        return res.status(500).json({ error: "Image upload failed" });
      }
      // Attach result so controllers can read it
      req.cloudinary = result;
      // Also set req.file.path so existing controllers work unchanged
      req.file.path = result.secure_url;
      req.file.filename = result.public_id;
      next();
    }
  );

  // Pipe the memory buffer into the Cloudinary stream
  const readable = new Readable();
  readable.push(req.file.buffer);
  readable.push(null);
  readable.pipe(stream);
};
