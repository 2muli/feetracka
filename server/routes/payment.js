import express from "express";
import { canPayForTerm, getStudentTermBalances } from "../controllers/FeeController.js";
import { addPayment, deletePayment, getBalance, getPaymentById, getPaymentByStudentId, getPayments, getPaymentSummary, getStudentBalance, getTodayPayments, getTotalPayments, updatePayment } from "../controllers/PaymentController.js";
import { verifyToken } from "../controllers/UserController.js";
import { canIPay } from "../utils/canIPay.js";
import { checkIfUserIsActive } from "../utils/isActive.js";
const router = express.Router();

router.get("/todayPayments",verifyToken,checkIfUserIsActive,getTodayPayments);
router.get("/getTotalPayments",verifyToken,checkIfUserIsActive,getTotalPayments);
router.get("/getPaymentSummary",verifyToken,checkIfUserIsActive,getPaymentSummary);
router.get('/getStudentBalances',verifyToken,checkIfUserIsActive,getStudentBalance);
router.get("/getBalance",verifyToken,checkIfUserIsActive, getBalance);
router.post("/addPayment",canIPay,verifyToken,checkIfUserIsActive,addPayment);
router.get('/getStudentPayments/:studentId',verifyToken,checkIfUserIsActive,getPaymentByStudentId)
router.put("/updatepayment/:id",canIPay,verifyToken,checkIfUserIsActive,updatePayment);
router.get("/",verifyToken,checkIfUserIsActive, getPayments);
router.get("/:id",verifyToken,checkIfUserIsActive, getPaymentById); 
router.delete("/:id",verifyToken,checkIfUserIsActive,deletePayment);  
router.get("/student-term-balance/:studentId", verifyToken,checkIfUserIsActive,getStudentTermBalances);
router.post("/can-pay-term", verifyToken,checkIfUserIsActive,canPayForTerm);

export default router;