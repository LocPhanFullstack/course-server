import { Request, Response } from "express";
import * as courseService from "../services/courseService";

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
