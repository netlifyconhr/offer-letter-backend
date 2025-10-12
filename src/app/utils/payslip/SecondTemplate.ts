// create a document and pipe to a blob

import PDFDocument from "pdfkit";

var doc = new PDFDocument();


const imageWidth = 320;
const imageHeight = 50;


const starttX=0;
const starttY=10;

// Right column (company info)
const rightX = 0 + imageWidth + 30; // spacing between image & text
const textWidth = 300;

doc
  .font('Helvetica-Bold')
  .fontSize(11)
  .text('WOODROCK INFOTECH PRIVATE LIMITED', rightX, starttY, { width: textWidth });

doc
  .font('Helvetica')
  .fontSize(9)
  .text('Registered Office', rightX, starttY + 15, { width: textWidth })
  .text('Fit way Enclave, DN 12, Street 18,', rightX, starttY + 30, { width: textWidth })
  .text('Salt Lake Sector 5, Kolkata-700091', rightX, starttY + 45, { width: textWidth })
  .fillColor('blue')
  .text('mail: contact@woodrockgroup.in', rightX, starttY + 60, {
    width: textWidth,
    link: 'mailto:contact@woodrockgroup.in'
  })
  .fillColor('black')
  .text('CIN: U64204WB2014PTC204429', rightX, starttY + 75, { width: textWidth });


const pageWidth = doc.page.width;
const tableWidth = pageWidth - 100;
const startX = 50;
const rowHeight = 20;
let currentY = 108;

// === EMPLOYEE INFO HEADER ===
doc
  .rect(startX, currentY, tableWidth, rowHeight)
  .fill('black');

doc
  .fillColor('white')
  .font('Helvetica-Bold')
  .fontSize(10)
  .text('PAYSLIP FOR AUGUST 2025', startX, currentY + 8, {
    width: tableWidth,
    align: 'center'
  });

currentY += rowHeight;

// === EMPLOYEE INFO TABLE ===
const empColWidths = [tableWidth * 0.2, tableWidth * 0.3, tableWidth * 0.2, tableWidth * 0.3];

const empRows = [
  ['Name', 'Sreemoyee Dutta', 'PAN', 'HXIPD7764J'],
  ['Employee Code', 'WRSD3270', 'Sex', 'Female'],
  ['Designation', 'CUSTOMER SUPPORT ', 'PF Number', ''],
  ['Location', 'SALT LAKE', 'PF UAN', ''],
  ['Joining Date', '01/06/2024', 'ESI Number', ''],
  ['Leaving Date', '', '', ''],
  ['Tax Regime', 'NEW', '', '']
];

empRows.forEach((row, rowIndex) => {
  const isGray = rowIndex % 2 === 0;
  let x = startX;

  if (isGray) {
    doc.rect(startX, currentY, tableWidth, rowHeight).fill('#e0e0e0');
  }

  doc.fillColor('black').fontSize(9);

  for (let i = 0; i < 4; i++) {
    const text = row[i] || '';
    const width = empColWidths[i];

    doc
      .font(i % 2 === 0 ? 'Helvetica-Bold' : 'Helvetica')
      .text(text, x + 5, currentY + 8, {
        width: width - 10,
        align: 'left'
      });

    doc.rect(x, currentY, width, rowHeight).stroke();

    x += width;
  }

  currentY += rowHeight;
});

// === SPACING BETWEEN TABLES ===
currentY += 20;

// === EARNINGS HEADER ===
doc
  .rect(startX, currentY, tableWidth, rowHeight)
  .fill('black');

doc
  .fillColor('white')
  .font('Helvetica-Bold')
  .fontSize(9)
  .text('EARNINGS (INR)', startX, currentY + 8, {
    width: tableWidth,
    align: 'center'
  });

currentY += rowHeight;

// === EARNINGS SUB-HEADER ===
const earningsColWidths = [
  tableWidth * 0.4,
  tableWidth * 0.2,
  tableWidth * 0.2,
  tableWidth * 0.2
];

const earningsHeaders = ['COMPONENTS', 'MONTHLY', 'ARREAR', 'TOTAL'];
let x = startX;

for (let i = 0; i < 4; i++) {
  doc.rect(x, currentY, earningsColWidths[i], rowHeight).fill('#d0d0d0');

  doc
    .fillColor('black')
    .font('Helvetica-Bold')
    .fontSize(9)
    .text(earningsHeaders[i], x + 5, currentY + 8, {
      width: earningsColWidths[i] - 10,
      align: 'left'
    });

  x += earningsColWidths[i];
}

currentY += rowHeight;

// === EARNINGS DATA ===
const earningsData = [
  ['Basic', '9314.52', '0.00', '9314.52'],
  ['HRA', '7451.61', '0.00', '7451.61'],
  ['FINAL PAYABLE DAYS', '33.00', '0.00', '33.00'],
  ['CONVEYANCE ALLOWANCE', '1862.90', '0.00', '1862.90'],
  ['PRESENT DAYS', '27.00', '0.00', '27.00'],
  ['WEEK OFF PRESENT DAYS', '4.00', '0.00', '4.00'],
  ['WEEK OFF', '2.00', '0.00', '2.00'],
  ['TOTAL EARNINGS', '18629.03', '0.00', '18629.03']
];

earningsData.forEach((row, rowIndex) => {
  let x = startX;

  for (let i = 0; i < 4; i++) {
    const text = row[i] || '';
    const width = earningsColWidths[i];

    const isLabelCol = i === 0;
    const isTotalRow = rowIndex === earningsData.length - 1;

    const bgColor = (isLabelCol || isTotalRow) ? '#e0e0e0' : 'white';
    doc.rect(x, currentY, width, rowHeight).fill(bgColor);
    doc.rect(x, currentY, width, rowHeight).stroke();

    doc
      .fillColor('black')
      .font((isLabelCol || isTotalRow) ? 'Helvetica-Bold' : 'Helvetica').fontSize(9)
      .text(text, x + 5, currentY + 8, {
        width: width - 10,
        align: 'left'
      });

    x += width;
  }

  currentY += rowHeight;
});

// === SPACING BETWEEN TABLES ===
currentY += 20;

// === DEDUCTIONS HEADER ===
doc
  .rect(startX, currentY, tableWidth, rowHeight)
  .fill('black');

doc
  .fillColor('white')
  .font('Helvetica-Bold')
  .fontSize(9)
  .text('DEDUCTIONS (INR)', startX, currentY + 8, {
    width: tableWidth,
    align: 'center'
  });

currentY += rowHeight;

// === DEDUCTIONS SUB-HEADER ===
const deductionsColWidths = [tableWidth * 0.8, tableWidth * 0.2];
const deductionsHeaders = ['COMPONENTS', 'TOTAL'];

let dx = startX;
for (let i = 0; i < 2; i++) {
  doc.rect(dx, currentY, deductionsColWidths[i], rowHeight).fill('#d0d0d0');

  doc
    .fillColor('black')
    .font('Helvetica-Bold')
    .fontSize(9)
    .text(deductionsHeaders[i], dx + 5, currentY + 8, {
      width: deductionsColWidths[i] - 10,
      align: 'left'
    });

  dx += deductionsColWidths[i];
}

currentY += rowHeight;

// === DEDUCTIONS DATA ===
const deductionsData = [
  ['PT', '130.00'],
  ['TOTAL DEDUCTIONS', '130.00'],
  ['Employer PF Contribution', '0.00']
];

deductionsData.forEach((row, rowIndex) => {
  let dx = startX;

  for (let i = 0; i < 2; i++) {
    const text = row[i] || '';
    const width = deductionsColWidths[i];

    const isTotalRow = rowIndex === 1 || rowIndex === 2; // bold for total and employer PF
    const bgColor = isTotalRow ? '#e0e0e0' : 'white';
    doc.rect(dx, currentY, width, rowHeight).fill(bgColor);
    doc.rect(dx, currentY, width, rowHeight).stroke();

    doc
      .fillColor('black')
      .font(isTotalRow ? 'Helvetica-Bold' : 'Helvetica').fontSize(9)
      .text(text, dx + 5, currentY + 8, {
        width: width - 10,
        align: 'left'
      });

    dx += width;
  }

  currentY += rowHeight;
});
// === SPACING BETWEEN TABLES ===
currentY += 20;

// === NET PAY TABLE ===
const netPayColWidths = [tableWidth * 0.3, tableWidth * 0.7];
const netPayRows = [
  ['NET PAY (INR)', '18499.03'],
  ['NET PAY IN WORDS', 'Eighteen Thousand Four Hundred Ninety Nine and Three paisa Only']
];

netPayRows.forEach((row, rowIndex) => {
  let nx = startX;

  for (let i = 0; i < 2; i++) {
    const text = row[i] || '';
    const width = netPayColWidths[i];

    // Gray background for first column
    if (i === 0) {
      doc.rect(nx, currentY, width, rowHeight).fill('#c0c0c0');
    } else {
      doc.rect(nx, currentY, width, rowHeight).fill('white');
    }

    doc.rect(nx, currentY, width, rowHeight).stroke();

    doc
      .fillColor('black')
      .font(i === 0 ? 'Helvetica-Bold' : 'Helvetica').fontSize(9)
      .text(text, nx + 5, currentY + 8, {
        width: width - 10,
        align: i === 0 ? 'left' : 'left'
      });

    nx += width;
  }

  currentY += rowHeight;
});
// === SPACING AFTER NET PAY TABLE ===
currentY += 30;

// === CUT HERE LINE ===
const lineY = currentY;
const lineStart = startX;
const lineEnd = startX + tableWidth;
const centerX = (lineStart + lineEnd) / 2;
const cutText = 'Cut Here';

// Draw left dashed line
doc
  .moveTo(lineStart, lineY)
  .lineTo(centerX - 40, lineY) // leave space for text
  .dash(3, { space: 3 })       // dashed pattern
  .strokeColor('#666')
  .stroke();

// Draw right dashed line
doc
  .moveTo(centerX + 40, lineY)
  .lineTo(lineEnd, lineY)
  .dash(3, { space: 3 })
  .strokeColor('#666')
  .stroke();

// Reset dash
doc.undash();

// Draw text in center
doc
  .font('Helvetica-Bold')
  .fontSize(12)
  .fillColor('#666')
  .text(cutText, centerX - 30, lineY - 8, {
    width: 60,
    align: 'center'
  });

// Adjust Y position for any content below
currentY += 40;


// End and display the document
doc.end();
