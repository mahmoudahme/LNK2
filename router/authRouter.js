import express from "express";
import {
    register ,
    login ,
    logout,
    verifyOTP,
    forgetPassword ,
    changePassword
} 
from "../controller/authController.js";

import { verifyToken } from "../Utils/verifyToken.js";

const router = express.Router();
router.post('/verifyOTP', verifyOTP);
router.post("/register", register)
router.post("/login" , login)
router.post("/logout",logout);
router.put("/forgetPass" , forgetPassword)
router.put("/changePassword" ,  changePassword)

export default router
