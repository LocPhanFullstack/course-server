import express from "express";
import * as transactionController from "../controllers/transactionController";

const router = express.Router();

router.post(
  "/stripe/payment-intent",
  transactionController.createStripePaymentIntent
);

export default router;
