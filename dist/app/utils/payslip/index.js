"use strict";
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
exports.generatePayslipPDFWithPDFKit = generatePayslipPDFWithPDFKit;
exports.generateBulkPayslipPDFs = generateBulkPayslipPDFs;
exports.saveBulkPDFsToFiles = saveBulkPDFsToFiles;
const pdfkit_1 = __importDefault(require("pdfkit"));
function generatePayslipPDFWithPDFKit(payslip) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
            try {
                const doc = new pdfkit_1.default({ margin: 50 });
                const buffers = [];
                doc.on("data", buffers.push.bind(buffers));
                doc.on("end", () => resolve(Buffer.concat(buffers)));
                doc.on("error", reject);
                // Add header image (adjust path as needed)
                // Set image height and place it at the top
                const imageHeight = 120; // change if your image needs more/less height
                doc.image("./banner-woodrock.png", 50, 20, {
                    width: 495,
                    height: imageHeight,
                });
                // After the image, start body section
                let currentY = 20 + imageHeight + 10; // image Y + image height + spacing
                // Company Title Background
                doc.rect(50, currentY, 495, 30).fillAndStroke("#B71C1C", "#8B0000");
                doc
                    .fillColor("white")
                    .fontSize(16)
                    .font("Helvetica-Bold")
                    .text("WOODROCK SOFTONIC PVT LTD", 60, currentY + 8);
                currentY += 30;
                // Company Address
                doc.rect(50, currentY, 495, 25).fillAndStroke("#F5F5F5", "#333333");
                doc
                    .fillColor("black")
                    .fontSize(11)
                    .font("Helvetica")
                    .text("FITWAY ENCLAVE DN 12, STREET NO 18, SECTOR 5, KOLKATA - 700091", 60, currentY + 8);
                currentY += 25;
                // Pay Slip Title
                doc.rect(50, currentY, 495, 25).fillAndStroke("#F5F5F5", "#333333");
                doc
                    .fillColor("black")
                    .fontSize(14)
                    .font("Helvetica-Bold")
                    .text(`Pay Slip ${payslip.month} ${payslip.year}`, 280, currentY + 8);
                currentY += 25;
                // Employee Information Table
                const rowHeight = 28;
                const colWidth = 123.75;
                const employeeData = [
                    [
                        "Employee Name",
                        payslip.employeeName,
                        "Salary Of Employee",
                        payslip.salaryOfEmployee,
                    ],
                    [
                        "Employee ID",
                        payslip.employeeId,
                        "Total Working Days",
                        payslip.totalWorkingDays,
                    ],
                    [
                        "Designation",
                        payslip.employeeDesignation,
                        "Total Present Days",
                        payslip.totalPresentDays,
                    ],
                    [
                        "Department",
                        payslip.employeeDepartment,
                        "Total Absent",
                        (_a = payslip.totalAbsent) !== null && _a !== void 0 ? _a : 0,
                    ],
                    ["UAN NO", "0", "Uninformed Leaves", (_b = payslip.uninformedLeaves) !== null && _b !== void 0 ? _b : 0],
                    ["Incentives", (_c = payslip.incentives) !== null && _c !== void 0 ? _c : 0, "OT", (_d = payslip.OT) !== null && _d !== void 0 ? _d : 0],
                    ["ESI NO", "0", "Half day", (_e = payslip.halfDay) !== null && _e !== void 0 ? _e : 0],
                ];
                employeeData.forEach((row, index) => {
                    const bgColor = index % 2 === 0 ? "#F9F9F9" : "white";
                    // Draw four columns
                    for (let i = 0; i < 4; i++) {
                        doc
                            .rect(50 + i * colWidth, currentY, colWidth, rowHeight)
                            .fillAndStroke(bgColor, "#333333");
                    }
                    doc
                        .fillColor("black")
                        .fontSize(10)
                        .font("Helvetica-Bold")
                        .text(String(row[0]), 55, currentY + 10)
                        .font("Helvetica")
                        .text(String(row[1]), 55 + colWidth + 5, currentY + 10)
                        .font("Helvetica-Bold")
                        .text(String(row[2]), 55 + 2 * colWidth + 5, currentY + 10)
                        .font("Helvetica")
                        .text(String(row[3]), 55 + 3 * colWidth + 5, currentY + 10);
                    currentY += rowHeight;
                });
                // Calculated Salary Row
                doc
                    .rect(50, currentY, 495, rowHeight)
                    .fillAndStroke("#E8F5E8", "#2E7D32");
                doc
                    .fillColor("black")
                    .fontSize(12)
                    .font("Helvetica-Bold")
                    .text("Calculated Salary", 55, currentY + 10)
                    .text(`${payslip.calculatedSalary}`, 450, currentY + 10);
                // Earnings and Deductions Headers
                doc
                    .rect(50, currentY, 247.5, rowHeight)
                    .fillAndStroke("#99ff99", "black");
                doc
                    .rect(297.5, currentY, 247.5, rowHeight)
                    .fillAndStroke("#99ff99", "black");
                doc
                    .fillColor("black")
                    .fontSize(14)
                    .font("Helvetica-Bold")
                    .text("Earnings", 55, currentY + 10)
                    .text("Deductions", 302.5, currentY + 10);
                currentY += rowHeight;
                // Earnings and Deductions Data
                const earningsDeductionsData = [
                    ["Basic Salary", (_f = payslip.basicSalary) !== null && _f !== void 0 ? _f : 0, "EPF", 0],
                    ["House Rent Allowances", (_g = payslip.houseRentAllowance) !== null && _g !== void 0 ? _g : 0, "ESI", 0],
                    [
                        "Conveyance Allowances",
                        (_h = payslip.conveyanceAllowance) !== null && _h !== void 0 ? _h : 0,
                        "Professional Tax",
                        (_j = payslip.professionalTax) !== null && _j !== void 0 ? _j : 0,
                    ],
                    ["Training", (_k = payslip.training) !== null && _k !== void 0 ? _k : 0, "", ""],
                ];
                earningsDeductionsData.forEach((row, index) => {
                    const bgColor = index % 2 === 0 ? "#F9F9F9" : "white";
                    // Draw four columns
                    for (let i = 0; i < 4; i++) {
                        doc
                            .rect(50 + i * colWidth, currentY, colWidth, rowHeight)
                            .fillAndStroke(bgColor, "#333333");
                    }
                    doc
                        .fillColor("black")
                        .fontSize(10)
                        .font("Helvetica-Bold")
                        .text(String(row[0]), 55, currentY + 10)
                        .font("Helvetica")
                        .text(`${row[1]}`, 55 + colWidth + 5, currentY + 10)
                        .font("Helvetica-Bold")
                        .text(String(row[2]), 55 + 2 * colWidth + 5, currentY + 10)
                        .font("Helvetica")
                        .text(row[3] ? `${row[3]}` : "", 55 + 3 * colWidth + 5, currentY + 10);
                    currentY += rowHeight;
                });
                // Gross Salary and Total Deductions
                for (let i = 0; i < 4; i++) {
                    doc
                        .rect(50 + i * colWidth, currentY, colWidth, rowHeight)
                        .fillAndStroke("#99ff99", "black");
                }
                doc
                    .fillColor("black")
                    .fontSize(11)
                    .font("Helvetica-Bold")
                    .text("Gross Salary", 55, currentY + 10)
                    .text(`${(_l = payslip.grossSalary) !== null && _l !== void 0 ? _l : 0}`, 55 + colWidth + 5, currentY + 10)
                    .text("Total Deductions", 55 + 2 * colWidth + 5, currentY + 10)
                    .text(`${(_m = payslip.totalDeductions) !== null && _m !== void 0 ? _m : 0}`, 55 + 3 * colWidth + 5, currentY + 10);
                currentY += rowHeight;
                // Net Pay
                doc.rect(50, currentY, 495, rowHeight).fillAndStroke("#99ff99", "black");
                doc
                    .fillColor("black")
                    .fontSize(14)
                    .font("Helvetica-Bold")
                    .text(`Net Pay ${(_o = payslip.netPay) !== null && _o !== void 0 ? _o : 0}`, 55, currentY + 10);
                currentY += rowHeight + 20;
                // Footer Note
                doc
                    .fillColor("black")
                    .fontSize(10)
                    .font("Helvetica-Oblique")
                    .text("* This is system generated Slip doesn't require signature *", 50, currentY, {
                    align: "center",
                    width: 495,
                });
                doc.end();
            }
            catch (error) {
                reject(error);
            }
        }));
    });
}
function generateBulkPayslipPDFs(payslips) {
    return __awaiter(this, void 0, void 0, function* () {
        const results = {
            success: [],
            failed: [],
        };
        console.log(`Starting bulk generation for ${payslips.length} payslips...`);
        for (let i = 0; i < payslips.length; i++) {
            try {
                console.log(`Generating PDF ${i + 1}/${payslips.length} for employee: ${payslips[i].employeeName}`);
                const pdfBuffer = yield generatePayslipPDFWithPDFKit(payslips[i]);
                results.success.push(pdfBuffer);
                console.log(`✅ PDF generated successfully for ${payslips[i].employeeName}`);
            }
            catch (error) {
                console.error(`❌ Failed to generate PDF for ${payslips[i].employeeName}:`, error);
                results.failed.push({ index: i, error });
            }
        }
        console.log(`Bulk generation completed. Success: ${results.success.length}, Failed: ${results.failed.length}`);
        return results;
    });
}
// Helper function to save PDFs to files (Node.js environment)
function saveBulkPDFsToFiles(payslips_1) {
    return __awaiter(this, arguments, void 0, function* (payslips, outputDir = "./payslips") {
        const fs = require("fs").promises;
        const path = require("path");
        // Ensure output directory exists
        try {
            yield fs.mkdir(outputDir, { recursive: true });
        }
        catch (error) {
            console.error("Failed to create output directory:", error);
        }
        const results = yield generateBulkPayslipPDFs(payslips);
        const successFiles = [];
        for (let i = 0; i < results.success.length; i++) {
            try {
                const payslip = payslips[i];
                const filename = `${payslip.employeeId}_${payslip.employeeName.replace(/\s+/g, "_")}_${payslip.month}_${payslip.year}.pdf`;
                const filepath = path.join(outputDir, filename);
                yield fs.writeFile(filepath, results.success[i]);
                successFiles.push(filepath);
                console.log(`📁 Saved: ${filepath}`);
            }
            catch (error) {
                console.error(`Failed to save PDF file for index ${i}:`, error);
                results.failed.push({ index: i, error });
            }
        }
        return {
            successFiles,
            failed: results.failed,
        };
    });
}
