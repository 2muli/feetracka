import express from "express";
import { addStudent, deleteStudent, getClasses, getLatestTenStudents, getStudentById, getStudentCount, getStudents, getStudentsByClass, payingStudent, searchStudents, updateStudent } from "../controllers/StudentController.js";
import { verifyToken } from "../controllers/UserController.js";
import { checkIfUserIsActive } from "../utils/isActive.js";


const router = express.Router();
router.get("/",verifyToken,checkIfUserIsActive,getStudents);
router.get("/studentsByClass",verifyToken,checkIfUserIsActive,getStudentsByClass);
router.get("/search",verifyToken,checkIfUserIsActive,searchStudents);
router.get("/searchStudents",verifyToken,checkIfUserIsActive,payingStudent);
router.get("/getLatestStudents",verifyToken,checkIfUserIsActive,getLatestTenStudents);
router.get("/classes",verifyToken,checkIfUserIsActive,getClasses);
router.post("/addStudent",verifyToken,checkIfUserIsActive, addStudent);
router.put("/updateStudent/:id",verifyToken,checkIfUserIsActive,updateStudent);
router.get("/studentById/:id",verifyToken,checkIfUserIsActive,getStudentById)
router.get("/studentNumber",verifyToken,checkIfUserIsActive,getStudentCount);   
router.delete("/:id",verifyToken,checkIfUserIsActive, deleteStudent);
export default router;

