import express from "express";
import * as courseController from "../controllers/courseController";
import { requireAuth } from "@clerk/express";
import multer from "multer";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get("/", courseController.getListOfCourses);
router.get("/:courseId", courseController.getCourse);
router.put(
  "/:courseId",
  requireAuth(),
  upload.single("image"),
  courseController.updateCourse
);
router.post("/", requireAuth(), courseController.createCourse);

export default router;
