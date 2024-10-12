import  express  from "express";
import {verifyToken} from "../Utils/verifyToken.js"
import {getAllUsers ,deleteUser ,getUserById , updateUser, getAnotherUser , addCredits} from "../controller/userController.js";

const router = express.Router();

router.get("/" , getAllUsers);
router.get("/:id" , getUserById);
router.delete("/:id" , deleteUser);
router.put("/:id"  , updateUser);
router.get("/another/:id" , getAnotherUser);
router.post("/:id" , addCredits)
export default router