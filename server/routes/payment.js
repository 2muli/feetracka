import express from "express";
import { canPayForTerm, getStudentTermBalances } from "../controllers/FeeController.js";
import { addPayment, deletePayment, getBalance, getPaymentById, getPaymentByStudentId, getPayments, getPaymentSummary, getStudentBalance, getTodayPayments, getTotalPayments, updatePayment } from "../controllers/PaymentController.js";
import { verifyToken } from "../controllers/UserController.js";
import { canIPay } from "../utils/canIPay.js";
const router = express.Router();

// Get all fee structures
router.get("/todayPayments",verifyToken,getTodayPayments);
router.get("/getTotalPayments",verifyToken,getTotalPayments);
router.get("/getPaymentSummary",verifyToken,getPaymentSummary);
router.get('/getStudentBalances',verifyToken,getStudentBalance);
router.get("/getBalance",verifyToken, getBalance);
router.post("/addPayment",canIPay,verifyToken,addPayment);
router.get('/getStudentPayments/:studentId',verifyToken,getPaymentByStudentId)
router.put("/updatepayment/:id",canIPay,verifyToken,updatePayment);
router.get("/",verifyToken, getPayments);
router.get("/:id",verifyToken, getPaymentById); 
router.delete("/:id",verifyToken,deletePayment);  
router.get("/student-term-balance/:studentId", getStudentTermBalances);
router.post("/can-pay-term", canPayForTerm);

export default router;