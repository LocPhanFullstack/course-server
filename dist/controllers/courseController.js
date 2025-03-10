"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUploadVideoUrl = exports.deleteCourse = exports.updateCourse = exports.createCourse = exports.getCourse = exports.getListOfCourses = void 0;
const courseService = __importStar(require("../services/courseService"));
const express_1 = require("@clerk/express");
const getListOfCourses = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { category } = req.query;
    try {
        const courses = yield courseService.getListOfCourses(category);
        res.json({ message: "Courses retrieved successfully!!!", data: courses });
    }
    catch (error) {
        res
            .status(500)
            .json({ message: "Error retrieving courses", error: error.message });
    }
});
exports.getListOfCourses = getListOfCourses;
const getCourse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { courseId } = req.params;
    try {
        const course = yield courseService.getCourse(courseId);
        res.json({ message: "Course retrieved successfully!!!", data: course });
    }
    catch (error) {
        res
            .status(500)
            .json({ message: "Error retrieving course", error: error.message });
    }
});
exports.getCourse = getCourse;
const createCourse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { teacherId, teacherName } = req.body;
    try {
        const newCourse = yield courseService.createCourse(teacherId, teacherName);
        res.json({ message: "Course created successfully!!!", data: newCourse });
    }
    catch (error) {
        res.status(500).json({ message: "Error creating course", error });
    }
});
exports.createCourse = createCourse;
const updateCourse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { courseId } = req.params;
    const updateData = Object.assign({}, req.body);
    const { userId } = (0, express_1.getAuth)(req);
    if (userId === null) {
        res.status(400).json({ message: "User is not authenticated" });
        return;
    }
    try {
        const course = yield courseService.updateCourse(courseId, updateData, userId);
        res.json({ message: "Course updated successfully!!!", data: course });
    }
    catch (error) {
        res
            .status(500)
            .json({ message: "Error updating course", error: error.message });
    }
});
exports.updateCourse = updateCourse;
const deleteCourse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { courseId } = req.params;
    const { userId } = (0, express_1.getAuth)(req);
    if (userId === null) {
        res.status(400).json({ message: "User is not authenticated" });
        return;
    }
    try {
        yield courseService.deleteCourse(courseId, userId);
        res.json({ message: "Course deleted successfully!!!" });
    }
    catch (error) {
        res
            .status(500)
            .json({ message: "Error deleting course", error: error.message });
    }
});
exports.deleteCourse = deleteCourse;
const getUploadVideoUrl = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { fileName, fileType } = req.body;
    try {
        const data = yield courseService.getUploadVideoUrl(fileName, fileType);
        res.json({
            message: "Upload URL generated successfully",
            data,
        });
    }
    catch (error) {
        res
            .status(500)
            .json({ message: "Error generating upload URL", error: error.message });
    }
});
exports.getUploadVideoUrl = getUploadVideoUrl;
