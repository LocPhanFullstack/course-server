import { clerkClient } from "..";

export const updateUser = async (
  userId: string,
  userData: any
): Promise<void> => {
  try {
    await clerkClient.users.updateUserMetadata(userId, {
      publicMetadata: {
        settings: userData.publicMetadata.settings,
      },
    });
  } catch (error: any) {
    throw new Error(`Error updating user metadata: ${error.message}`);
  }
};
