import { StatusCodes } from "http-status-codes";
import AppError from "../../errors/appError";
import { EmailHelper } from "../../utils/emailHelper";
import { GuestMessageType } from "./guest-message.interface";
import GuestMessage from "./guest-message.model";

const craeteGuestMessage = async (
  OrganizationData: GuestMessageType,
) => { 

let messages;
  
    try {

      
  messages=    await GuestMessage.create(OrganizationData
      
    );
const feedbackEmailContent = await EmailHelper.createEmailContent(
       OrganizationData,
        "GUEST_MESSAGE_FEEDBACK"
      );
  
      await EmailHelper.sendEmailFromAdmin(
        OrganizationData.email,
        feedbackEmailContent as string,
        "Contact Us"
      );
      const emailContent = await EmailHelper.createEmailContent(
       OrganizationData,
        "GUEST_MESSAGE"
      );
  
      await EmailHelper.sendEmailFromAdmin(
        'admin@netlifycon-hr.in',
        emailContent as string,
        "Contact Us"
      );

      
    } catch (error) {
      throw new AppError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        "Failed to send OTP email. Please try again later."
      );
    }
return messages;
};

const getContactMessages = async () => {

  const organization = await GuestMessage.find()
  return organization;
};

export const guestMessageService = {
  craeteGuestMessage,
  getContactMessages,
};
