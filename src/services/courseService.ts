import Course from "../models/courseModel";

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
