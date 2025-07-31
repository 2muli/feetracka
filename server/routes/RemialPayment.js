import express from "express";
import { addRemedialPayment, deleteRemedialPayment, getRemedialBalance, getRemedialPaymentById, getRemedialPaymentByStudentId, getRemedialPayments, getRemedialPaymentSummary, getRemedialStudentBalance, getRemedialTodayPayments, getRemedialTotalPayments, updateRemedialPayment } from "../controllers/RemedialPaymentController.js";
import { verifyToken } from "../controllers/UserController.js";
const router = express.Router();

router.get("/todayRemedialPayments",verifyToken,getRemedialTodayPayments);
router.get("/getTotalRemedialPayments",verifyToken,getRemedialTotalPayments);
router.get("/getRemedialPaymentSummary",verifyToken,getRemedialPaymentSummary);
router.get('/getRemedialStudentBalances',verifyToken,getRemedialStudentBalance);
router.get('/getRemedialPaymentByStudent/:studentId',verifyToken,getRemedialPaymentByStudentId);
router.post("/addRemedialPayment",verifyToken,addRemedialPayment);
router.put("/updateRemedialPayment/:id",verifyToken,updateRemedialPayment);
router.get("/getRemedialBalance",verifyToken, getRemedialBalance);
router.get("/",verifyToken, getRemedialPayments);
router.get("/:id",verifyToken, getRemedialPaymentById); 
router.delete("/:id",verifyToken,deleteRemedialPayment);  
export default router;