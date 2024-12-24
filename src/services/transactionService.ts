// services/paymentService.ts
import Stripe from "stripe";
import dotenv from "dotenv";
import Course from "../models/courseModel";
import Transaction from "../models/transactionModel";
import UserCourseProgress from "../models/userCourseProgressModel";

dotenv.config();

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error(
    "STRIPE_SECRET_KEY is required but was not found in env variables"
  );
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createPaymentIntent = async (amount: number) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: "never",
      },
    });

    return paymentIntent;
  } catch (error: any) {
    throw new Error(`Error creating payment intent: ${error.message}`);
  }
};

export const createTransaction = async (
  userId: string,
  courseId: string,
  transactionId: string,
  amount: number,
  paymentProvider: string
) => {
  if (!userId || !courseId || !transactionId || !amount || !paymentProvider) {
    throw new Error(
      "Missing required parameters in service: userId, courseId, transactionId, amount, and paymentProvider are all required."
    );
  }
  try {
    const course = await Course.get(courseId);
    if (!course) {
      throw new Error("Course not found");
    }

    const newTransaction = new Transaction({
      dateTime: new Date().toISOString(),
      userId,
      courseId,
      transactionId,
      amount,
      paymentProvider,
    });
    await newTransaction.save();

    const initialProgress = new UserCourseProgress({
      userId,
      courseId,
      enrollmentDate: new Date().toISOString(),
      overallProgress: 0,
      sections: course.sections.map((section: any) => ({
        sectionId: section.sectionId,
        chapters: section.chapters.map((chapter: any) => ({
          chapterId: chapter.chapterId,
          completed: false,
        })),
      })),
      lastAccessedTimestamp: new Date().toISOString(),
    });
    await initialProgress.save();

    await Course.update(
      { courseId },
      {
        $ADD: {
          enrollments: [{ userId }],
        },
      }
    );

    return { newTransaction, initialProgress };
  } catch (error: any) {
    throw new Error(
      "Error creating transaction and enrollment: " + error.message
    );
  }
};
