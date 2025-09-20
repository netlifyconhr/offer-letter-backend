"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
// Mongoose schema for the generated link
const GeneratedLinkSchema = new mongoose_1.Schema({
    employeeId: { type: String, required: true },
    expiresAt: { type: Date, required: true },
}, { timestamps: true });
// Create TTL index on expiresAt for automatic expiration
GeneratedLinkSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
const GeneratedLink = (0, mongoose_1.model)("GeneratedLink", GeneratedLinkSchema);
exports.default = GeneratedLink;
