// routes/fee.js
import express from "express";
import {
    addFee,
    deleteFee,
    getFeeByClassAndTerm,
    getFeeById,
    getFees,
    getTerms,
    updateFee
} from "../controllers/FeeController.js";
import { verifyToken } from "../controllers/UserController.js";
import { checkIfUserIsActive } from "../utils/isActive.js";


const router = express.Router();

router.get("/terms/list",verifyToken,checkIfUserIsActive, getTerms);
router.post("/addFee",verifyToken,checkIfUserIsActive,addFee);
router.get("/byClass/:classPaid/:term",verifyToken,checkIfUserIsActive,getFeeByClassAndTerm);
router.get("/",verifyToken,checkIfUserIsActive,getFees);    
router.get("/:id",verifyToken,checkIfUserIsActive,getFeeById);
router.put("/updateFee/:id",verifyToken,checkIfUserIsActive,updateFee);
router.delete("/:id",verifyToken,checkIfUserIsActive, deleteFee);

export default router;
