const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { fromBuffer } = require("file-type"); // ✅ New import for real file verification

// Ensure uploads/tickets folder exists
const uploadDir = "uploads/tickets";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() + "-" + file.originalname.replace(/\s+/g, "_");
    cb(null, uniqueName);
  },
});

// ✅ Secure file filter using real file headers (magic bytes)
const fileFilter = async (req, file, cb) => {
  try {
    // Read first few bytes of the file
    const chunks = [];
    file.stream.on("data", (chunk) => chunks.push(chunk));
    file.stream.on("end", async () => {
      const buffer = Buffer.concat(chunks);
      const fileType = await fromBuffer(buffer);

      // Allow only images or PDFs by actual file type
      const allowedTypes = ["image/png", "image/jpeg", "application/pdf"];

      if (fileType && allowedTypes.includes(fileType.mime)) {
        cb(null, true);
      } else {
        cb(new Error("Invalid file type. Only PDF, PNG, JPG files are allowed."));
      }
    });
  } catch (err) {
    cb(new Error("File validation failed"));
  }
};

// Create multer upload instance
const uploadAttachment = multer({
  storage,
  fileFilter,
});

module.exports = uploadAttachment;
