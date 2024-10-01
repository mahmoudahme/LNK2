import express from "express";
import {
    createlisting,
    getAllMyListing,
    getAllListing,
    updateListing,
    deleteListing,
    oneListFromMyListing,
    getAllcostalList
} 
from "../controller/listingController.js";
import { verifyToken } from "../Utils/verifyToken.js";
import fs from "fs";
const router = express.Router();
import multer from "multer";
const uploadDir = 'uploads/Images';
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


router.post("/", upload.array('images', 20),createlisting)
router.get("/" ,getAllListing)
router.get("/:id", getAllMyListing)
router.get("/:id/:listid", oneListFromMyListing)
router.put("/:id", updateListing)
router.delete("/:id", deleteListing)

export default router