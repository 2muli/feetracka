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

const router = express.Router();

router.get("/",verifyToken, getUsers);  
router.get("/loggedUser",verifyToken, getLoggedUser); // ✅ Protected
router.post('/login', login); 
router.post('/changePassword',verifyToken,changePassword);
router.post('/logout',logout);
router.post('/register', Register);
router.put('/updateUser/:id',verifyToken,updateUser);
router.put('/reset-password/:token', resetPasswordWithToken);
router.delete('/:id',verifyToken,deleteUser);

export default router;
