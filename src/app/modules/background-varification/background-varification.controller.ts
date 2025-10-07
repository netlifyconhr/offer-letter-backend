import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import AppError from "../../errors/appError";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { backgroundVarificationService } from "./background-varification.service";
// paySlip.schema.ts
import * as XLSX from "xlsx";
import { z } from "zod";


 const backgroundVerificationSchema = z.object({
  employeeName: z.string().nonempty(),
  employeeId: z.string().nonempty(),
  employeeDesignation: z.string().nonempty(),
  employeeDepartment: z.string().nonempty(),
  employeeEmail: z.string().email(),
  companyName: z.string().nonempty(),
  companyBranch: z.string().nonempty(),
  companyRegion: z.string().nonempty(),
  employeeGender: z.string().nonempty(),

  pan: z.string().optional(),
  aadharFront: z.string().optional(),
  aadharBack: z.string().optional(),
  experience: z.string().optional(),
  education: z.string().optional(),
  photo: z.string().optional(),
  educationStatus: z.string().optional(),
  experienceStatus: z.string().optional(),

  addressStatus: z.string().optional(),
  criminalStatus: z.string().optional(),
  panStatus: z.string().optional(),
  adharStatus: z.string().optional(),
  remarks: z.string().optional(),
  employeePhone: z.string().optional(),

  employeeDateOfJoin: z.string().optional(), // consider z.coerce.date() if you want to parse it as Date
});

export type BackgroundVerificationInput = z.infer<typeof backgroundVerificationSchema>;

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
}) as Record<string, any>[];

// Validate and filter valid rows
const validPaySlips: BackgroundVerificationInput[] = [];

for (const row of rows) {
  const result = backgroundVerificationSchema.safeParse(row);
  if (result.success) {
    validPaySlips.push(result.data);
  } else {
    console.warn("Invalid row skipped:", result.error.flatten().fieldErrors);
  }
}

  const result = await backgroundVarificationService.createBulkBackgroundVarificationData(
  validPaySlips
);

sendResponse(res, {
  statusCode: StatusCodes.OK,
  success: true,
  message: "Bulk employee data processed for background verification!",
  data: result,
});

  },
};
