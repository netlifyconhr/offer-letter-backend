import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import AppError from "../../errors/appError";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { backgroundVarificationService } from "./background-varification.service";
// paySlip.schema.ts
import * as XLSX from "xlsx";
import { z } from "zod";


// Define Zod schema
 const paySlipSchema = z.object({
  employeeName: z.string().nonempty(),
  employeeId: z.string().nonempty(),
  month: z.string().nonempty(),
  year: z.string().nonempty(),
  employeeDesignation: z.string().nonempty(),
  employeeDepartment: z.string().nonempty(),
  employeeUAN: z.string().optional(),
  employeeESINO: z.string().optional(),
  basicSalary: z.string().optional(),
  houseRentAllowance: z.string().optional(),
  conveyanceAllowance: z.string().optional(),
  training: z.string().optional(),
  grossSalary: z.string().optional(),
  netPay: z.string().optional(),
  salaryOfEmployee: z.string().optional(),
  totalWorkingDays: z.string().optional(),
  totalPresentDays: z.string().optional(),
  totalAbsent: z.string().optional(),
  uninformedLeaves: z.string().optional(),
  halfDay: z.string().optional(),
  calculatedSalary: z.string().optional(),
  EPF: z.string().optional(),
  ESI: z.string().optional(),
  incentives: z.string().optional(),
  OT: z.string().optional(),
  professionalTax: z.string().optional(),
  totalDeductions: z.string().optional(),
  employeeEmail: z.string().email(),
  companyName: z.string().nonempty(),
  dateOfPayment: z.string().optional(),
  generateByUser: z.string().optional(), // Can later be ObjectId
  status: z.enum(["PENDING", "SENT", "FAILED"]).optional(),
});

// Infer TypeScript type from schema
export type PaySlipInput = z.infer<typeof paySlipSchema>;

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
const validPaySlips: PaySlipInput[] = [];

for (const row of rows) {
  const result = paySlipSchema.safeParse(row);
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
