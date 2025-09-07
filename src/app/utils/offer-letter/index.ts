import axios from "axios";
import PDFDocument from "pdfkit";
import { IOfferLetter } from "../../modules/offer-letter/offer-letter.interface";

// Download image from URL and convert to buffer
async function downloadImage(url: string): Promise<Buffer | null> {
  try {
    const response = await axios.get(url, { responseType: "arraybuffer" });
    return Buffer.from(response.data);
  } catch (error) {
    console.error("Failed to download image:", error);
    return null;
  }
}

// Helper method to create table
function createTable(
  doc: PDFKit.PDFDocument,
  x: number,
  y: number,
  data: string[][]
) {
  const cellWidth = 175;
  const cellHeight = 20;

  data.forEach((row, rowIndex) => {
    row.forEach((cell, cellIndex) => {
      const cellX = x + cellIndex * cellWidth;
      const cellY = y + rowIndex * cellHeight;

      // Draw cell border
      doc.rect(cellX, cellY, cellWidth, cellHeight).stroke("#000000");

      // Fill header row
      if (rowIndex === 0) {
        doc.rect(cellX, cellY, cellWidth, cellHeight).fill("#f2f2f2");
      }

      // Add text
      doc
        .fillColor("#000000")
        .fontSize(9)
        .font(rowIndex === 0 ? "Helvetica-Bold" : "Helvetica")
        .text(cell, cellX + 5, cellY + 6, {
          width: cellWidth - 10,
          align: "center",
          lineBreak: false,
        });
    });
  });
}

async function createPage1(
  doc: PDFKit.PDFDocument,
  offerLetter: IOfferLetter,
  signatureBuffer: Buffer | null
) {
  const pageWidth = 595.28; // A4 width in points
  const pageHeight = 841.89; // A4 height in points

  // Top dark bar
  doc.rect(0, 0, pageWidth, 25).fill("#3b3b3b");

  // Company name header
  doc
    .fillColor("#000000")
    .fontSize(24)
    .font("Helvetica-Bold")
    .text("WOODROCK SOFTONIC PVT LTD", 20, 45);

  // drawParallelogram(doc, pageWidth - 200, 35, 200, 30, 40, "#000000");
  const x = pageWidth - 200;
  const y = 35;
  const width = 200;
  const height = 30;
  const skew = 40;
  doc
    .moveTo(x + skew, y) // Top-left (skewed)
    .lineTo(x + width, y) // Top-right
    .lineTo(x + width, y + height) // Bottom-right (skewed)
    .lineTo(x, y + height) // Bottom-left
    .closePath() // Close the shape
    .fill("#000000"); // Fill with specified color

  // Maroon strip with employee name
  doc.rect(0, 100, 320, 50).fill("#660505");

  doc
    .fillColor("#ffffff")
    .fontSize(18)
    .font("Helvetica-Bold")
    .text(`Dear ${offerLetter.employeeName}`, 30, 118);

  // Date section
  doc
    .fillColor("#ff0000")
    .fontSize(16)
    .font("Helvetica-Bold")
    .text(`Date: ${offerLetter.offerLetterDate}`, pageWidth - 200, 170, {
      align: "right",
    });

  // Main content
  doc
    .fillColor("#000000")
    .fontSize(12)
    .font("Helvetica")
    .text(
      "Congratulations! With reference to your application and subsequent interview with us we are pleased to offer you the position of Customer Care Executive with Woodrock Softonic Private Limited. Your beginning monthly remuneration will be INR " +
        offerLetter.employeeCtc +
        "/-",
      30,
      210,
      { width: 535, lineGap: 3 }
    );

  // Job details section
  let yPosition = 270;
  const jobDetails = [
    "Shift Allocated: Full Time",
    "Shift Timing Allocated: Flexible Timing",
    "Reporting Timing: 20 mins before login",
    "Joining Location: Kolkata",
    "Venue Details: Work from office / Work from home",
  ];

  doc.font("Helvetica-Bold");
  jobDetails.forEach((detail) => {
    const [label, value] = detail.split(": ");
    doc
      .font("Helvetica-Bold")
      .text(label + ":", 30, yPosition, { continued: true })
      .font("Helvetica")
      .text(" " + value);
    yPosition += 20;
  });

  // Additional terms
  yPosition += 10;
  doc
    .font("Helvetica")
    .text(
      "The offer has been made based on information furnished by you. However, if there is a discrepancy in the copies of any document or certificate given by you as proof, we hold the rights to review the offer of employment.",
      30,
      yPosition,
      { width: 535, lineGap: 3 }
    );

  yPosition += 40;
  doc.text(
    "Employment as per this offer is subject to your being medically fit.",
    30,
    (yPosition += 20),
    { width: 535 }
  );

  yPosition += 30;
  doc.text(
    "Please sign and return duplicate copy of this letter in token of your acceptance.",
    30,
    yPosition,
    { width: 535 }
  );

  yPosition += 30;
  doc.text(
    "We congratulate you on your appointment and wish you a long and successful career with us. We are confident that your contribution will take us further in our journey towards becoming world leaders. We assure you of our support for your professional development and growth.",
    30,
    yPosition,
    { width: 535, lineGap: 3 }
  );

  yPosition += 60;
  doc.text(
    "We look forward to mutually rewarding term with us.",
    30,
    yPosition,
    { width: 535 }
  );

  // Signature section
  yPosition += 60;
  doc.text("Sincerely,", 30, yPosition);

  // Add signature image if available
  if (signatureBuffer) {
    try {
      doc.image(signatureBuffer, 30, yPosition + 20, {
        width: 120,
        height: 60,
      });
      yPosition += 90;
    } catch (error) {
      console.error("Failed to add signature image:", error);
      yPosition += 30;
    }
  } else {
    yPosition += 30;
  }

  doc.font("Helvetica-Bold").text("Simran Jha || HR Department", 30, yPosition);

  yPosition += 18;
  doc.text("Woodrock Softonic Pvt Ltd", 30, yPosition);

  yPosition += 18;
  doc
    .font("Helvetica")
    .fillColor("#0000ff")
    .text("Email: Simran.jha@woodrockgroup.in", 30, yPosition);
}

// Create Page 2 - Terms & Conditions
async function createPage2(doc: PDFKit.PDFDocument, offerLetter: IOfferLetter) {
  const pageWidth = 595.28;

  // Top dark bar
  doc.rect(0, 0, pageWidth, 25).fill("#3b3b3b");

  // Company name header
  doc
    .fillColor("#000000")
    .fontSize(24)
    .font("Helvetica-Bold")
    .text("WOODROCK SOFTONIC PVT LTD", 20, 45);
  const x = pageWidth - 200;
  const y = 35;
  const width = 200;
  const height = 30;
  const skew = 40;
  doc
    .moveTo(x + skew, y) // Top-left (skewed)
    .lineTo(x + width, y) // Top-right
    .lineTo(x + width, y + height) // Bottom-right (skewed)
    .lineTo(x, y + height) // Bottom-left
    .closePath() // Close the shape
    .fill("#000000"); // Fill with specified color

  // Terms & Conditions heading
  doc
    .fillColor("#000000")
    .fontSize(16)
    .font("Helvetica-Bold")
    .text("Terms & Conditions:", 30, 100);

  // Terms list
  const terms = [
    "Your attendance cycle will be calculated from 1st to 31st of every month.",
    "Your salary date will be 15th of every month for the previous month.",
    "Training will be of 40 days which includes your On Job Training (OJT).",
    "Every employee will have their P tax deduction as per norm.",
    "Flexible shift timings may vary and are subject to change any time within a week.",
    "Unapproved leave or absenteeism may lead to salary hold.",
    "Company may modify policies as needed.",
    "Salary will be disbursed via Cheque/NEFT/IMPS.",
    "Probation period is 90 days.",
    "Absenteeism between 1st and 15th may lead to salary hold.",
    "Official job timing & working days will be informed by your Process Manager.",
    "Immediate termination may occur for performance or disciplinary issues.",
    "Minimum 30 working days required for first salary eligibility.",
    "30-day notice period mandatory for resignation; else dues will be forfeited.",
    "Strict late-coming policy; 3 lates = 1 day absent.",
  ];

  let yPosition = 130;
  doc.fontSize(10).font("Helvetica");

  terms.forEach((term, index) => {
    doc.text(`• ${term}`, 35, yPosition, { width: 525, lineGap: 2 });
    yPosition += 20;
  });

  // ZTE Policy heading
  yPosition += 20;
  doc.fontSize(14).font("Helvetica-Bold").text("ZTE Policy:", 30, yPosition);

  // ZTE Policy table
  yPosition += 25;
  createTable(doc, 30, yPosition, [
    ["Parameter", "Target", "Consequence"],
    ["CMB", "0", "Separation under ZT"],
    ["CNR", "0", "Separation under ZT"],
    ["Rude/Sarcastic Call", "0", "Separation under ZT"],
    ["Re-Assignment Case", "0", "Separation under ZT"],
    ["Invalid/Forcefully Call disconnection", "0", "Separation under ZT"],
  ]);

  yPosition += 140;

  // Note section
  doc.fontSize(12).font("Helvetica-Bold").text("Note:", 30, yPosition);

  yPosition += 20;
  doc
    .fontSize(10)
    .font("Helvetica")
    .text(
      "• Salary for the month in which ZT violation occurred will not be disbursed.",
      35,
      yPosition,
      { width: 525 }
    );

  yPosition += 15;
  doc.text(
    "• Release letter/experience certificate will not be issued for ZT terminations.",
    35,
    yPosition,
    { width: 525 }
  );

  // Uninformed Leave Policy
  yPosition += 30;
  doc
    .fontSize(14)
    .font("Helvetica-Bold")
    .text("Uninformed Leave (UL) Policy:", 30, yPosition);

  yPosition += 20;
  doc
    .fontSize(10)
    .font("Helvetica")
    .text(
      "• Absence without prior approval will be treated as Uninformed Leave (UL).",
      35,
      yPosition,
      { width: 525 }
    );

  yPosition += 15;
  doc.text(
    "• Each UL results in 2 days of Loss of Pay (LOP). Repeated ULs may lead to disciplinary action.",
    35,
    yPosition,
    { width: 525 }
  );

  // Employee acceptance signature
  yPosition += 50;
  doc
    .fontSize(12)
    .font("Helvetica")
    .text(
      `I, ${offerLetter.employeeName}, hereby accept the offer & agree totally to the terms & conditions.`,
      30,
      yPosition,
      { width: 535 }
    );

  yPosition += 30;
  doc.text("Employee Signature: _______________________", 30, yPosition);
}

// Main function to generate PDF from offer letter data
export async function generateOfferLetterPDFByPdfKIt(
  offerLetter: IOfferLetter
): Promise<Buffer> {
  try {
    return new Promise(async (resolve, reject) => {
      const doc = new PDFDocument({
        size: "A4",
        margin: 0,
        bufferPages: true,
      });

      const buffer: Uint8Array[] = [];
      doc.on("data", (chunk) => buffer.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(buffer)));
      doc.on("error", (err) => reject(err));

      // Download signature image
      const signatureBuffer = await downloadImage(
        "https://res.cloudinary.com/dri1mh3xh/image/upload/v1750698006/mhyrewrvtfgpqz21lfo7.jpg"
      );

      // PAGE 1 - Main Offer Letter
      await createPage1(doc, offerLetter, signatureBuffer);

      // PAGE 2 - Terms & Conditions
      doc.addPage();
      await createPage2(doc, offerLetter);

      doc.end();
    });
  } catch (error: any) {
    console.error("PDF creation error:", error);
    throw new Error(`PDF creation failed: ${error.message}`);
  }
}
