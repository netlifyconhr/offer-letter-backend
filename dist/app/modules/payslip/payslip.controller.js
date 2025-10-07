"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.payslipController = void 0;
const http_status_codes_1 = require("http-status-codes");
const XLSX = __importStar(require("xlsx"));
const appError_1 = __importDefault(require("../../errors/appError"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const payslip_service_1 = require("./payslip.service");
// paySlip.schema.ts
const zod_1 = require("zod");
const release_letter_interface_1 = require("../release-letter/release-letter.interface");
const paySlipSchema = zod_1.z.object({
    employeeName: zod_1.z.string().nonempty(),
    employeeId: zod_1.z.string().nonempty(),
    month: zod_1.z.string().nonempty(),
    year: zod_1.z.string().nonempty(),
    employeeDesignation: zod_1.z.string().nonempty(),
    employeeDepartment: zod_1.z.string().nonempty(),
    employeeUAN: zod_1.z.string().optional(),
    employeeESINO: zod_1.z.string().optional(),
    basicSalary: zod_1.z.string().optional(),
    houseRentAllowance: zod_1.z.string().optional(),
    conveyanceAllowance: zod_1.z.string().optional(),
    training: zod_1.z.string().optional(),
    grossSalary: zod_1.z.string().optional(),
    netPay: zod_1.z.string().optional(),
    salaryOfEmployee: zod_1.z.string().optional(),
    totalWorkingDays: zod_1.z.string().optional(),
    totalPresentDays: zod_1.z.string().optional(),
    totalAbsent: zod_1.z.string().optional(),
    uninformedLeaves: zod_1.z.string().optional(),
    halfDay: zod_1.z.string().optional(),
    calculatedSalary: zod_1.z.string().optional(),
    EPF: zod_1.z.string().optional(),
    ESI: zod_1.z.string().optional(),
    incentives: zod_1.z.string().optional(),
    OT: zod_1.z.string().optional(),
    professionalTax: zod_1.z.string().optional(),
    totalDeductions: zod_1.z.string().optional(),
    employeeEmail: zod_1.z.string().email(),
    companyName: zod_1.z.string().nonempty(),
    dateOfPayment: zod_1.z.string().optional(), // or z.coerce.date()
    generateByUser: zod_1.z.string().optional(), // You can validate ObjectId separately if needed
    status: zod_1.z.nativeEnum(release_letter_interface_1.IEmailStatus).optional(),
});
exports.payslipController = {
    getOfferLetterAll: (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield payslip_service_1.payslipService.getOfferLetterAll(req.query);
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_codes_1.StatusCodes.OK,
            success: true,
            message: "OfferLetter are retrieved successfully",
            meta: result.meta,
            data: result.result,
        });
    })),
    getThisMonthPayslipCount(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield payslip_service_1.payslipService.getThisMonthPayslipCount();
            (0, sendResponse_1.default)(res, {
                statusCode: http_status_codes_1.StatusCodes.OK,
                success: true,
                message: "Offer Letter retrived succesfully",
                data: result,
            });
        });
    },
    createBulkOfferLetter(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const file = req.file;
            if (!file) {
                throw new appError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Empty or invalid Excel file");
            }
            // const workbook = XLSX.read(file.buffer, {
            //   type: "buffer",
            //   cellDates: true,
            // });
            // const sheetName = workbook.SheetNames[0];
            // const rows = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {
            //   defval: "",
            //   raw: false,
            // }) as PaySlipInput[];
            // const filteredRows = rows.filter((it: IPaySlip) => it.employeeEmail);
            // const results = await payslipService.createBulkOfferLetters(
            //   filteredRows,
            //   req.user as IJwtPayload
            // );
            const workbook = XLSX.read(file.buffer, {
                type: "buffer",
                cellDates: true,
            });
            const sheetName = workbook.SheetNames[0];
            const rows = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {
                defval: "",
                raw: false,
            });
            // Validate and filter valid rows
            const validPaySlips = [];
            for (const row of rows) {
                const result = paySlipSchema.safeParse(row);
                if (result.success) {
                    validPaySlips.push(result.data);
                }
                else {
                    console.warn("Invalid row skipped:", result.error.flatten().fieldErrors);
                }
            }
            const result = yield payslip_service_1.payslipService.createBulkOfferLetters(validPaySlips, req.user);
            (0, sendResponse_1.default)(res, {
                statusCode: http_status_codes_1.StatusCodes.OK,
                success: true,
                message: "Bulk employee data processed for background verification!",
                data: result,
            });
        });
    },
};
