// routes/fee.js
import express from "express";
import {
    addFee,
    deleteFee,
    getFeeById,
    getFees,
    getTerms,
    updateFee
} from "../controllers/feeController.js";
import { verifyToken } from "../controllers/UserController.js";


const router = express.Router();

router.get("/terms/list",verifyToken, getTerms);
router.post("/addFee",verifyToken,addFee);
router.get("/",verifyToken,getFees);
router.get("/:id",verifyToken,getFeeById);
router.put("/updateFee/:id",verifyToken,updateFee);
router.delete("/:id",verifyToken, deleteFee);

export default router;
