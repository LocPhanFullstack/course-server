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
exports.getListOfTransactions = exports.createTransaction = exports.createPaymentIntent = void 0;
// services/paymentService.ts
const stripe_1 = __importDefault(require("stripe"));
const dotenv_1 = __importDefault(require("dotenv"));
const courseModel_1 = __importDefault(require("../models/courseModel"));
const transactionModel_1 = __importDefault(require("../models/transactionModel"));
const userCourseProgressModel_1 = __importDefault(require("../models/userCourseProgressModel"));
dotenv_1.default.config();
if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY is required but was not found in env variables");
}
const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY);
const createPaymentIntent = (amount) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const paymentIntent = yield stripe.paymentIntents.create({
            amount,
            currency: "usd",
            automatic_payment_methods: {
                enabled: true,
                allow_redirects: "never",
            },
        });
        return paymentIntent;
    }
    catch (error) {
        throw new Error(`Error creating payment intent: ${error.message}`);
    }
});
exports.createPaymentIntent = createPaymentIntent;
const createTransaction = (userId, courseId, transactionId, amount, paymentProvider) => __awaiter(void 0, void 0, void 0, function* () {
    if (!userId || !courseId || !transactionId || !amount || !paymentProvider) {
        throw new Error("Missing required parameters in service: userId, courseId, transactionId, amount, and paymentProvider are all required.");
    }
    try {
        const course = yield courseModel_1.default.get(courseId);
        if (!course) {
            throw new Error("Course not found");
        }
        const newTransaction = new transactionModel_1.default({
            dateTime: new Date().toISOString(),
            userId,
            courseId,
            transactionId,
            amount,
            paymentProvider,
        });
        yield newTransaction.save();
        const initialProgress = new userCourseProgressModel_1.default({
            userId,
            courseId,
            enrollmentDate: new Date().toISOString(),
            overallProgress: 0,
            sections: course.sections.map((section) => ({
                sectionId: section.sectionId,
                chapters: section.chapters.map((chapter) => ({
                    chapterId: chapter.chapterId,
                    completed: false,
                })),
            })),
            lastAccessedTimestamp: new Date().toISOString(),
        });
        yield initialProgress.save();
        yield courseModel_1.default.update({ courseId }, {
            $ADD: {
                enrollments: [{ userId }],
            },
        });
        return { newTransaction, initialProgress };
    }
    catch (error) {
        throw new Error("Error creating transaction and enrollment: " + error.message);
    }
});
exports.createTransaction = createTransaction;
const getListOfTransactions = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const transactions = userId
            ? yield transactionModel_1.default.query("userId").eq(userId).exec()
            : transactionModel_1.default.scan().exec();
        return transactions;
    }
    catch (error) {
        throw new Error("Error getting list of transactions: " + error.message);
    }
});
exports.getListOfTransactions = getListOfTransactions;
