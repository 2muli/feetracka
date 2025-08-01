import express from "express";
import { addRemedialPayment, deleteRemedialPayment, getRemedialBalance, getRemedialPaymentById, getRemedialPaymentByStudentId, getRemedialPayments, getRemedialPaymentSummary, getRemedialStudentBalance, getRemedialTodayPayments, getRemedialTotalPayments, updateRemedialPayment } from "../controllers/RemedialPaymentController.js";
import { verifyToken } from "../controllers/UserController.js";
import { checkIfUserIsActive } from "../utils/isActive.js";
const router = express.Router();

router.get("/todayRemedialPayments",verifyToken,checkIfUserIsActive,getRemedialTodayPayments);
router.get("/getTotalRemedialPayments",verifyToken,checkIfUserIsActive,getRemedialTotalPayments);
router.get("/getRemedialPaymentSummary",verifyToken,checkIfUserIsActive,getRemedialPaymentSummary);
router.get('/getRemedialStudentBalances',verifyToken,checkIfUserIsActive,getRemedialStudentBalance);
router.get('/getRemedialPaymentByStudent/:studentId',verifyToken,checkIfUserIsActive,getRemedialPaymentByStudentId);
router.post("/addRemedialPayment",verifyToken,checkIfUserIsActive,addRemedialPayment);
router.put("/updateRemedialPayment/:id",verifyToken,checkIfUserIsActive,updateRemedialPayment);
router.get("/getRemedialBalance",verifyToken,checkIfUserIsActive, getRemedialBalance);
router.get("/",verifyToken,checkIfUserIsActive, getRemedialPayments);
router.get("/:id",verifyToken,checkIfUserIsActive, getRemedialPaymentById); 
router.delete("/:id",verifyToken,checkIfUserIsActive,deleteRemedialPayment);  
export default router;