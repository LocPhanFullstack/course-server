import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import bodyParser from "body-parser";
import * as dynamoose from "dynamoose";
import courseRoute from "./routes/courseRoutes";
import userClerkRoute from "./routes/userClerkRoutes";
import transactionRoute from "./routes/transactionRoute";
import userCourseProgressRoute from "./routes/userCourseProgressRoute";
import {
  clerkMiddleware,
  createClerkClient,
  requireAuth,
} from "@clerk/express";
import serverless from "serverless-http";
import seed from "./seed/seedDynamoDB";

dotenv.config();

const isProduction = process.env.NODE_ENV === "production";

if (!isProduction) {
  dynamoose.aws.ddb.local();
}

export const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
});

const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(clerkMiddleware());

// ROUTES
app.get("/", (req, res) => {
  res.send("hello");
});

app.use("/courses", courseRoute);
app.use("/users/clerk", requireAuth(), userClerkRoute);
app.use("/transactions", requireAuth(), transactionRoute);
app.use("/users/course-progress", requireAuth(), userCourseProgressRoute);

// SERVER
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// aws production environment
const serverlessApp = serverless(app);
export const handler = async (event: any, context: any) => {
  if (event.action === "seed") {
    await seed();
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Data seeded successfully" }),
    };
  } else {
    return serverlessApp(event, context);
  }
};
