import { IEmailStatus } from "../release-letter/release-letter.interface";

export interface BackgroundVarificationType extends Document {
  employeeName: string;
  employeeId: string;
  employeeDesignation: string;
  employeeDepartment: string;
  employeeUAN: string;
  employeeESINO: string;
  uninformedLeaves: string;
  halfDay: string;
  calculatedSalary: string;
  EPF: string;
  ESI: string;
  employeeEmail: string;
  companyName: string;
  status: IEmailStatus;
  pan: string;
  aadhar: string;
  voter: string;
  photo: string;
}
