import QueryBuilder from "../../builder/QueryBuilder";
import { EmailHelper } from "../../utils/emailHelper";
import { generatePayslipPDFWithPDFKit } from "../../utils/payslip";
import { IJwtPayload } from "../auth/auth.interface";
import { IEmailStatus } from "../release-letter/release-letter.interface";
import { PaySlipInput } from "./payslip.controller";
import PaySlip from "./payslip.model";
async function processOnePayslipLetter(
  offerLetterData: PaySlipInput,
  authUser: IJwtPayload
) {
  try {
    const emailContent = await EmailHelper.createEmailContent(
      //@ts-ignore
      { userName: offerLetterData.employeeEmail || "", ...offerLetterData },
      "payslip"
    );

    const pdfBuffer = await generatePayslipPDFWithPDFKit(offerLetterData);

    const attachment = {
      filename: `payslip_${offerLetterData.employeeEmail}.pdf`,
      content: pdfBuffer,
      encoding: "base64",
    };

    const emailResult = await EmailHelper.sendEmail(
      //@ts-ignore
      offerLetterData.employeeEmail,
      emailContent as string,
      "Payslip generated!",
      attachment
    );

    const resultStatus =
      emailResult.status === IEmailStatus.SENT
        ? IEmailStatus.SENT
        : IEmailStatus.FAILED;
    const newOfferLetter = new PaySlip({
      ...offerLetterData,
      generateByUser: authUser.userId,
      status: resultStatus,
    });

    const result = await newOfferLetter.save();
    return result;
  } catch (error) {
    console.error(`Failed for ${offerLetterData.employeeEmail}:`, error);
  }

  const newOfferLetter = new PaySlip({
    ...offerLetterData,
    generateByUser: authUser.userId,
  });

  await newOfferLetter.save();

  return {
    email: offerLetterData.employeeEmail,
  };
}

export const payslipService = {
  async getOfferLetterAll(query: Record<string, unknown>) {
    const offerLetterQuery = new QueryBuilder(PaySlip.find(), query)
      .search(["employeeName", "employeeEmail"])
      .filter()
      .sort()
      .paginate()
      .fields();

    const result = await offerLetterQuery.modelQuery;
    const meta = await offerLetterQuery.countTotal();

    return {
      meta,
      result,
    };
  },
  async getThisMonthPayslipCount() {
    const startOfMonth = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      1
    );
    const endOfMonth = new Date(
      new Date().getFullYear(),
      new Date().getMonth() + 1,
      0,
      23,
      59,
      59,
      999
    );

    const currentMonthCount = await PaySlip.countDocuments({
      createdAt: { $gte: startOfMonth, $lte: endOfMonth },
    });

    return {
      currentMonthCount, // add this to the response
    };
  },

  async createBulkOfferLetters(
    offerLetters: PaySlipInput[],
    authUser: IJwtPayload
  ) {
    const pLimit = (await import("p-limit")).default;
    const limit = pLimit(1); // Max 1 at a time
    const results = await Promise.all(
      offerLetters.map((data) =>
        limit(() => {
          if (data?.employeeEmail) {
            return processOnePayslipLetter(data, authUser);
          }
          return;
        })
      )
    );

    return results;
  },
};
