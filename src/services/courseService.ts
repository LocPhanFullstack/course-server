import Course from "../models/courseModel";
import { v4 as uuidv4 } from "uuid";

// List courses based on category
export const getListOfCourses = async (category: string | undefined) => {
  try {
    const courses =
      category && category !== "all"
        ? await Course.scan("category").eq(category).exec()
        : await Course.scan().exec();
    return courses;
  } catch (error) {
    throw new Error("Error retrieving courses");
  }
};

// Get a single course by ID
export const getCourse = async (courseId: string) => {
  try {
    const course = await Course.get(courseId);
    if (!course) {
      throw new Error("Course not found");
    }
    return course;
  } catch (error) {
    throw new Error("Error retrieving course");
  }
};

export const createCourse = async (teacherId: string, teacherName: string) => {
  if (!teacherId || !teacherName) {
    throw new Error(
      "Missing required parameters in service: teacherName and teacherId are all required."
    );
  }
  try {
    const newCourse = new Course({
      courseId: uuidv4(),
      teacherId,
      teacherName,
      title: "Untitled Course",
      description: "",
      category: "Uncategorized",
      image: "",
      price: 0,
      level: "Beginner",
      status: "Draft",
      sections: [],
      enrollments: [],
    });
    await newCourse.save();
  } catch (error) {
    throw new Error("Error retrieving course");
  }
};

export const updateCourse = async (
  courseId: string,
  updateData: any,
  userId: string
) => {
  if (!courseId || !updateData || !userId) {
    throw new Error(
      "Missing required parameters in service: courseId, userId, updateData are all required."
    );
  }

  const course = await Course.get(courseId);
  if (!course) {
    throw new Error("Course not found");
  }

  if (course.teacherId !== userId) {
    throw new Error("Not authorized to update this course");
  }

  if (updateData.price) {
    const price = parseInt(updateData.price);
    if (isNaN(price)) {
      throw new Error("Price must be a valid number");
    }
    updateData.price = price * 100;
  }

  if (updateData.sections) {
    const sectionsData =
      typeof updateData.sections === "string"
        ? JSON.parse(updateData.sections)
        : updateData.sections;

    updateData.sections = sectionsData.map((section: any) => ({
      ...section,
      sectionId: section.sectionId || uuidv4(),
      chapters: section.chapters.map((chapter: any) => ({
        ...chapter,
        chapterId: chapter.chapterId || uuidv4(),
      })),
    }));
  }

  Object.assign(course, updateData);
  await course.save();
  return course;
};

export const deleteCourse = async (courseId: string, userId: string) => {
  if (!courseId || !userId) {
    throw new Error(
      "Missing required parameters in service: courseId, userId are all required."
    );
  }

  const course = await Course.get(courseId);
  if (!course) {
    throw new Error("Course not found");
  }

  if (course.teacherId !== userId) {
    throw new Error("Not authorized to delete this course");
  }

  await Course.delete(courseId);
};
