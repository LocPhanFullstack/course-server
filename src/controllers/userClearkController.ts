import { Request, Response } from "express";
import * as userClerkService from "../services/userClerkService";

export const updateUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { userId } = req.params;
  const userData = req.body;

  try {
    // Gọi service để cập nhật dữ liệu người dùng
    await userClerkService.updateUser(userId, userData);

    // Trả về phản hồi sau khi cập nhật thành công
    res.json({ message: "User updated successfully" });
  } catch (error: any) {
    // Xử lý lỗi nếu có
    console.error("Error updating user:", error);
    res.status(500).json({
      message: "Error updating user",
      error: error.message || error,
    });
  }
};
