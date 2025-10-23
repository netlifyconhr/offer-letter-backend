import { Schema, model } from "mongoose";
import { BackgroundVarificationType } from "./background-varification.interface";
const BackgroundVarificationSchema = new Schema<BackgroundVarificationType>(
  {
    employeeName: { type: String, required: true },
    employeeEmail: { type: String, required: true },
    employeeId: { type: String, default: "" },
    employeeDesignation: { type: String, default: "" },
    employeeDepartment: { type: String, default: "" },
    experienceStatus: { type: String, default: "" },

    addressStatus: { type: String, default: "" },

    criminalStatus: { type: String, default: "" },

    employeePhone: { type: String, default: "" },
    employeeDateOfJoin: { type: String, default: "" },
    employeeGender: { type: String, default: "" },

    companyRegion: { type: String, default: "" },
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
    companyBranch: { type: String, default: "" },
    verificationStatus: { type: String, default: "pending" ,enum:['pending','completed']},
  },
  { timestamps: true }
);

const BackgroundVarification = model<BackgroundVarificationType>(
  "BackgroundVarification",
  BackgroundVarificationSchema
);

export default BackgroundVarification;
