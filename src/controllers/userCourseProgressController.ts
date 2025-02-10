import { Request, Response } from "express";
import * as userCourseProgressService from "../services/userCourseProgressService";
import { getAuth } from "@clerk/express";

export const getUserEnrolledCourses = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { userId } = req.params;
  const auth = getAuth(req);

  if (!auth || auth.userId !== userId) {
    res.status(403).json({ message: "Access denied" });
    return;
  }

  try {
    const courses = await userCourseProgressService.getUserEnrolledCourses(
      userId
    );
    res.json({
      message: "Enrolled courses retrieved successfully!!!",
      data: courses,
    });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error retrieving course", error: error.message });
  }
};

export const getUserCoursesProgress = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { userId, courseId } = req.params;

  try {
    const progress = await userCourseProgressService.getUserCoursesProgress(
      userId,
      courseId
    );
    if (!progress) {
      res
        .status(404)
        .json({ message: "Course progress not found for this user" });
      return;
    }
    res.json({
      message: "Enrolled courses retrieved successfully!!!",
      data: progress,
    });
  } catch (error: any) {
    res.status(500).json({
      message: "Error retrieving course progress",
      error: error.message,
    });
  }
};

export const updateUserCoursesProgress = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { userId, courseId } = req.params;
  const progressData = req.body;

  try {
    const progress = await userCourseProgressService.updateUserCoursesProgress(
      userId,
      courseId,
      progressData
    );
    res.json({
      message: "",
      data: progress,
    });
  } catch (error: any) {
    res.status(500).json({
      message: "Error updating user course progress",
      error: error.message,
    });
  }
};
