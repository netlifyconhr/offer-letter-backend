"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.EmailHelper = void 0;
const fs = __importStar(require("fs"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const path = __importStar(require("path"));
const Util = __importStar(require("util"));
const config_1 = __importDefault(require("../config"));
const release_letter_interface_1 = require("../modules/release-letter/release-letter.interface");
const ReadFile = Util.promisify(fs.readFile);
const handlebars_1 = __importDefault(require("handlebars"));
const sendEmail = (email, html, subject, attachment) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const transporter = nodemailer_1.default.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: config_1.default.sender_email,
                pass: config_1.default.sender_app_password,
            },
            tls: {
                rejectUnauthorized: false,
            },
        });
        const mailOptions = {
            from: `Woodrock <${config_1.default.sender_email}>`, // corrected formatting
            to: email,
            subject,
            html,
        };
        if (attachment) {
            mailOptions.attachments = [
                {
                    filename: attachment.filename,
                    content: attachment.content,
                    encoding: attachment.encoding,
                },
            ];
        }
        const info = yield transporter.sendMail(mailOptions);
        console.log("Email sent:", info.messageId, email);
        return {
            status: release_letter_interface_1.IEmailStatus.SENT,
            messageId: info.messageId,
        };
    }
    catch (error) {
        console.error("Error sending email:", error.message || error);
        return {
            status: release_letter_interface_1.IEmailStatus.FAILED,
            error: error.message || "Unknown error",
        };
    }
});
const verifyEmailCredentials = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const transporter = nodemailer_1.default.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: config_1.default.sender_email,
                pass: config_1.default.sender_app_password,
            },
            tls: {
                rejectUnauthorized: false,
            },
        });
        yield transporter.verify(); // This checks if the connection/auth is OK
        console.log("SMTP credentials are valid.");
        return true;
    }
    catch (err) {
        console.error("Invalid SMTP credentials:", err.message || err);
        return false;
    }
});
const sendEmailFromAdmin = (email, html, subject, attachment) => __awaiter(void 0, void 0, void 0, function* () {
    // SENDER_EMAIL="anandagharami.am@gmail.com"
    // SENDER_APP_PASS="gcjm dbqa idpd jcfh"
    try {
        const transporter = nodemailer_1.default.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: "anandagharami.am@gmail.com",
                pass: "gcjm dbqa idpd jcfh",
            },
            tls: {
                rejectUnauthorized: false,
            },
        });
        const mailOptions = {
            from: `Woodrock <${"anandagharami.am@gmail.com"}>`, // corrected formatting
            to: email,
            subject,
            html,
        };
        if (attachment) {
            mailOptions.attachments = [
                {
                    filename: attachment.filename,
                    content: attachment.content,
                    encoding: attachment.encoding,
                },
            ];
        }
        const info = yield transporter.sendMail(mailOptions);
        console.log("Email sent:", info.messageId, email);
        return {
            status: release_letter_interface_1.IEmailStatus.SENT,
            messageId: info.messageId,
        };
    }
    catch (error) {
        console.error("Error sending email:", error.message || error);
        return {
            status: release_letter_interface_1.IEmailStatus.FAILED,
            error: error.message || "Unknown error",
        };
    }
});
const createEmailContent = (data, templateType) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const templatePath = path.join(process.cwd(), `/src/templates/${templateType}.template.hbs`);
        const content = yield ReadFile(templatePath, "utf8");
        const template = handlebars_1.default.compile(content);
        return template(data);
    }
    catch (error) {
        console.log(error, "complier error");
    }
});
exports.EmailHelper = {
    sendEmail,
    createEmailContent,
    sendEmailFromAdmin,
    verifyEmailCredentials
};
