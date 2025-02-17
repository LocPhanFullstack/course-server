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
exports.getListOfTransactions = exports.createTransaction = exports.createStripePaymentIntent = void 0;
const transactionService = __importStar(require("../services/transactionService"));
const createStripePaymentIntent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { amount } = req.body;
    if (!amount || amount <= 0) {
        amount = 50;
    }
    try {
        const paymentIntent = yield transactionService.createPaymentIntent(amount);
        res.json({
            message: "",
            data: {
                clientSecret: paymentIntent.client_secret,
            },
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Error creating stripe payment intent",
            error: error.message,
        });
    }
});
exports.createStripePaymentIntent = createStripePaymentIntent;
const createTransaction = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { userId, courseId, transactionId, amount, paymentProvider } = req.body;
    try {
        const { newTransaction, initialProgress } = yield transactionService.createTransaction(userId, courseId, transactionId, amount, paymentProvider);
        res.json({
            message: "Purchase a course successfully!!!",
            data: {
                transaction: newTransaction,
                courseProgress: initialProgress,
            },
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Error creating transaction and enrollment",
            error: error.message,
        });
    }
});
exports.createTransaction = createTransaction;
const getListOfTransactions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.query;
        const transactions = yield transactionService.getListOfTransactions(userId);
        res.json({
            message: "Transactions retrieved successfully!!!",
            data: transactions,
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Error getting list of transactions",
            error: error.message,
        });
    }
});
exports.getListOfTransactions = getListOfTransactions;
