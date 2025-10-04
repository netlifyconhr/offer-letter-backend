import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import * as XLSX from "xlsx";
import AppError from "../../errors/appError";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { BackgroundVarificationType } from "./background-varification.interface";
import { backgroundVarificationService } from "./background-varification.service";

export const backgroundVarificationController = {
  getBackgroundVarificationAll: catchAsync(async (req, res) => {
    const result = await backgroundVarificationService.getOfferLetterAll(
      req.query
    );
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "OfferLetter are retrieved successfully",
      meta: result.meta,
      data: result.result,
    });
  }),
  updateBackgroundVarification: catchAsync(async (req, res) => {
    const result = await backgroundVarificationService.getAndUpdateEmployeeById(
      req.params.employeeId as string,
      req.body
    );
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Background varification are updated successfully",
      data: result,
    });
  }),
  async getThisMonthPayslipCount(req: Request, res: Response) {
    const result =
      await backgroundVarificationService.getThisMonthPayslipCount();

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Offer Letter retrived succesfully",
      data: result,
    });
  },
  async createBulkBackgroundVarification(req: Request, res: Response) {
    const file = req.file;
    if (!file) {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        "Empty or invalid Excel file"
      );
    }
    const workbook = XLSX.read(file.buffer, {
      type: "buffer",
      cellDates: true,
    });

    const sheetName = workbook.SheetNames[0];

    const rows = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {
      defval: "",
      raw: false,
    }) as BackgroundVarificationType[];

    const filteredRows = rows.filter(
      (it: BackgroundVarificationType) => it.employeeEmail
    );
    const results =
      await backgroundVarificationService.createBulkBackgroundVarificationData(
        filteredRows
      );

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Bulk employee data  processed for background varification!",
      data: results,
    });
  },
};
