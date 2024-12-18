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
