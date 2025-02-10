import express from "express";
import * as userCourseProgressController from "../controllers/userCourseProgressController";

const router = express.Router();

router.get(
  "/:userId/enrolled-courses",
  userCourseProgressController.getUserEnrolledCourses
);
router.get(
  "/:userId/courses/:courseId",
  userCourseProgressController.getUserCoursesProgress
);
router.put(
  "/:userId/courses/:courseId",
  userCourseProgressController.updateUserCoursesProgress
);

export default router;
