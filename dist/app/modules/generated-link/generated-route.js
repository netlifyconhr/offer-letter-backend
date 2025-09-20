"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeneratedLinkRoutes = void 0;
const express_1 = require("express");
const generated_link_model_1 = __importDefault(require("./generated-link.model"));
const router = (0, express_1.Router)();
router.post("/generate-background-verification-url/:employeeId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { employeeId } = req.params;
        const now = new Date();
        // Check if there's already a valid (non-expired) link for this employee
        let existingLink = yield generated_link_model_1.default.findOne({
            employeeId,
            expiresAt: { $gt: now }, // Not expired yet
        });
        if (existingLink) {
            // Return the existing valid link
            return res.json({
                message: "Existing valid link found.",
                expiresAt: existingLink.expiresAt,
            });
        }
        // No valid link found, so create a new one for 7 days
        //   const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        // No valid link found, so create a new one for 10 minute
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
        const newGeneratedLink = new generated_link_model_1.default({
            employeeId,
            expiresAt,
        });
        yield newGeneratedLink.save();
        return res.json({
            message: "Generated new link successfully.",
            expiresAt: newGeneratedLink.expiresAt,
        });
    }
    catch (error) {
        console.error("Error generating background verification link:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}));
exports.GeneratedLinkRoutes = router;
