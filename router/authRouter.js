import express from "express";
import {
    register ,
    login ,
    logout,
    sendOTP,
    verifyOTP,
    forgetPassword} 
from "../controller/authController.js";

import { verifyToken } from "../Utils/verifyToken.js";

const router = express.Router();
router.post('/sendOTP', sendOTP);
router.post('/verifyOTP', verifyOTP);
router.post("/register", register)
router.post("/login" , login)
router.post("/logout",logout);
router.put("/forgetPass" , forgetPassword)

export default router