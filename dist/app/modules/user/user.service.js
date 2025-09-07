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
exports.UserServices = void 0;
const http_status_codes_1 = require("http-status-codes");
const mongoose_1 = __importDefault(require("mongoose"));
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const appError_1 = __importDefault(require("../../errors/appError"));
const auth_service_1 = require("../auth/auth.service");
const user_constant_1 = require("./user.constant");
const user_interface_1 = require("./user.interface");
const user_model_1 = __importDefault(require("./user.model"));
// Function to register user
const registerUser = (userData) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        if ([user_interface_1.UserRole.ADMIN].includes(userData.role)) {
            throw new appError_1.default(http_status_codes_1.StatusCodes.NOT_ACCEPTABLE, "Invalid role. Only User is allowed.");
        }
        // Check if the user already exists by email
        const existingUser = yield user_model_1.default.findOne({ email: userData.email }).session(session);
        if (existingUser) {
            throw new appError_1.default(http_status_codes_1.StatusCodes.NOT_ACCEPTABLE, "Email is already registered");
        }
        // Create the user
        const user = new user_model_1.default(userData);
        const createdUser = yield user.save({ session });
        yield session.commitTransaction();
        return yield auth_service_1.AuthService.loginUser({
            email: createdUser.email,
            password: userData.password,
            clientInfo: userData.clientInfo,
        });
    }
    catch (error) {
        if (session.inTransaction()) {
            yield session.abortTransaction();
        }
        throw error;
    }
    finally {
        session.endSession();
    }
});
const getAllUser = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const UserQuery = new QueryBuilder_1.default(user_model_1.default.find(), query)
        .search(user_constant_1.UserSearchableFields)
        .filter()
        .sort()
        .paginate()
        .fields();
    const result = yield UserQuery.modelQuery;
    const meta = yield UserQuery.countTotal();
    return {
        result,
        meta,
    };
});
const myProfile = (authUser) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExists = yield user_model_1.default.findById(authUser.userId);
    if (!isUserExists) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "User not found!");
    }
    if (!isUserExists.isActive) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "User is not active!");
    }
    return Object.assign({}, isUserExists.toObject());
});
const updateUserStatus = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.default.findById(userId);
    console.log("comes here");
    if (!user) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "User is not found");
    }
    user.isActive = !user.isActive;
    const updatedUser = yield user.save();
    return updatedUser;
});
exports.UserServices = {
    registerUser,
    getAllUser,
    myProfile,
    updateUserStatus,
};
