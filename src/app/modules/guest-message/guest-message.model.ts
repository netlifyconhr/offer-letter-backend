import mongoose, { Model, Schema } from "mongoose";
import { GuestMessageType } from "./guest-message.interface";

const GuestMessageSchema = new Schema<GuestMessageType>(
  {
    
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
    },
    message: {
      type: String,
      required: true,
    
  },
},
  {
    timestamps: true,
  }
);

const GuestMessage: Model<GuestMessageType> = mongoose.model<GuestMessageType>(
  "GuestMessage",
  GuestMessageSchema
);
export default GuestMessage;
