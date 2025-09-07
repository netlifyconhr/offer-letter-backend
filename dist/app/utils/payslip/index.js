"use strict";
// import htmlPdf from "html-pdf-node";
// import { IPaySlip } from "../../modules/payslip/payslip.interface";
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
// export const generatePayslipHTML = (offerLetter: IPaySlip): string => {
//   return `
//  <!DOCTYPE html>
// <html lang="en">
// <head>
//   <meta charset="UTF-8" />
//   <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
//   <title>Salary Slip - ${offerLetter.month} ${offerLetter.year}</title>
//  <style>
//     body {
//       font-family: Arial, sans-serif;
//       margin:0px;
//       margin-bottom:20px;
//     }
//     table {
//       width: 100%;
//       border-collapse: collapse;
//       padding:0px 40px;
//     }
//     th, td {
//       border: 1px solid #333;
//       padding: 6px 10px;
//       text-align: left;
//     }
//     .header {
//       background-color: brown;
//       text-align: center;
//       font-weight: bold;
//       font-size: 18px;
//     }
//     .sub-header {
//       text-align: center;
//       font-size: 14px;
//     }
//     .pay-slip-title {
//       text-align: center;
//       font-weight: bold;
//     }
//     .highlight {
//       color: red;
//       font-weight: bold;
//     }
//     .earnings-header {
//       background-color: rgb(152, 251, 152);
//       font-weight: bold;
//     }
//     .gross-total {
//       background-color: rgb(152, 251, 152);
//       font-weight: bold;
//     }
//     .net-pay {
//       background-color:rgb(152, 251, 152);
//       font-weight: bold;
//       text-align: center;
//       font-size: 16px;
//     }
//     .footer {
//       text-align: center;
//       font-style: italic;
//       margin-top: 10px;
//     }
//   </style>
// </head>
// <body>
//  <img
//       src="https://res.cloudinary.com/dri1mh3xh/image/upload/v1750060932/vqqwphzjqzft8u5evzdh.png"
//       alt="Woodrock Logo Left"
//       style="height: 160px;  object-fit: cover; width:100%; margin-bottom:20px"
//     >
// <div class="container" style="padding:0px 40px">
//   <table>
//     <tr>
//       <td colspan="4" class="header">WOODROCK SOFTONIC PVT LTD</td>
//     </tr>
//     <tr>
//       <td colspan="4" class="sub-header">FITWAY ENCLAVE DN 12, STREET NO 18, SECTOR 5, KOLKATA - 700091</td>
//     </tr>
//     <tr>
//       <td colspan="4" class="pay-slip-title">Pay Slip <span class=""> ${
//         offerLetter.month
//       }</span></td>
//     </tr>
//     <tr>
//       <th>Employee Name</th>
//       <td class=""> ${offerLetter.employeeName}</td>
//       <th>Salary Of Employee</th>
//       <td> ${offerLetter.salaryOfEmployee}</td>
//     </tr>
//     <tr>
//       <th>Employee ID</th>
//       <td class=""> ${offerLetter.employeeId}</td>
//       <th>Total Working Days</th>
//       <td> ${offerLetter.totalWorkingDays}</td>
//     </tr>
//     <tr>
//       <th>Designation</th>
//       <td> ${offerLetter.employeeDesignation}</td>
//       <th>Total Present Days</th>
//       <td class=""> ${offerLetter.totalPresentDays}</td>
//     </tr>
//     <tr>
//       <th>Department</th>
//       <td> ${offerLetter.employeeDepartment}</td>
//       <th>Total Absent</th>
//       <td class=""> ${offerLetter.totalAbsent ?? 0}</td>
//     </tr>
//     <tr>
//       <th>UAN NO</th>
//       <td>0</td>
//       <th>Uninformed Leaves</th>
//       <td class=""> ${offerLetter.uninformedLeaves ?? 0}</td>
//     </tr>
//     <tr>
//       <th>Incentives</th>
//       <td> ${offerLetter.incentives ? offerLetter.incentives : 0}</td>
//       <th>OT</th>
//       <td class="">  ${offerLetter.OT ? offerLetter.OT : 0}</td>
//     </tr>
//     <tr>
//       <th>ESI NO</th>
//       <td>0</td>
//       <th>Half day</th>
//       <td class=""> ${offerLetter.halfDay ?? 0}</td>
//     </tr>
//     <tr>
//       <th colspan="3">Calculated Salary</th>
//       <td>₹${offerLetter?.calculatedSalary}</td>
//     </tr>
//     <tr class="earnings-header">
//       <td colspan="2">Earnings</td>
//       <td colspan="2">Deductions</td>
//     </tr>
//     <tr>
//       <td>Basic Salary</td>
//       <td class="">₹${offerLetter.basicSalary ?? 0}</td>
//       <td>EPF</td>
//       <td>₹0</td>
//     </tr>
//     <tr>
//       <td>House Rent Allowances</td>
//       <td class="">₹${offerLetter.houseRentAllowance ?? 0}</td>
//       <td>ESI</td>
//       <td>₹0</td>
//     </tr>
//     <tr>
//       <td>Conveyance Allowances</td>
//       <td class="">₹ ${offerLetter.conveyanceAllowance ?? 0}</td>
//       <td>Professional Tax</td>
//       <td class="">₹ ${offerLetter.professionalTax ?? 0}</td>
//     </tr>
//     <tr>
//       <td>Training</td>
//       <td class="">₹${offerLetter?.training ?? 0}</td>
//       <td></td>
//       <td></td>
//     </tr>
//     <tr class="gross-total">
//       <td>Gross Salary</td>
//       <td class="">₹ ${offerLetter.grossSalary ?? 0}</td>
//       <td>Total Deductions</td>
//       <td class="">₹ ${
//         offerLetter.totalDeductions ? offerLetter.totalDeductions : 0
//       }</td>
//     </tr>
//     <tr class="net-pay">
//       <td colspan="4">Net Pay ₹ ${offerLetter.netPay ?? 0}</td>
//     </tr>
//     </table>
//   </div>
//   <div class="footer">* This is system generated Slip doesn't require signature *</div>
// </body>
// </html>
// `;
// };
// export const generatePayslipPDF = async (
//   offerLetter: IPaySlip
// ): Promise<Buffer> => {
//   try {
//     const htmlContent = generatePayslipHTML(offerLetter);
//     const options = {
//       format: "A4",
//       printBackground: true,
//       displayHeaderFooter: false,
//       margin: {
//         top: "0mm",
//         right: "0mm",
//         bottom: "0mm",
//         left: "0mm",
//       },
//       preferCSSPageSize: true,
//       landscape: false,
//     };
//     const file = { content: htmlContent };
//     const pdfBuffer: any = await htmlPdf.generatePdf(file, options);
//     if (!pdfBuffer || pdfBuffer.length === 0) {
//       throw new Error("Generated PDF is empty");
//     }
//     console.log(
//       "PDF generated successfully with html-pdf-node, size:",
//       pdfBuffer.length,
//       "bytes"
//     );
//     return pdfBuffer;
//   } catch (err) {
//     throw err;
//   }
// };
const pdfkit_1 = __importDefault(require("pdfkit"));
const axios_1 = __importDefault(require("axios"));
function downloadImage(url) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield axios_1.default.get(url, { responseType: "arraybuffer" });
            return Buffer.from(response.data);
        }
        catch (_a) {
            return null;
        }
    });
}
function generatePayslipPDFWithPDFKit(payslip) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
            const doc = new pdfkit_1.default({ size: "A4", margin: 30 });
            const buffers = [];
            const logoURL = "https://res.cloudinary.com/dri1mh3xh/image/upload/v1750060932/vqqwphzjqzft8u5evzdh.png";
            const logoBuffer = yield downloadImage(logoURL);
            doc.on("data", buffers.push.bind(buffers));
            doc.on("end", () => resolve(Buffer.concat(buffers)));
            // Header image
            if (logoBuffer) {
                doc.image(logoBuffer, 40, 20, { width: 60 });
            }
            // Skewed shape (red)
            doc
                .save()
                .moveTo(100, 60)
                .lineTo(300, 60)
                .lineTo(270, 90)
                .lineTo(70, 90)
                .fill("#660505")
                .restore();
            // Right-side skewed shape
            doc
                .save()
                .moveTo(500, 20)
                .lineTo(550, 20)
                .lineTo(510, 50)
                .lineTo(460, 50)
                .fill("#444")
                .restore();
            // Add logo again on the right (mock style)
            if (logoBuffer) {
                doc.image(logoBuffer, 500, 25, { width: 50 });
            }
            // Company Name
            doc
                .fontSize(14)
                .font("Helvetica-Bold")
                .fillColor("black")
                .text("WOODROCK SOFTONIC PVT LTD", 0, 100, { align: "center" });
            doc
                .font("Helvetica")
                .fontSize(10)
                .text("FITWAY ENCLAVE DN 12, STREET NO 18, SECTOR 5, KOLKATA - 700091", {
                align: "center",
            });
            // Payslip title
            doc
                .font("Helvetica-Bold")
                .fontSize(12)
                .text(`Pay Slip ${payslip.month} ${payslip.year}`, { align: "center" });
            doc.moveDown();
            // ===== Employee Information Table =====
            const employeeInfo = [
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
                ["Calculated Salary", `₹${payslip.calculatedSalary}`, "", ""],
            ];
            const tableX = 40;
            let y = doc.y + 10;
            const colWidths = [120, 100, 120, 100];
            const rowHeight = 20;
            employeeInfo.forEach((row) => {
                row.forEach((text, i) => {
                    doc
                        .rect(tableX + colWidths.slice(0, i).reduce((a, b) => a + b, 0), y, colWidths[i], rowHeight)
                        .stroke();
                    doc
                        .font("Helvetica")
                        .fontSize(9)
                        .text(String(text), tableX + colWidths.slice(0, i).reduce((a, b) => a + b, 0) + 5, y + 5);
                });
                y += rowHeight;
            });
            // ===== Salary Breakdown Table =====
            y += 20;
            const earnings = [
                ["Basic Salary", `₹${(_f = payslip.basicSalary) !== null && _f !== void 0 ? _f : 0}`],
                ["House Rent Allowances", `₹${(_g = payslip.houseRentAllowance) !== null && _g !== void 0 ? _g : 0}`],
                ["Conveyance Allowances", `₹${(_h = payslip.conveyanceAllowance) !== null && _h !== void 0 ? _h : 0}`],
                ["Training", `₹${(_j = payslip.training) !== null && _j !== void 0 ? _j : 0}`],
                ["Gross Salary", `₹${(_k = payslip.grossSalary) !== null && _k !== void 0 ? _k : 0}`],
            ];
            const deductions = [
                ["EPF", "₹0"],
                ["ESI", "₹0"],
                ["Professional Tax", `₹${(_l = payslip.professionalTax) !== null && _l !== void 0 ? _l : 0}`],
                ["", ""],
                ["Total Deductions", `₹${(_m = payslip.totalDeductions) !== null && _m !== void 0 ? _m : 0}`],
            ];
            // Headers
            doc
                .font("Helvetica-Bold")
                .fontSize(10)
                .fillColor("#000")
                .rect(tableX, y, 240, rowHeight)
                .fillAndStroke("#98fb98", "#000");
            doc.text("Earnings", tableX + 5, y + 5);
            doc.rect(tableX + 240, y, 240, rowHeight).fillAndStroke("#98fb98", "#000");
            doc.text("Deductions", tableX + 245, y + 5);
            y += rowHeight;
            for (let i = 0; i < earnings.length; i++) {
                // Earnings column
                doc
                    .font("Helvetica")
                    .fillColor("black")
                    .rect(tableX, y, 240, rowHeight)
                    .stroke();
                doc.text(`${earnings[i][0]}: ${earnings[i][1]}`, tableX + 5, y + 5);
                // Deductions column
                doc.rect(tableX + 240, y, 240, rowHeight).stroke();
                doc.text(`${deductions[i][0]}: ${deductions[i][1]}`, tableX + 245, y + 5);
                y += rowHeight;
            }
            // ===== Net Pay Highlight =====
            y += 10;
            doc
                .font("Helvetica-Bold")
                .fontSize(12)
                .fillColor("green")
                .text(`Net Pay ₹ ${(_o = payslip.netPay) !== null && _o !== void 0 ? _o : 0}`, { align: "center" });
            y += 20;
            // Footer note
            doc
                .fontSize(9)
                .font("Helvetica-Oblique")
                .fillColor("black")
                .text("* This is system generated Slip doesn't require signature *", 0, y, {
                align: "center",
            });
            doc.end();
        }));
    });
}
