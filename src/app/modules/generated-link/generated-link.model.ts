import { Document, Schema, model } from "mongoose";

// New schema for storing the link with expiration
export interface IGeneratedLink extends Document {
  employeeId: string;
  expiresAt: Date;
}

// Mongoose schema for the generated link
const GeneratedLinkSchema = new Schema<IGeneratedLink>(
  {
    employeeId: { type: String, required: true },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

// Create TTL index on expiresAt for automatic expiration
GeneratedLinkSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const GeneratedLink = model<IGeneratedLink>(
  "GeneratedLink",
  GeneratedLinkSchema
);

export default GeneratedLink;
