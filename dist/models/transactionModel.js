"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dynamoose_1 = require("dynamoose");
const transactionSchema = new dynamoose_1.Schema({
    userId: {
        type: String,
        hashKey: true,
        required: true,
    },
    transactionId: {
        type: String,
        required: true,
        rangeKey: true,
    },
    courseId: {
        type: String,
        required: true,
        index: {
            name: "CourseTransactionIndex",
            type: "global",
        },
    },
    dateTime: {
        type: String,
        required: true,
    },
    paymentProvider: {
        type: String,
        enum: ["stripe"],
        required: true,
    },
    amount: Number,
}, {
    saveUnknown: true,
    timestamps: true,
});
const Transaction = (0, dynamoose_1.model)("Transaction", transactionSchema);
exports.default = Transaction;
