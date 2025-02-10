"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserCoursesProgress = exports.getUserCoursesProgress = exports.getUserEnrolledCourses = void 0;
const courseModel_1 = __importDefault(require("../models/courseModel"));
const userCourseProgressModel_1 = __importDefault(require("../models/userCourseProgressModel"));
const utils_1 = require("../utils");
const getUserEnrolledCourses = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    if (!userId) {
        throw new Error("Missing required parameter in service: userId is required.");
    }
    try {
        const enrolledCourses = yield userCourseProgressModel_1.default.query("userId")
            .eq(userId)
            .exec();
        const courseIds = enrolledCourses.map((item) => item.courseId);
        const courses = yield courseModel_1.default.batchGet(courseIds);
        if (!courses) {
            throw new Error("Courses not found");
        }
        return courses;
    }
    catch (error) {
        throw new Error("Error retrieving enrolled courses");
    }
});
exports.getUserEnrolledCourses = getUserEnrolledCourses;
const getUserCoursesProgress = (userId, courseId) => __awaiter(void 0, void 0, void 0, function* () {
    if (!userId || !courseId) {
        throw new Error("Missing required parameter in service: userId, courseId are all required.");
    }
    try {
        const progress = yield userCourseProgressModel_1.default.get({ userId, courseId });
        return progress;
    }
    catch (error) {
        throw new Error("Error retrieving course progress");
    }
});
exports.getUserCoursesProgress = getUserCoursesProgress;
const updateUserCoursesProgress = (userId, courseId, progressData) => __awaiter(void 0, void 0, void 0, function* () {
    if (!userId || !courseId) {
        throw new Error("Missing required parameter in service: userId, courseId are all required.");
    }
    try {
        let progress = yield userCourseProgressModel_1.default.get({ userId, courseId });
        if (!progress) {
            progress = new userCourseProgressModel_1.default({
                userId,
                courseId,
                enrollmentDate: new Date().toISOString(),
                overallProgress: 0,
                sections: progressData.sections || [],
                lastAccessedTimestamp: new Date().toISOString(),
            });
        }
        else {
            progress.sections = (0, utils_1.mergeSections)(progress.sections, progressData.sections || []);
            progress.lastAccessedTimestamp = new Date().toISOString();
            progress.overallProgress = (0, utils_1.calculateOverallProgress)(progress.sections);
        }
        yield progress.save();
        return progress;
    }
    catch (error) {
        throw new Error("Error updating user course progress");
    }
});
exports.updateUserCoursesProgress = updateUserCoursesProgress;
