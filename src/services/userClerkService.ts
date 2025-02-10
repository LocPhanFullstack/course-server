import { clerkClient } from "..";

export const updateUser = async (userId: string, userData: any) => {
  try {
    const user = await clerkClient.users.updateUserMetadata(userId, {
      publicMetadata: {
        settings: userData.publicMetadata.settings,
      },
    });
    return user;
  } catch (error: any) {
    throw new Error(`Error updating user metadata: ${error.message}`);
  }
};
