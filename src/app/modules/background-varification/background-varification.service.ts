import QueryBuilder from "../../builder/QueryBuilder";
import { BackgroundVarificationType } from "./background-varification.interface";
import BackgroundVarification from "./background-varification.model";

export const backgroundVarificationService = {
  async getOfferLetterAll(query: Record<string, unknown>) {
    const offerLetterQuery = new QueryBuilder(
      BackgroundVarification.find(),
      query
    )
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

    const currentMonthCount = await BackgroundVarification.countDocuments({
      createdAt: { $gte: startOfMonth, $lte: endOfMonth },
    });

    return {
      currentMonthCount, // add this to the response
    };
  },

  async createBulkBackgroundVarificationData(
    payload: BackgroundVarificationType[]
  ) {
    const results = await BackgroundVarification.insertMany(payload);

    return results;
  },
};
