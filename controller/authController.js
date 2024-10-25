import bcrypt from "bcrypt";
import { ApiError } from "../Utils/apiError.js";
import JsonWebToken from "jsonwebtoken";
import User from "../model/User/User.js";
// import subAccount from '../model/User/subAccounts.js'
import Logger from "../Services/logger.js";
const logger = new Logger("AuthControllers");
import dotenv from "dotenv";
import { mailSender } from "../Utils/mailSender.js";
dotenv.config({ path: "config/config.env" });
import Randomstring from "randomstring";

///////////////////////////////////REGISTER TO SYSTEM ////////////////////////////////////////////////
function generateOTP() {
  return Randomstring.generate({
    length: 4,
    charset: "numeric",
  });
}
/////////////////////////////////////////////////////////////////////////////////////////////
export const verifyOTP = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email: email });
    if (user.otp == otp) {
      await User.findByIdAndUpdate(user.id, { received: otp }, { new: true });
      res
        .status(200)
        .json({ success: true, message: "OTP verification successful" });
    } else {
      res.status(400).json({ success: false, error: "Invalid OTP" });
    }
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};
/////////////////////////////////////////////////////////////////////////////////////////////
export const register = async (req, res, next) => {
  try {
    const { name, email, phone, password, city, address } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      if (req.body.UserId == undefined) {
        //generate new password
        const otp = generateOTP();
        await mailSender({
          to: email,
          subject: "Verification Email",
          message: `<h1>Please confirm your OTP</h1>
               <p>Here is your OTP code: ${otp}</p>`,
        });
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        //create new user
        if (req.body.typeofUser == "agency") {
          const newUser = new User({
            typeofUser: req.body.typeofUser,
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            password: hashedPassword,
            city: req.body.city,
            address: req.body.address,
            Limits: 20,
            otp: otp,
          });
          await newUser.save();
          res
            .status(200)
            .json({ message: "New User Created", userdata: newUser });
        } else {
          const newUser = new User({
            typeofUser: req.body.typeofUser,
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            password: hashedPassword,
            city: req.body.city,
            address: req.body.address,
            otp: otp,
          });
          await newUser.save();
          res
            .status(200)
            .json({ message: "New User Created", userdata: newUser });
        }
      } else {
        const userId = req.body.UserId;
        const user = await User.findById(userId);
        if (user.Limits > 0) {
          //generate new password
          const otp = generateOTP();
          await mailSender({
            to: email,
            subject: "Verification Email",
            message: `<h1>Please confirm your OTP</h1>
                <p>Here is your OTP code: ${otp}</p>`,
          });
          const salt = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hash(req.body.password, salt);
          //create new user
          const newUser = new User({
            typeofUser: req.body.typeofUser,
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            password: hashedPassword,
            city: req.body.city,
            address: req.body.address,
            otp: otp,
          });
          await newUser.save();
          res
            .status(200)
            .json({ message: "New User Created", userdata: newUser });

          await User.findByIdAndUpdate(
            user.id,
            { Limits: user.Limits - 1 },
            { new: true }
          );
        } else {
          res.status(300).json({ message: "You Should Upgrade your Account " });
        }
      }
    } else if (user) {
      if (user.otp == user.received) {
        res
          .status(200)
          .json({
            success: false,
            message: "This Email or Phone is Used Before",
          });
      } else {
        const otp = generateOTP();
        await mailSender({
          to: email,
          subject: "Verification Email",
          message: `<h1>Please confirm your OTP</h1>
               <p>Here is your OTP code: ${otp}</p>`,
        });
        await User.findByIdAndUpdate(user.id, { otp: otp }, { new: true });
        res
          .status(200)
          .json({ success: true, message: "OTP sent successfully" });
      }
    }
  } catch (error) {
    logger.error("There is error", error);
    return next(new ApiError(`System Error ${error}`, 409));
  }
};
/////////////////////////////////////////////////////////////////////////////////////////////
export const login = async (req, res, next) => {
  try {
    const user = await User.findOne({ phone: req.body.phone }).populate({
      path: "UserId",
      select: "name-_id",
    });
    if (!user) {
      return next(new ApiError("User not found!", 404));
    } else {
      if (user.otp == user.received) {
        const isPasswordCorrect = await bcrypt.compare(
          req.body.password,
          user.password
        );
        if (!isPasswordCorrect) {
          return next(new ApiError("password isn't correct", 422));
        }

        const token = JsonWebToken.sign(
          { id: user._id, isAdmin: user.isAdmin },
          process.env.JWT
        );
        const { password, isAdmin, ...otherDetails } = user._doc;
        logger.info("User LogIn");
        res
          .cookie("accessToken", token, {
            httpOnly: true,
            sameSite: "lax",
          })
          .status(200)
          .json({ details: { ...otherDetails }, isAdmin, token: token });
      } else {
        return next(new ApiError("You Should verify your account", 300));
      }
    }
  } catch (error) {
    logger.error("There is error", error);
    return next(new ApiError(`System Error ${error}`, 404));
  }
};
/////////////////////////////////////////////////////////////////////////////////////////////
export const logout = async (req, res, next) => {
  try {
    // Clear the token from the cookies
    res.cookie("accessToken", "", { httpOnly: true, expires: new Date(0) });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    next(err);
  }
};
///////////////////////////////////////////////////////////////
export const forgetPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const otp = generateOTP();
    await mailSender({
      to: email,
      subject: "Verification Email",
      message: `<h1>Please confirm your OTP</h1>
               <p>Here is your OTP code: ${otp}</p>`,
    });
    const user = await User.findOne({ email: email });
    if (user) {
      await User.findByIdAndUpdate(user.id, { otp: otp }, { new: true });
    }
  } catch (error) {
    next(new ApiError("System Error", 404));
  }
};
/////////////////////////////////////////////////////////////////////////////////////////////
export const changePassword = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const userAccount = await User.findOne({ email: email });
    const newDateforUser = await User.findByIdAndUpdate(userAccount.id, {
      password: hashedPassword,
    });
    res
      .status(200)
      .json({ Message: "Your Passwprd is Updated", UserData: newDateforUser });
  } catch (error) {
    return next(new ApiError("System Error", 404));
  }
};

////////////////////////////Mahmoud Ahmed Saeed ///////////////////////////////////
