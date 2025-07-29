import express from "express";
import { addStudent, deleteStudent, getLatestTenStudents, getStudentById, getStudentCount, getStudents, getStudentsByClass, payingStudent, searchStudents, updateStudent } from "../controllers/StudentController.js";
import { verifyToken } from "../controllers/UserController.js";


const router = express.Router();
router.get("/",verifyToken,getStudents);
router.get("/studentsByClass",verifyToken,getStudentsByClass);
router.get("/search",verifyToken,searchStudents);
router.get("/searchStudents",verifyToken,payingStudent);
router.get("/getLatestStudents",verifyToken,getLatestTenStudents);
router.post("/addStudent",verifyToken, addStudent);
router.put("/updateStudent/:id", verifyToken,updateStudent);
router.get("/studentById/:id",verifyToken,getStudentById)
router.get("/studentNumber",verifyToken,getStudentCount);   
router.delete("/:id",verifyToken ,deleteStudent);
export default router;

