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

export const getListOfTransactions = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId } = req.query;
    const transactions = await transactionService.getListOfTransactions(
      userId as string
    );

    res.json({
      message: "Transactions retrieved successfully!!!",
      data: transactions,
    });
  } catch (error: any) {
    res.status(500).json({
      message: "Error getting list of transactions",
      error: error.message,
    });
  }
};
