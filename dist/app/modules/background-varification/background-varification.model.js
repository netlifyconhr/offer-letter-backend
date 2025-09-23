"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const release_letter_interface_1 = require("../release-letter/release-letter.interface");
const BackgroundVarificationSchema = new mongoose_1.Schema({
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
    education: { type: String, default: "" },
    status: {
        type: String,
        enum: release_letter_interface_1.IEmailStatus,
        default: release_letter_interface_1.IEmailStatus.DRAFT,
    },
}, { timestamps: true });
const BackgroundVarification = (0, mongoose_1.model)("BackgroundVarification", BackgroundVarificationSchema);
exports.default = BackgroundVarification;
