import express from "express";
import * as transactionController from "../controllers/transactionController";

const router = express.Router();

router.post(
  "/stripe/payment-intent",
  transactionController.createStripePaymentIntent
);
router.post("/", transactionController.createTransaction);
router.get("/", transactionController.getListOfTransactions);

export default router;
