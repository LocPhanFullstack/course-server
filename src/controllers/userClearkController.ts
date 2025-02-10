import { Request, Response } from "express";
import * as userClerkService from "../services/userClerkService";

export const updateUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { userId } = req.params;
  const userData = req.body;

  try {
    const user = await userClerkService.updateUser(userId, userData);

    res.json({ message: "User updated successfully", data: user });
  } catch (error: any) {
    console.error("Error updating user:", error);
    res.status(500).json({
      message: "Error updating user",
      error: error.message || error,
    });
  }
};
