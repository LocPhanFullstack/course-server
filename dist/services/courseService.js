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
exports.getCourse = exports.getListOfCourses = void 0;
const courseModel_1 = __importDefault(require("../models/courseModel"));
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
