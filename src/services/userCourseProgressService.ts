import Course from "../models/courseModel";
import UserCourseProgress from "../models/userCourseProgressModel";
import { calculateOverallProgress, mergeSections } from "../utils";

export const getUserEnrolledCourses = async (userId: string) => {
  if (!userId) {
    throw new Error(
      "Missing required parameter in service: userId is required."
    );
  }

  try {
    const enrolledCourses = await UserCourseProgress.query("userId")
      .eq(userId)
      .exec();
    const courseIds = enrolledCourses.map((item: any) => item.courseId);
    const courses = await Course.batchGet(courseIds);
    if (!courses) {
      throw new Error("Courses not found");
    }

    return courses;
  } catch (error) {
    throw new Error("Error retrieving enrolled courses");
  }
};

export const getUserCoursesProgress = async (
  userId: string,
  courseId: string
) => {
  if (!userId || !courseId) {
    throw new Error(
      "Missing required parameter in service: userId, courseId are all required."
    );
  }

  try {
    const progress = await UserCourseProgress.get({ userId, courseId });

    return progress;
  } catch (error) {
    throw new Error("Error retrieving course progress");
  }
};

export const updateUserCoursesProgress = async (
  userId: string,
  courseId: string,
  progressData: any
) => {
  if (!userId || !courseId) {
    throw new Error(
      "Missing required parameter in service: userId, courseId are all required."
    );
  }

  try {
    let progress = await UserCourseProgress.get({ userId, courseId });

    if (!progress) {
      progress = new UserCourseProgress({
        userId,
        courseId,
        enrollmentDate: new Date().toISOString(),
        overallProgress: 0,
        sections: progressData.sections || [],
        lastAccessedTimestamp: new Date().toISOString(),
      });
    } else {
      progress.sections = mergeSections(
        progress.sections,
        progressData.sections || []
      );
      progress.lastAccessedTimestamp = new Date().toISOString();
      progress.overallProgress = calculateOverallProgress(progress.sections);
    }

    await progress.save();
    return progress;
  } catch (error) {
    throw new Error("Error updating user course progress");
  }
};
