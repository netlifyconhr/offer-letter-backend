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
exports.releaseLetterService = void 0;
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const emailHelper_1 = require("../../utils/emailHelper");
const release_letter_1 = require("../../utils/woodrock/release-letter");
const release_letter_interface_1 = require("./release-letter.interface");
const release_letter_model_1 = __importDefault(require("./release-letter.model"));
function processOneReleaseLetter(offerLetterData, authUser) {
    return __awaiter(this, void 0, void 0, function* () {
        const updatedData = Object.assign({}, offerLetterData);
        let resultStatus = release_letter_interface_1.IEmailStatus.FAILED;
        try {
            const emailContent = yield emailHelper_1.EmailHelper.createEmailContent(Object.assign({ userName: offerLetterData.employeeEmail || "" }, updatedData), "releaseLetter");
            const pdfBuffer = yield (0, release_letter_1.generateReleaseLetterPDF)(offerLetterData);
            const attachment = {
                filename: `releaseLetter_${offerLetterData.employeeEmail}.pdf`,
                content: pdfBuffer,
                encoding: "base64", // if necessary
            };
            const emailResult = yield emailHelper_1.EmailHelper.sendEmail(
            //@ts-ignore
            offerLetterData.employeeEmail, emailContent, "release letter!", attachment);
            resultStatus =
                emailResult.status === release_letter_interface_1.IEmailStatus.SENT
                    ? release_letter_interface_1.IEmailStatus.SENT
                    : release_letter_interface_1.IEmailStatus.FAILED;
            updatedData.status = resultStatus;
        }
        catch (error) {
            console.error(`Failed for ${offerLetterData.employeeEmail}:`, error);
            updatedData.status = release_letter_interface_1.IEmailStatus.FAILED;
        }
        const monthNames = [
            "january",
            "february",
            "march",
            "april",
            "may",
            "june",
            "july",
            "august",
            "september",
            "october",
            "november",
            "december",
        ];
        const currentMonthName = monthNames[new Date().getMonth()];
        const newOfferLetter = new release_letter_model_1.default(Object.assign(Object.assign({}, updatedData), { generateByUser: authUser.userId, month: currentMonthName }));
        yield newOfferLetter.save();
        return {
            email: offerLetterData.employeeEmail,
            status: updatedData.status,
        };
    });
}
exports.releaseLetterService = {
    getReleaseLetterAll(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const offerLetterQuery = new QueryBuilder_1.default(release_letter_model_1.default.find(), query)
                .search(["employeeName", "employeeEmail"])
                .filter()
                .sort()
                .paginate()
                .fields();
            const result = yield offerLetterQuery.modelQuery;
            const meta = yield offerLetterQuery.countTotal();
            return {
                meta,
                result,
            };
        });
    },
    createBulkReleaseLetters(offerLetters, authUser) {
        return __awaiter(this, void 0, void 0, function* () {
            const pLimit = (yield Promise.resolve().then(() => __importStar(require("p-limit")))).default;
            const limit = pLimit(1); // Max 1 at a time
            const results = yield Promise.all(offerLetters.map((data) => limit(() => processOneReleaseLetter(data, authUser))));
            return results;
        });
    },
};
