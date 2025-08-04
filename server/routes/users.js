import express from "express";
import {
    changePassword,
    deleteUser,
    getLoggedUser,
    getUserById,
    getUsers,
    login,
    logout,
    Register,
    resetPasswordWithToken,
    toggleUserActivation,
    updateUser,
    verifyToken,
} from "../controllers/UserController.js";
import { checkIfUserIsActive } from "../utils/isActive.js";
import isAdmin from "../utils/isAdmin.js";

const router = express.Router();

router.get("/", verifyToken, isAdmin, checkIfUserIsActive, getUsers);
router.get("/loggedUser", verifyToken, checkIfUserIsActive, getLoggedUser);
router.post("/login", login);
router.post("/changePassword", verifyToken, checkIfUserIsActive, changePassword);
router.post("/logout", verifyToken, checkIfUserIsActive, logout);
router.post("/register", Register);
router.patch("/:id/toggle-activation", verifyToken, isAdmin, checkIfUserIsActive, toggleUserActivation);
router.get("/userById/:id", verifyToken,isAdmin, checkIfUserIsActive, getUserById);
router.put("/updateUser/:id", verifyToken, isAdmin, checkIfUserIsActive, updateUser);
router.put("/reset-password/:token", resetPasswordWithToken);
router.delete("/:id", verifyToken, isAdmin, checkIfUserIsActive, deleteUser);

export default router;
