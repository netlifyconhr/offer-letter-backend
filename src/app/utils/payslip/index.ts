import PDFDocument from "pdfkit";
import { IPaySlip } from "../../modules/payslip/payslip.interface";

export async function generatePayslipPDFWithPDFKit(
  payslip: IPaySlip
): Promise<Buffer> {
  return new Promise(async (resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });
      const buffers: any[] = [];

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
        .text(
          "FITWAY ENCLAVE DN 12, STREET NO 18, SECTOR 5, KOLKATA - 700091",
          60,
          currentY + 8
        );

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
          payslip.totalAbsent ?? 0,
        ],
        ["UAN NO", "0", "Uninformed Leaves", payslip.uninformedLeaves ?? 0],
        ["Incentives", payslip.incentives ?? 0, "OT", payslip.OT ?? 0],
        ["ESI NO", "0", "Half day", payslip.halfDay ?? 0],
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
        ["Basic Salary", payslip.basicSalary ?? 0, "EPF", 0],
        ["House Rent Allowances", payslip.houseRentAllowance ?? 0, "ESI", 0],
        [
          "Conveyance Allowances",
          payslip.conveyanceAllowance ?? 0,
          "Professional Tax",
          payslip.professionalTax ?? 0,
        ],
        ["Training", payslip.training ?? 0, "", ""],
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
          .text(
            row[3] ? `${row[3]}` : "",
            55 + 3 * colWidth + 5,
            currentY + 10
          );

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
        .text(`${payslip.grossSalary ?? 0}`, 55 + colWidth + 5, currentY + 10)
        .text("Total Deductions", 55 + 2 * colWidth + 5, currentY + 10)
        .text(
          `${payslip.totalDeductions ?? 0}`,
          55 + 3 * colWidth + 5,
          currentY + 10
        );

      currentY += rowHeight;

      // Net Pay
      doc.rect(50, currentY, 495, rowHeight).fillAndStroke("#99ff99", "black");

      doc
        .fillColor("black")
        .fontSize(14)
        .font("Helvetica-Bold")
        .text(`Net Pay ${payslip.netPay ?? 0}`, 55, currentY + 10);

      currentY += rowHeight + 20;

      // Footer Note
      doc
        .fillColor("black")
        .fontSize(10)
        .font("Helvetica-Oblique")
        .text(
          "* This is system generated Slip doesn't require signature *",
          50,
          currentY,
          {
            align: "center",
            width: 495,
          }
        );

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}

export async function generateBulkPayslipPDFs(
  payslips: IPaySlip[]
): Promise<{ success: Buffer[]; failed: { index: number; error: any }[] }> {
  const results = {
    success: [] as Buffer[],
    failed: [] as { index: number; error: any }[],
  };

  console.log(`Starting bulk generation for ${payslips.length} payslips...`);

  for (let i = 0; i < payslips.length; i++) {
    try {
      console.log(
        `Generating PDF ${i + 1}/${payslips.length} for employee: ${
          payslips[i].employeeName
        }`
      );
      const pdfBuffer = await generatePayslipPDFWithPDFKit(payslips[i]);
      results.success.push(pdfBuffer);
      console.log(
        `✅ PDF generated successfully for ${payslips[i].employeeName}`
      );
    } catch (error) {
      console.error(
        `❌ Failed to generate PDF for ${payslips[i].employeeName}:`,
        error
      );
      results.failed.push({ index: i, error });
    }
  }

  console.log(
    `Bulk generation completed. Success: ${results.success.length}, Failed: ${results.failed.length}`
  );
  return results;
}

// Helper function to save PDFs to files (Node.js environment)
export async function saveBulkPDFsToFiles(
  payslips: IPaySlip[],
  outputDir: string = "./payslips"
): Promise<{
  successFiles: string[];
  failed: { index: number; error: any }[];
}> {
  const fs = require("fs").promises;
  const path = require("path");

  // Ensure output directory exists
  try {
    await fs.mkdir(outputDir, { recursive: true });
  } catch (error) {
    console.error("Failed to create output directory:", error);
  }

  const results = await generateBulkPayslipPDFs(payslips);
  const successFiles: string[] = [];

  for (let i = 0; i < results.success.length; i++) {
    try {
      const payslip = payslips[i];
      const filename = `${payslip.employeeId}_${payslip.employeeName.replace(
        /\s+/g,
        "_"
      )}_${payslip.month}_${payslip.year}.pdf`;
      const filepath = path.join(outputDir, filename);

      await fs.writeFile(filepath, results.success[i]);
      successFiles.push(filepath);
      console.log(`📁 Saved: ${filepath}`);
    } catch (error) {
      console.error(`Failed to save PDF file for index ${i}:`, error);
      results.failed.push({ index: i, error });
    }
  }

  return {
    successFiles,
    failed: results.failed,
  };
}
