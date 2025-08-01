import express from "express";
import {
    changePassword,
    deleteUser,
    getLoggedUser,
    getUsers,
    login,
    logout,
    Register,
    resetPasswordWithToken,
    updateUser,
    verifyToken
} from "../controllers/UserController.js";
import { checkIfUserIsActive } from "../utils/isActive.js";
const router = express.Router();

router.get("/",verifyToken,checkIfUserIsActive, getUsers);  
router.get("/loggedUser",verifyToken,checkIfUserIsActive, getLoggedUser); // ✅ Protected
router.post('/login', login); 
router.post('/changePassword',verifyToken,checkIfUserIsActive,changePassword);
router.post('/logout',verifyToken,checkIfUserIsActive,logout);
router.post('/register', Register);
router.put('/updateUser/:id',verifyToken,checkIfUserIsActive,updateUser);
router.put('/reset-password/:token',resetPasswordWithToken);
router.delete('/:id',verifyToken,checkIfUserIsActive,deleteUser);

export default router;
