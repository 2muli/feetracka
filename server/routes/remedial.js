// routes/fee.js
import express from "express";
import { addRemedial, deleteRemedial, getRemedialById, getRemedials, updateRemedial } from "../controllers/RemedialController.js";
import { verifyToken } from "../controllers/UserController.js";
import { getTerms } from "../controllers/feeController.js";


const router = express.Router();

router.get("/terms/list",verifyToken,getTerms);
router.post("/",verifyToken,addRemedial);
router.get("/",verifyToken,getRemedials);
router.put("/updateRemedial/:id",verifyToken,updateRemedial);
router.get("/:id",verifyToken,getRemedialById);
router.delete("/:id",verifyToken, deleteRemedial);

export default router;
