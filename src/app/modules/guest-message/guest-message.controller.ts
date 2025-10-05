import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { guestMessageService } from "./guest-message.service";

const craeteGuestMessage = catchAsync(async (req: Request, res: Response) => {
  const result = await guestMessageService.craeteGuestMessage(
    req.body
  );

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: "Thanks for connecting us.We will connect soon!",
    data: result,
  });
});

const getContactMessages = catchAsync(async (req: Request, res: Response) => {
  const result = await guestMessageService.getContactMessages(
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Guest messages retrive successfully!",
    data: result,
  });
});

export const GuestMessageController = {
  craeteGuestMessage,
  getContactMessages,
};
