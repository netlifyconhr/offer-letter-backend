import { StatusCodes } from "http-status-codes";
import QueryBuilder from "../../builder/QueryBuilder";
import AppError from "../../errors/appError";
import { EmailHelper } from "../../utils/emailHelper";
import { generateOfferLetterHTML } from "../../utils/generateOrderInvoicePDF";
import { generateOfferLetterPDFByPdfKIt } from "../../utils/offer-letter";
import { IJwtPayload } from "../auth/auth.interface";
import { IEmailStatus } from "../release-letter/release-letter.interface";
import { IOfferLetter } from "./offer-letter.interface";
import OfferLetter from "./offer-letter.model";
import { monthNames } from "../../../constant";


export const offerLetterService = {
  async getOfferLetterAll(query: Record<string, unknown>) {
    const offerLetterQuery = new QueryBuilder(OfferLetter.find(), query)
      .search(["employeeName", "employeeEmail"])
      .filter()
      .sort()
      .paginate()
      .fields();

    const result = await offerLetterQuery.modelQuery;
    const meta = await offerLetterQuery.countTotal();

    return { meta, result };
  },

  async getOfferLetterById(id: string) {
    const offerLetter = await OfferLetter.findById(id);
    if (!offerLetter) {
      throw new AppError(StatusCodes.NOT_FOUND, "Offer letter not found!");
    }

    const logoBase64 = ""; // You can fetch actual logo if needed
    const htmlContent = generateOfferLetterHTML(
      offerLetter as IOfferLetter,
      logoBase64
    );

    return htmlContent;
  },

  async acknowledgeById(employeeEmail: string) {
    const offerLetter = await OfferLetter.findOne({ employeeEmail });

    if (!offerLetter) {
      throw new AppError(StatusCodes.NOT_FOUND, "Offer letter not found!");
    }

    if (offerLetter.acknowledge) {
      return {
        message: `Offer letter already acknowledged on ${
          offerLetter.dateOfAcknowledge
            ? offerLetter.dateOfAcknowledge.toLocaleString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })
            : "unknown date"
        }`,
      };
    }

    offerLetter.acknowledge = true;
    offerLetter.dateOfAcknowledge = new Date();

    await offerLetter.save();

    return {
      message:
        "Thank you for your confirmation. Your acknowledgement has been recorded successfully.",
    };
  },

  async createOfferLetter(
    offerLetterData: IOfferLetter,
    authUser: IJwtPayload
  ) {
    const updatedData: IOfferLetter = { ...offerLetterData };

    if (offerLetterData.status === IEmailStatus.SENT) {
      const emailContent = await EmailHelper.createEmailContent(
        //@ts-ignore
        { userName: offerLetterData.employeeEmail || "", ...updatedData },
        "offerLetter"
      );

      const pdfBuffer = await generateOfferLetterPDFByPdfKIt(offerLetterData);

      const attachment = {
        filename: `offerletter_${offerLetterData.employeeEmail}.pdf`,
        content: pdfBuffer,
        encoding: "base64",
      };

      const result = await EmailHelper.sendEmail(
        //@ts-ignore
        offerLetterData.employeeEmail,
        emailContent,
        "Offer letter confirmed!",
        attachment
      );

      updatedData.status =
        result.status === IEmailStatus.SENT
          ? IEmailStatus.SENT
          : IEmailStatus.FAILED;
    }

    const newOfferLetter = new OfferLetter({
      ...updatedData,
      generateByUser: authUser.userId,
    });

    return await newOfferLetter.save();
  },

  async createBulkOfferLetters(
    offerLetters: IOfferLetter[],
    authUser: IJwtPayload
  ) {
    const pLimit = (await import("p-limit")).default;
    const limit = pLimit(1); // Max 1 at a time

    const results = await Promise.all(
      offerLetters.map((data) =>
        limit(() => this.processOneOfferLetter(data, authUser))
      )
    );

    return results;
  },

  

  async processOneOfferLetter(
    offerLetterData: IOfferLetter,
    authUser: IJwtPayload
  ) {
    const updatedData: IOfferLetter = { ...offerLetterData };
    let resultStatus = IEmailStatus.FAILED;

    try {
      const emailContent = await EmailHelper.createEmailContent(
        //@ts-ignore
        { userName: offerLetterData.employeeEmail || "", ...updatedData },
        "offerLetter"
      );

      const pdfBuffer = await generateOfferLetterPDFByPdfKIt(offerLetterData);

      const attachment = {
        filename: `offerletter_${offerLetterData.employeeEmail}.pdf`,
        content: pdfBuffer,
        encoding: "base64",
      };

      const emailResult = await EmailHelper.sendEmail(
        //@ts-ignore
        offerLetterData.employeeEmail,
        emailContent,
        "Offer letter confirmed!",
        attachment
      );

      resultStatus =
        emailResult.status === IEmailStatus.SENT
          ? IEmailStatus.SENT
          : IEmailStatus.FAILED;

      updatedData.status = resultStatus;
    } catch (error) {
      console.error(`Failed for ${offerLetterData.employeeEmail}:`, error);
      updatedData.status = IEmailStatus.FAILED;
    }

    const currentMonthName = monthNames[new Date().getMonth()];

    const newOfferLetter = new OfferLetter({
      ...updatedData,
      generateByUser: authUser.userId,
      month: currentMonthName,
    });

    await newOfferLetter.save();

    return {
      email: offerLetterData.employeeEmail,
      status: updatedData.status,
    };
  },


};

