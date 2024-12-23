import { Request, Response } from "express";
import * as transactionService from "../services/transactionService";

export const createStripePaymentIntent = async (
  req: Request,
  res: Response
): Promise<void> => {
  let { amount } = req.body;

  if (!amount || amount <= 0) {
    amount = 50;
  }

  try {
    const paymentIntent = await transactionService.createPaymentIntent(amount);

    res.json({
      message: "",
      data: {
        clientSecret: paymentIntent.client_secret,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      message: "Error creating stripe payment intent",
      error: error.message,
    });
  }
};

export const createTransaction = async (
  req: Request,
  res: Response
): Promise<void> => {
  let { userId, courseId, transactionId, amount, paymentProvider } = req.body;

  try {
    // Gọi service để xử lý nghiệp vụ
    const { newTransaction, initialProgress } =
      await transactionService.createTransaction(
        userId,
        courseId,
        transactionId,
        amount,
        paymentProvider
      );

    res.json({
      message: "Purchase a course successfully!!!",
      data: {
        transaction: newTransaction,
        courseProgress: initialProgress,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      message: "Error creating transaction and enrollment",
      error: error.message,
    });
  }
};
