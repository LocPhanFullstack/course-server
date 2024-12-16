import express from "express";
import * as userClearkController from "../controllers/userClearkController";

const router = express.Router();

router.post("/:userId", userClearkController.updateUser);

export default router;
