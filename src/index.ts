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
import {
  clerkMiddleware,
  createClerkClient,
  requireAuth,
} from "@clerk/express";

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
app.use("/transaction", requireAuth(), transactionRoute);

// SERVER
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
