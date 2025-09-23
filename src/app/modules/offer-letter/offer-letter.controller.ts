import { Request, Response } from "express";
import { offerLetterService } from "./offer-letter.service";
import { IJwtPayload } from "../auth/auth.interface";
import sendResponse from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import catchAsync from "../../utils/catchAsync";
import { IOfferLetter } from "./offer-letter.interface";
import * as XLSX from "xlsx";
import AppError from "../../errors/appError";
import { EmailHelper } from "../../utils/emailHelper";

export const offerLetterController = {
  getOfferLetterAll: catchAsync(async (req, res) => {
    const result = await offerLetterService.getOfferLetterAll(req.query);
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "OfferLetter are retrieved successfully",
      meta: result.meta,
      data: result.result,
    });
  }),

  acknowledgeById: catchAsync(async (req, res) => {
    // async acknowledgeById(req: Request, res: Response) {
    const message = await offerLetterService.acknowledgeById(
      req.params.employeeEmail
    );

    sendResponse(res, {
      statusCode: StatusCodes.CREATED,
      success: true,
      message: message.message || "Offer letter acknowledged successfully",
      data: null,
    });
  }),

  async createBulkOfferLetter(req: Request, res: Response) {
    const file = req.file;
    if (!file) {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        "Empty or invalid Excel file"
      );
    }

    const isValid = await EmailHelper.verifyEmailCredentials();

    if (!isValid) {
      console.error("Cannot send email: Invalid credentials.");
      return sendResponse(res, {
        statusCode: StatusCodes.BAD_REQUEST, // Or StatusCodes.BAD_REQUEST
        success: false,
        message:
          "Failed to send offer letters: Invalid email credentials. Please contact admin.",
        data: "INVALID_MAIL_CONFIG",
      });
    }

    // Proceed if credentials are valid
    const workbook = XLSX.read(file.buffer, {
      type: "buffer",
      cellDates: true,
    });

    const sheetName = workbook.SheetNames[0];

    const rows = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {
      defval: "",
      raw: false,
    }) as IOfferLetter[];

    const filteredRows = rows.filter((it: IOfferLetter) => it.employeeEmail);
    const results = await offerLetterService.createBulkOfferLetters(
      filteredRows,
      req.user as IJwtPayload
    );

    console.log(rows, "rows");

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Bulk offer letters processed and emails sent successfully.",
      data: results,
    });
  },
};
