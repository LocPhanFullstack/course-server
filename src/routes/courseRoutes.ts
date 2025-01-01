import express from "express";
import * as courseController from "../controllers/courseController";
import { requireAuth } from "@clerk/express";
import multer from "multer";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get("/", courseController.getListOfCourses);
router.post("/", requireAuth(), courseController.createCourse);
router.get("/:courseId", courseController.getCourse);
router.delete("/:courseId", requireAuth(), courseController.deleteCourse);
router.put(
  "/:courseId",
  requireAuth(),
  upload.single("image"),
  courseController.updateCourse
);

export default router;
