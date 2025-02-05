import { Request, Response } from "express";
import * as courseService from "../services/courseService";
import { getAuth } from "@clerk/express";

export const getListOfCourses = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { category } = req.query;
  try {
    const courses = await courseService.getListOfCourses(category as string);
    res.json({ message: "Courses retrieved successfully!!!", data: courses });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error retrieving courses", error: error.message });
  }
};

export const getCourse = async (req: Request, res: Response): Promise<void> => {
  const { courseId } = req.params;
  try {
    const course = await courseService.getCourse(courseId);
    res.json({ message: "Course retrieved successfully!!!", data: course });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error retrieving course", error: error.message });
  }
};

export const createCourse = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { teacherId, teacherName } = req.body;
  try {
    const newCourse = await courseService.createCourse(teacherId, teacherName);
    res.json({ message: "Course created successfully!!!", data: newCourse });
  } catch (error: any) {
    res.status(500).json({ message: "Error creating course", error });
  }
};

export const updateCourse = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { courseId } = req.params;
  const updateData = { ...req.body };
  const { userId } = getAuth(req);

  if (userId === null) {
    res.status(400).json({ message: "User is not authenticated" });
    return;
  }

  try {
    const course = await courseService.updateCourse(
      courseId,
      updateData,
      userId
    );
    res.json({ message: "Course updated successfully!!!", data: course });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error updating course", error: error.message });
  }
};

export const deleteCourse = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { courseId } = req.params;
  const { userId } = getAuth(req);

  if (userId === null) {
    res.status(400).json({ message: "User is not authenticated" });
    return;
  }

  try {
    await courseService.deleteCourse(courseId, userId);
    res.json({ message: "Course deleted successfully!!!" });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error deleting course", error: error.message });
  }
};
