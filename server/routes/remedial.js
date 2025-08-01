// routes/fee.js
import express from "express";
import { addRemedial, deleteRemedial, getRemedialById, getRemedialByTerm, getRemedials, getRemedialTerms, updateRemedial } from "../controllers/RemedialController.js";
import { verifyToken } from "../controllers/UserController.js";
import { checkIfUserIsActive } from "../utils/isActive.js";


const router = express.Router();

router.get("/terms/list",verifyToken,checkIfUserIsActive,getRemedialTerms);
router.post("/",verifyToken,checkIfUserIsActive,addRemedial);
router.get("/",verifyToken,checkIfUserIsActive,getRemedials);
router.get("/byClass/:term",verifyToken,checkIfUserIsActive,getRemedialByTerm);
router.put("/updateRemedial/:id",verifyToken,checkIfUserIsActive,updateRemedial);
router.get("/:id",verifyToken,checkIfUserIsActive,getRemedialById);
router.delete("/:id",verifyToken,checkIfUserIsActive, deleteRemedial);

export default router;
