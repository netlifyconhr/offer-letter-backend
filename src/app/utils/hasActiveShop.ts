import { StatusCodes } from "http-status-codes";
import AppError from "../errors/appError";
import User from "../modules/user/user.model";

export const hasActiveShop = async (userId: string) => {
  const isUserExists = await User.checkUserExist(userId);
  if (!isUserExists) {
    throw new AppError(StatusCodes.NOT_FOUND, "User not found");
  }

  return true;
};
