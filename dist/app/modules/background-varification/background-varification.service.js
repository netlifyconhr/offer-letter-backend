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
exports.backgroundVarificationService = void 0;
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const background_varification_model_1 = __importDefault(require("./background-varification.model"));
exports.backgroundVarificationService = {
    getOfferLetterAll(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const offerLetterQuery = new QueryBuilder_1.default(background_varification_model_1.default.find(), query)
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
    getThisMonthPayslipCount() {
        return __awaiter(this, void 0, void 0, function* () {
            const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
            const endOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0, 23, 59, 59, 999);
            const currentMonthCount = yield background_varification_model_1.default.countDocuments({
                createdAt: { $gte: startOfMonth, $lte: endOfMonth },
            });
            return {
                currentMonthCount, // add this to the response
            };
        });
    },
    getAndUpdateEmployeeById(employeeId, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(payload, employeeId);
            return yield background_varification_model_1.default.findByIdAndUpdate(employeeId, payload, {
                upsert: true,
            });
        });
    },
    createBulkBackgroundVarificationData(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const results = yield background_varification_model_1.default.insertMany(payload);
            return results;
        });
    },
};
