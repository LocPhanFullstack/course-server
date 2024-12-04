import { Schema, model, transaction } from "dynamoose";

const transactionSchema = new Schema(
  {
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
  },
  {
    saveUnknown: true,
    timestamps: true,
  }
);

const Transaction = model("Transaction", transactionSchema);

export default Transaction;
