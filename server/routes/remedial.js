// routes/fee.js
import express from "express";
import { addRemedial, deleteRemedial, getRemedialById, getRemedialByTerm, getRemedials, getRemedialTerms, updateRemedial } from "../controllers/RemedialController.js";
import { verifyToken } from "../controllers/UserController.js";


const router = express.Router();

router.get("/terms/list",verifyToken,getRemedialTerms);
router.post("/",verifyToken,addRemedial);
router.get("/",verifyToken,getRemedials);
router.get("/byClass/:term",verifyToken,getRemedialByTerm);
router.put("/updateRemedial/:id",verifyToken,updateRemedial);
router.get("/:id",verifyToken,getRemedialById);
router.delete("/:id",verifyToken, deleteRemedial);

export default router;
