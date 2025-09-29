import { Schema, model } from "mongoose";
import { IEmailStatus } from "../release-letter/release-letter.interface";
import { BackgroundVarificationType } from "./background-varification.interface";
const BackgroundVarificationSchema = new Schema<BackgroundVarificationType>(
  {
    employeeName: { type: String, required: true },
    employeeEmail: { type: String, required: true },
    employeeId: { type: String, default: "" },
    employeeDesignation: { type: String, default: "" },
    employeeDepartment: { type: String, default: "" },
    employeeUAN: { type: String, default: "" },
    employeeESINO: { type: String, default: "" },
    EPF: { type: String, default: "" },
    ESI: { type: String, default: "" },
    companyName: { type: String, default: "" },
    photo: { type: String, default: "" },
    experience: { type: String, default: "" },
    pan: { type: String, default: "" },
    aadharFront: { type: String, default: "" },
    aadharBack: { type: String, default: "" },
    adharStatus: { type: String, default: "" },
    educationStatus: { type: String, default: "" },
    panStatus: { type: String, default: "" },
    remarks: { type: String, default: "" },
    status: {
      type: String,

      enum: IEmailStatus,
      default: IEmailStatus.DRAFT,
    },
  },
  { timestamps: true }
);

const BackgroundVarification = model<BackgroundVarificationType>(
  "BackgroundVarification",
  BackgroundVarificationSchema
);

export default BackgroundVarification;
