import express from "express";
import * as courseController from "../controllers/courseController";

const router = express.Router();

router.post("/", courseController.getListOfCourses);
router.post("/:courseId", courseController.getCourse);

export default router;
