import { StatusCodes } from "http-status-codes";
import { v4 as uuidv4 } from "uuid";
import QueryBuilder from "../../builder/QueryBuilder";
import AppError from "../../errors/appError";
import { EmailHelper } from "../../utils/emailHelper";
import { generateOfferLetterHTML } from "../../utils/generateOrderInvoicePDF";
import { generateOfferLetterPDFByPdfKIt } from "../../utils/offer-letter";
import { IJwtPayload } from "../auth/auth.interface";
import { IEmailStatus } from "../release-letter/release-letter.interface";
import { IBulkProcessStatus } from "../socket/socket-manager";
import { IOfferLetter } from "./offer-letter.interface";
import OfferLetter from "./offer-letter.model";
import { monthNames } from "../../../constant";

const processStatuses = new Map<string, IBulkProcessStatus>();

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

  async processOfferLettersAsync(
    offerLetters: IOfferLetter[],
    authUser: IJwtPayload,
    processId: string
  ) {
    const pLimit = (await import("p-limit")).default;
    const limit = pLimit(1);

    const status = processStatuses.get(processId);
    if (!status) return;

    status.status = "PROCESSING";

    try {
      const results = await Promise.all(
        offerLetters.map((data) =>
          limit(() =>
            this.processOneOfferLetterWithSocket(data, authUser, processId)
          )
        )
      );

      console.log(
        `Bulk process ${processId} completed with ${results.length} results`
      );
    } catch (error) {
      console.error("Bulk process failed:", error);
      const errorStatus = processStatuses.get(processId);
      if (errorStatus) {
        errorStatus.status = "FAILED";
      }
    }
  },

  async createBulkOfferLettersWithSocket(
    offerLetters: IOfferLetter[],
    authUser: IJwtPayload
  ): Promise<{ processId: string; status: string }> {
    const processId = uuidv4();
    const total = offerLetters.length;

    const initialStatus: IBulkProcessStatus = {
      processId,
      total,
      sent: 0,
      failed: 0,
      pending: total,
      status: "PENDING",
      completedEmails: [],
      failedEmails: [],
    };

    processStatuses.set(processId, initialStatus);

    this.processOfferLettersAsync(offerLetters, authUser, processId).catch(
      (error) => {
        console.error(`Process ${processId} failed:`, error);
        const errorStatus = processStatuses.get(processId);
        if (errorStatus) {
          errorStatus.status = "FAILED";
        }
      }
    );

    return { processId, status: "started" };
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

  async processOneOfferLetterWithSocket(
    offerLetterData: IOfferLetter,
    authUser: IJwtPayload,
    processId: string
  ): Promise<{ email: string; status: IEmailStatus }> {
    const result = await this.processOneOfferLetter(offerLetterData, authUser);

    this.updateProcessStatus(
      processId,
      offerLetterData.employeeEmail,
      result.status
    );

    return result;
  },

  updateProcessStatus(processId: string, email: string, status: IEmailStatus) {
    const processStatus = processStatuses.get(processId);
    if (!processStatus) return;

    if (status === IEmailStatus.SENT) {
      processStatus.sent++;
      processStatus.completedEmails.push(email);
    } else {
      processStatus.failed++;
      processStatus.failedEmails.push(email);
    }

    processStatus.pending =
      processStatus.total - processStatus.sent - processStatus.failed;

    if (processStatus.pending === 0) {
      processStatus.status =
        processStatus.failed === processStatus.total ? "FAILED" : "COMPLETED";

      setTimeout(() => {
        processStatuses.delete(processId);
      }, 300000);
    }
  },

  getProcessStatus(processId: string): IBulkProcessStatus | null {
    return processStatuses.get(processId) || null;
  },

  getAllActiveProcesses(): IBulkProcessStatus[] {
    return Array.from(processStatuses.values());
  },

  cancelProcess(processId: string): boolean {
    return processStatuses.delete(processId);
  },

  cleanupExpiredProcesses() {
    const maxProcesses = 100;

    if (processStatuses.size > maxProcesses) {
      for (const [processId, status] of processStatuses.entries()) {
        if (status.status === "COMPLETED" || status.status === "FAILED") {
          processStatuses.delete(processId);
        }
      }
    }
  },
};
