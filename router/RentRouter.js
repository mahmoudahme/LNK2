import express from "express";
import {
  createRent,
  deleteListing,
  getAllListing,
  getAllMyListing,
  oneListFromMyListing,
  updateListing
} 
from "../controller/rentController.js";
import { verifyToken } from "../Utils/verifyToken.js";
import fs from "fs";
import multer from "multer";
const router = express.Router();
const uploadDir = 'uploads/rent';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// إعداد Multer لرفع الصور
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // مجلد تخزين الصور
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // حفظ الصورة باسمها الأصلي
  }
});
const upload = multer({ storage: storage });
router.post("/",upload.array('images', 20), createRent)
router.get("/" ,getAllListing)
router.get("/:id", getAllMyListing)
router.get("/:id/:listid", oneListFromMyListing)
router.put("/:id", updateListing)
router.delete("/:id", deleteListing)

export default router