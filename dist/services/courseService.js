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
exports.deleteCourse = exports.updateCourse = exports.createCourse = exports.getCourse = exports.getListOfCourses = void 0;
const courseModel_1 = __importDefault(require("../models/courseModel"));
const uuid_1 = require("uuid");
// List courses based on category
const getListOfCourses = (category) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const courses = category && category !== "all"
            ? yield courseModel_1.default.scan("category").eq(category).exec()
            : yield courseModel_1.default.scan().exec();
        return courses;
    }
    catch (error) {
        throw new Error("Error retrieving courses");
    }
});
exports.getListOfCourses = getListOfCourses;
// Get a single course by ID
const getCourse = (courseId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const course = yield courseModel_1.default.get(courseId);
        if (!course) {
            throw new Error("Course not found");
        }
        return course;
    }
    catch (error) {
        throw new Error("Error retrieving course");
    }
});
exports.getCourse = getCourse;
const createCourse = (teacherId, teacherName) => __awaiter(void 0, void 0, void 0, function* () {
    if (!teacherId || !teacherName) {
        throw new Error("Missing required parameters in service: teacherName and teacherId are all required.");
    }
    try {
        const newCourse = new courseModel_1.default({
            courseId: (0, uuid_1.v4)(),
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
        yield newCourse.save();
        return newCourse;
    }
    catch (error) {
        throw new Error("Error creating course");
    }
});
exports.createCourse = createCourse;
const updateCourse = (courseId, updateData, userId) => __awaiter(void 0, void 0, void 0, function* () {
    if (!courseId || !updateData || !userId) {
        throw new Error("Missing required parameters in service: courseId, userId, updateData are all required.");
    }
    const course = yield courseModel_1.default.get(courseId);
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
        const sectionsData = typeof updateData.sections === "string"
            ? JSON.parse(updateData.sections)
            : updateData.sections;
        updateData.sections = sectionsData.map((section) => (Object.assign(Object.assign({}, section), { sectionId: section.sectionId || (0, uuid_1.v4)(), chapters: section.chapters.map((chapter) => (Object.assign(Object.assign({}, chapter), { chapterId: chapter.chapterId || (0, uuid_1.v4)() }))) })));
    }
    Object.assign(course, updateData);
    yield course.save();
    return course;
});
exports.updateCourse = updateCourse;
const deleteCourse = (courseId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    if (!courseId || !userId) {
        throw new Error("Missing required parameters in service: courseId, userId are all required.");
    }
    const course = yield courseModel_1.default.get(courseId);
    if (!course) {
        throw new Error("Course not found");
    }
    if (course.teacherId !== userId) {
        throw new Error("Not authorized to delete this course");
    }
    yield courseModel_1.default.delete(courseId);
});
exports.deleteCourse = deleteCourse;
